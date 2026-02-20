import { PaidSummaryPanel } from "./paid-summary-panel";

interface DashboardPageProps {
  params: Promise<{ propertyId: string }>;
}

interface DashboardResponse {
  ok: boolean;
  data?: {
    apartmentName: string;
    district: string;
    exclusiveAreaM2: number;
    latestTradePriceKrw: string;
    latestTradeDate: string;
    estimatedJeonseKrw: string;
    rentYieldPpm: string;
    riskBand: "low" | "medium" | "high";
    sourceLabel: string;
    sourceUrl: string;
  };
  error?: string;
  meta: { basisDate: string; policyVersion: string; generatedAt: string };
}

function riskBandLabel(riskBand: "low" | "medium" | "high"): string {
  if (riskBand === "high") return "주의";
  if (riskBand === "medium") return "보통";
  return "낮음";
}

export default async function FreeDashboardPage({ params }: DashboardPageProps) {
  const { propertyId } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/dashboard/free?propertyId=${propertyId}`, {
    cache: "no-store"
  });
  const body = (await res.json()) as DashboardResponse;

  if (!res.ok || !body.ok || !body.data) {
    return (
      <main>
        <h1>무료 대시보드</h1>
        <section className="card">
          <p className="error-box">{body.error ?? "대시보드 로드에 실패했습니다."}</p>
          <p className="muted">기준: {body.meta?.basisDate ?? "-"} / {body.meta?.policyVersion ?? "-"}</p>
          <a href="/search">검색으로 돌아가기</a>
        </section>
      </main>
    );
  }

  const { data } = body;
  return (
    <main>
      <h1>무료 대시보드</h1>
      <section className="card">
        <h2>
          {data.apartmentName} ({data.district})
        </h2>
        <dl className="result-grid">
          <dt>전용면적</dt>
          <dd>{data.exclusiveAreaM2}m²</dd>
          <dt>최근 실거래가</dt>
          <dd>{Number(data.latestTradePriceKrw).toLocaleString("ko-KR")}원</dd>
          <dt>최근 거래일</dt>
          <dd>{data.latestTradeDate}</dd>
          <dt>추정 전세가(참고)</dt>
          <dd>{Number(data.estimatedJeonseKrw).toLocaleString("ko-KR")}원</dd>
          <dt>추정 임대수익률(연)</dt>
          <dd>{(Number(data.rentYieldPpm) / 10_000).toFixed(2)}%</dd>
          <dt>리스크 밴드</dt>
          <dd>{riskBandLabel(data.riskBand)}</dd>
        </dl>
        <p className="muted">
          기준: {body.meta.basisDate} / {body.meta.policyVersion}
        </p>
        <p className="disclaimer">
          안내: 무료 대시보드는 공개 데이터 기반 참고 정보이며 투자 판단/세무 자문을 대체하지 않습니다.
        </p>
        <p className="muted">
          출처:{" "}
          <a href={data.sourceUrl} target="_blank" rel="noreferrer">
            {data.sourceLabel}
          </a>
        </p>
      </section>
      <PaidSummaryPanel propertyId={propertyId} />
    </main>
  );
}
