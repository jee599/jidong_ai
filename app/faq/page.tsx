import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 집값AI",
  description: "집값AI 계산/결제/정책 기준일 관련 FAQ"
};

export default function FaqPage() {
  return (
    <main>
      <h1>자주 묻는 질문</h1>
      <section className="card">
        <h2>Q. 계산 결과를 그대로 신고해도 되나요?</h2>
        <p>A. 아니요. 참고용이며 실제 신고 전 관할 기관/전문가 확인이 필요합니다.</p>
      </section>
      <section className="card">
        <h2>Q. 정책 기준일은 어디서 보나요?</h2>
        <p>A. 각 API 응답의 <code>meta.basisDate</code>, <code>meta.policyVersion</code> 필드에서 확인할 수 있습니다.</p>
      </section>
    </main>
  );
}
