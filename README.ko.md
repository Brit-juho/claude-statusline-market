[English](./README.md) · **한국어**

# Claude Statusline Market

[![Deploy](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/deploy.yml/badge.svg)](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/deploy.yml)
[![Validate Presets](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/validate.yml/badge.svg)](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/validate.yml)
[![Smoke Test](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/smoke.yml/badge.svg)](https://github.com/Brit-juho/claude-statusline-market/actions/workflows/smoke.yml)
[![License: MIT](https://img.shields.io/github/license/Brit-juho/claude-statusline-market?color=00d97e)](./LICENSE)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-BC52EE?logo=astro&logoColor=white)](https://astro.build)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-00d97e.svg)](./CONTRIBUTING.md)

> 클로드 코드 상태 표시줄 프리셋 갤러리. 한 줄로 설치.

[Claude Code](https://code.claude.com) 상태 표시줄 프리셋을 위한 다국어 마켓플레이스입니다. 스크린샷과 함께 커뮤니티 프리셋을 둘러보고, 명령 한 줄로 설치하고, PR로 직접 기여할 수 있습니다.

## 이 프로젝트가 하는 일

Claude Code의 상태 표시줄은 강력한 커스터마이징 지점이지만, 관련 도구 생태계는 `ccstatusline`, `claude-powerline`, `cship`, `CCometixLine` 등 10개 이상의 도구로 파편화돼 있습니다. 이 사이트는 그 공백을 채웁니다:

- **탐색** — 실제 터미널 스크린샷과 함께 프리셋 둘러보기
- **설치** — SHA256 검증과 자동 백업이 딸린 `curl | sh` 한 줄 명령
- **기여** — PR로 프리셋 제출, CI가 스크린샷을 자동 생성
- **다국어** — 처음부터 한국어/영어 지원 (일본어, 중국어 예정)

## 터미널에서 바로 쓰기 (브라우저 필요 없음)

`skills/statusline-market`은 Claude Code Skill입니다 — 사이트 방문도, 설치 명령 복사도 없이 Claude Code와 대화만으로 상태 표시줄을 탐색·미리보기·커스터마이징·적용할 수 있습니다. 미리보기는 실제 ANSI 터미널 출력으로 렌더링됩니다 — 상태 표시줄이 실제로 동작하는 바로 그 환경입니다.

**방법 A — 플러그인 마켓플레이스 (권장):**

```
/plugin marketplace add Brit-juho/claude-statusline-market
/plugin install statusline-market@claude-statusline-market
```

이후 Claude Code 세션에서 `/statusline-market`이라고 말하거나 "상태줄 프리셋 골라줘"라고 물어보면 됩니다.

**방법 B — 수동 복사 (플러그인 시스템 불필요):**

```bash
mkdir -p ~/.claude/skills && cp -r skills/statusline-market ~/.claude/skills/
```

두 경로 모두 완전히 동일한 `SKILL.md`를 실행하고, 아래 `curl | sh` 한 줄 설치가 쓰는 것과 같은 `scripts/apply-ccstatusline.sh`를 호출합니다 — 터미널, 플러그인, 웹사이트 설치가 모두 하나의 적용 경로로 수렴합니다.

## 상태

**v0.1.** GitHub Pages에서 정적 갤러리로 서빙되며 `ccstatusline` 프리셋을 지원합니다.

로드맵:

- **v0.1** — 갤러리 + 한 줄 설치 + 한국어/영어 i18n + 시드 프리셋 (`ccstatusline` 전용)
- **v0.2** — 인터랙티브 빌더, 언어 추가(ja/zh), 추가 도구(`cship`, `claude-powerline`)
- **v0.3+** — 도구 간 설정 변환기, NPM 패키징

## 기여하기

PR 환영합니다. 기여 흐름:

1. 이 저장소를 Fork
2. 프리셋 JSON을 `public/presets/`에 추가
3. PR 오픈
4. CI가 JSON을 검증하고 터미널 스크린샷을 생성
5. 관리자가 리뷰 후 머지
6. 사이트가 자동 배포됨

자세한 내용은 [CONTRIBUTING.md](./CONTRIBUTING.ko.md) 참고.

## 디자인

UI 결정 사항은 [DESIGN.md](./DESIGN.md)에 정리돼 있습니다 (영문 전용 — 내부 개발 참고 문서).

## 라이선스

MIT. [LICENSE](./LICENSE) 참고.

## 크레딧

다음 도구들 위에서 (그리고 함께) 만들어졌습니다:

- [ccstatusline](https://github.com/sirmalloc/ccstatusline) by @sirmalloc
- [claude-powerline](https://github.com/Owloops/claude-powerline) by @Owloops
- [cship](https://github.com/stephenleo/cship) by @stephenleo

이 프로젝트는 메타 레이어입니다 — 경쟁 도구가 아닙니다. 우리는 상태 표시줄을 직접 렌더링하지 않고, 위 도구들과 함께 동작하는 프리셋을 큐레이션합니다.
