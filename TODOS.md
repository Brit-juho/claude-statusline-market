# TODOS

## ✅ 완료된 항목

- **[T3]** 카테고리별 빈 상태 메시지 — `filterCards()` 카테고리 전용 메시지
- **[T4]** 복사 버튼 `role="status"` toast — WCAG 4.1.3 접근성
- **[T5]** 기여 유도 CTA — 갤러리 하단 PR 안내 + CONTRIBUTING.md 링크
- **[T6]** 빌더 페이지 + xterm.js 제거 — 280KB 번들 정리
- **[T7]** ccstatusline 설치 여부 체크 — install-preset.sh 안내 메시지
- **[T1]** ccstatusline segment type enum 확정 — `public/presets/schema.json` enum 26종 추가
- **[T8]** astro dev 서버 수정 — `@astrojs/preact` Rolldown→Rollup 플러그인 형식 패치 (`patches/` + postinstall)
- **[T9]** 빌더 컴포넌트 Vitest 테스트 — dnd-kit mock + 12개 테스트 (BuilderApp click-to-add, remove, config, JSON)
- **[T10]** Windows PS1 설치 스크립트 수정 — `Install-Preset` 함수 실제 구현 + `ccstatusline_settings` 키 추출(과거엔 프리셋 파일 전체를 그대로 옮겨써서 메타데이터가 섞여 들어갔음) 버그 수정
- **[T11]** `install-preset.sh`/`skills/statusline-market`가 공유하는 `scripts/apply-ccstatusline.sh` 추출 — 적용 로직 이중 관리 방지
- **[T12]** `scripts/render-preview.mjs`, `scripts/segment-catalog.json`, `public/presets/index.json` 추가 — 터미널 Skill이 브라우저 빌더와 동일한 카탈로그/렌더링을 참조. `npm run validate`가 두 파일의 드리프트를 감지
- **[T13]** `CONTRIBUTING.md`/`.github/workflows/screenshot.yml`의 구식 스키마(`settings.statusline.segments`) 참조 수정, `screenshot.yml`의 `chmod +x /usr/local/bin freeze` 공백 버그 수정
- **[T14]** `skills/statusline-market` Skill + `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` 추가 — 터미널 대화형 탐색/미리보기/커스터마이징/적용

## 남은 항목

## [T2] 설치 스크립트 E2E 스모크 테스트
**What:** CI에서 GitHub Pages 배포 후 `curl ... | bash -s -- ko-minimal` 실행 → settings.json 검증
**Why:** 배포 구조 변경 시 설치가 조용히 깨지는 걸 자동으로 감지
**Status:** `.github/workflows/smoke.yml` 작성 완료, v3 형식 검증까지 이미 반영되어 있음. `install-preset.sh`가 내부적으로 `apply-ccstatusline.sh`를 호출하도록 리팩터링됐지만 외부 인터페이스(`bash scripts/install-preset.sh <id>`)는 동일해 smoke.yml 수정 불필요 — 완료로 간주 가능.
**Depends on:** 없음 (완료 후보, 리뷰 시 확인)

## [T15] Windows(`install-preset.ps1`) 스모크 테스트 부재
**What:** `smoke.yml`에는 sh 스크립트 검증만 있고 ps1 검증이 없어 Windows 설치가 CI에서 감지되지 않음
**Why:** T10에서 ps1을 고쳤지만 회귀를 잡아줄 CI가 없음
**Status:** 미착수. `windows-latest` 러너에서 `Install-Preset`을 실행해 `ccstatusline/settings.json`을 검증하는 잡 추가 필요

## [T16] `pr-status`/`agent-name` 세그먼트 — ccstatusline 미지원 확인, 보류
**What:** 최신 Claude Code CLI가 stdin으로 넘기는 `pr.*`(GitHub PR + GitLab MR), `agent.name` 필드를 세그먼트 카탈로그에 추가하려 했으나, ccstatusline 2.2.27(npm) 소스에 해당 widget type이 존재하지 않아 렌더링이 불가능함을 확인
**Why:** 카탈로그에 추가해도 실제 ccstatusline이 그려주지 못하면 사용자에게 오히려 혼란
**Status:** 이번 스코프에서 제외. ccstatusline 상류에서 지원이 추가되면 `segment-defs.ts` + `public/presets/schema.json` enum + `scripts/segment-catalog.json`(재생성)에 반영
