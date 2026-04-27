# Claude Statusline Market

> Discover Claude Code statusline presets. Install in one line.
> 클로드 코드 상태 표시줄 프리셋 갤러리. 한 줄로 설치.

A multilingual marketplace for [Claude Code](https://code.claude.com) statusline presets. Browse community presets with screenshots, install with one command, contribute your own via PR.

## Status

**v0.1 in planning.** See [design doc](#design) for scope.

## What this is

Claude Code's statusline is a powerful customization point, but the tooling ecosystem is fragmented across 10+ tools (`ccstatusline`, `claude-powerline`, `cship`, `CCometixLine`, etc.). This site fills the gap:

- **Discover** — browse presets with real terminal screenshots
- **Install** — one `curl | sh` command, with SHA256 verification and automatic backup
- **Contribute** — submit your preset via PR, CI auto-generates the screenshot
- **Multilingual** — Korean and English from day one (Japanese, Chinese coming)

## Status

**Planning phase.** v0.1 ships as a static gallery on GitHub Pages with `ccstatusline` preset support.

Roadmap:

- **v0.1** — gallery + one-line install + Korean/English i18n + 5-10 seed presets (`ccstatusline` only)
- **v0.2** — interactive builder, more languages (ja/zh), additional tools (`cship`, `claude-powerline`)
- **v0.3+** — cross-tool config converters, NPM packaging

## Contributing

PRs welcome. The contribution flow:

1. Fork this repo
2. Add your preset JSON to `presets/`
3. Open a PR
4. CI validates the JSON and generates a terminal screenshot
5. Maintainer reviews and merges
6. Site auto-deploys with your preset

See [CONTRIBUTING.md](./CONTRIBUTING.md) once it exists.

## Design

Architecture and design decisions documented in the design doc (kept in `~/.gstack/projects/setting/` during planning, will move into this repo as `docs/design.md` during implementation).

## License

MIT. See [LICENSE](./LICENSE).

## Credits

Built on top of (and in collaboration with):

- [ccstatusline](https://github.com/sirmalloc/ccstatusline) by @sirmalloc
- [claude-powerline](https://github.com/Owloops/claude-powerline) by @Owloops
- [cship](https://github.com/stephenleo/cship) by @stephenleo

This is a meta-layer, not a competing tool. We don't render statuslines ourselves — we curate presets that work with the great tools above.
