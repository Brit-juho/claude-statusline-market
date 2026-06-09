export type ConfigField = {
  key: string;
  label: { ko: string; en: string };
  type: 'color' | 'select' | 'boolean' | 'text';
  options?: string[];
};

export type SegmentDef = {
  id: string;
  label: { ko: string; en: string };
  type: string;
  group: 'claude' | 'context' | 'cost' | 'git' | 'workspace' | 'infra' | 'runtime' | 'stats' | 'separators';
  defaultConfig: { format: string; style: string };
  configSchema: ConfigField[];
};

const COLORS = ['accent', 'green', 'cyan', 'blue', 'yellow', 'orange', 'red', 'magenta', 'pink', 'white', 'gray', 'dim'];

const baseSchema: ConfigField[] = [
  { key: 'format', label: { ko: '형식', en: 'Format' }, type: 'text' },
  { key: 'color', label: { ko: '색상', en: 'Color' }, type: 'select', options: COLORS },
  { key: 'bold', label: { ko: '굵게', en: 'Bold' }, type: 'boolean' },
];

export const SEGMENT_DEFS: SegmentDef[] = [
  // ── Claude / AI ─────────────────────────────────────────────
  {
    id: 'model', label: { ko: '모델명', en: 'Model' }, type: 'model', group: 'claude',
    defaultConfig: { format: '◆ {model}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'thinking-effort', label: { ko: '노력 수준', en: 'Thinking Effort' }, type: 'thinking-effort', group: 'claude',
    defaultConfig: { format: '{effort_level}', style: 'magenta' },
    configSchema: baseSchema,
  },
  {
    id: 'output-style', label: { ko: '출력 스타일', en: 'Output Style' }, type: 'output-style', group: 'claude',
    defaultConfig: { format: '{output_style}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'version', label: { ko: 'CC 버전', en: 'CC Version' }, type: 'version', group: 'claude',
    defaultConfig: { format: 'v{version}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'claude-session-id', label: { ko: '세션 ID', en: 'Session ID' }, type: 'claude-session-id', group: 'claude',
    defaultConfig: { format: '#{session_id}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'claude-account-email', label: { ko: '계정 이메일', en: 'Account Email' }, type: 'claude-account-email', group: 'claude',
    defaultConfig: { format: '{email}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'session-name', label: { ko: '세션 이름', en: 'Session Name' }, type: 'session-name', group: 'claude',
    defaultConfig: { format: '{session_name}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'skills', label: { ko: '스킬', en: 'Skills' }, type: 'skills', group: 'claude',
    defaultConfig: { format: '{skills}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'vim-mode', label: { ko: 'Vim 모드', en: 'Vim Mode' }, type: 'vim-mode', group: 'claude',
    defaultConfig: { format: '{vim_mode}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'voice-status', label: { ko: '음성 상태', en: 'Voice Status' }, type: 'voice-status', group: 'claude',
    defaultConfig: { format: '{voice_status}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'compaction-counter', label: { ko: '압축 카운터', en: 'Compaction Counter' }, type: 'compaction-counter', group: 'claude',
    defaultConfig: { format: '{compaction_count}', style: 'dim' },
    configSchema: baseSchema,
  },

  // ── Context / Tokens ────────────────────────────────────────
  {
    id: 'context-percentage', label: { ko: '컨텍스트 %', en: 'Context %' }, type: 'context-percentage', group: 'context',
    defaultConfig: { format: '{used_percentage}%', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'context-percentage-usable', label: { ko: '사용 가능 컨텍스트 %', en: 'Usable Context %' }, type: 'context-percentage-usable', group: 'context',
    defaultConfig: { format: '{usable_percentage}%', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'context-bar', label: { ko: '컨텍스트 바 ░█', en: 'Context Bar ░█' }, type: 'context-bar', group: 'context',
    defaultConfig: { format: '{context_bar} {used_percentage}%', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'context-length', label: { ko: '컨텍스트 길이', en: 'Context Length' }, type: 'context-length', group: 'context',
    defaultConfig: { format: '{context_length}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'context-window', label: { ko: '컨텍스트 윈도우', en: 'Context Window' }, type: 'context-window', group: 'context',
    defaultConfig: { format: '{context_window}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'tokens-input', label: { ko: '입력 토큰', en: 'Input Tokens' }, type: 'tokens-input', group: 'context',
    defaultConfig: { format: '↑{input_tokens}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'tokens-output', label: { ko: '출력 토큰', en: 'Output Tokens' }, type: 'tokens-output', group: 'context',
    defaultConfig: { format: '↓{output_tokens}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'tokens-cached', label: { ko: '캐시 토큰', en: 'Cached Tokens' }, type: 'tokens-cached', group: 'context',
    defaultConfig: { format: '⚡{cache_tokens}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'tokens-total', label: { ko: '총 토큰', en: 'Total Tokens' }, type: 'tokens-total', group: 'context',
    defaultConfig: { format: '{total_tokens}tok', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'input-speed', label: { ko: '입력 속도', en: 'Input Speed' }, type: 'input-speed', group: 'context',
    defaultConfig: { format: '{input_speed}t/s', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'output-speed', label: { ko: '출력 속도', en: 'Output Speed' }, type: 'output-speed', group: 'context',
    defaultConfig: { format: '{output_speed}t/s', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'total-speed', label: { ko: '전체 속도', en: 'Total Speed' }, type: 'total-speed', group: 'context',
    defaultConfig: { format: '{total_speed}t/s', style: 'dim' },
    configSchema: baseSchema,
  },

  // ── Cost / Time ─────────────────────────────────────────────
  {
    id: 'session-cost', label: { ko: '세션 비용', en: 'Session Cost' }, type: 'session-cost', group: 'cost',
    defaultConfig: { format: '${total_cost_usd:.4f}', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'session-clock', label: { ko: '세션 시간', en: 'Session Clock' }, type: 'session-clock', group: 'cost',
    defaultConfig: { format: '◷ {duration}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'session-usage', label: { ko: '5시간 사용률', en: '5h Usage' }, type: 'session-usage', group: 'cost',
    defaultConfig: { format: '5h:{rate_limit_5h}%', style: 'orange' },
    configSchema: baseSchema,
  },
  {
    id: 'weekly-usage', label: { ko: '7일 사용률', en: 'Weekly Usage' }, type: 'weekly-usage', group: 'cost',
    defaultConfig: { format: '7d:{rate_limit_7d}%', style: 'red' },
    configSchema: baseSchema,
  },
  {
    id: 'weekly-sonnet-usage', label: { ko: '주간 Sonnet 사용량', en: 'Weekly Sonnet Usage' }, type: 'weekly-sonnet-usage', group: 'cost',
    defaultConfig: { format: 'S:{sonnet_usage}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'weekly-opus-usage', label: { ko: '주간 Opus 사용량', en: 'Weekly Opus Usage' }, type: 'weekly-opus-usage', group: 'cost',
    defaultConfig: { format: 'O:{opus_usage}', style: 'magenta' },
    configSchema: baseSchema,
  },
  {
    id: 'extra-usage-utilization', label: { ko: '추가 사용률', en: 'Extra Usage %' }, type: 'extra-usage-utilization', group: 'cost',
    defaultConfig: { format: '+{extra_pct}%', style: 'orange' },
    configSchema: baseSchema,
  },
  {
    id: 'extra-usage-remaining', label: { ko: '추가 사용 잔여', en: 'Extra Usage Remaining' }, type: 'extra-usage-remaining', group: 'cost',
    defaultConfig: { format: '{extra_remaining}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'reset-timer', label: { ko: '리셋 타이머', en: 'Reset Timer' }, type: 'reset-timer', group: 'cost',
    defaultConfig: { format: 'reset:{reset_in}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'weekly-reset-timer', label: { ko: '주간 리셋 타이머', en: 'Weekly Reset Timer' }, type: 'weekly-reset-timer', group: 'cost',
    defaultConfig: { format: 'w-reset:{weekly_reset_in}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'block-timer', label: { ko: '블록 타이머', en: 'Block Timer' }, type: 'block-timer', group: 'cost',
    defaultConfig: { format: '{block_time}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'free-memory', label: { ko: '여유 메모리', en: 'Free Memory' }, type: 'free-memory', group: 'cost',
    defaultConfig: { format: '{free_memory}GB', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'terminal-width', label: { ko: '터미널 너비', en: 'Terminal Width' }, type: 'terminal-width', group: 'cost',
    defaultConfig: { format: '{terminal_width}', style: 'dim' },
    configSchema: baseSchema,
  },

  // ── Git ─────────────────────────────────────────────────────
  {
    id: 'git-branch', label: { ko: 'Git 브랜치', en: 'Git Branch' }, type: 'git-branch', group: 'git',
    defaultConfig: { format: '⎇ {branch}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'git-status', label: { ko: 'Git 상태', en: 'Git Status' }, type: 'git-status', group: 'git',
    defaultConfig: { format: '{branch}', style: 'blue' },
    configSchema: baseSchema,
  },
  {
    id: 'git-changes', label: { ko: 'Git 변경 파일', en: 'Git Changes' }, type: 'git-changes', group: 'git',
    defaultConfig: { format: '~{changed}', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'git-insertions', label: { ko: 'Git 추가 줄', en: 'Git Insertions' }, type: 'git-insertions', group: 'git',
    defaultConfig: { format: '+{insertions}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'git-deletions', label: { ko: 'Git 삭제 줄', en: 'Git Deletions' }, type: 'git-deletions', group: 'git',
    defaultConfig: { format: '-{deletions}', style: 'red' },
    configSchema: baseSchema,
  },
  {
    id: 'git-staged-files', label: { ko: 'Git 스테이지 파일', en: 'Git Staged Files' }, type: 'git-staged-files', group: 'git',
    defaultConfig: { format: 'S:{staged_files}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'git-unstaged-files', label: { ko: 'Git 언스테이지 파일', en: 'Git Unstaged Files' }, type: 'git-unstaged-files', group: 'git',
    defaultConfig: { format: 'U:{unstaged_files}', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'git-untracked-files', label: { ko: 'Git 미추적 파일', en: 'Git Untracked Files' }, type: 'git-untracked-files', group: 'git',
    defaultConfig: { format: '?:{untracked_files}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-staged', label: { ko: 'Git 스테이지', en: 'Git Staged' }, type: 'git-staged', group: 'git',
    defaultConfig: { format: '{staged}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'git-unstaged', label: { ko: 'Git 언스테이지', en: 'Git Unstaged' }, type: 'git-unstaged', group: 'git',
    defaultConfig: { format: '{unstaged}', style: 'yellow' },
    configSchema: baseSchema,
  },
  {
    id: 'git-untracked', label: { ko: 'Git 미추적', en: 'Git Untracked' }, type: 'git-untracked', group: 'git',
    defaultConfig: { format: '{untracked}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-clean-status', label: { ko: 'Git 클린 상태', en: 'Git Clean Status' }, type: 'git-clean-status', group: 'git',
    defaultConfig: { format: '{clean_status}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'git-ahead-behind', label: { ko: 'Git 앞뒤 커밋', en: 'Git Ahead/Behind' }, type: 'git-ahead-behind', group: 'git',
    defaultConfig: { format: '↑{ahead} ↓{behind}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'git-conflicts', label: { ko: 'Git 충돌', en: 'Git Conflicts' }, type: 'git-conflicts', group: 'git',
    defaultConfig: { format: '!{conflicts}', style: 'red' },
    configSchema: baseSchema,
  },
  {
    id: 'git-sha', label: { ko: 'Git SHA', en: 'Git SHA' }, type: 'git-sha', group: 'git',
    defaultConfig: { format: '{sha}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-review', label: { ko: 'Git 리뷰', en: 'Git Review' }, type: 'git-review', group: 'git',
    defaultConfig: { format: '{review_status}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'git-worktree', label: { ko: 'Git 워크트리', en: 'Git Worktree' }, type: 'git-worktree', group: 'git',
    defaultConfig: { format: '{worktree}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-root-dir', label: { ko: 'Git 루트', en: 'Git Root' }, type: 'git-root-dir', group: 'git',
    defaultConfig: { format: '{git_root}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-origin-owner', label: { ko: 'Git 오리진 오너', en: 'Git Origin Owner' }, type: 'git-origin-owner', group: 'git',
    defaultConfig: { format: '{origin_owner}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-origin-repo', label: { ko: 'Git 오리진 레포', en: 'Git Origin Repo' }, type: 'git-origin-repo', group: 'git',
    defaultConfig: { format: '{origin_repo}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-origin-owner-repo', label: { ko: 'Git 오리진 오너/레포', en: 'Git Origin Owner/Repo' }, type: 'git-origin-owner-repo', group: 'git',
    defaultConfig: { format: '{origin_owner}/{origin_repo}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-upstream-owner', label: { ko: 'Git 업스트림 오너', en: 'Git Upstream Owner' }, type: 'git-upstream-owner', group: 'git',
    defaultConfig: { format: '{upstream_owner}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-upstream-repo', label: { ko: 'Git 업스트림 레포', en: 'Git Upstream Repo' }, type: 'git-upstream-repo', group: 'git',
    defaultConfig: { format: '{upstream_repo}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-upstream-owner-repo', label: { ko: 'Git 업스트림 오너/레포', en: 'Git Upstream Owner/Repo' }, type: 'git-upstream-owner-repo', group: 'git',
    defaultConfig: { format: '{upstream_owner}/{upstream_repo}', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'git-is-fork', label: { ko: 'Git 포크 여부', en: 'Git Is Fork' }, type: 'git-is-fork', group: 'git',
    defaultConfig: { format: '{is_fork}', style: 'dim' },
    configSchema: baseSchema,
  },

  // ── Workspace ────────────────────────────────────────────────
  {
    id: 'current-working-dir', label: { ko: '작업 디렉토리', en: 'Working Dir' }, type: 'current-working-dir', group: 'workspace',
    defaultConfig: { format: '{dir_name}', style: 'blue' },
    configSchema: baseSchema,
  },
  {
    id: 'worktree-mode', label: { ko: '워크트리 모드', en: 'Worktree Mode' }, type: 'worktree-mode', group: 'workspace',
    defaultConfig: { format: '{worktree_mode}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'worktree-name', label: { ko: '워크트리 이름', en: 'Worktree Name' }, type: 'worktree-name', group: 'workspace',
    defaultConfig: { format: '{worktree_name}', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'worktree-branch', label: { ko: '워크트리 브랜치', en: 'Worktree Branch' }, type: 'worktree-branch', group: 'workspace',
    defaultConfig: { format: '{worktree_branch}', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'worktree-original-branch', label: { ko: '원본 브랜치', en: 'Original Branch' }, type: 'worktree-original-branch', group: 'workspace',
    defaultConfig: { format: '{original_branch}', style: 'dim' },
    configSchema: baseSchema,
  },

  // ── Cloud / Infra (custom-command wrappers) ──────────────────
  {
    id: 'docker', label: { ko: 'Docker 컨텍스트', en: 'Docker Context' }, type: 'custom-command', group: 'infra',
    defaultConfig: { format: 'docker context show', style: 'blue' },
    configSchema: baseSchema,
  },
  {
    id: 'k8s', label: { ko: 'Kubernetes 컨텍스트', en: 'K8s Context' }, type: 'custom-command', group: 'infra',
    defaultConfig: { format: 'kubectl config current-context', style: 'cyan' },
    configSchema: baseSchema,
  },
  {
    id: 'cloud', label: { ko: '클라우드 리전', en: 'Cloud Region' }, type: 'custom-command', group: 'infra',
    defaultConfig: { format: 'aws configure get region', style: 'orange' },
    configSchema: baseSchema,
  },
  {
    id: 'terraform', label: { ko: 'Terraform 워크스페이스', en: 'Terraform Workspace' }, type: 'custom-command', group: 'infra',
    defaultConfig: { format: 'terraform workspace show', style: 'magenta' },
    configSchema: baseSchema,
  },

  // ── Runtime / Environment ────────────────────────────────────
  {
    id: 'runtime', label: { ko: 'Node.js 버전', en: 'Node.js Version' }, type: 'custom-command', group: 'runtime',
    defaultConfig: { format: 'node --version', style: 'green' },
    configSchema: baseSchema,
  },
  {
    id: 'venv', label: { ko: 'Python 가상환경', en: 'Python Venv' }, type: 'custom-command', group: 'runtime',
    defaultConfig: { format: 'basename $VIRTUAL_ENV', style: 'yellow' },
    configSchema: baseSchema,
  },

  // ── Custom / Separators ──────────────────────────────────────
  {
    id: 'custom-text', label: { ko: '커스텀 텍스트', en: 'Custom Text' }, type: 'custom-text', group: 'separators',
    defaultConfig: { format: '·', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'custom-command', label: { ko: '커스텀 명령', en: 'Custom Command' }, type: 'custom-command', group: 'separators',
    defaultConfig: { format: 'echo hello', style: 'dim' },
    configSchema: baseSchema,
  },
  {
    id: 'separator', label: { ko: '구분자', en: 'Separator' }, type: 'separator', group: 'separators',
    defaultConfig: { format: '|', style: 'dim' },
    configSchema: baseSchema,
  },
];

export const SEGMENT_GROUPS: Record<SegmentDef['group'], { ko: string; en: string }> = {
  claude:     { ko: 'Claude / AI', en: 'Claude / AI' },
  context:    { ko: '컨텍스트 / 토큰', en: 'Context / Tokens' },
  cost:       { ko: '비용 / 시간', en: 'Cost / Time' },
  git:        { ko: 'Git', en: 'Git' },
  workspace:  { ko: '작업공간', en: 'Workspace' },
  infra:      { ko: '클라우드 / 인프라', en: 'Cloud / Infra' },
  runtime:    { ko: '런타임 / 환경', en: 'Runtime / Env' },
  stats:      { ko: '통계', en: 'Stats' },
  separators: { ko: '구분자 / 텍스트', en: 'Separators / Text' },
};

export function styleFromConfig(config: { color?: string; bold?: boolean }): string {
  const parts: string[] = [];
  if (config.color) parts.push(config.color);
  if (config.bold) parts.push('bold');
  return parts.join(' ');
}

export function configFromStyle(style: string): { color: string; bold: boolean } {
  const parts = style.split(/\s+/).filter(Boolean);
  const bold = parts.includes('bold');
  const colorParts = parts.filter(p => p !== 'bold');
  const color = colorParts[0] ?? 'dim';
  return { color, bold };
}
