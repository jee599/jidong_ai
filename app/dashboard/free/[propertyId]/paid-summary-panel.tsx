"use client";

import { useState } from "react";

interface PaidSummaryPanelProps {
  propertyId: string;
}

export function PaidSummaryPanel({ propertyId }: PaidSummaryPanelProps) {
  const [userId, setUserId] = useState("demo-user-1");
  const [reportId, setReportId] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function requestPaidSummary() {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const reportRes = await fetch("/api/reports/create", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ propertyId })
      });
      const reportBody = await reportRes.json();
      if (!reportRes.ok || !reportBody.ok) throw new Error(reportBody.error ?? "리포트 생성 실패");
      setReportId(reportBody.data.reportId);

      const intentRes = await fetch("/api/payments/intent", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ reportId: reportBody.data.reportId })
      });
      const intentBody = await intentRes.json();
      if (!intentRes.ok || !intentBody.ok) throw new Error(intentBody.error ?? "결제 생성 실패");
      setPaymentId(intentBody.data.paymentId);

      const confirmRes = await fetch("/api/payments/confirm", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ paymentId: intentBody.data.paymentId })
      });
      const confirmBody = await confirmRes.json();
      if (!confirmRes.ok || !confirmBody.ok) throw new Error(confirmBody.error ?? "결제 승인 실패");

      const summaryRes = await fetch("/api/reports/ai-summary", {
        method: "POST",
        headers: { "content-type": "application/json", "x-user-id": userId },
        body: JSON.stringify({ reportId: reportBody.data.reportId, disclaimerAccepted: true })
      });
      const summaryBody = await summaryRes.json();
      if (!summaryRes.ok || !summaryBody.ok) throw new Error(summaryBody.error ?? "AI 요약 실패");
      setSummary(summaryBody.data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>유료 AI 요약 (Mock 결제)</h2>
      <p className="muted">로그인 사용자 기준으로 결제/요약 요청이 가능합니다. 외부 PG/AI 연결 전 Mock 어댑터를 사용합니다.</p>
      <label htmlFor="userId">사용자 ID</label>
      <input id="userId" value={userId} onChange={(event) => setUserId(event.target.value)} />
      <div className="button-row">
        <button type="button" onClick={requestPaidSummary} disabled={isLoading}>
          {isLoading ? "처리 중..." : "결제 후 AI 요약 받기"}
        </button>
      </div>
      {error && <p className="error-box">{error}</p>}
      {reportId && <p className="muted">reportId: {reportId}</p>}
      {paymentId && <p className="muted">paymentId: {paymentId}</p>}
      {summary && <pre className="summary-box">{summary}</pre>}
    </section>
  );
}
