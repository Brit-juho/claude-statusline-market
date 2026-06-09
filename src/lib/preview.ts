export const SAMPLE_VALUES: Record<string, number | string | boolean> = {
  // ── Model / Session ──────────────────────────────────────
  model: 'Sonnet 4.6',
  model_id: 'claude-sonnet-4-6',
  version: '2.2.19',
  session_id: 'abc123de',
  session_name: 'my-session',
  effort_level: 'high',
  thinking_enabled: true,
  output_style: 'default',
  agent_name: 'code-reviewer',
  email: 'user@example.com',
  skills: '3 skills',
  vim_mode: 'NORMAL',
  voice_status: 'off',
  compaction_count: 2,

  // ── Workspace ────────────────────────────────────────────
  cwd: '~/GitHub/my-project',
  project_dir: '~/GitHub/my-project',
  dir_name: 'my-project',
  worktree_mode: 'worktree',
  worktree_name: 'feature-auth',
  worktree_branch: 'worktree-feature-auth',
  original_branch: 'main',

  // ── Context Window ───────────────────────────────────────
  total_input_tokens: 15234,
  total_output_tokens: 4521,
  context_window_size: 200000,
  context_window: 200000,
  context_length: 19755,
  used_percentage: 12,
  usable_percentage: 10,
  remaining_percentage: 88,
  current_input_tokens: 8500,
  cache_creation_tokens: 5000,
  cache_read_tokens: 2000,
  cache_hit_rate: 87.3,
  cache_saved_tokens: 8912,
  cache_tokens: 8912,
  total_tokens: 19755,
  exceeds_200k: false,

  // ── Token speeds ─────────────────────────────────────────
  input_tokens: 15234,
  output_tokens: 4521,
  input_speed: 1240,
  output_speed: 380,
  total_speed: 1620,

  // ── Cost / Time ──────────────────────────────────────────
  total_cost_usd: 0.0234,
  total_cost: 0.0234,
  today_cost: 0.12,
  total_duration_ms: 4980000,
  total_api_duration_ms: 2300,
  api_duration_s: 2.3,
  duration: '1h 23m',
  free_memory: 8.2,
  terminal_width: 220,

  // ── Rate Limits / Usage ───────────────────────────────────
  rate_limit_5h: 23,
  rate_limit_7d: 41,
  sonnet_usage: '124k',
  opus_usage: '12k',
  extra_pct: 18,
  extra_remaining: '82k',
  reset_in: '2h 14m',
  weekly_reset_in: '3d 12h',
  block_time: '42s',

  // ── Git ──────────────────────────────────────────────────
  branch: 'main',
  ahead: 0,
  behind: 0,
  changed: 3,
  insertions: 47,
  deletions: 12,
  staged_files: 2,
  unstaged_files: 1,
  untracked_files: 3,
  staged: '2',
  unstaged: '1',
  untracked: '3',
  clean_status: '✓',
  conflicts: 0,
  sha: 'a1b2c3d',
  review_status: 'approved',
  worktree: 'feature-auth',
  git_root: 'my-project',
  origin_owner: 'neo',
  origin_repo: 'my-project',
  upstream_owner: 'upstream',
  upstream_repo: 'my-project',
  is_fork: 'fork',
  git_stash_count: 2,
  git_last_commit: 'fix: update auth middleware',
  git_commit_age: '2h ago',
  total_lines_added: 156,
  total_lines_removed: 23,

  // ── Cloud / Infra ────────────────────────────────────────
  docker_context: 'default',
  docker_running: 3,
  k8s_context: 'prod-cluster',
  k8s_namespace: 'default',
  aws_profile: 'dev',
  aws_region: 'ap-northeast-2',
  gcp_project: 'my-project',
  tf_workspace: 'staging',

  // ── Runtime / Language ───────────────────────────────────
  node_version: '22.15.1',
  python_version: '3.13.2',
  venv_name: '.venv',

  // ── System ───────────────────────────────────────────────
  battery_pct: 78,
  tmux_session: 'dev',

  // ── Computed display values ───────────────────────────────
  context_bar: '█░░░░░░░░░',
};

const COLOR_MAP: Record<string, string> = {
  accent:'#00d97e', green:'#00d97e', cyan:'#22d3ee', blue:'#60a5fa',
  yellow:'#fbbf24', orange:'#fb923c', red:'#f87171', magenta:'#c084fc',
  pink:'#f472b6', white:'#d0d0d0', gray:'#6b7280', dim:'#4b5563',
};

export function styleToCSS(style?: string): string {
  if (!style) return '';
  const css: string[] = [];
  for (const p of style.split(/\s+/)) {
    if (p === 'bold')                           css.push('font-weight:700');
    else if (p === 'dim')                       css.push(`color:${COLOR_MAP.dim}`);
    else if (/^#[0-9a-fA-F]{6}$/.test(p))      css.push(`color:${p}`);
    else if (COLOR_MAP[p])                      css.push(`color:${COLOR_MAP[p]}`);
  }
  return css.join(';');
}

export function renderFormat(fmt: string): string {
  return fmt.replace(/\{([a-zA-Z_.]+)(?::([^}]+))?\}/g, (_, key, spec) => {
    const val = SAMPLE_VALUES[key];
    if (val === undefined) return `{${key}}`;
    if (spec) { const fm = spec.match(/\.(\d+)f/); if (fm) return Number(val).toFixed(parseInt(fm[1])); }
    return String(val);
  });
}

