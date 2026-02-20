import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "면책 및 법적 고지 | 집값AI",
  description: "집값AI 서비스의 참고용 정보 제공 범위 및 면책 고지"
};

export default function DisclaimerPage() {
  return (
    <main>
      <h1>면책 및 법적 고지</h1>
      <section className="card">
        <p>
          집값AI는 공개 정책/데이터를 기반으로 한 참고 정보를 제공합니다. 세무, 법률, 투자 자문을 제공하지 않으며,
          실제 의사결정은 최신 공공자료 및 전문가 검토를 통해 진행해야 합니다.
        </p>
      </section>
      <section className="card">
        <p>정책/데이터는 기준일 이후 변경될 수 있으며, 서비스 결과는 지연 또는 누락이 있을 수 있습니다.</p>
      </section>
    </main>
  );
}
