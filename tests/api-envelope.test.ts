import { describe, expect, it } from "vitest";
import { envelope } from "@/src/lib/api-envelope";

describe("api envelope", () => {
  it("includes basisDate/policyVersion/generatedAt", () => {
    const response = envelope({ ping: true }, { basisDate: "2026-02-21", policyVersion: "v1" });
    expect(response.ok).toBe(true);
    expect(response.meta.basisDate).toBe("2026-02-21");
    expect(response.meta.policyVersion).toBe("v1");
    expect(response.meta.generatedAt).toMatch(/T/);
  });
});
