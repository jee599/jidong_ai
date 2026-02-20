import { describe, expect, it } from "vitest";
import { assertDisclaimerAccepted, buildSafeSummaryPrompt, buildScaffoldedSummary } from "@/src/features/reports/ai-summary";

describe("ai summary scaffold", () => {
  it("builds conservative prompt and summary", () => {
    const prompt = buildSafeSummaryPrompt({
      apartmentName: "반포하이츠",
      district: "서초구",
      latestTradePriceKrw: "2310000000",
      estimatedJeonseKrw: "1339800000",
      riskBand: "high"
    });
    const summary = buildScaffoldedSummary({
      apartmentName: "반포하이츠",
      district: "서초구",
      latestTradePriceKrw: "2310000000",
      estimatedJeonseKrw: "1339800000",
      riskBand: "high"
    });
    expect(prompt).toContain("투자 권유/세무 자문/확정 표현 금지");
    expect(summary).toContain("확인 필요 항목");
  });

  it("enforces disclaimer acceptance", () => {
    expect(() => assertDisclaimerAccepted(false)).toThrowError(/법적 고지/);
    expect(() => assertDisclaimerAccepted(true)).not.toThrow();
  });
});
