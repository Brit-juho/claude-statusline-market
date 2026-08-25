**English** · [한국어](./README.ko.md)

# Claude Statusline Market

> Discover Claude Code statusline presets. Install in one line.

A multilingual marketplace for [Claude Code](https://code.claude.com) statusline presets. Browse community presets with screenshots, install with one command, contribute your own via PR.

## What this is

Claude Code's statusline is a powerful customization point, but the tooling ecosystem is fragmented across 10+ tools (`ccstatusline`, `claude-powerline`, `cship`, `CCometixLine`, etc.). This site fills the gap:

- **Discover** — browse presets with real terminal screenshots
- **Install** — one `curl | sh` command, with SHA256 verification and automatic backup
- **Contribute** — submit your preset via PR, CI auto-generates the screenshot
- **Multilingual** — Korean and English from day one (Japanese, Chinese coming)

## Use it from the terminal (no browser needed)

`skills/statusline-market` is a Claude Code Skill that lets you browse, preview, customize, and apply a statusline entirely by talking to Claude Code — no site visit, no copy-pasting install commands. Previews render as real ANSI terminal output, the same environment the statusline actually runs in.

**Option A — plugin marketplace (recommended):**

```
/plugin marketplace add Brit-juho/claude-statusline-market
/plugin install statusline-market@claude-statusline-market
```

Then just say `/statusline-market` (or ask "상태줄 프리셋 골라줘" / "help me pick a statusline") in any Claude Code session.

**Option B — manual copy (no plugin system needed):**

```bash
mkdir -p ~/.claude/skills && cp -r skills/statusline-market ~/.claude/skills/
```

Both paths run the exact same `SKILL.md`, and both end up calling the same `scripts/apply-ccstatusline.sh` that the one-line `curl | sh` install below uses — so terminal, plugin, and website installs all converge on one apply path.

## Status

**v0.1.** Ships as a static gallery on GitHub Pages with `ccstatusline` preset support.

Roadmap:

- **v0.1** — gallery + one-line install + Korean/English i18n + seed presets (`ccstatusline` only)
- **v0.2** — interactive builder, more languages (ja/zh), additional tools (`cship`, `claude-powerline`)
- **v0.3+** — cross-tool config converters, NPM packaging

## Contributing

PRs welcome. The contribution flow:

1. Fork this repo
2. Add your preset JSON to `public/presets/`
3. Open a PR
4. CI validates the JSON and generates a terminal screenshot
5. Maintainer reviews and merges
6. Site auto-deploys with your preset

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## Design

Architecture and design decisions are documented in [DESIGN.md](./DESIGN.md).

## License

MIT. See [LICENSE](./LICENSE).

## Credits

Built on top of (and in collaboration with):

- [ccstatusline](https://github.com/sirmalloc/ccstatusline) by @sirmalloc
- [claude-powerline](https://github.com/Owloops/claude-powerline) by @Owloops
- [cship](https://github.com/stephenleo/cship) by @stephenleo

This is a meta-layer, not a competing tool. We don't render statuslines ourselves — we curate presets that work with the great tools above.
