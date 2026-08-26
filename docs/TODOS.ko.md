[English](./TODOS.md) · **한국어**

# TODOS

## ✅ 완료된 항목

- **[T3]** 카테고리별 빈 상태 메시지 — `filterCards()` 카테고리 전용 메시지
- **[T4]** 복사 버튼 `role="status"` toast — WCAG 4.1.3 접근성
- **[T5]** 기여 유도 CTA — 갤러리 하단 PR 안내 + CONTRIBUTING.md 링크
- **[T6]** 빌더 페이지 + xterm.js 제거 — 280KB 번들 정리
- **[T7]** ccstatusline 설치 여부 체크 — install-preset.sh 안내 메시지
- **[T1]** ccstatusline segment type enum 확정 — `public/presets/schema.json` enum 26종 추가
- **[T8]** astro dev 서버 수정 — `@astrojs+preact` Rolldown→Rollup 플러그인 형식 패치 (`patches/` + postinstall)
- **[T9]** 빌더 컴포넌트 Vitest 테스트 — dnd-kit mock + 12개 테스트 (BuilderApp click-to-add, remove, config, JSON)
- **[T10]** Windows PS1 설치 스크립트 수정 — `Install-Preset` 함수 실제 구현 + `ccstatusline_settings` 키 추출(과거엔 프리셋 파일 전체를 그대로 옮겨써서 메타데이터가 섞여 들어갔음) 버그 수정
- **[T11]** `install-preset.sh`/`skills/statusline-market`가 공유하는 `scripts/apply-ccstatusline.sh` 추출 — 적용 로직 이중 관리 방지
- **[T12]** `scripts/render-preview.mjs`, `scripts/segment-catalog.json`, `public/presets/index.json` 추가 — 터미널 Skill이 브라우저 빌더와 동일한 카탈로그/렌더링을 참조. `npm run validate`가 두 파일의 드리프트를 감지
- **[T13]** `CONTRIBUTING.md`/`.github/workflows/screenshot.yml`의 구식 스키마(`settings.statusline.segments`) 참조 수정, `screenshot.yml`의 `chmod +x /usr/local/bin freeze` 공백 버그 수정
- **[T14]** `skills/statusline-market` Skill + `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` 추가 — 터미널 대화형 탐색/미리보기/커스터마이징/적용
- **[T17]** GitHub Pages 활성화 — 저장소에 Pages 자체가 꺼져 있어 `Deploy to GitHub Pages`가 항상 404로 실패하고 있었음. `gh api`로 Source=GitHub Actions 활성화 후 재배포, 라이브 URL 200 확인
- **[T19]** `flex-separator` 위젯 추가 — `separator`와는 별개로 실존하는 ccstatusline 타입임을 소스 직접 확인("Expands to fill available terminal width", 우측 정렬용). `skills/statusline-market/SKILL.md`의 stale "9개 그룹" 표현도 수정(카탈로그가 커질 때마다 바뀌므로 하드코딩 숫자 대신 실제 읽어온 개수를 쓰도록 지침 변경)
- **[T18]** `screenshot.yml`의 `freeze` 버전 핀 수정 — `FREEZE_VERSION=1.4.3`은 존재한 적 없는 버전(항상 404). 최신 `v0.2.2`로 교체하고 에셋 이름 규칙 변경(`linux_amd64`→`Linux_x86_64`, tar 내부 서브디렉터리 구조)에 맞춰 설치 로직도 수정. 실제 워크플로우 재실행으로 성공 확인
- **[T2]** 설치 스크립트 E2E 스모크 테스트 — `.github/workflows/smoke.yml`이 v3 형식 검증까지 반영돼 있고, T17(Pages 활성화) 이후 실제 라이브 URL로 정상 실행 확인(워크플로우 성공)
- **[T16]** `pr-status`/`agent-name` 세그먼트 검토 — 최신 Claude Code CLI가 stdin으로 넘기는 `pr.*`(GitHub PR + GitLab MR), `agent.name` 필드를 세그먼트 카탈로그에 추가하려 했으나, ccstatusline 2.2.27(npm) 소스를 직접 확인해 해당 widget type이 존재하지 않음을 확인 — 카탈로그에 추가해도 실제로 그려지지 않아 혼란만 줄 것이라 판단해 미반영으로 확정. ccstatusline 상류에서 지원이 추가되면 그때 `segment-defs.ts` + `public/presets/schema.json` enum + `scripts/segment-catalog.json`에 반영
- **[T20]** 브라우저 빌더의 "커스텀" 위젯이 다운로드 시 값을 버리던 버그 수정 — `custom-text`/`custom-command`의 실제 텍스트·명령어(`rawValue`/`commandPath`)가 미리보기엔 반영되는데 다운로드한 JSON엔 빠져 있었음. "전역 구분자" 입력도 미리보기 전용이었던 걸 ccstatusline 실제 필드(`defaultSeparator`)로 내보내도록 수정. `def?.type === 'text'`로 되어 있어 한 번도 매치되지 않던 죽은 분기(`isText`/`segmentLabel`)도 `'custom-text'`로 수정. 회귀 방지 테스트 추가
- **[T21]** `python-dev.json`이 `node --version`을 실행하던 복붙 실수 수정 — 전체 30개 프리셋의 custom-command/custom-text/link/custom-symbol 사용 현황과 실제 렌더링을 전수 점검하는 과정에서 발견. `python --version`으로 수정, `segment-defs.ts`에 `python-version` 카탈로그 항목도 신규 추가

