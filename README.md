# Phase 1 Day 1 Baseline

Next.js + TypeScript(strict) baseline for policy-driven acquisition tax/DSR calculations.

## Run

```bash
npm install
npm run dev
```

- Home: `http://localhost:3000/`
- Health API: `GET /api/health`
- Acquisition Tax API: `POST /api/tax/acquisition`
- DSR API: `POST /api/dsr/calculate`

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
- Handoff TC 문서가 저장소에 없어 placeholder TC 테스트를 추가했으며, 실제 TC ID/기댓값으로 교체가 필요함.

## TODO (Legal Edge Cases)

- Verify rural special tax applicability conditions beyond area (e.g., housing count, region conditions).
- Verify heavy tax applicability exceptions (temporary 2-home, inheritance, etc.).
- Replace placeholder handoff TC cases with authoritative table once document is provided.
