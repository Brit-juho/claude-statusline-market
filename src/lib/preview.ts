export const SAMPLE_VALUES: Record<string, number | string | boolean> = {
  model: 'Sonnet 4.6',
  model_id: 'claude-sonnet-4-6',
  cwd: '~/GitHub/my-project',
  project_dir: '~/GitHub/my-project',
  dir_name: 'my-project',
  total_cost_usd: 0.0234,
  total_duration_ms: 4980000,
  total_api_duration_ms: 2300,
  total_lines_added: 156,
  total_lines_removed: 23,
  total_input_tokens: 15234,
  total_output_tokens: 4521,
  context_window_size: 200000,
  used_percentage: 12,
  remaining_percentage: 88,
  current_input_tokens: 8500,
  cache_creation_tokens: 5000,
  cache_read_tokens: 2000,
  session_id: 'abc123de',
  session_name: 'my-session',
  version: '2.1.90',
  effort_level: 'high',
  thinking_enabled: true,
  rate_limit_5h: 23,
  rate_limit_7d: 41,
  vim_mode: 'NORMAL',
  branch: 'main',
  ahead: 0,
  behind: 0,
  changed: 3,
  input_tokens: 15234,
  output_tokens: 4521,
  cache_hit_rate: 87.3,
  cache_saved_tokens: 8912,
  total_tokens: 19755,
  duration: '1h 23m',
  // aliases used by older presets
  total_cost: 0.0234,
  // runtime environment (new fields)
  node_version: '22.15.1',
  python_version: '3.13.2',
  go_version: '1.23.4',
  ruby_version: '3.3.6',
  java_version: '21.0.2',
  rust_version: '1.78.0',
  venv_name: '.venv',
  conda_env: 'myenv',
  docker_context: 'default',
  k8s_context: 'prod-cluster',
  k8s_namespace: 'default',
  aws_profile: 'dev',
  gcp_project: 'my-project',
  tf_workspace: 'staging',
};

// style string → inline CSS (e.g. "bold cyan", "dim", "green")
const COLOR_MAP: Record<string, string> = {
  accent:  '#00d97e',
  green:   '#00d97e',
  cyan:    '#22d3ee',
  blue:    '#60a5fa',
  yellow:  '#fbbf24',
  orange:  '#fb923c',
  red:     '#f87171',
  magenta: '#c084fc',
  pink:    '#f472b6',
  white:   '#ededed',
  gray:    '#6b7280',
  dim:     '#4b5563',
};

export function styleToCSS(style?: string): string {
  if (!style) return '';
  const parts = style.toLowerCase().split(/\s+/);
  const css: string[] = [];
  for (const p of parts) {
    if (p === 'bold')   { css.push('font-weight:700'); continue; }
    if (p === 'dim')    { css.push(`color:${COLOR_MAP.dim}`); continue; }
    if (COLOR_MAP[p])   { css.push(`color:${COLOR_MAP[p]}`); continue; }
  }
  return css.join(';');
}

export function renderFormat(fmt: string): string {
  return fmt.replace(/\{([a-zA-Z_.]+)(?::([^}]+))?\}/g, (_, key, spec) => {
    const val = SAMPLE_VALUES[key];
    if (val === undefined) return `{${key}}`;
    if (spec) {
      const fm = spec.match(/\.(\d+)f/);
      if (fm) return Number(val).toFixed(parseInt(fm[1]));
    }
    return String(val);
  });
}

export interface RenderedSegment {
  text: string;
  cssStyle: string;
}

export function renderSegmentsWithStyle(
  segments: Array<{ type: string; format?: string; enabled?: boolean; style?: string }>
): RenderedSegment[] {
  const fallbacks: Record<string, string> = {
    model:        String(SAMPLE_VALUES.model),
    cost:         `$${Number(SAMPLE_VALUES.total_cost_usd).toFixed(4)}`,
    cache:        `${Math.round(Number(SAMPLE_VALUES.cache_hit_rate))}%`,
    tokens:       `${SAMPLE_VALUES.total_input_tokens}+${SAMPLE_VALUES.total_output_tokens}`,
    git:          ` ${SAMPLE_VALUES.branch}`,
    session_time: String(SAMPLE_VALUES.duration),
    git_changes:  `${SAMPLE_VALUES.changed} changed`,
    context:      `${SAMPLE_VALUES.used_percentage}%`,
  };
  return segments
    .filter(s => s.enabled !== false)
    .map(s => ({
      text: s.format ? renderFormat(s.format) : (fallbacks[s.type] ?? s.type),
      cssStyle: styleToCSS(s.style),
    }));
}

// kept for compat
export function renderSegments(
  segments: Array<{ type: string; format?: string; enabled?: boolean }>
): string[] {
  return renderSegmentsWithStyle(segments).map(s => s.text);
}

export function tokenBar(pct: number, width = 10): string {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// bar that shifts color by threshold (returns { bar, css })
export function contextBarStyled(pct: number, width = 10): { bar: string; css: string } {
  const bar = tokenBar(pct, width);
  const css = pct >= 85 ? `color:${COLOR_MAP.red}` :
              pct >= 60 ? `color:${COLOR_MAP.yellow}` :
              `color:${COLOR_MAP.green}`;
  return { bar, css };
}
