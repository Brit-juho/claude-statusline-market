---
name: statusline-market
description: ccstatusline 프리셋을 터미널에서 대화로 탐색·미리보기·커스터마이징하고 로컬에 즉시 적용한다. "상태줄", "statusline", "ccstatusline 프리셋" 관련 요청 시 사용.
tools: [Bash, WebFetch]
---

# Claude Statusline Market

당신(Claude)은 이 스킬이 호출되면, **사용자가 브라우저를 열지 않고 지금 이 대화만으로** ccstatusline 상태줄을 탐색·구성·적용할 수 있게 안내한다. 미리보기는 항상 실제 터미널 ANSI 출력으로 보여준다(이미지 미리보기는 이 스킬의 목적에 맞지 않음 — 사용자가 지금 보고 있는 터미널이 실제 렌더링 환경이므로).

`SITE_BASE`는 `https://NeTrioGit.github.io/claude-statusline-market`(프리셋 JSON, GitHub Pages 빌드 결과물)이다. `RAW_BASE`는 `https://raw.githubusercontent.com/NeTrioGit/claude-statusline-market/main`(스크립트류 — `scripts/`는 GitHub Pages 빌드 산출물에 포함되지 않으므로 저장소 raw 콘텐츠에서 받는다)이다. 플러그인으로 설치되어 로컬에 `scripts/`가 이미 있으면(먼저 `ls scripts/apply-ccstatusline.sh`로 확인) 그것을 우선 사용하고, 없으면(수동 SKILL.md 복사 설치본 등) `RAW_BASE`에서 매번 최신본을 받아 실행한다.

## 1. 탐색 (Browse)

1. `${SITE_BASE}/presets/index.json`을 WebFetch로 가져온다. 각 항목은 `{id, title, description, category, tags, author}`.
2. 카테고리(`minimal`/`productivity`/`cost`/`git`/`powerline`/`custom`)별로 묶어 번호를 매겨 터미널에 텍스트 목록으로 보여준다. 사용자가 카테고리나 검색어를 언급하면 그걸로 필터링한다.
3. 사용자가 하나를 고르면 2단계로 넘어간다. "커스텀으로 처음부터 만들래" 같은 요청이면 3단계로 바로 간다.

## 2. 미리보기 (Preview)

1. 고른 프리셋의 전체 JSON을 `${SITE_BASE}/presets/<id>.json`에서 WebFetch로 가져온다.
2. 그 JSON을 임시 파일로 저장한 뒤, 다음 중 있는 것을 실행해 실제 터미널 색상으로 렌더링한다:
   - 로컬 `scripts/render-preview.mjs`가 있으면: `node scripts/render-preview.mjs <tmpfile>`
   - 없으면: `curl -fsSL ${RAW_BASE}/scripts/render-preview.mjs -o /tmp/render-preview.mjs && node /tmp/render-preview.mjs <tmpfile>`
3. 출력 결과를 그대로 사용자에게 보여주고 "이대로 적용할까요, 수정할까요?"라고 묻는다.

## 3. 커스터마이징 (Customize)

1. `${RAW_BASE}/scripts/segment-catalog.json`(또는 로컬 `scripts/segment-catalog.json`)을 읽는다. `groups`(9개 그룹)와 `segments`(각 `{id, label, type, group, defaultConfig:{format,style}, configSchema}`)로 구성된다.
2. 진행 중인 구성은 메모리상 `{version:3, lines:[[...]]}` 형태(ccstatusline widget item: `{id, type, color?, bold?, rawValue?, commandPath?}`)로 유지한다. 처음부터 시작하면 빈 `lines:[[]]`에서 출발.
3. 사용자의 자연어 요청("git 브랜치 추가해줘", "비용 항목 빨간색으로", "굵게 해줘", "두 번째 줄로 옮겨줘")을 다음으로 매핑:
   - **추가**: 카탈로그에서 `id`/`label`로 세그먼트를 찾아 `defaultConfig`의 `style`을 `color`/`bold`로 분해(예: `"cyan bold"` → `color:"cyan", bold:true`)해서 위젯 아이템으로 추가.
   - **삭제/순서 변경**: 배열 조작.
   - **색상/굵기/포맷 수정**: 해당 세그먼트의 `color`/`bold`/`rawValue`(커스텀 텍스트일 때) 갱신. 색상은 카탈로그의 `configSchema`에 정의된 select 옵션(`accent/green/cyan/blue/yellow/orange/red/magenta/pink/white/gray/dim`) 중에서만 받는다 — 임의 hex는 지원하지 않음(카탈로그 스키마 기준).
4. **매 변경마다** 2단계의 렌더링 스크립트로 다시 그려서 보여준다. 되돌리기 요청("방금 거 취소")도 지원한다.

## 4. 적용 (Apply)

1. 사용자가 확정하면 현재 구성(`{version:3, lines:[...]}`)을 임시 JSON 파일로 쓴다.
2. 다음 중 있는 것을 실행:
   - 로컬 `scripts/apply-ccstatusline.sh`가 있으면: `bash scripts/apply-ccstatusline.sh <tmpfile>`
   - 없으면: `curl -fsSL ${RAW_BASE}/scripts/apply-ccstatusline.sh -o /tmp/apply-ccstatusline.sh && bash /tmp/apply-ccstatusline.sh <tmpfile>`
3. 이 스크립트가 `~/.config/ccstatusline/settings.json`을 갱신하고(기존 파일은 자동 백업), 필요하면 `~/.claude/settings.json`에 `statusLine` 커맨드를 등록한다. 실행 결과(백업 경로, 성공/실패)를 **있는 그대로** 사용자에게 보고한다 — 임의로 "성공했다"고 요약하지 말고 스크립트 출력을 인용한다.
4. 마지막에 "Claude Code를 재시작해야 적용됩니다"라고 안내한다.

## 주의사항

- `jq`, `node`가 로컬에 없으면 스크립트가 에러를 낸다 — 에러 메시지를 그대로 사용자에게 보여주고 설치 안내(스크립트 자체 출력에 포함됨)를 따르게 한다.
- `~/.claude/settings.json` / `~/.config/ccstatusline/settings.json`을 건드리는 것은 되돌리기 어려운 로컬 상태 변경이다 — 4단계(적용) 실행 전에는 항상 사용자의 명시적 확정을 받는다. 2~3단계(탐색/미리보기/커스터마이징)는 로컬 파일을 건드리지 않으므로 자유롭게 반복해도 된다.
- 이 스킬이 하는 일은 `scripts/install-preset.sh`(사이트에서 받은 완성 프리셋 설치)와 `scripts/apply-ccstatusline.sh`(임의의 ccstatusline 설정 적용)를 그대로 재사용하는 것뿐이다 — 별도의 새 적용 로직을 만들지 않는다.
