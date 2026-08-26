---
name: statusline-market
description: ccstatusline 프리셋을 터미널에서 대화로 탐색·미리보기·커스터마이징하고 로컬에 즉시 적용한다. "상태줄", "statusline", "ccstatusline 프리셋" 관련 요청 시 사용.
tools: [Bash, WebFetch, AskUserQuestion]
---

# Claude Statusline Market

당신(Claude)은 이 스킬이 호출되면, **사용자가 브라우저를 열지 않고 지금 이 대화만으로** ccstatusline 상태줄을 탐색·구성·적용할 수 있게 안내한다. 미리보기는 항상 실제 터미널 ANSI 출력으로 보여준다(이미지 미리보기는 이 스킬의 목적에 맞지 않음 — 사용자가 지금 보고 있는 터미널이 실제 렌더링 환경이므로).

`SITE_BASE`는 `https://Brit-juho.github.io/claude-statusline-market`(프리셋 JSON, GitHub Pages 빌드 결과물)이다. `RAW_BASE`는 `https://raw.githubusercontent.com/Brit-juho/claude-statusline-market/main`(스크립트류 — `scripts/`는 GitHub Pages 빌드 산출물에 포함되지 않으므로 저장소 raw 콘텐츠에서 받는다)이다. 플러그인으로 설치되어 로컬에 `scripts/`가 이미 있으면(먼저 `ls scripts/apply-ccstatusline.sh`로 확인) 그것을 우선 사용하고, 없으면(수동 SKILL.md 복사 설치본 등) `RAW_BASE`에서 매번 최신본을 받아 실행한다.

## 0. 도입 질문 (Intake) — 목록을 보여주기 전에 반드시 먼저 한다

번호 목록부터 던지지 않는다. 목록은 사용자가 스스로 걸러야 하는 부담을 주므로, 먼저 AskUserQuestion으로 다음을 확인해 좁혀진 추천을 만든다.

### 0-1. 방식 — 항상 가장 먼저, 독립된 질문으로 묻는다

웹 갤러리/빌더(`${SITE_BASE}`)를 쓸지, 지금 이 대화(CLI/터미널)로 진행할지를 AskUserQuestion으로 단독으로 먼저 묻는다. 사용자가 직전 대화에서 "터미널에서/여기서 하고 싶다"처럼 이미 명시적으로 CLI를 선택한 경우에만 생략한다 — 스킬이 자동 매칭되어 호출된 경우, 또는 "상태줄 바꾸고 싶다"처럼 방식을 특정하지 않은 요청이었던 경우에는 반드시 묻는다("보통 CLI를 의미하니까"라는 추정으로 건너뛰지 않는다).

- **웹**을 고르면: `${SITE_BASE}` 접속 안내(로컬 개발 중이면 dev 서버 URL)로 마무리하고 이 스킬의 나머지 단계는 진행하지 않는다.
- **CLI**를 고르면 0-2로 이어간다.

### 0-2. 출발점 + 용도 — CLI를 선택한 뒤, 한 번의 AskUserQuestion 호출로 함께 묻는다

1. **출발점**: 기존 프리셋 중에서 고를지, 처음부터 커스텀으로 만들지. ("추천받고 싶다"도 프리셋 경로로 취급 — 2번 질문으로 이어감.)
2. **용도/우선순위** (프리셋 경로를 골랐거나 아직 방향이 없다고 답한 경우): 어떤 작업에 주로 쓰는지, 상태줄에서 가장 신경 쓰는 정보가 무엇인지 — 예: 비용/한도 추적, Git 작업량, 생산성 지표(경과 시간·컨텍스트 사용률), 미니멀/조용한 화면, 파워라인 스타일의 풀 정보, 클라우드/컨테이너 등 특정 스택. 이 답을 카탈로그의 `category`/`tags`와 매칭해 후보를 2~4개로 좁힌다.

두 질문은 한 번의 AskUserQuestion 호출에 함께 담는다(불필요하게 여러 번 나눠 묻지 않는다). "커스텀"을 선택하면 2번은 건너뛰고 바로 3단계(커스터마이징)로 간다.

## 1. 탐색 (Browse)

1. `${SITE_BASE}/presets/index.json`을 WebFetch로 가져온다. 각 항목은 `{id, title, description, category, tags, author}`.
2. 0단계의 답으로 좁혀진 후보(보통 2~4개)를 추천 이유와 함께 제시한다. 후보가 없거나 사용자가 "전체 다 보고 싶다"고 하면 카테고리별로 번호를 매겨 전체 목록을 보여준다.
3. **후보에는 항상 예시를 붙인다** — 각 후보를 2단계(미리보기)의 렌더링 스크립트로 실제 터미널 출력을 미리 그려서 나란히 보여준다. 설명 텍스트만으로 고르게 하지 않는다.
4. **후보 제시에는 AskUserQuestion을 쓰지 않는다.** AskUserQuestion의 옵션 카드는 렌더링 폭이 좁고 색상 정보도 못 담아, 프리셋별 미리보기(3번에서 만든 렌더링 결과 + 색상 설명)를 온전히 보여주기 어렵다. 대신 후보 목록 전체(제목, id, 렌더링 예시, 색상 설명)를 메시지 본문에 텍스트로 출력하고, 사용자가 제목이나 id를 직접 타이핑해서 고르게 한다. (0단계의 방식/출발점/용도처럼 짧은 사지선다 질문에는 여전히 AskUserQuestion을 쓴다 — 이 규칙은 "프리셋/세그먼트처럼 정보량이 많은 항목을 고를 때"에만 해당.)
5. 사용자가 하나를 고르면 2단계(적용 전 최종 확인)로 넘어간다. 마음에 드는 게 없으면 조건을 다시 묻거나(0단계 0-2 두 번째 질문 재조정) "커스텀으로 처음부터 만들래" 같은 요청이면 3단계로 바로 간다.

