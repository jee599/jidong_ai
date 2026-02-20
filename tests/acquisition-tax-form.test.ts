import { describe, expect, it } from "vitest";
import {
  INITIAL_ACQUISITION_TAX_FORM,
  formatRatePercent,
  validateAcquisitionTaxForm
} from "@/src/features/acquisition-tax/form";

describe("acquisition tax form validation", () => {
  it("maps pre-acquisition house count to API post-acquisition count", () => {
    const result = validateAcquisitionTaxForm({
      ...INITIAL_ACQUISITION_TAX_FORM,
      purchasePriceKrw: "850,000,000",
      ownedHouseCount: "1",
      isAdjustmentTargetArea: true,
      exclusiveAreaM2: "84.99",
      agreedDisclaimer: true
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.apiInput).toEqual({
      purchasePriceKrw: 850_000_000,
      ownedHouseCount: 2,
      isAdjustmentTargetArea: true,
      exclusiveAreaM2: 84.99
    });
  });

  it("returns field errors for malformed numeric inputs", () => {
    const result = validateAcquisitionTaxForm({
      ...INITIAL_ACQUISITION_TAX_FORM,
      purchasePriceKrw: "-1",
      exclusiveAreaM2: "abc"
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.fieldErrors.purchasePriceKrw).toBeDefined();
    expect(result.fieldErrors.exclusiveAreaM2).toBeDefined();
    expect(result.fieldErrors.agreedDisclaimer).toBeDefined();
  });

  it("formats ppm rate string as percent", () => {
    expect(formatRatePercent("80000")).toBe("8%");
    expect(formatRatePercent("26667")).toBe("2.6667%");
  });
});
