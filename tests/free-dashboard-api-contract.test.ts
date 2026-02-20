import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/dashboard/free/route";

describe("GET /api/dashboard/free contract", () => {
  it("returns free dashboard data with metadata", async () => {
    const req = new Request("http://localhost/api/dashboard/free?propertyId=apt-seocho-001");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data).toMatchObject({
      propertyId: "apt-seocho-001",
      apartmentName: expect.any(String),
      latestTradePriceKrw: expect.any(String),
      rentYieldPpm: expect.any(String),
      sourceUrl: expect.any(String)
    });
    expect(body.meta).toMatchObject({
      basisDate: expect.any(String),
      policyVersion: expect.any(String)
    });
  });

  it("returns 404 for unknown property id", async () => {
    const req = new Request("http://localhost/api/dashboard/free?propertyId=not-found");
    const res = await GET(req);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toEqual(expect.any(String));
  });
});
