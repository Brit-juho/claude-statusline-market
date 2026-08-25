#!/usr/bin/env node
// render-preview.mjs — render a ccstatusline_settings JSON as real terminal output.
//
// Usage: node scripts/render-preview.mjs <path-to-ccstatusline-settings.json>
//    or: node scripts/render-preview.mjs -   (read JSON from stdin)
//
// This is a Node port of src/lib/preview.ts's WIDGET_SAMPLE + styleToCSS logic,
// swapped from CSS output to ANSI escape codes so the statusline-market Skill
// can show the exact same sample rendering in a terminal that the browser
// builder shows in TerminalPreview.tsx. Keep WIDGET_SAMPLE / COLOR_ANSI in
// sync with src/lib/preview.ts's WIDGET_SAMPLE / COLOR_MAP when either changes.

import { readFileSync } from 'node:fs';

const COLOR_ANSI = {
  accent: '38;2;0;217;126',
  green: '38;2;0;217;126',
  cyan: '38;2;34;211;238',
  blue: '38;2;96;165;250',
  yellow: '38;2;251;191;36',
  orange: '38;2;251;146;60',
  red: '38;2;248;113;113',
  magenta: '38;2;192;132;252',
  pink: '38;2;244;114;182',
  white: '38;2;208;208;208',
  gray: '38;2;107;114;128',
  dim: '38;2;75;85;99',
};

const WIDGET_SAMPLE = {
  'model': 'Sonnet 4.6',
  'thinking-effort': 'high',
  'output-style': 'default',
  'version': 'v2.2.19',
  'claude-session-id': '#abc123de',
  'claude-account-email': 'user@example.com',
  'session-name': 'my-session',
  'skills': '3 skills',
  'vim-mode': 'NORMAL',
  'voice-status': 'off',
  'compaction-counter': '2',
  'context-percentage': '12%',
  'context-percentage-usable': '10%',
  'context-bar': '█░░░░░░░░░ 12%',
  'context-length': '19755',
  'context-window': '200000',
  'tokens-input': '↑15234',
  'tokens-output': '↓4521',
  'tokens-cached': '⚡8912',
  'tokens-total': '19755tok',
  'input-speed': '1240t/s',
  'output-speed': '380t/s',
  'total-speed': '1620t/s',
  'session-cost': '$0.0234',
  'session-clock': '1h 23m',
  'session-usage': '5h:23%',
  'weekly-usage': '7d:41%',
  'weekly-sonnet-usage': 'S:124k',
  'weekly-opus-usage': 'O:12k',
  'extra-usage-utilization': '+18%',
  'extra-usage-remaining': '82k',
  'reset-timer': 'reset:2h 14m',
  'weekly-reset-timer': 'w-reset:3d 12h',
  'block-timer': '42s',
  'free-memory': '8.2GB',
  'terminal-width': '220',
  'git-branch': '⎇ main',
  'git-status': 'main',
  'git-changes': '~3',
  'git-insertions': '+47',
  'git-deletions': '-12',
  'git-staged-files': 'S:2',
  'git-unstaged-files': 'U:1',
  'git-untracked-files': '?:3',
  'git-staged': '2',
  'git-unstaged': '1',
  'git-untracked': '3',
  'git-clean-status': '✓',
  'git-ahead-behind': '↑0 ↓0',
  'git-conflicts': '!0',
  'git-sha': 'a1b2c3d',
  'git-review': 'approved',
  'git-worktree': 'feature-auth',
  'git-root-dir': 'my-project',
  'git-origin-owner': 'neo',
  'git-origin-repo': 'my-project',
  'git-origin-owner-repo': 'neo/my-project',
  'git-upstream-owner': 'upstream',
  'git-upstream-repo': 'my-project',
  'git-upstream-owner-repo': 'upstream/my-project',
  'git-is-fork': 'fork',
  'current-working-dir': 'my-project',
  'worktree-mode': 'worktree',
  'worktree-name': 'feature-auth',
  'worktree-branch': 'worktree-feature-auth',
  'worktree-original-branch': 'main',
  'custom-text': '·',
  'custom-symbol': '◆',
  'custom-command': '[cmd]',
  'link': 'link',
  'separator': '|',
  'sandbox-status': '🔒 sandboxed',
  'remote-control-status': '📡 remote',
  'cache-hit-rate': '⚡87%',
  'cache-read': '↓cache 2000',
  'cache-write': '↑cache 5000',
  'cache-timer': 'cache:42s',
  'fable-weekly-usage': 'F:9%',
  'git-ci-status': '✓ CI',
  'jj-revision': 'k9lrxyz',
  'jj-bookmarks': 'main*',
  'jj-workspace': 'default',
  'jj-description': 'wip: refactor status renderer',
  'jj-changes': '~5',
  'jj-insertions': '+38',
  'jj-deletions': '-6',
  'jj-root-dir': 'my-project',
};

function ansiFor(color, bold) {
  const codes = [];
  if (bold) codes.push('1');
  const c = COLOR_ANSI[color] ?? COLOR_ANSI.dim;
  codes.push(c);
  return `\x1b[${codes.join(';')}m`;
}

function renderWidget(item) {
  const text = item.rawValue ?? WIDGET_SAMPLE[item.type] ?? item.type;
  const reset = '\x1b[0m';
  return `${ansiFor(item.color ?? 'dim', item.bold)}${text}${reset}`;
}

function renderLines(ccsSettings) {
  const lines = ccsSettings.lines ?? [];
  return lines.map(line => line.map(renderWidget).join(' '));
}

function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: node scripts/render-preview.mjs <path-to-ccstatusline-settings.json>');
    console.error('   or: node scripts/render-preview.mjs -   (read JSON from stdin)');
    process.exit(1);
  }
  const raw = arg === '-' ? readFileSync(0, 'utf8') : readFileSync(arg, 'utf8');
  const data = JSON.parse(raw);
  const ccsSettings = data.ccstatusline_settings ?? data; // accept full preset or raw settings
  for (const line of renderLines(ccsSettings)) {
    console.log(line);
  }
}

main();
