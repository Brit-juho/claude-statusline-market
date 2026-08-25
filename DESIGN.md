**English only** — internal engineering doc, no Korean translation (nothing to translate from; ask if one is wanted)

# Design System — Claude Statusline Market

> Source of truth for all UI decisions. Read this before adding any component.
> Derived from `/plan-design-review` session 2026-04-27.

## Art Direction

**Vercel/Linear-type dark aesthetic.** Terminal-first. Monospace as a design element. Single accent color.

Rules:
- Dark mode only (v0.1). No light mode toggle.
- No shadows anywhere. Borders only for depth.
- No hover transforms (`translateY`, `scale`). Border-color change only.
- No emoji ever. Lucide for UI icons, Iconify `simple-icons` for brand only.
- No gradient blobs, wavy dividers, or decorative SVG shapes.
- Cards earn their existence — no decorative card grids.

## Color Tokens

```css
--bg:           #0a0a0a   /* base background */
--bg-card:      #111111   /* card surface */
--bg-elevated:  #161616   /* elevated surface (modals, dropdowns) */
--bg-hover:     #161616   /* hover state background */
--border:       #2a2a2a   /* default border */
--border-hover: #404040   /* hover border */
--accent:       #00d97e   /* terminal green — single accent */
--accent-hover: #00f594   /* accent hover */
--accent-dim:   rgba(0, 217, 126, 0.15)  /* accent background tint */
--text:         #ededed   /* primary text */
--text-dim:     #888888   /* secondary text */
--text-muted:   #555555   /* muted/meta text — do not use for body copy */
```

Light mode: v0.2 (not in scope for v0.1).

## Typography

```
Sans:  "Pretendard Variable", "Geist", system-ui, sans-serif
Mono:  "Geist Mono", "JetBrains Mono", ui-monospace, monospace
       (Korean: Pretendard first, English: Geist first)

Scale (px): 12 / 14 / 16 / 20 / 24 / 32 / 48
H1:    48px / 700 / tracking -0.04em / line-height 1.1
H2:    32px / 600
Body:  16px / 400 / line-height 1.6
Caption: 14px / 400 / text-dim
Code:  Mono 14px / 400
```

Responsive H1: `clamp(2rem, 5vw, 3rem)` — preserves weight at all viewports.

## Spacing

4-grid: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px`

## Border Radius

- Card: `8px` (--radius)
- Button/Input: `6px`
- Badge/pill: `999px`
- Avatar: `50%`

## Iconography

- **Lucide** — all UI icons (search, filter, copy, check, terminal, external-link, globe, x)
- **Iconify simple-icons** — brand icons only (GitHub, npm)
- **No emoji** — not even ♥ or ◆ substitutes that render differently per platform

## Layout

### Navigation (Base.astro)

- Sticky 56px top bar, `backdrop-filter: blur(12px)`, `border-bottom: 1px solid var(--border)`
- Left: logo mark + site name
- Right: nav links + KR|EN pill switcher
- Max-width: 1200px container

### Gallery Page

- Hero: `padding: 80px 1.5rem 4rem`, centered `max-width: 640px`
- Gallery: `max-width: 960px`, search + category pills + count + grid
- Grid: `repeat(auto-fill, minmax(280px, 1fr))` — adapts 1/2/3 col by viewport
- Count text: `var(--text-muted)` — never below #555555

### Card Component

- Background: `#0e0e0e`, border: `1px solid #1c1c1c`, radius: `12px`
- Hover: `border-color: #2c2c2c` only — NO transform, NO box-shadow
- Structure: terminal chrome → statusline preview → divider → info (badge + title + desc) → tags

### Preset Detail Page

- Max-width: `760px`, centered
- Terminal preview → Install section → SHA256 → Script body `<details>` → JSON `<details>`
- SHA256 always visible (not hidden in `<details>`)

## Interaction States

| Scenario | UX |
|---|---|
| Search 0 results | Empty div: message + hint text |
| Copy success | Button text → "✓ Copied" + `.copied` class (accent color) for 2s |
| SHA256 verify | Displayed inline below install commands |
| Script body | `<details>` collapsed by default, "recommended before running" label |

## Accessibility

- WCAG AA minimum 4.5:1 contrast for all body text
- `var(--text-muted)` (#555555) — use only for meta/label text, never body copy
- Touch targets: 44px minimum
- Keyboard nav: Tab → search → pills → first card
- ARIA: `<main>`, `<nav aria-label>`, `role="status"` on copy toast
- Visited links: must differ from unvisited (use `--accent` + `text-decoration: underline` on hover)

## AI Slop Blacklist

Never use:
1. Purple/violet/indigo gradients
2. 3-column icon-in-circle feature grids
3. `text-align: center` on everything
4. Uniform large border-radius on all elements
5. Decorative blobs / wavy SVG dividers
6. Emoji as design elements
7. Colored left-border on cards (`border-left: 3px solid`)
8. Generic hero copy ("Welcome to...", "Unlock the power of...")
9. Cookie-cutter section rhythm (hero→3 features→testimonials→pricing→CTA)
10. `system-ui` or `-apple-system` as primary display font

## What Is NOT in Scope (v0.1)

- Light mode / dark-light toggle
- Card hover transform or box-shadow
- Browser live builder (deferred v0.2)
- Emoji anywhere
- CLI Ink TUI builder (deferred permanently — a standalone TUI app is a separate build from `skills/statusline-market`, which is a Claude Code Skill that drives the *existing* install/render scripts conversationally, not a new interactive program)
- User authentication
- i18n beyond KO/EN (Japanese, Chinese: v0.2)
- Custom domain (v0.2)
- NPM package (v0.3)
- Illustration / decorative art
