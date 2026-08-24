# Contributing a Preset

Anyone can add a preset to the gallery via a pull request.

## Quick start

1. Fork this repository
2. Copy an existing preset as a template:
   ```bash
   cp public/presets/ko-minimal.json public/presets/your-preset-id.json
   ```
3. Edit the JSON file (see schema below)
4. Run validation locally (also regenerates `public/presets/index.json` and `scripts/segment-catalog.json` if either is stale — commit the diff if it changes):
   ```bash
   npm run validate
   ```
5. Open a pull request

## Preset file format

All preset files live in `public/presets/`. The full schema is at `public/presets/schema.json`.

Minimum required fields:

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

`ccstatusline_settings`는 native ccstatusline v3 설정 그대로다(위젯 `type` 전체 목록은 `public/presets/schema.json`의 enum 참고). `lines`는 줄 배열, 각 줄은 위젯 아이템 배열이다.

**Categories:** `minimal` · `productivity` · `cost` · `git` · `powerline` · `custom`

**ID rules:** lowercase letters, numbers, hyphens only (e.g. `ko-my-preset`)

## What CI checks

- `validate.yml` — JSON Schema validation on every PR touching `public/presets/`
- `screenshot.yml` — auto-generates a preview image when presets change
- `deploy.yml` — deploys to GitHub Pages on merge to main

## Tips

- Test your preset locally with ccstatusline before submitting
- Add both Korean and English title/description even if your preset is language-specific
- The `tool_min_version` field is optional but recommended if your preset uses newer segment types
- Keep `id` stable after publish — the install URL is `curl ... | bash -s -- your-preset-id`
