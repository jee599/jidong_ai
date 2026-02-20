# Blog Pipeline (작업량 기준)

이 블로그는 **날짜 기준이 아니라 작업량 기준**으로 발행합니다.

## 기준
- 1 Work Unit = 하나의 의미 있는 작업 단위
  - 문제 정의
  - 접근/구현
  - 결과/인사이트
- 기본 발행 임계치: **5 units**
  - units가 5개 쌓이면 1개 글로 자동 묶음 발행

## 흐름
1. 작업 끝날 때마다 unit 추가
2. 발행 스크립트 실행
3. 임계치 이상이면 `blog/posts/`에 글 생성
4. 생성 후 자동 커밋

## 명령어
```bash
# 유닛 추가
python3 scripts/blog_units.py add \
  --title "OpenClaw gateway pairing 복구" \
  --problem "pairing required와 token mismatch 충돌" \
  --approach "gateway probe + devices 승인 + token 정리" \
  --result "Reachable yes 확인" \
  --tags openclaw,ops,debug

# 발행(5개 이상이면 자동 생성)
python3 scripts/blog_units.py publish --min-units 5
```

## 출력 구조
- 입력 큐: `blog/units.json`
- 발행본: `blog/posts/<slug>.md`
