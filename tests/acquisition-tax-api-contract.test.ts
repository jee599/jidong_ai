import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/tax/acquisition/route";

describe("POST /api/tax/acquisition contract", () => {
  it("returns expected success envelope shape", async () => {
    const req = new Request("http://localhost/api/tax/acquisition", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        purchasePriceKrw: 700_000_000,
        ownedHouseCount: 1,
        isAdjustmentTargetArea: false,
        exclusiveAreaM2: 84
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toMatchObject({
      acquisitionTaxKrw: expect.any(String),
      localEducationTaxKrw: expect.any(String),
      ruralSpecialTaxKrw: expect.any(String),
      totalTaxKrw: expect.any(String),
      acquisitionTaxRatePpm: expect.any(String),
      isHeavyTaxRate: expect.any(Boolean)
    });
    expect(body.meta).toMatchObject({
      basisDate: expect.any(String),
      policyVersion: expect.any(String),
      generatedAt: expect.any(String)
    });
  });

  it("returns 400 with error shape for invalid payload", async () => {
    const req = new Request("http://localhost/api/tax/acquisition", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        purchasePriceKrw: -100,
        ownedHouseCount: 0,
        isAdjustmentTargetArea: "no",
        exclusiveAreaM2: -1
      })
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toEqual(expect.any(String));
    expect(body.meta).toMatchObject({
      basisDate: expect.any(String),
      policyVersion: expect.any(String),
      generatedAt: expect.any(String)
    });
  });
});
