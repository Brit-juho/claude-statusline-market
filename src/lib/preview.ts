export const SAMPLE_VALUES: Record<string, number | string | boolean> = {
  // model
  model: 'Sonnet 4.6',
  model_id: 'claude-sonnet-4-6',
  // workspace
  cwd: '~/GitHub/my-project',
  project_dir: '~/GitHub/my-project',
  dir_name: 'my-project',
  // cost
  total_cost_usd: 0.0234,
  total_duration_ms: 4980000,
  total_api_duration_ms: 2300,
  total_lines_added: 156,
  total_lines_removed: 23,
  // context window
  total_input_tokens: 15234,
  total_output_tokens: 4521,
  context_window_size: 200000,
  used_percentage: 12,
  remaining_percentage: 88,
  current_input_tokens: 8500,
  cache_creation_tokens: 5000,
  cache_read_tokens: 2000,
  // session
  session_id: 'abc123de',
  session_name: 'my-session',
  version: '2.1.90',
  // effort & thinking
  effort_level: 'high',
  thinking_enabled: true,
  // rate limits
  rate_limit_5h: 23,
  rate_limit_7d: 41,
  // vim
  vim_mode: 'NORMAL',
  // git
  branch: 'main',
  ahead: 0,
  behind: 0,
  changed: 3,
  // legacy compat
  input_tokens: 15234,
  output_tokens: 4521,
  cache_hit_rate: 87.3,
  cache_saved_tokens: 8912,
  total_tokens: 19755,
  duration: '1h 23m',
};

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

export function renderSegments(
  segments: Array<{ type: string; format?: string; enabled?: boolean }>
): string[] {
  return segments.filter(s => s.enabled !== false).map(s => {
    if (s.format) return renderFormat(s.format);
    const fallbacks: Record<string, string> = {
      model: String(SAMPLE_VALUES.model),
      cost: `$${Number(SAMPLE_VALUES.total_cost_usd).toFixed(4)}`,
      cache: `${Math.round(Number(SAMPLE_VALUES.cache_hit_rate))}%`,
      tokens: `${SAMPLE_VALUES.total_input_tokens}+${SAMPLE_VALUES.total_output_tokens}`,
      git: ` ${SAMPLE_VALUES.branch}`,
      session_time: String(SAMPLE_VALUES.duration),
      git_changes: `${SAMPLE_VALUES.changed} changed`,
      context: `${SAMPLE_VALUES.used_percentage}%`,
    };
    return fallbacks[s.type] ?? s.type;
  });
}

export function tokenBar(pct: number, width = 10): string {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

// context bar with color thresholds (for preview only)
export function contextBar(pct: number, width = 10): string {
  return tokenBar(pct, width);
}
