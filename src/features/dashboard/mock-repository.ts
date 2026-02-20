export interface PropertyRecord {
  id: string;
  addressRoad: string;
  addressJibun: string;
  district: string;
  apartmentName: string;
  exclusiveAreaM2: number;
  latestTradePriceKrw: number;
  latestTradeDate: string;
  sourceLabel: string;
  sourceUrl: string;
}

const MOCK_PROPERTIES: PropertyRecord[] = [
  {
    id: "apt-seocho-001",
    addressRoad: "서울특별시 서초구 반포대로 111",
    addressJibun: "서울 서초구 반포동 100",
    district: "서초구",
    apartmentName: "반포하이츠",
    exclusiveAreaM2: 84.96,
    latestTradePriceKrw: 2_310_000_000,
    latestTradeDate: "2026-01-08",
    sourceLabel: "국토교통부 실거래가 공개시스템",
    sourceUrl: "https://rt.molit.go.kr"
  },
  {
    id: "apt-mapo-002",
    addressRoad: "서울특별시 마포구 월드컵북로 322",
    addressJibun: "서울 마포구 상암동 401",
    district: "마포구",
    apartmentName: "상암리버뷰",
    exclusiveAreaM2: 84.98,
    latestTradePriceKrw: 1_520_000_000,
    latestTradeDate: "2026-01-17",
    sourceLabel: "국토교통부 실거래가 공개시스템",
    sourceUrl: "https://rt.molit.go.kr"
  },
  {
    id: "apt-suyeong-003",
    addressRoad: "부산광역시 수영구 광안해변로 219",
    addressJibun: "부산 수영구 민락동 21",
    district: "수영구",
    apartmentName: "광안오션",
    exclusiveAreaM2: 74.21,
    latestTradePriceKrw: 870_000_000,
    latestTradeDate: "2026-02-03",
    sourceLabel: "국토교통부 실거래가 공개시스템",
    sourceUrl: "https://rt.molit.go.kr"
  }
];

export interface FreeDashboardRecord extends PropertyRecord {
  estimatedJeonseKrw: number;
  rentYieldPpm: number;
  riskBand: "low" | "medium" | "high";
}

function toDashboardRecord(record: PropertyRecord): FreeDashboardRecord {
  const estimatedJeonseKrw = Math.round(record.latestTradePriceKrw * 0.58);
  const annualRentKrw = Math.round(record.latestTradePriceKrw * 0.024);
  const rentYieldPpm = Math.round((annualRentKrw * 1_000_000) / record.latestTradePriceKrw);
  const riskBand: FreeDashboardRecord["riskBand"] =
    record.latestTradePriceKrw >= 2_000_000_000 ? "high" : record.latestTradePriceKrw >= 1_200_000_000 ? "medium" : "low";
  return { ...record, estimatedJeonseKrw, rentYieldPpm, riskBand };
}

export function searchProperties(query: string): PropertyRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOCK_PROPERTIES.filter((item) =>
    [item.apartmentName, item.addressRoad, item.addressJibun, item.district].some((field) => field.toLowerCase().includes(q))
  );
}

export function getFreeDashboardById(propertyId: string): FreeDashboardRecord | null {
  const found = MOCK_PROPERTIES.find((item) => item.id === propertyId);
  if (!found) return null;
  return toDashboardRecord(found);
}

export const marketDataPolicyMeta = {
  basisDate: "2026-02-01",
  policyVersion: "market-data-mock-v1"
};
