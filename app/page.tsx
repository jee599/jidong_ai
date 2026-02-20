export default function HomePage() {
  return (
    <main>
      <h1>집값AI Phase 1 Day 2</h1>
      <section className="card">
        <p>정책 기반 세금/DSR 계산 API와 계산기 UI를 제공합니다.</p>
        <p>
          API: <code>/api/tax/acquisition</code>, <code>/api/dsr/calculate</code>, <code>/api/health</code>
        </p>
        <p>
          계산기: <a href="/calculator/acquisition-tax">/calculator/acquisition-tax</a>
        </p>
        <p>
          무료 플로우: <a href="/search">/search</a> → <code>/dashboard/free/[propertyId]</code>
        </p>
        <p>
          참고 페이지: <a href="/pricing">/pricing</a>, <a href="/faq">/faq</a>, <a href="/legal/disclaimer">/legal/disclaimer</a>
        </p>
      </section>
    </main>
  );
}
