import { describe, expect, it } from "vitest";
import { POST as createReportPost } from "@/app/api/reports/create/route";
import { POST as createPaymentIntentPost } from "@/app/api/payments/intent/route";
import { POST as confirmPaymentPost } from "@/app/api/payments/confirm/route";
import { POST as aiSummaryPost } from "@/app/api/reports/ai-summary/route";

describe("payment gating + ai summary flow", () => {
  it("requires auth for payment intent", async () => {
    const createReq = new Request("http://localhost/api/reports/create", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ propertyId: "apt-seocho-001" })
    });
    const createRes = await createReportPost(createReq);
    const createBody = await createRes.json();
    expect(createBody.ok).toBe(true);

    const intentReq = new Request("http://localhost/api/payments/intent", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ reportId: createBody.data.reportId })
    });
    const intentRes = await createPaymentIntentPost(intentReq);
    expect(intentRes.status).toBe(401);
  });

  it("returns scaffolded summary only after paid + disclaimer accepted", async () => {
    const userId = "user-paid-1";
    const createReq = new Request("http://localhost/api/reports/create", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ propertyId: "apt-seocho-001" })
    });
    const createRes = await createReportPost(createReq);
    const createBody = await createRes.json();
    const reportId = createBody.data.reportId as string;

    const intentReq = new Request("http://localhost/api/payments/intent", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ reportId })
    });
    const intentRes = await createPaymentIntentPost(intentReq);
    expect(intentRes.status).toBe(200);
    const intentBody = await intentRes.json();

    const confirmReq = new Request("http://localhost/api/payments/confirm", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ paymentId: intentBody.data.paymentId })
    });
    const confirmRes = await confirmPaymentPost(confirmReq);
    expect(confirmRes.status).toBe(200);

    const rejectedReq = new Request("http://localhost/api/reports/ai-summary", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ reportId, disclaimerAccepted: false })
    });
    const rejectedRes = await aiSummaryPost(rejectedReq);
    expect(rejectedRes.status).toBe(400);

    const summaryReq = new Request("http://localhost/api/reports/ai-summary", {
      method: "POST",
      headers: { "content-type": "application/json", "x-user-id": userId },
      body: JSON.stringify({ reportId, disclaimerAccepted: true })
    });
    const summaryRes = await aiSummaryPost(summaryReq);
    expect(summaryRes.status).toBe(200);
    const summaryBody = await summaryRes.json();
    expect(summaryBody.ok).toBe(true);
    expect(summaryBody.data.summary).toContain("요약:");
    expect(summaryBody.data.disclaimer).toContain("참고용");
  });
});
