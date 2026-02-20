import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "요금 안내 | 집값AI",
  description: "집값AI 무료 대시보드 및 유료 AI 요약 리포트 요금 안내"
};

export default function PricingPage() {
  return (
    <main>
      <h1>요금 안내</h1>
      <section className="card">
        <h2>무료</h2>
        <p>매물 검색 + 무료 대시보드(실거래/참고 지표)</p>
      </section>
      <section className="card">
        <h2>유료 AI 요약</h2>
        <p>1건 19,900원 (Mock 결제 흐름 기준)</p>
        <p className="disclaimer">법적 고지 확인 후 생성되는 참고용 요약 문서입니다.</p>
      </section>
    </main>
  );
}
