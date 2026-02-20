import { taxRules } from "@/src/domain/policy";
import { KRW_PER_EOK, PPM_BASE, divRound, mulByRatePpm, toBigIntKrw } from "./math";

export interface AcquisitionTaxInput {
  purchasePriceKrw: number;
  ownedHouseCount: number;
  isAdjustmentTargetArea: boolean;
  exclusiveAreaM2: number;
}

export interface AcquisitionTaxBreakdown {
  acquisitionTaxKrw: bigint;
  localEducationTaxKrw: bigint;
  ruralSpecialTaxKrw: bigint;
  totalTaxKrw: bigint;
  acquisitionTaxRatePpm: bigint;
  isHeavyTaxRate: boolean;
}

export function computeAcquisitionTax(input: AcquisitionTaxInput): AcquisitionTaxBreakdown {
  if (!Number.isInteger(input.ownedHouseCount) || input.ownedHouseCount < 1) {
    throw new Error("ownedHouseCount must be an integer >= 1");
  }
  if (typeof input.exclusiveAreaM2 !== "number" || Number.isNaN(input.exclusiveAreaM2) || input.exclusiveAreaM2 < 0) {
    throw new Error("exclusiveAreaM2 must be a non-negative number");
  }

  const price = toBigIntKrw(input.purchasePriceKrw);
  const isHeavyTaxRate = input.ownedHouseCount > 1 && input.isAdjustmentTargetArea;
  const acquisitionTaxRatePpm = isHeavyTaxRate
    ? BigInt(taxRules.acquisitionTax.multiHome.adjustmentTargetAreaHeavyRatePpm)
    : determineNormalAcquisitionRatePpm(price, input.ownedHouseCount);

  const acquisitionTaxKrw = divRound(price * acquisitionTaxRatePpm, PPM_BASE);
  const localEducationTaxKrw = isHeavyTaxRate
    ? mulByRatePpm(price, taxRules.acquisitionTax.localEducationTax.heavyRatePpm)
    : divRound(
        acquisitionTaxKrw * BigInt(taxRules.acquisitionTax.localEducationTax.nonHeavyMultiplierPpm),
        PPM_BASE
      );

  const ruralSpecialTaxKrw =
    input.exclusiveAreaM2 <= taxRules.acquisitionTax.ruralSpecialTax.areaTaxFreeMaxM2
      ? 0n
      : mulByRatePpm(price, taxRules.acquisitionTax.ruralSpecialTax.ratePpm);

  // TODO(legal): Verify whether rural special tax applies only for specific housing-count/region combinations.
  // TODO(legal): Verify heavy-tax branching for temporary 2-home and inheritance cases.

  return {
    acquisitionTaxKrw,
    localEducationTaxKrw,
    ruralSpecialTaxKrw,
    totalTaxKrw: acquisitionTaxKrw + localEducationTaxKrw + ruralSpecialTaxKrw,
    acquisitionTaxRatePpm,
    isHeavyTaxRate
  };
}

function determineNormalAcquisitionRatePpm(priceKrw: bigint, ownedHouseCount: number): bigint {
  if (ownedHouseCount !== 1) {
    return BigInt(taxRules.acquisitionTax.multiHome.generalRatePpm);
  }

  const sixEok = BigInt(taxRules.acquisitionTax.oneHome.formulaRange.minEokInclusive) * KRW_PER_EOK;
  const nineEok = BigInt(taxRules.acquisitionTax.oneHome.formulaRange.maxEokExclusive) * KRW_PER_EOK;

  if (priceKrw < sixEok) {
    return BigInt(taxRules.acquisitionTax.oneHome.standardRateBelow6EokPpm);
  }
  if (priceKrw >= nineEok) {
    return BigInt(taxRules.acquisitionTax.oneHome.standardRateFrom9EokPpm);
  }

  // 6~9억 1주택: (priceInEok * 2/3 - 3) / 100
  // Equivalent rate: (2*price - 9*1e8) / (300*1e8)
  const numerator = 2n * priceKrw - 9n * KRW_PER_EOK;
  const denominator = 300n * KRW_PER_EOK;
  return divRound(numerator * PPM_BASE, denominator);
}
