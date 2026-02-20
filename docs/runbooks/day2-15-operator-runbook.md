# 집값AI Operator Runbook (Day 2-15)

## 1) 배포 전 체크
- `npm test`
- `npm run build`
- 핵심 API smoke
  - `GET /api/search?q=반포`
  - `GET /api/dashboard/free?propertyId=apt-seocho-001`
  - `POST /api/reports/create`
  - `POST /api/payments/intent` (인증 필요)
  - `POST /api/payments/confirm` (인증 필요)
  - `POST /api/reports/ai-summary` (결제+면책확인 필요)

## 2) 운영 모니터링
- 오류 우선순위
  1. 결제 API 5xx/4xx 급증
  2. AI 요약 API 402 급증 (결제 누락 플로우 점검)
  3. 검색 API 400 급증 (UI 입력 안내 점검)
- 메타 검증
  - 모든 응답에 `meta.basisDate`, `meta.policyVersion` 포함 확인

## 3) 배치 작업(스캐폴드)
- 정책 버전 동기화/리포트 워밍은 스캐폴드 상태
- 파일: `src/jobs/batch-scaffold.ts`
- TODO
  - 외부 정책 소스 인증 연동
  - 큐/워커 기반 재시도 전략 적용

## 4) 장애 대응
- 네트워크/외부 API 장애 시
  - Mock adapter로 서비스 축소 모드 유지
  - 사용자 안내 문구: "현재 일부 데이터 동기화가 지연되고 있습니다."
- 결제 장애 시
  - 새 결제 생성 중단
  - 기존 무료 대시보드는 정상 제공

## 5) 법적/신뢰 고지 운영
- 계산기/AI 요약에 면책 문구 노출 여부 확인
- 보수적 문구 유지
  - 확정 표현 금지
  - 참고/확인 필요 문구 유지
