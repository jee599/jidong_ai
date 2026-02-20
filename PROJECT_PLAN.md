# 집값AI 실행 계획 (병렬 운영)

## Stream A — Core Engine (Codex)
- 취득세/교육세/농특세 계산 엔진
- 정책 JSON 분리
- 경계값/회귀 테스트

## Stream B — Product Skeleton (Main)
- 웹 정보구조/라우팅 설계
- API 응답 메타 표준화
- 에러/면책 UX 기본 문구 통일

## Stream C — Delivery & Comms (Main)
- 기능 단위 커밋 규칙
- 배치 블로그 템플릿 유지
- 각 배치 종료 후 사용자 보고 요약

## Done 기준 (웹 10/10)
1. 계산 정확도 테스트 통과
2. 기준일/출처/면책 표시
3. 유저 플로우(검색→무료→유료) E2E 통과
4. 결제/실패/복구 시나리오 검증
