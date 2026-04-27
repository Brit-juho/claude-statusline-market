import { describe, it, expect } from 'vitest';
import { renderFormat, styleToCSS, tokenBar, contextBarStyled } from './preview';

describe('renderFormat', () => {
  it('{model} 치환', () => {
    expect(renderFormat('{model}')).toBe('Sonnet 4.6');
  });
  it(':.4f 소수점 포맷', () => {
    expect(renderFormat('${total_cost_usd:.4f}')).toBe('$0.0234');
  });
  it(':.0f 반올림 포맷', () => {
    expect(renderFormat('{used_percentage:.0f}%')).toBe('12%');
  });
  it('누락 키는 원본 유지', () => {
    expect(renderFormat('{no_such_key}')).toBe('{no_such_key}');
  });
  it('일반 텍스트 prefix 유지', () => {
    expect(renderFormat('◷ {duration}')).toBe('◷ 1h 23m');
  });
  it('복합 포맷', () => {
    expect(renderFormat('↑{total_input_tokens} ↓{total_output_tokens}')).toBe('↑15234 ↓4521');
  });
  it('이모지 포함', () => {
    expect(renderFormat('🔋 {battery_pct}%')).toBe('🔋 78%');
  });
});

describe('styleToCSS', () => {
  it('hex 색상', () => {
    expect(styleToCSS('#22d3ee')).toBe('color:#22d3ee');
  });
  it('named 색상 cyan', () => {
    expect(styleToCSS('cyan')).toBe('color:#22d3ee');
  });
  it('bold', () => {
    expect(styleToCSS('bold')).toBe('font-weight:700');
  });
  it('복합: hex + bold', () => {
    const css = styleToCSS('#22d3ee bold');
    expect(css).toContain('color:#22d3ee');
    expect(css).toContain('font-weight:700');
  });
  it('dim 처리', () => {
    expect(styleToCSS('dim')).toBe('color:#4b5563');
  });
  it('undefined → 빈 문자열', () => {
    expect(styleToCSS(undefined)).toBe('');
  });
  it('빈 문자열 → 빈 문자열', () => {
    expect(styleToCSS('')).toBe('');
  });
});

describe('tokenBar', () => {
  it('0% → 전부 빈 블록', () => {
    expect(tokenBar(0, 10)).toBe('░'.repeat(10));
  });
  it('100% → 전부 찬 블록', () => {
    expect(tokenBar(100, 10)).toBe('█'.repeat(10));
  });
  it('50% → 절반', () => {
    const bar = tokenBar(50, 10);
    expect(bar).toBe('█'.repeat(5) + '░'.repeat(5));
  });
  it('너비 변경', () => {
    expect(tokenBar(100, 5)).toBe('█'.repeat(5));
  });
});

describe('contextBarStyled', () => {
  it('12% → green', () => {
    const { css } = contextBarStyled(12);
    expect(css).toContain('#00d97e');
  });
  it('70% → yellow', () => {
    const { css } = contextBarStyled(70);
    expect(css).toContain('#fbbf24');
  });
  it('90% → red', () => {
    const { css } = contextBarStyled(90);
    expect(css).toContain('#f87171');
  });
  it('bar 길이', () => {
    const { bar } = contextBarStyled(50, 10);
    expect(bar.length).toBe(10);
  });
});
