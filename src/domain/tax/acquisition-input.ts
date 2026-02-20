import type { AcquisitionTaxInput } from "./acquisition";

interface RawInput {
  purchasePriceKrw?: unknown;
  ownedHouseCount?: unknown;
  isAdjustmentTargetArea?: unknown;
  exclusiveAreaM2?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function assertFiniteNumber(value: unknown, fieldName: keyof RawInput): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${fieldName} must be a finite number`);
  }
  return value;
}

export function parseAcquisitionTaxInput(raw: unknown): AcquisitionTaxInput {
  if (!isRecord(raw)) {
    throw new Error("request body must be a JSON object");
  }

  const input = raw as RawInput;
  const purchasePriceKrw = assertFiniteNumber(input.purchasePriceKrw, "purchasePriceKrw");
  const ownedHouseCount = assertFiniteNumber(input.ownedHouseCount, "ownedHouseCount");
  const exclusiveAreaM2 = assertFiniteNumber(input.exclusiveAreaM2, "exclusiveAreaM2");

  if (!Number.isInteger(purchasePriceKrw) || purchasePriceKrw <= 0) {
    throw new Error("purchasePriceKrw must be an integer > 0");
  }
  if (!Number.isInteger(ownedHouseCount) || ownedHouseCount < 1) {
    throw new Error("ownedHouseCount must be an integer >= 1");
  }
  if (typeof input.isAdjustmentTargetArea !== "boolean") {
    throw new Error("isAdjustmentTargetArea must be a boolean");
  }
  if (exclusiveAreaM2 < 0) {
    throw new Error("exclusiveAreaM2 must be a non-negative number");
  }

  return {
    purchasePriceKrw,
    ownedHouseCount,
    isAdjustmentTargetArea: input.isAdjustmentTargetArea,
    exclusiveAreaM2
  };
}
