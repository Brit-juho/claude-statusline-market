# TODOS

## [T1] ccstatusline segment type enum 확정
**What:** ccstatusline repo의 실제 지원 segment type 목록 파악 → schema.json에 enum 추가
**Why:** 현재 빌더가 생성하는 type 값(git_branch, context_pct 등)이 ccstatusline 실제 type과 다를 수 있어 설치 후 미동작 위험
**How to start:** https://github.com/sirmalloc/ccstatusline 소스 분석 → SEGMENT_GROUPS의 UI type과 실제 type 분리
**Depends on:** 없음

## [T2] 설치 스크립트 E2E 스모크 테스트
**What:** CI에서 GitHub Pages 배포 후 `curl ... | bash -s -- ko-minimal` 실행 → settings.json 검증
**Why:** Issue #1(404)처럼 배포 구조 변경 시 설치가 조용히 깨지는 걸 감지하기 위함
**How to start:** .github/workflows/smoke.yml 추가. ubuntu 환경에서 jq, curl 설치 후 스크립트 실행
**Depends on:** [T1] public/presets/ 이동 완료 후
