import { describe, expect, it } from "vitest";
import { GET as searchGet } from "@/app/api/search/route";
import { GET as dashboardGet } from "@/app/api/dashboard/free/route";
import { POST as reportCreatePost } from "@/app/api/reports/create/route";
import { POST as paymentIntentPost } from "@/app/api/payments/intent/route";
import { POST as paymentConfirmPost } from "@/app/api/payments/confirm/route";
import { POST as aiSummaryPost } from "@/app/api/reports/ai-summary/route";

describe("e2e smoke: search -> free dashboard -> payment -> ai summary", () => {
  it("executes full happy path", async () => {
    const userId = "e2e-user-1";

    const searchRes = await searchGet(new Request("http://localhost/api/search?q=%EB%B0%98%ED%8F%AC"));
    expect(searchRes.status).toBe(200);
    const searchBody = await searchRes.json();
    const propertyId = searchBody.data.results[0].propertyId as string;
    expect(propertyId).toBeDefined();

    const dashboardRes = await dashboardGet(
      new Request(`http://localhost/api/dashboard/free?propertyId=${encodeURIComponent(propertyId)}`)
    );
    expect(dashboardRes.status).toBe(200);

    const reportRes = await reportCreatePost(
      new Request("http://localhost/api/reports/create", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ propertyId })
      })
    );
    expect(reportRes.status).toBe(200);
    const reportBody = await reportRes.json();
    const reportId = reportBody.data.reportId as string;

    const paymentIntentRes = await paymentIntentPost(
      new Request("http://localhost/api/payments/intent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ reportId })
      })
    );
    expect(paymentIntentRes.status).toBe(200);
    const paymentIntentBody = await paymentIntentRes.json();
    const paymentId = paymentIntentBody.data.paymentId as string;

    const paymentConfirmRes = await paymentConfirmPost(
      new Request("http://localhost/api/payments/confirm", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ paymentId })
      })
    );
    expect(paymentConfirmRes.status).toBe(200);

    const summaryRes = await aiSummaryPost(
      new Request("http://localhost/api/reports/ai-summary", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ reportId, disclaimerAccepted: true })
      })
    );
    expect(summaryRes.status).toBe(200);
    const summaryBody = await summaryRes.json();
    expect(summaryBody.data.summary).toContain("요약:");
    expect(summaryBody.data.disclaimer).toContain("참고용");
  });
});
