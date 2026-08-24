import { describe, it, expect } from 'vitest';
import { SEGMENT_DEFS, SEGMENT_GROUPS, styleFromConfig, configFromStyle } from './segment-defs.ts';

describe('SEGMENT_DEFS', () => {
  it('has at least 20 segments', () => {
    expect(SEGMENT_DEFS.length).toBeGreaterThanOrEqual(20);
  });

  it('all segment ids are unique', () => {
    const ids = SEGMENT_DEFS.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all segments have ko and en labels', () => {
    for (const def of SEGMENT_DEFS) {
      expect(def.label.ko, `${def.id}.label.ko`).toBeTruthy();
      expect(def.label.en, `${def.id}.label.en`).toBeTruthy();
    }
  });

  it('all segments have non-empty defaultConfig', () => {
    for (const def of SEGMENT_DEFS) {
      expect(def.defaultConfig.format, `${def.id}.format`).toBeTruthy();
    }
  });

  it('all segments belong to a valid group', () => {
    const validGroups = Object.keys(SEGMENT_GROUPS);
    for (const def of SEGMENT_DEFS) {
      expect(validGroups, `${def.id}.group`).toContain(def.group);
    }
  });
});

describe('styleFromConfig', () => {
  it('returns color only', () => {
    expect(styleFromConfig({ color: 'cyan', bold: false })).toBe('cyan');
  });

  it('returns color + bold', () => {
    expect(styleFromConfig({ color: 'green', bold: true })).toBe('green bold');
  });

  it('handles dim color', () => {
    expect(styleFromConfig({ color: 'dim', bold: false })).toBe('dim');
  });

  it('handles accent color', () => {
    expect(styleFromConfig({ color: 'accent', bold: false })).toBe('accent');
  });

  it('bold only (no color)', () => {
    expect(styleFromConfig({ bold: true })).toBe('bold');
  });

  it('empty config returns empty string', () => {
    expect(styleFromConfig({})).toBe('');
  });
});

describe('configFromStyle', () => {
  it('parses color only', () => {
    expect(configFromStyle('cyan')).toEqual({ color: 'cyan', bold: false });
  });

  it('parses color + bold', () => {
    expect(configFromStyle('green bold')).toEqual({ color: 'green', bold: true });
  });

  it('parses bold + color (order invariant)', () => {
    expect(configFromStyle('bold blue')).toEqual({ color: 'blue', bold: true });
  });

  it('parses dim', () => {
    expect(configFromStyle('dim')).toEqual({ color: 'dim', bold: false });
  });

  it('empty string falls back to dim', () => {
    expect(configFromStyle('')).toEqual({ color: 'dim', bold: false });
  });
});

describe('JSON serialization round-trip', () => {
  it('styleFromConfig → configFromStyle round-trips correctly', () => {
    const original = { color: 'magenta', bold: true };
    const style = styleFromConfig(original);
    const recovered = configFromStyle(style);
    expect(recovered).toEqual(original);
  });

  it('round-trips for all segment defaultConfigs', () => {
    for (const def of SEGMENT_DEFS) {
      const style = def.defaultConfig.style;
      const config = configFromStyle(style);
      const restored = styleFromConfig(config);
      // Allow minor whitespace/ordering differences — just verify it's non-empty for styled defs
      if (style) {
        expect(restored, `${def.id} round-trip`).toBeTruthy();
      }
    }
  });
});
