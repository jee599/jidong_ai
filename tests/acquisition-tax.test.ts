import { describe, expect, it } from "vitest";
import { computeAcquisitionTax } from "@/src/domain/tax/acquisition";

describe("computeAcquisitionTax", () => {
  it("applies 1% below 6억", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 599_999_999,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 84
    });

    expect(result.acquisitionTaxKrw).toBe(6_000_000n);
  });

  it("matches formula boundary at exactly 6억 => 1%", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 600_000_000,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 84
    });

    expect(result.acquisitionTaxRatePpm).toBe(10_000n);
    expect(result.acquisitionTaxKrw).toBe(6_000_000n);
  });

  it("matches formula boundary at exactly 9억 => 3%", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 900_000_000,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 84
    });

    expect(result.acquisitionTaxRatePpm).toBe(30_000n);
    expect(result.acquisitionTaxKrw).toBe(27_000_000n);
  });

  it("local education tax uses non-heavy branch (10% of acquisition tax)", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 500_000_000,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 100
    });

    expect(result.isHeavyTaxRate).toBe(false);
    expect(result.acquisitionTaxKrw).toBe(5_000_000n);
    expect(result.localEducationTaxKrw).toBe(500_000n);
  });

  it("local education tax uses heavy branch when heavy tax applies", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 1_000_000_000,
      ownedHouseCount: 2,
      isAdjustmentTargetArea: true,
      exclusiveAreaM2: 100
    });

    expect(result.isHeavyTaxRate).toBe(true);
    expect(result.localEducationTaxKrw).toBe(4_000_000n);
  });

  it("rural special tax is exempt at exclusive area <= 85m2", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 700_000_000,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 85
    });

    expect(result.ruralSpecialTaxKrw).toBe(0n);
  });

  it("rural special tax applies above 85m2", () => {
    const result = computeAcquisitionTax({
      purchasePriceKrw: 700_000_000,
      ownedHouseCount: 1,
      isAdjustmentTargetArea: false,
      exclusiveAreaM2: 85.1
    });

    expect(result.ruralSpecialTaxKrw).toBe(1_400_000n);
  });

  it("Day1 handoff TC placeholder set", () => {
    // TODO(test): Replace this placeholder table with exact TC IDs/expected values from handoff doc when shared.
    const tcCases = [
      {
        input: { purchasePriceKrw: 750_000_000, ownedHouseCount: 1, isAdjustmentTargetArea: false, exclusiveAreaM2: 84 },
        expectedRatePpm: 20_000n
      },
      {
        input: { purchasePriceKrw: 850_000_000, ownedHouseCount: 1, isAdjustmentTargetArea: false, exclusiveAreaM2: 84 },
        expectedRatePpm: 26_667n
      }
    ] as const;

    for (const tc of tcCases) {
      const result = computeAcquisitionTax(tc.input);
      expect(result.acquisitionTaxRatePpm).toBe(tc.expectedRatePpm);
    }
  });
});
