**English** · [한국어](./CONTRIBUTING.ko.md)

# Contributing a Preset

Anyone can add a preset to the gallery via a pull request.

## Quick start

1. Fork this repository
2. Copy an existing preset as a template:
   ```bash
   cp public/presets/clean-signal.json public/presets/your-preset-id.json
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

`ccstatusline_settings` is the native ccstatusline v3 settings object, verbatim (see `public/presets/schema.json`'s enum for the full list of widget `type`s). `lines` is an array of lines, each line an array of widget items.

**Categories:** `minimal` · `productivity` · `cost` · `git` · `powerline` · `custom`

**ID rules:** lowercase letters, numbers, hyphens only (e.g. `ko-my-preset`)

## What CI checks

- `validate.yml` — JSON Schema validation on every PR touching `public/presets/`
- `screenshot.yml` — auto-generates a preview image when presets change
- `deploy.yml` — deploys to GitHub Pages on merge to main

## Tips

- Test your preset locally with ccstatusline before submitting
- Add both Korean and English title/description even if your preset is language-specific
- Keep `id` stable after publish — the install URL is `curl ... | bash -s -- your-preset-id`
