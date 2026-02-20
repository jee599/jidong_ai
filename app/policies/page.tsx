export const metadata = {
  title: "정책 기준 정보 | 집값AI"
};

export default function PoliciesPage() {
  return (
    <main>
      <h1>정책 기준 정보</h1>
      <section className="card">
        <p>기준일과 정책 버전은 API 응답 meta 필드에서 확인할 수 있습니다.</p>
      </section>
    </main>
  );
}
