import { beforeEach, describe, expect, it } from "vitest";
import { entityRepo, paymentRepo, policyVersionRepo, reportRepo, resetMemoryStore } from "@/src/db/memory-store";

describe("memory db adapters", () => {
  beforeEach(() => {
    resetMemoryStore();
  });

  it("stores and reads entity/report/payment flow", () => {
    const entity = entityRepo.upsert({
      id: "apt-seocho-001",
      entityType: "property",
      displayName: "반포하이츠",
      regionCode: "11650",
      payloadJson: JSON.stringify({ district: "서초구" })
    });
    const report = reportRepo.create({
      entityId: entity.id,
      userId: "user-1",
      reportType: "free-dashboard",
      basisDate: "2026-02-01",
      policyVersion: "market-data-mock-v1"
    });
    const payment = paymentRepo.create({
      reportId: report.id,
      userId: "user-1",
      amountKrw: 19_900,
      currency: "KRW",
      status: "requires_auth",
      provider: "mock",
      providerRef: null
    });

    expect(entityRepo.getById(entity.id)?.displayName).toBe("반포하이츠");
    expect(reportRepo.getById(report.id)?.status).toBe("pending");
    expect(paymentRepo.getById(payment.id)?.status).toBe("requires_auth");
  });

  it("upserts policy version records", () => {
    policyVersionRepo.upsert({
      policyKey: "tax_rules",
      basisDate: "2026-01-01",
      policyVersion: "tax-2026-01",
      checksumSha256: "sha-a",
      publishedAt: "2026-01-01T00:00:00.000Z"
    });
    policyVersionRepo.upsert({
      policyKey: "tax_rules",
      basisDate: "2026-01-01",
      policyVersion: "tax-2026-01-hotfix",
      checksumSha256: "sha-b",
      publishedAt: "2026-01-10T00:00:00.000Z"
    });
    const list = policyVersionRepo.list("tax_rules");
    expect(list).toHaveLength(1);
    expect(list[0].policyVersion).toBe("tax-2026-01-hotfix");
  });
});