export interface RenderedSegment { text: string; cssStyle: string; }

export function renderSegmentsWithStyle(
  segments: Array<{ type: string; format?: string; enabled?: boolean; style?: string }>
): RenderedSegment[] {
  return segments.filter(s => s.enabled !== false).map(s => ({
    text: s.format ? renderFormat(s.format) : (s.type),
    cssStyle: styleToCSS(s.style),
  }));
}

const WIDGET_SAMPLE: Record<string, string> = {
  'model':                    'Sonnet 4.6',
  'thinking-effort':          'high',
  'output-style':             'default',
  'version':                  'v2.2.19',
  'claude-session-id':        '#abc123de',
  'claude-account-email':     'user@example.com',
  'session-name':             'my-session',
  'skills':                   '3 skills',
  'vim-mode':                 'NORMAL',
  'voice-status':             'off',
  'compaction-counter':       '2',
  'context-percentage':       '12%',
  'context-percentage-usable':'10%',
  'context-bar':              '█░░░░░░░░░ 12%',
  'context-length':           '19755',
  'context-window':           '200000',
  'tokens-input':             '↑15234',
  'tokens-output':            '↓4521',
  'tokens-cached':            '⚡8912',
  'tokens-total':             '19755tok',
  'input-speed':              '1240t/s',
  'output-speed':             '380t/s',
  'total-speed':              '1620t/s',
  'session-cost':             '$0.0234',
  'session-clock':            '1h 23m',
  'session-usage':            '5h:23%',
  'weekly-usage':             '7d:41%',
  'weekly-sonnet-usage':      'S:124k',
  'weekly-opus-usage':        'O:12k',
  'extra-usage-utilization':  '+18%',
  'extra-usage-remaining':    '82k',
  'reset-timer':              'reset:2h 14m',
  'weekly-reset-timer':       'w-reset:3d 12h',
  'block-timer':              '42s',
  'free-memory':              '8.2GB',
  'terminal-width':           '220',
  'git-branch':               '⎇ main',
  'git-status':               'main',
  'git-changes':              '~3',
  'git-insertions':           '+47',
  'git-deletions':            '-12',
  'git-staged-files':         'S:2',
  'git-unstaged-files':       'U:1',
  'git-untracked-files':      '?:3',
  'git-staged':               '2',
  'git-unstaged':             '1',
  'git-untracked':            '3',
  'git-clean-status':         '✓',
  'git-ahead-behind':         '↑0 ↓0',
  'git-conflicts':            '!0',
  'git-sha':                  'a1b2c3d',
  'git-review':               'approved',
  'git-worktree':             'feature-auth',
  'git-root-dir':             'my-project',
  'git-origin-owner':         'neo',
  'git-origin-repo':          'my-project',
  'git-origin-owner-repo':    'neo/my-project',
  'git-upstream-owner':       'upstream',
  'git-upstream-repo':        'my-project',
  'git-upstream-owner-repo':  'upstream/my-project',
  'git-is-fork':              'fork',
  'current-working-dir':      'my-project',
  'worktree-mode':            'worktree',
  'worktree-name':            'feature-auth',
  'worktree-branch':          'worktree-feature-auth',
  'worktree-original-branch': 'main',
  'custom-text':              '·',
  'custom-symbol':            '◆',
  'custom-command':           '[cmd]',
  'link':                     'link',
  'separator':                '|',
};

export interface CcsWidgetItem {
  id: string;
  type: string;
  color?: string;
  bold?: boolean;
  rawValue?: string;
  commandPath?: string;
}

export function renderCcsWidgets(items: CcsWidgetItem[]): RenderedSegment[] {
  return items.map(item => {
    const text = item.rawValue ?? WIDGET_SAMPLE[item.type] ?? item.type;
    const styleStr = [item.color ?? 'dim', item.bold ? 'bold' : ''].filter(Boolean).join(' ');
    return { text, cssStyle: styleToCSS(styleStr) };
  });
}

export function renderSegments(segments: Array<{ type: string; format?: string; enabled?: boolean }>): string[] {
  return renderSegmentsWithStyle(segments).map(s => s.text);
}

export function tokenBar(pct: number, width = 10): string {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

export function contextBarStyled(pct: number, width = 10): { bar: string; css: string } {
  return {
    bar: tokenBar(pct, width),
    css: pct >= 85 ? `color:${COLOR_MAP.red}` : pct >= 60 ? `color:${COLOR_MAP.yellow}` : `color:${COLOR_MAP.green}`,
  };
}