- **[T15]** `smoke.yml`에 `smoke-windows` 잡(`windows-latest`) 추가 — GitHub 클라우드 Windows 러너에서 `Install-Preset`을 실제로 실행해 `ccstatusline/settings.json`을 sh 버전과 동일한 기준으로 검증(로컬 Windows 불필요), T10이 고친 회귀(프리셋 메타데이터 유출)를 직접 잡는 체크도 추가. **CI가 즉시 진짜 버그를 잡음**: `install-preset.ps1`의 `[System.IO.File]::WriteAllBytes($TmpFile, $Response.Content)`가 PowerShell 7(pwsh)에서 항상 실패하고 있었음 — pwsh에서는 `.Content`가 Windows PowerShell 5.1과 달리 byte[]가 아니라 문자열이라, 헤더에 "PowerShell 5.1+"라고 적혀 있었지만 실제론 5.1에서만 동작했음. `Invoke-WebRequest -OutFile`로 교체(버전 무관하게 안전)해서 수정, 실제 워크플로우 재실행으로 Windows 러너에서 통과 확인.
- **[T22]** 프리셋 카탈로그 전면 리뉴얼(30개 → 19개) — 아이콘이 하나도 없던 하위권 12개 삭제, 나머지는 `custom-text` 위젯으로 아이콘을 명시하도록 재설계(위젯 `type`만으로는 카탈로그가 제안하는 아이콘 접두어가 붙지 않는 게 프리셋이 밋밋해 보였던 진짜 원인이었음), 서술형 프리셋 3종 신설(`git-story`/`session-story`/`cost-story`, `custom-command`로 실제 문장 조합), 범용 플래그십 2종 신설(`daily-pulse`/`daily-radar` — 한 도메인 특화 대신 model+context+git+cost를 블렌딩)로 더 니치했던 `speed-flow`/`multi-model` 대체, 오리지널 톤온톤 다크 테마 3종 신설(`theme-ember`/`theme-deep-current`/`theme-violet-dusk`, ccstatusline의 실제 `powerline` 설정을 활용 — 흉내가 아님). 대부분의 프리셋에 `context-percentage` 추가(미니멀/테마 계열은 의도적으로 제외). 전체 프리셋에 스타일 태그(`symbol`/`narrative`/`powerline`/`theme`) 부여 — statuslin.es의 기능+스타일 이중 태그 방식을 참고.
- **[T23]** `PresetCard.astro`가 `ccstatusline_settings.powerline` 설정을 아예 무시하고 모든 프리셋을 "·"로 이어붙인 평문 텍스트로만 렌더링하던 문제 — 실제 배경 블록+화살표 구분선 렌더링(`preview.ts`의 `renderPowerlineBlocks`/`colorHex`/`contrastText`) 추가해서 파워라인 프리셋이 갤러리 카드에서도 실제 파워라인처럼 보이도록 수정. 터미널 쪽 미리보기(`render-preview.mjs`, 스킬이 사용)도 동일하게 처리하고, 원래 없던 hex 색상 지원도 추가(이전엔 hex `color` 값이 전부 회색으로 폴백됨).
- **[T24]** `public/presets/schema.json`의 위젯 `type` enum이 `scripts/segment-catalog.json`과 어긋나 있었음 — 빌더/스킬에서 고를 수 있는 세그먼트 7개(`docker`, `k8s`, `cloud`, `terraform`, `runtime`, `python-version`, `venv`)가 스키마 enum엔 없어서, 이걸 써서 프리셋을 저장하면 검증에서 무조건 실패하는 상태였음. enum에 추가.
- **[T25]** T22 프리셋 리뉴얼 이후 정리: `smoke.yml`이 이미 삭제된 `ko-minimal`을 기본 `PRESET_ID`로 계속 참조해서 `smoke`/`smoke-windows` 둘 다 404로 실패 중이었음 — `clean-signal`로 교체. 별도로, `smoke-windows`의 T10 회귀 검사(프리셋 메타데이터가 `ccstatusline/settings.json`에 유출되지 않는지)가 `version`/`lines`만 화이트리스트에 둬서, T22 프리셋들이 쓰는 정상 필드 `defaultSeparator`/`powerline`까지 오탐하고 있었음 — 화이트리스트에 둘 다 추가. `CONTRIBUTING.md`/`.ko.md`도 함께 수정: "기존 프리셋을 템플릿으로 복사" 예시가 이미 삭제된 `ko-minimal.json`을 가리키고 있어 `clean-signal.json`으로 교체, 그리고 스키마에 존재한 적 없고 실제로 추가하면 검증에 실패하는(`additionalProperties: false`) `tool_min_version` 필드를 "선택 권장"한다고 적혀 있던 팁 문구 제거.

## 남은 항목

현재 없음.
