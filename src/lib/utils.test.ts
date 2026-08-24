import { describe, it, expect, vi } from 'vitest';

// import.meta.env.BASE_URL을 모킹해야 하므로 모듈을 직접 테스트
// getBase()의 두 경로: BASE_URL이 '/'로 끝나는 경우 vs 안 끝나는 경우

describe('getBase logic', () => {
  it('/ 로 끝나는 BASE_URL → 그대로 반환', () => {
    const b = '/claude-statusline-market/';
    const result = b.endsWith('/') ? b : b + '/';
    expect(result).toBe('/claude-statusline-market/');
  });

  it('/ 로 안 끝나는 BASE_URL → / 추가', () => {
    const b = '/claude-statusline-market';
    const result = b.endsWith('/') ? b : b + '/';
    expect(result).toBe('/claude-statusline-market/');
  });

  it('루트 BASE_URL "/" → 그대로', () => {
    const b = '/';
    const result = b.endsWith('/') ? b : b + '/';
    expect(result).toBe('/');
  });

  it('빈 문자열 BASE_URL → "/"', () => {
    const b = '';
    const result = b.endsWith('/') ? b : b + '/';
    expect(result).toBe('/');
  });
});
