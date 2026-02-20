# 작업 배치 #1: OpenClaw 모델/결제 경로 정리 외 1건

## 이번 배치에서 다룬 작업

### 1. OpenClaw 모델/결제 경로 정리
- 문제: ChatGPT Pro 구독과 OpenAI API 과금 경로가 혼동됨
- 접근: 모델 provider별 인증 경로와 과금 체계를 분리 설명
- 결과: 기본 모델을 codex로 복귀하고 API 추가과금 리스크 제거
- 태그: openclaw, openai, billing

### 2. Gateway pairing/token mismatch 복구
- 문제: gateway probe에서 unauthorized/pairing required 반복
- 접근: pairing 승인 + gateway 상태 재검증 + 세션 정상화
- 결과: Reachable yes 확인, 텔레그램 응답 정상
- 태그: openclaw, gateway, ops

## 배치 회고
- 공통 패턴: 문제를 작은 단위로 나눌수록 해결 속도가 빨라짐
- 다음 액션: 반복되는 작업은 스크립트/템플릿으로 자동화
