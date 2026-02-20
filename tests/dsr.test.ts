import { describe, expect, it } from "vitest";
import { calculateDsr } from "@/src/domain/dsr/calculate";

describe("calculateDsr", () => {
  it("returns within-limit result at 40%", () => {
    const result = calculateDsr({ annualIncomeKrw: 100_000_000, annualDebtServiceKrw: 40_000_000 });
    expect(result.dsrPpm).toBe(400_000n);
    expect(result.isWithinLimit).toBe(true);
  });

  it("returns out-of-limit result above 40%", () => {
    const result = calculateDsr({ annualIncomeKrw: 100_000_000, annualDebtServiceKrw: 40_100_000 });
    expect(result.isWithinLimit).toBe(false);
  });
});
