import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/search/route";

describe("GET /api/search contract", () => {
  it("returns searchable list with policy metadata", async () => {
    const req = new Request("http://localhost/api/search?q=%EB%B0%98%ED%8F%AC");
    const res = await GET(req);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.data.count).toBeGreaterThan(0);
    expect(body.data.results[0]).toMatchObject({
      propertyId: expect.any(String),
      apartmentName: expect.any(String),
      latestTradePriceKrw: expect.any(String)
    });
    expect(body.meta).toMatchObject({
      basisDate: expect.any(String),
      policyVersion: expect.any(String)
    });
  });

  it("returns 400 when query is too short", async () => {
    const req = new Request("http://localhost/api/search?q=%EA%B0%80");
    const res = await GET(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toEqual(expect.any(String));
  });
});
