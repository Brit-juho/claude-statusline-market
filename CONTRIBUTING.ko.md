[English](./CONTRIBUTING.md) · **한국어**

# 프리셋 기여하기

누구나 PR로 갤러리에 프리셋을 추가할 수 있습니다.

## 빠른 시작

1. 이 저장소를 Fork
2. 기존 프리셋을 템플릿으로 복사:
   ```bash
   cp public/presets/clean-signal.json public/presets/your-preset-id.json
   ```
3. JSON 파일 수정 (아래 스키마 참고)
4. 로컬에서 검증 실행 (`public/presets/index.json`과 `scripts/segment-catalog.json`이 오래됐으면 자동 재생성됩니다 — 변경되면 diff도 함께 커밋하세요):
   ```bash
   npm run validate
   ```
5. PR 오픈

## 프리셋 파일 형식

모든 프리셋 파일은 `public/presets/`에 있습니다. 전체 스키마는 `public/presets/schema.json`에 있습니다.

최소 필수 필드:

```json
{
  "id": "your-preset-id",
  "version": "0.1.0",
  "title": { "ko": "한국어 제목", "en": "English title" },
  "description": { "ko": "설명", "en": "Description" },
  "tool": "ccstatusline",
  "category": "minimal",
  "tags": ["minimal"],
  "author": { "name": "your-github-handle", "github": "your-github-handle" },
  "ccstatusline_settings": {
    "version": 3,
    "lines": [
      [
        { "id": "model", "type": "model", "color": "cyan" }
      ]
    ]
  }
}
```

`ccstatusline_settings`는 native ccstatusline v3 설정 그대로입니다(위젯 `type` 전체 목록은 `public/presets/schema.json`의 enum 참고). `lines`는 줄 배열이고, 각 줄은 위젯 아이템 배열입니다.

**카테고리:** `minimal` · `productivity` · `cost` · `git` · `powerline` · `custom`

**ID 규칙:** 소문자, 숫자, 하이픈만 사용 (예: `ko-my-preset`)

## CI가 검사하는 것

- `validate.yml` — `public/presets/`를 건드리는 모든 PR에서 JSON Schema 검증
- `screenshot.yml` — 프리셋 변경 시 미리보기 이미지 자동 생성
- `deploy.yml` — main 머지 시 GitHub Pages 배포

## 팁

- 제출 전에 ccstatusline으로 로컬에서 프리셋을 테스트해보세요
- 언어 특화 프리셋이라도 한국어/영어 title·description을 모두 채워주세요
- 배포 후에는 `id`를 바꾸지 마세요 — 설치 URL이 `curl ... | bash -s -- your-preset-id`이기 때문입니다
