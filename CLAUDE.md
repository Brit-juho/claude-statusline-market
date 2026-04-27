# Claude Statusline Market — Project Notes for Claude Code

## What this project is

A multilingual marketplace site for Claude Code statusline presets. Static site (Astro), GitHub Pages hosting, one-line install via `curl | sh`. We don't build statusline tools — we curate presets for existing tools (`ccstatusline` first, more later).

## Where the design lives

Planning artifacts are in `~/.gstack/projects/setting/`:

- `neo-main-design-20260427-094607.md` — main design doc (eng-review + design-review approved)
- `neo-main-eng-review-test-plan-20260427-094607.md` — test plan

Read these before suggesting architecture or design changes. Eng review and design review are both CLEAR.

## Key locked-in decisions

- **Stack**: Astro (static, GitHub Pages, i18n built-in)
- **Style**: Vercel/Linear-type aesthetic, dark mode only in v0.1
- **Typography**: Geist Sans + Pretendard (Korean) + Geist Mono
- **Icons**: Lucide (UI) + Iconify simple-icons (brand only). No emoji ever.
- **Tool support**: `ccstatusline` only in v0.1, more in v0.3+
- **Live builder**: deferred to v0.2 (sees `ccstatusline` TUI as sufficient for now)

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
