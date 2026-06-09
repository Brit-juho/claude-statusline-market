export interface CcsWidgetItem {
  id: string;
  type: string;
  color?: string;
  bold?: boolean;
  commandPath?: string;
  rawValue?: string;
  [key: string]: unknown;
}

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
  ccstatusline_settings: {
    version: 3;
    lines: CcsWidgetItem[][];
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
