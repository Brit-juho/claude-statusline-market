import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getInstallCommand } from './presets';
import type { Preset } from './presets';

const BASE = 'https://raw.githubusercontent.com/Brit-juho/claude-statusline-market/main';

function makePreset(id: string): Preset {
  return {
    id,
    version: '0.1.0',
    title: { ko: '테스트', en: 'Test' },
    description: { ko: '설명', en: 'Description' },
    tool: 'ccstatusline',
    category: 'minimal',
    tags: [],
    author: { name: 'test' },
    settings: {
      statusline: {
        enabled: true,
        segments: [],
      },
    },
  };
}

describe('getInstallCommand', () => {
  it('sh — curl|bash 명령 생성', () => {
    const cmd = getInstallCommand(makePreset('ko-minimal'), 'sh');
    expect(cmd).toBe(`curl -fsSL ${BASE}/scripts/install-preset.sh | bash -s -- ko-minimal`);
  });

  it('ps1 — irm|iex 명령 생성', () => {
    const cmd = getInstallCommand(makePreset('en-powerline-pro'), 'ps1');
    expect(cmd).toBe(`irm ${BASE}/scripts/install-preset.ps1 | iex; Install-Preset en-powerline-pro`);
  });

  it('기본 플랫폼은 sh', () => {
    const cmd = getInstallCommand(makePreset('ko-minimal'));
    expect(cmd).toContain('bash -s -- ko-minimal');
  });

  it('preset id가 URL에 포함됨', () => {
    const cmd = getInstallCommand(makePreset('neo-custom-preset'), 'sh');
    expect(cmd).toContain('neo-custom-preset');
  });

  it('sh 명령에 ps1 스크립트 참조 없음', () => {
    const cmd = getInstallCommand(makePreset('ko-minimal'), 'sh');
    expect(cmd).not.toContain('.ps1');
  });

  it('ps1 명령에 sh 스크립트 참조 없음', () => {
    const cmd = getInstallCommand(makePreset('ko-minimal'), 'ps1');
    expect(cmd).not.toContain('.sh');
  });
});
