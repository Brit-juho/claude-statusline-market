**English** · [한국어](./TODOS.ko.md)

# TODOS

## ✅ Done

- **[T3]** Category-specific empty-state messages — `filterCards()` per-category copy
- **[T4]** Copy button `role="status"` toast — WCAG 4.1.3 accessibility
- **[T5]** Contribution CTA — PR guidance + CONTRIBUTING.md link at the bottom of the gallery
- **[T6]** Builder page + removal of xterm.js — trimmed 280KB from the bundle
- **[T7]** ccstatusline install check — guidance message in install-preset.sh
- **[T1]** Locked down the ccstatusline segment type enum — added 26 types to `public/presets/schema.json`
- **[T8]** Fixed the astro dev server — patched `@astrojs/preact`'s Rolldown→Rollup plugin format mismatch (`patches/` + postinstall)
- **[T9]** Vitest tests for the builder components — dnd-kit mocks + 12 tests (BuilderApp click-to-add, remove, config, JSON)
- **[T10]** Fixed the Windows PS1 install script — actually implemented the `Install-Preset` function and fixed the `ccstatusline_settings` extraction bug (it used to move the whole preset file as-is, mixing metadata into the ccstatusline config)
- **[T11]** Extracted `scripts/apply-ccstatusline.sh`, shared by `install-preset.sh` and `skills/statusline-market` — avoids maintaining the apply logic twice
- **[T12]** Added `scripts/render-preview.mjs`, `scripts/segment-catalog.json`, `public/presets/index.json` — the terminal Skill references the same catalog/rendering as the browser builder. `npm run validate` catches drift between the two
- **[T13]** Fixed the outdated schema reference (`settings.statusline.segments`) in `CONTRIBUTING.md`/`.github/workflows/screenshot.yml`, and the `chmod +x /usr/local/bin freeze` whitespace bug in `screenshot.yml`
- **[T14]** Added the `skills/statusline-market` Skill + `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` — conversational terminal browse/preview/customize/apply
- **[T17]** Enabled GitHub Pages — Pages was never turned on for the repo, so `Deploy to GitHub Pages` was always failing with a 404. Enabled Source=GitHub Actions via `gh api`, redeployed, confirmed the live URL returns 200
- **[T19]** Added the `flex-separator` widget (right-align content — confirmed as a real ccstatusline type, distinct from `separator`, by reading the minified source directly: `"Expands to fill available terminal width"`), and fixed `skills/statusline-market/SKILL.md`'s stale "9 groups" reference (now grows with the catalog — told the Skill to read the actual count instead of trusting a hardcoded number)
- **[T18]** Fixed the `freeze` version pin in `screenshot.yml` — `FREEZE_VERSION=1.4.3` was a version that never existed (always 404). Bumped to the current `v0.2.2` and updated the install logic for the upstream asset-naming change (`linux_amd64` → `Linux_x86_64`, plus a subdirectory inside the tarball). Confirmed with a real workflow re-run
- **[T2]** E2E smoke test for the install script — `.github/workflows/smoke.yml` already validates the v3 format, and after T17 (Pages enabled) it now runs successfully against the real live URL
- **[T16]** Reviewed `pr-status`/`agent-name` segments — tried to add segments for the `pr.*` (GitHub PR + GitLab MR) and `agent.name` fields the latest Claude Code CLI passes over stdin, but confirmed directly against the ccstatusline 2.2.27 (npm) source that no such widget type exists — adding it to the catalog would render nothing and just confuse users, so this is settled as excluded, not pending. Revisit once upstream ccstatusline adds support (`segment-defs.ts` + the `public/presets/schema.json` enum + `scripts/segment-catalog.json`)
- **[T20]** Fixed a bug where the browser builder's "custom" widgets lost their value on download — `custom-text`/`custom-command`'s actual text/command (`rawValue`/`commandPath`) rendered correctly in the preview but was missing from the downloaded JSON. Also fixed the "global separator" field, which was preview-only, to export ccstatusline's real `defaultSeparator` field. Fixed a dead branch (`isText`/`segmentLabel`) that checked `def?.type === 'text'` and never matched anything — should have been `'custom-text'`. Added a regression test
- **[T21]** Fixed a copy-paste mistake in `python-dev.json` that ran `node --version` — found while auditing custom-command/custom-text/link/custom-symbol usage and actual rendering across all 30 presets. Fixed to `python --version`, and added a new `python-version` catalog entry to `segment-defs.ts`

## Open

## [T15] No Windows (`install-preset.ps1`) smoke test
**What:** `smoke.yml` only validates the sh script — there's no ps1 coverage, so Windows install breakage isn't caught by CI
**Why:** T10 fixed ps1, but there's no CI to catch a regression
**Status:** Not started. Needs a `windows-latest` runner job that runs `Install-Preset` and validates `ccstatusline/settings.json` — GitHub Actions' `windows-latest` is a cloud runner, so this can be built and actually verified without a local Windows machine
