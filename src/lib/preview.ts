export const SAMPLE_VALUES: Record<string, number | string | boolean> = {
  // ── Model / Session ──────────────────────────────────────
  model: 'Sonnet 4.6',
  model_id: 'claude-sonnet-4-6',
  version: '2.1.90',
  session_id: 'abc123de',
  session_name: 'my-session',
  effort_level: 'high',
  thinking_enabled: true,
  output_style: 'default',
  agent_name: 'code-reviewer',

  // ── Workspace ────────────────────────────────────────────
  cwd: '~/GitHub/my-project',
  project_dir: '~/GitHub/my-project',
  dir_name: 'my-project',
  worktree_name: 'feature-auth',
  worktree_branch: 'worktree-feature-auth',

  // ── Context Window ───────────────────────────────────────
  total_input_tokens: 15234,
  total_output_tokens: 4521,
  context_window_size: 200000,
  used_percentage: 12,
  remaining_percentage: 88,
  current_input_tokens: 8500,
  cache_creation_tokens: 5000,
  cache_read_tokens: 2000,
  cache_hit_rate: 87.3,
  cache_saved_tokens: 8912,
  total_tokens: 19755,
  exceeds_200k: false,

  // ── Cost / Time ──────────────────────────────────────────
  total_cost_usd: 0.0234,
  total_cost: 0.0234,            // alias
  today_cost: 0.12,
  total_duration_ms: 4980000,
  total_api_duration_ms: 2300,
  api_duration_s: 2.3,
  duration: '1h 23m',

  // ── Lines / Code ─────────────────────────────────────────
  total_lines_added: 156,
  total_lines_removed: 23,
  input_tokens: 15234,
  output_tokens: 4521,

  // ── Rate Limits ──────────────────────────────────────────
  rate_limit_5h: 23,
  rate_limit_7d: 41,

  // ── Git ──────────────────────────────────────────────────
  branch: 'main',
  ahead: 0,
  behind: 0,
  changed: 3,
  git_stash_count: 2,
  git_last_commit: 'fix: update auth middleware',
  git_commit_age: '2h ago',
  pr_number: 142,
  pr_reviews: 2,
  pr_state: 'open',
  ci_status: 'pass',

  // ── Sub-agents ───────────────────────────────────────────
  sub_agents: 3,

  // ── Runtime / Language ───────────────────────────────────
  node_version: '22.15.1',
  python_version: '3.13.2',
  go_version: '1.23.4',
  ruby_version: '3.3.6',
  java_version: '21.0.2',
  rust_version: '1.78.0',
  go_module: 'myapp',

  // ── Virtual Environments ─────────────────────────────────
  venv_name: '.venv',
  conda_env: 'myenv',
  node_env: 'development',
  rails_env: 'development',
  mix_env: 'dev',
  java_profile: 'development',
  db_connected: true,

  // ── Cloud / Infra ────────────────────────────────────────
  docker_context: 'default',
  docker_running: 3,
  k8s_context: 'prod-cluster',
  k8s_namespace: 'default',
  aws_profile: 'dev',
  aws_region: 'ap-northeast-2',
  gcp_project: 'my-project',
  tf_workspace: 'staging',

  // ── System ───────────────────────────────────────────────
  battery_pct: 78,
  memory_free_gb: 8.2,
  port_3000: 'up',
  tmux_session: 'dev',
  vim_mode: 'NORMAL',
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
