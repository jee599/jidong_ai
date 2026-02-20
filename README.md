# Phase 1 Day 2

Next.js + TypeScript(strict) project for policy-driven acquisition tax/DSR calculations.

## Run

```bash
npm install
npm run dev
```

- Home: `http://localhost:3000/`
- Acquisition Tax Calculator: `http://localhost:3000/calculator/acquisition-tax`
- Search: `http://localhost:3000/search`
- Free Dashboard: `http://localhost:3000/dashboard/free/[propertyId]`
- Health API: `GET /api/health`
- Acquisition Tax API: `POST /api/tax/acquisition`
- DSR API: `POST /api/dsr/calculate`
- Search API: `GET /api/search?q=...`
- Free Dashboard API: `GET /api/dashboard/free?propertyId=...`
- Report Create API: `POST /api/reports/create`
- Payment Intent API: `POST /api/payments/intent` (auth required)
- Payment Confirm API: `POST /api/payments/confirm` (auth required)
- AI Summary API: `POST /api/reports/ai-summary` (auth+paid+disclaimer required)
- Telemetry API: `POST /api/telemetry/event`

## Day2 Runbook (취득세 계산기)

1. 계산기 페이지 접속: `http://localhost:3000/calculator/acquisition-tax`
2. 아래 입력값을 채운 뒤 `세금 계산` 클릭
- 매수 가격(원)
- 현재 주택 보유 수(0/1/2/3+)
- 조정대상지역 여부
- 전용면적(m²)
3. 결과 영역에서 아래 항목 확인
- 취득세
- 지방교육세
- 농어촌특별세
- 합계
- 적용 취득세율
- 중과 여부
4. 신뢰 요소 확인
- 기준일 표시(`meta.basisDate`)
- 계산 과정 토글
- 면책 문구
5. 에러 UX 확인
- 비정상 입력(음수/문자 등) 시 필드 단위 검증 메시지
- API 실패/네트워크 실패 시 오류 박스 노출

## Test

```bash
npm test
```

## Policy Data

- `src/policies/tax_rules.json`
- `src/policies/dsr_rules.json`
- `src/policies/adjustment-zones.json`

Each policy file includes:
- `basisDate`
- `policyVersion`

API responses include `meta.basisDate`, `meta.policyVersion`, `meta.generatedAt`.

## Reliability Notes

- Tax core uses bigint arithmetic (`ppm` scale) to avoid floating-point drift.
- 1주택 6~9억 세율 formula is implemented exactly as:
  - `(priceInEok * 2/3 - 3) / 100`
- Boundary tests cover `6억`, `9억`, local education tax branch(heavy/non-heavy), and rural special tax area threshold(`<=85` exempt).
- Form validation test covers `0/1/2/3+` 입력 매핑(취득 전 보유수 -> API 취득 후 보유수).
- API contract test covers both success envelope shape and `400` error shape.
- Handoff TC 문서가 저장소에 없어 placeholder TC 테스트를 추가했으며, 실제 TC ID/기댓값으로 교체가 필요함.

## TODO (Legal Edge Cases)

- Verify rural special tax applicability conditions beyond area (e.g., housing count, region conditions).
- Verify heavy tax applicability exceptions (temporary 2-home, inheritance, etc.).
- Replace placeholder handoff TC cases with authoritative table once document is provided.

## Day 6-15 Additions

- DB migration scaffold: `db/migrations/0001_core_tables.sql`, `db/migrations/0002_indexes.sql`
- In-memory adapters for `entities/reports/payments/policy_versions`: `src/db/memory-store.ts`
- Safe AI summary scaffold: `src/features/reports/ai-summary.ts`
- Batch scaffold jobs: `src/jobs/batch-scaffold.ts`
- Operator runbook: `docs/runbooks/day2-15-operator-runbook.md`
