"use client";

import { FormEvent, useState } from "react";

interface SearchResult {
  propertyId: string;
  apartmentName: string;
  district: string;
  addressRoad: string;
  exclusiveAreaM2: number;
  latestTradePriceKrw: string;
  latestTradeDate: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [basisMeta, setBasisMeta] = useState<string>("-");
  const sessionId = "session-web-search";

  async function fireEvent(eventName: "search_submitted" | "search_result_clicked", propertyId?: string) {
    await fetch("/api/telemetry/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ eventName, sessionId, propertyId })
    }).catch(() => undefined);
  }

  async function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);
    void fireEvent("search_submitted");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const body = await res.json();
      if (!res.ok || !body.ok) {
        setResults([]);
        setBasisMeta("-");
        setError(body.error ?? "검색 중 오류가 발생했습니다.");
        return;
      }
      setResults(body.data.results);
      setBasisMeta(`${body.meta.basisDate} / ${body.meta.policyVersion}`);
    } catch {
      setError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <h1>매물 검색 (무료)</h1>
      <section className="card">
        <form className="form-grid" onSubmit={onSearch}>
          <label htmlFor="searchInput">아파트명/도로명/지번</label>
          <input
            id="searchInput"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="예: 반포, 상암, 광안"
          />
          <div className="button-row">
            <button type="submit" disabled={isLoading}>
              {isLoading ? "검색 중..." : "검색"}
            </button>
          </div>
        </form>
        {error && <p className="error-box">{error}</p>}
        <p className="muted">데이터 기준: {basisMeta}</p>
      </section>

      <section className="card">
        <h2>검색 결과</h2>
        {results.length === 0 ? (
          <p className="muted">결과가 없으면 검색어를 더 구체적으로 입력해 주세요.</p>
        ) : (
          <ul className="process-list">
            {results.map((item) => (
              <li key={item.propertyId}>
                <strong>{item.apartmentName}</strong> ({item.district}) / {item.exclusiveAreaM2}m² / 최근 거래{" "}
                {Number(item.latestTradePriceKrw).toLocaleString("ko-KR")}원 ({item.latestTradeDate}){" "}
                <a href={`/dashboard/free/${item.propertyId}`} onClick={() => void fireEvent("search_result_clicked", item.propertyId)}>
                  무료 대시보드 보기
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
