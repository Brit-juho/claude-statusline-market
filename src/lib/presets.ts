export interface Preset {
  id: string;
  version: string;
  title: { ko: string; en: string };
  description: { ko: string; en: string };
  tool: string;
  category: string;
  tags: string[];
  author: { name: string; github?: string };
  screenshot?: string;
  settings: {
    statusline: {
      enabled: boolean;
      position?: string;
      separator?: string;
      segments: Array<{
        type: string;
        enabled?: boolean;
        format?: string;
        style?: string;
        options?: Record<string, unknown>;
      }>;
    };
  };
}

export async function getAllPresets(): Promise<Preset[]> {
  const modules = import.meta.glob('/public/presets/*.json', { eager: true });
  const presets: Preset[] = [];
  for (const [, mod] of Object.entries(modules)) {
    const data = (mod as { default?: Preset } & Preset).default ?? (mod as Preset);
    if (data && data.id) presets.push(data);
  }
  return presets.sort((a, b) => a.id.localeCompare(b.id));
}

export function getInstallCommand(preset: Preset, platform: 'sh' | 'ps1' = 'sh'): string {
  const base = 'https://raw.githubusercontent.com/NeTrioGit/claude-statusline-market/main';
  if (platform === 'sh') {
    return `curl -fsSL ${base}/scripts/install-preset.sh | bash -s -- ${preset.id}`;
  }
  return `irm ${base}/scripts/install-preset.ps1 | iex; Install-Preset ${preset.id}`;
}
