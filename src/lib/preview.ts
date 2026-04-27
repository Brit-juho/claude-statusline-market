export const SAMPLE_VALUES: Record<string, number | string> = {
  model: 'Sonnet 4.6',
  total_cost: 0.0234,
  cache_hit_rate: 87.3,
  input_tokens: 12400,
  output_tokens: 3215,
  total_tokens: 15615,
  cache_saved_tokens: 8912,
  branch: 'main',
  ahead: 0,
  behind: 0,
  changed: 3,
  duration: '1h 23m',
  cwd: '~/GitHub/my-project',
};

export function renderFormat(fmt: string): string {
  return fmt.replace(/\{([a-zA-Z_.]+)(?::([^}]+))?\}/g, (_, varName, spec) => {
    const val = SAMPLE_VALUES[varName];
    if (val === undefined) return `{${varName}}`;
    if (spec) {
      const fmatch = spec.match(/\.(\d+)f/);
      if (fmatch) return (val as number).toFixed(parseInt(fmatch[1]));
    }
    return String(val);
  });
}

export function renderSegments(segments: Array<{ type: string; format?: string; enabled?: boolean }>): string[] {
  return segments
    .filter(s => s.enabled !== false)
    .map(s => {
      if (s.format) return renderFormat(s.format);
      // fallback per type
      const fallbacks: Record<string, string> = {
        model: SAMPLE_VALUES.model as string,
        cost: `$${(SAMPLE_VALUES.total_cost as number).toFixed(4)}`,
        cache: `${(SAMPLE_VALUES.cache_hit_rate as number).toFixed(1)}%`,
        tokens: `${SAMPLE_VALUES.input_tokens}+${SAMPLE_VALUES.output_tokens}`,
        git: ` ${SAMPLE_VALUES.branch}`,
        session_time: SAMPLE_VALUES.duration as string,
        git_changes: `${SAMPLE_VALUES.changed} changed`,
      };
      return fallbacks[s.type] ?? s.type;
    });
}

export function tokenBar(pct: number, width = 10): string {
  const filled = Math.round((pct / 100) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}
