import { describe, it, expect } from 'vitest';
import { getLangFromUrl } from './index';

describe('getLangFromUrl — 회귀 방지', () => {
  it('한국어 기본 경로 → ko', () => {
    expect(getLangFromUrl(new URL('http://x.com/'))).toBe('ko');
  });
  it('/en/ → en', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/'))).toBe('en');
  });
  it('base path 포함 /claude-statusline-market/en/ → en (핵심 회귀 방지)', () => {
    expect(getLangFromUrl(new URL('http://x.com/claude-statusline-market/en/'))).toBe('en');
  });
  it('base path만 있는 경우 → ko fallback', () => {
    expect(getLangFromUrl(new URL('http://x.com/claude-statusline-market/'))).toBe('ko');
  });
  it('/en/presets/ko-minimal → en', () => {
    expect(getLangFromUrl(new URL('http://x.com/en/presets/ko-minimal'))).toBe('en');
  });
  it('/ko/ 같은 알 수 없는 lang → ko fallback', () => {
    expect(getLangFromUrl(new URL('http://x.com/fr/'))).toBe('ko');
  });
});