### 색상 표시 관련 주의

렌더링 스크립트(`render-preview.mjs`)의 출력은 ANSI 컬러 이스케이프 코드를 포함한다. 이 코드는 **실제 터미널에서만** 색으로 보이고, 이 대화가 마크다운으로 렌더링되는 채널(코드블록 등)에 그대로 붙여넣으면 색이 보이지 않거나 이스케이프 문자가 깨져 보인다. 따라서:

- 사용자에게 텍스트로 미리보기를 보여줄 때는 색상 정보를 텍스트로도 함께 설명한다(예: "비용은 노란색 굵게, 5h 한도는 주황, 7d 한도는 빨강"). 색상 자체가 "없다"는 인상을 주지 않는다.
- 실제 색상까지 눈으로 확인하고 싶다고 하면, 본인 로컬 터미널에서 `node scripts/render-preview.mjs <파일>`을 직접 실행해보게 안내하거나, 터미널 스크린샷을 캡처해 이미지로 보여주는 방법을 제안한다.
- 프리셋에 아이콘/글리프가 없는 경우(대부분의 현재 프리셋과 세그먼트 카탈로그가 그렇다) "아이콘이 안 보인다"고 오해하지 않도록, 아이콘이 원래 없는 것인지 표시가 누락된 것인지를 확인해서 알려준다.

## 2. 미리보기 (Preview)

1. 고른 프리셋의 전체 JSON을 `${SITE_BASE}/presets/<id>.json`에서 WebFetch로 가져온다.
2. 그 JSON을 임시 파일로 저장한 뒤, 다음 중 있는 것을 실행해 실제 터미널 색상으로 렌더링한다:
   - 로컬 `scripts/render-preview.mjs`가 있으면: `node scripts/render-preview.mjs <tmpfile>`
   - 없으면: `curl -fsSL ${RAW_BASE}/scripts/render-preview.mjs -o /tmp/render-preview.mjs && node /tmp/render-preview.mjs <tmpfile>`
3. 출력 결과를 그대로 사용자에게 보여주고 "이대로 적용할까요, 수정할까요?"라고 묻는다.

## 3. 커스터마이징 (Customize)

1. `${RAW_BASE}/scripts/segment-catalog.json`(또는 로컬 `scripts/segment-catalog.json`)을 읽는다. `groups`와 `segments`(각 `{id, label, type, group, defaultConfig:{format,style}, configSchema}`)로 구성된다 — 그룹/세그먼트 개수는 카탈로그가 갱신될 때마다 바뀔 수 있으니 하드코딩된 숫자를 믿지 말고 읽어온 JSON의 실제 길이를 쓸 것.
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
4. 이 스킬 진행 중(탐색/미리보기/커스터마이징 단계 포함) 확인용으로 로컬 프로세스(예: dev 서버)를 띄웠거나 임시 파일(`<tmpfile>`, `/tmp/*.mjs`, `/tmp/*.sh` 등)을 만들었다면, 적용이 끝난 시점에 별도 요청 없이 자동으로 종료·삭제한다. 종료/삭제한 대상을 사용자에게 짧게 알린다.
5. 마지막에 "Claude Code를 재시작해야 적용됩니다"라고 안내한다.

## 주의사항

- `jq`, `node`가 로컬에 없으면 스크립트가 에러를 낸다 — 에러 메시지를 그대로 사용자에게 보여주고 설치 안내(스크립트 자체 출력에 포함됨)를 따르게 한다.
- `~/.claude/settings.json` / `~/.config/ccstatusline/settings.json`을 건드리는 것은 되돌리기 어려운 로컬 상태 변경이다 — 4단계(적용) 실행 전에는 항상 사용자의 명시적 확정을 받는다. 2~3단계(탐색/미리보기/커스터마이징)는 로컬 파일을 건드리지 않으므로 자유롭게 반복해도 된다.
- 이 스킬이 하는 일은 `scripts/install-preset.sh`(사이트에서 받은 완성 프리셋 설치)와 `scripts/apply-ccstatusline.sh`(임의의 ccstatusline 설정 적용)를 그대로 재사용하는 것뿐이다 — 별도의 새 적용 로직을 만들지 않는다.
