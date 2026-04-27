export type SegmentCondition =
  | 'always'    // 항상 표시
  | 'git'       // git 저장소 안에 있을 때
  | 'worktree'  // --worktree 세션
  | 'agent'     // --agent 플래그 사용 시
  | 'vim'       // vim 모드 활성화 시
  | 'pro'       // Pro/Max 구독자 (rate_limits 존재)
  | 'named'     // 세션에 커스텀 이름 있을 때
  | 'effort'    // 모델이 effort 지원 시
  | 'thinking'  // 확장 사고 활성화 시
  | 'docker'    // Docker 실행 중
  | 'tmux'      // tmux 세션 안
  | 'cloud'     // AWS/K8s/GCP 환경변수 있을 때
  | 'update';   // 새 버전 사용 가능 시

export interface SegmentDef {
  type: string;
  label: { ko: string; en: string };
  defaultFmt: string;
  defaultStyle: string;
  when: SegmentCondition;
}

export interface SegmentGroup {
  group: string;
  segments: SegmentDef[];
}

export const WHEN_LABELS: Record<SegmentCondition, { ko: string; en: string }> = {
  always:   { ko: '상시',          en: 'always' },
  git:      { ko: 'git 저장소',    en: 'in git repo' },
  worktree: { ko: 'worktree 세션', en: 'worktree session' },
  agent:    { ko: 'agent 플래그',  en: '--agent flag' },
  vim:      { ko: 'vim 모드',      en: 'vim mode on' },
  pro:      { ko: 'Pro/Max 구독',  en: 'Pro/Max plan' },
  named:    { ko: '세션 이름 설정',en: 'named session' },
  effort:   { ko: 'effort 지원',   en: 'effort supported' },
  thinking: { ko: '확장 사고 활성',en: 'thinking enabled' },
  docker:   { ko: 'Docker 실행 중',en: 'docker running' },
  tmux:     { ko: 'tmux 세션',     en: 'in tmux' },
  cloud:    { ko: '클라우드 환경', en: 'cloud env' },
  update:   { ko: '업데이트 가능', en: 'update available' },
};

// 조건별 bash 스크립트 가드 코드 (설치 스크립트 생성용)
export const WHEN_BASH_GUARD: Record<SegmentCondition, string> = {
  always:   '',
  git:      'git rev-parse --git-dir > /dev/null 2>&1 &&',
  worktree: '[ -n "$(echo "$input" | jq -r ".worktree.name // empty")" ] &&',
  agent:    '[ -n "$(echo "$input" | jq -r ".agent.name // empty")" ] &&',
  vim:      '[ -n "$(echo "$input" | jq -r ".vim.mode // empty")" ] &&',
  pro:      '[ -n "$(echo "$input" | jq -r ".rate_limits // empty")" ] &&',
  named:    '[ -n "$(echo "$input" | jq -r ".session_name // empty")" ] &&',
  effort:   '[ -n "$(echo "$input" | jq -r ".effort.level // empty")" ] &&',
  thinking: '[ "$(echo "$input" | jq -r ".thinking.enabled // false")" = "true" ] &&',
  docker:   'command -v docker > /dev/null 2>&1 && [ "$(docker ps -q 2>/dev/null | wc -l)" -gt 0 ] &&',
  tmux:     '[ -n "$TMUX" ] &&',
  cloud:    '[ -n "${AWS_PROFILE:-}${KUBECONFIG:-}${GOOGLE_CLOUD_PROJECT:-}" ] &&',
  update:   '[ -f /tmp/claude-code-update ] && [ -n "$(cat /tmp/claude-code-update 2>/dev/null)" ] &&',
};

export function makeSegmentGroups(lang: 'ko' | 'en'): SegmentGroup[] {
  const g = (ko: string, en: string) => (lang === 'ko' ? ko : en);
  return [
    // ── 1. 모델 / 세션 ──────────────────────────────────────
    { group: g('모델 / 세션', 'Model / Session'), segments: [
      { type:'model',         label:{ko:'모델명',         en:'Model'},           defaultFmt:'◆ {model}',                 defaultStyle:'#22d3ee bold', when:'always' },
      { type:'version',       label:{ko:'CC 버전',        en:'CC Version'},      defaultFmt:'v{version}',                 defaultStyle:'#4b5563',      when:'always' },
      { type:'session_id',    label:{ko:'세션 ID',        en:'Session ID'},      defaultFmt:'#{session_id}',              defaultStyle:'#4b5563',      when:'always' },
      { type:'session_name',  label:{ko:'세션명',         en:'Session Name'},    defaultFmt:'▪ {session_name}',          defaultStyle:'#d0d0d0',      when:'named' },
      { type:'effort',        label:{ko:'추론 수준',      en:'Effort'},          defaultFmt:'● {effort_level}',          defaultStyle:'#c084fc',      when:'effort' },
      { type:'thinking',      label:{ko:'확장 사고',      en:'Thinking'},        defaultFmt:'🧠 on',                     defaultStyle:'#c084fc',      when:'thinking' },
      { type:'output_style',  label:{ko:'출력 스타일',    en:'Output Style'},    defaultFmt:'style:{output_style}',      defaultStyle:'#4b5563',      when:'always' },
      { type:'agent',         label:{ko:'에이전트',       en:'Agent'},           defaultFmt:'◈ {agent_name}',            defaultStyle:'#f472b6 bold', when:'agent' },
      { type:'sub_agents',    label:{ko:'서브에이전트 수',en:'Sub-agents'},      defaultFmt:'agents:{sub_agents}',       defaultStyle:'#f472b6',      when:'agent' },
    ]},
    // ── 2. 작업 공간 ────────────────────────────────────────
    { group: g('작업 공간', 'Workspace'), segments: [
      { type:'cwd',           label:{ko:'현재 디렉터리',  en:'Current Dir'},     defaultFmt:'{dir_name}',                 defaultStyle:'#60a5fa',      when:'always' },
      { type:'cwd_full',      label:{ko:'전체 경로',      en:'Full Path'},       defaultFmt:'{cwd}',                      defaultStyle:'#4b5563',      when:'always' },
      { type:'project_dir',   label:{ko:'프로젝트 원점',  en:'Project Root'},    defaultFmt:'root:{project_dir}',         defaultStyle:'#4b5563',      when:'always' },
      { type:'worktree',      label:{ko:'Worktree 이름',  en:'Worktree'},        defaultFmt:'wt:{worktree_name}',         defaultStyle:'#22d3ee',      when:'worktree' },
      { type:'worktree_br',   label:{ko:'Worktree 브랜치',en:'Worktree Branch'}, defaultFmt:'⎇ {worktree_branch}',       defaultStyle:'#00d97e',      when:'worktree' },
    ]},
    // ── 3. Git 기본 ─────────────────────────────────────────
    { group: g('Git 기본', 'Git Basic'), segments: [
      { type:'git_branch',    label:{ko:'브랜치',         en:'Branch'},          defaultFmt:'⎇ {branch}',                defaultStyle:'#00d97e',      when:'git' },
      { type:'git_changes',   label:{ko:'변경 파일 수',   en:'Changed Files'},   defaultFmt:'~{changed}',                 defaultStyle:'#fbbf24',      when:'git' },
      { type:'git_ahead',     label:{ko:'앞선 커밋',      en:'Ahead/Behind'},    defaultFmt:'↑{ahead} ↓{behind}',        defaultStyle:'#22d3ee',      when:'git' },
      { type:'lines_changed', label:{ko:'코드 변경량',    en:'Lines Delta'},     defaultFmt:'+{total_lines_added} -{total_lines_removed}', defaultStyle:'#22d3ee', when:'always' },
    ]},
    // ── 4. Git 고급 ─────────────────────────────────────────
    { group: g('Git 고급', 'Git Advanced'), segments: [
      { type:'git_stash',     label:{ko:'스태시 수',      en:'Stash Count'},     defaultFmt:'stash:{git_stash_count}',   defaultStyle:'#fb923c',      when:'git' },
      { type:'git_last_msg',  label:{ko:'마지막 커밋',    en:'Last Commit'},     defaultFmt:'"{git_last_commit}"',       defaultStyle:'#4b5563',      when:'git' },
      { type:'git_commit_age',label:{ko:'커밋 경과 시간', en:'Commit Age'},      defaultFmt:'committed {git_commit_age}',defaultStyle:'#4b5563',      when:'git' },
      { type:'pr_status',     label:{ko:'PR 상태',        en:'PR Status'},       defaultFmt:'PR #{pr_number}',           defaultStyle:'#60a5fa',      when:'git' },
      { type:'ci_status',     label:{ko:'CI 상태',        en:'CI Status'},       defaultFmt:'CI:{ci_status}',            defaultStyle:'#00d97e',      when:'git' },
    ]},
    // ── 5. 컨텍스트 창 ──────────────────────────────────────
    { group: g('컨텍스트 창', 'Context Window'), segments: [
      { type:'context_pct',   label:{ko:'사용 %',         en:'Used %'},          defaultFmt:'{used_percentage}%',         defaultStyle:'#fbbf24',      when:'always' },
      { type:'context_rem',   label:{ko:'남은 %',         en:'Remaining %'},     defaultFmt:'{remaining_percentage}% left',defaultStyle:'#00d97e',     when:'always' },
      { type:'context_bar',   label:{ko:'컨텍스트 바',    en:'Ctx Bar'},         defaultFmt:'[{used_percentage}%]',      defaultStyle:'#00d97e',      when:'always' },
      { type:'exceeds_200k',  label:{ko:'200k 초과 경고', en:'200k Warning'},    defaultFmt:'⚠ 200k+',                  defaultStyle:'#f87171 bold', when:'always' },
      { type:'tokens_in_out', label:{ko:'입출력 토큰',    en:'In/Out Tokens'},   defaultFmt:'↑{total_input_tokens} ↓{total_output_tokens}', defaultStyle:'#4b5563', when:'always' },
      { type:'cache_tokens',  label:{ko:'캐시 절감',      en:'Cache Savings'},   defaultFmt:'⚡{cache_saved_tokens}',    defaultStyle:'#22d3ee',      when:'always' },
      { type:'cache_rate',    label:{ko:'캐시 히트율',    en:'Cache Hit Rate'},  defaultFmt:'C:{cache_hit_rate:.0f}%',  defaultStyle:'#22d3ee',      when:'always' },
    ]},
    // ── 6. 비용 / 시간 ──────────────────────────────────────
    { group: g('비용 / 시간', 'Cost / Time'), segments: [
      { type:'cost',          label:{ko:'세션 비용',       en:'Session Cost'},   defaultFmt:'${total_cost_usd:.4f}',     defaultStyle:'#fbbf24',      when:'always' },
      { type:'today_cost',    label:{ko:'오늘 누적 비용',  en:'Today Cost'},     defaultFmt:'today:${today_cost:.2f}',   defaultStyle:'#fb923c',      when:'always' },
      { type:'duration',      label:{ko:'세션 시간',       en:'Duration'},       defaultFmt:'◷ {duration}',              defaultStyle:'#22d3ee',      when:'always' },
      { type:'api_time',      label:{ko:'API 응답 시간',   en:'API Time'},       defaultFmt:'api:{api_duration_s:.1f}s', defaultStyle:'#4b5563',      when:'always' },
    ]},
    // ── 7. 사용 한도 ────────────────────────────────────────
    { group: g('사용 한도', 'Rate Limits'), segments: [
      { type:'rate_5h',       label:{ko:'5h 한도',         en:'5h Rate'},        defaultFmt:'5h:{rate_limit_5h}%',       defaultStyle:'#fb923c',      when:'pro' },
      { type:'rate_7d',       label:{ko:'7d 한도',         en:'7d Rate'},        defaultFmt:'7d:{rate_limit_7d}%',       defaultStyle:'#f87171',      when:'pro' },
      { type:'vim_mode',      label:{ko:'Vim 모드',         en:'Vim Mode'},       defaultFmt:'[{vim_mode}]',              defaultStyle:'#60a5fa',      when:'vim' },
    ]},
    // ── 8. 런타임 버전 ──────────────────────────────────────
    { group: g('런타임 버전', 'Runtime Versions'), segments: [
      { type:'node_ver',      label:{ko:'Node.js',          en:'Node.js'},        defaultFmt:'node {node_version}',       defaultStyle:'#00d97e bold', when:'always' },
      { type:'python_ver',    label:{ko:'Python',           en:'Python'},         defaultFmt:'py{python_version}',        defaultStyle:'#60a5fa bold', when:'always' },
      { type:'go_ver',        label:{ko:'Go',               en:'Go'},             defaultFmt:'go{go_version}',            defaultStyle:'#22d3ee bold', when:'always' },
      { type:'rust_ver',      label:{ko:'Rust',             en:'Rust'},           defaultFmt:'rs{rust_version}',          defaultStyle:'#fb923c bold', when:'always' },
      { type:'ruby_ver',      label:{ko:'Ruby',             en:'Ruby'},           defaultFmt:'rb{ruby_version}',          defaultStyle:'#f87171 bold', when:'always' },
      { type:'java_ver',      label:{ko:'Java',             en:'Java'},           defaultFmt:'java{java_version}',        defaultStyle:'#fbbf24 bold', when:'always' },
      { type:'go_module',     label:{ko:'Go 모듈명',        en:'Go Module'},      defaultFmt:'mod:{go_module}',           defaultStyle:'#22d3ee',      when:'always' },
    ]},
    // ── 9. 가상환경 / 프레임워크 ────────────────────────────
    { group: g('가상환경 / 프레임워크', 'Venv / Framework'), segments: [
      { type:'venv',          label:{ko:'Python venv',      en:'Python venv'},    defaultFmt:'({venv_name})',              defaultStyle:'#fbbf24',      when:'always' },
      { type:'conda',         label:{ko:'Conda 환경',       en:'Conda Env'},      defaultFmt:'conda:{conda_env}',         defaultStyle:'#fbbf24',      when:'always' },
      { type:'node_env',      label:{ko:'NODE_ENV',         en:'NODE_ENV'},       defaultFmt:'env:{node_env}',            defaultStyle:'#00d97e',      when:'always' },
      { type:'rails_env',     label:{ko:'RAILS_ENV',        en:'RAILS_ENV'},      defaultFmt:'rails:{rails_env}',         defaultStyle:'#f87171',      when:'always' },
      { type:'mix_env',       label:{ko:'MIX_ENV (Elixir)', en:'MIX_ENV'},        defaultFmt:'mix:{mix_env}',             defaultStyle:'#c084fc',      when:'always' },
      { type:'java_profile',  label:{ko:'Spring Profile',   en:'Spring Profile'}, defaultFmt:'spring:{java_profile}',     defaultStyle:'#fbbf24',      when:'always' },
      { type:'db_connected',  label:{ko:'DB 연결 여부',     en:'DB Connected'},   defaultFmt:'DB:connected',              defaultStyle:'#00d97e',      when:'always' },
    ]},
    // ── 10. 클라우드 / 인프라 ────────────────────────────────
    { group: g('클라우드 / 인프라', 'Cloud / Infra'), segments: [
      { type:'docker_ctx',    label:{ko:'Docker 컨텍스트',  en:'Docker Context'}, defaultFmt:'🐳 {docker_context}',      defaultStyle:'#60a5fa',      when:'docker' },
      { type:'docker_running',label:{ko:'실행 중 컨테이너', en:'Containers'},     defaultFmt:'docker:{docker_running}',   defaultStyle:'#60a5fa',      when:'docker' },
      { type:'k8s',           label:{ko:'K8s 컨텍스트',     en:'K8s Context'},    defaultFmt:'☸ {k8s_context}',          defaultStyle:'#22d3ee',      when:'cloud' },
      { type:'k8s_ns',        label:{ko:'K8s 네임스페이스', en:'K8s Namespace'},  defaultFmt:'ns:{k8s_namespace}',       defaultStyle:'#22d3ee',      when:'cloud' },
      { type:'aws',           label:{ko:'AWS 프로파일',      en:'AWS Profile'},    defaultFmt:'AWS:{aws_profile}',        defaultStyle:'#fb923c',      when:'cloud' },
      { type:'aws_region',    label:{ko:'AWS 리전',          en:'AWS Region'},     defaultFmt:'ap:{aws_region}',          defaultStyle:'#fb923c',      when:'cloud' },
      { type:'gcp',           label:{ko:'GCP 프로젝트',      en:'GCP Project'},    defaultFmt:'GCP:{gcp_project}',        defaultStyle:'#60a5fa',      when:'cloud' },
      { type:'terraform',     label:{ko:'TF 워크스페이스',   en:'TF Workspace'},   defaultFmt:'TF:{tf_workspace}',        defaultStyle:'#c084fc',      when:'cloud' },
    ]},
    // ── 11. 시스템 모니터 ────────────────────────────────────
    { group: g('시스템 모니터', 'System Monitor'), segments: [
      { type:'battery',       label:{ko:'배터리',            en:'Battery'},        defaultFmt:'🔋 {battery_pct}%',        defaultStyle:'#00d97e',      when:'always' },
      { type:'memory',        label:{ko:'여유 메모리',       en:'Free Memory'},    defaultFmt:'mem:{memory_free_gb:.1f}GB',defaultStyle:'#22d3ee',      when:'always' },
      { type:'docker_count',  label:{ko:'컨테이너 수',       en:'Container Count'},defaultFmt:'containers:{docker_running}',defaultStyle:'#60a5fa',    when:'docker' },
      { type:'port',          label:{ko:'포트 상태',         en:'Port Status'},    defaultFmt:':{port_3000}',              defaultStyle:'#00d97e',      when:'always' },
      { type:'tmux',          label:{ko:'tmux 세션',         en:'tmux Session'},   defaultFmt:'tmux:{tmux_session}',       defaultStyle:'#c084fc',      when:'tmux' },
    ]},
    // ── 12. 업데이트 알림 ─────────────────────────────────────
    { group: g('업데이트 알림', 'Update Check'), segments: [
      { type:'update_badge',  label:{ko:'업데이트 알림',   en:'Update Available'},defaultFmt:'↑ v{latest_version}',      defaultStyle:'#fbbf24 bold', when:'update' },
      { type:'update_detail', label:{ko:'현재/최신 버전',  en:'Version Compare'}, defaultFmt:'v{version}→{latest_version}',defaultStyle:'#fb923c',     when:'update' },
      { type:'update_minimal',label:{ko:'최신 버전 표시',  en:'Latest Version'},  defaultFmt:'latest:v{latest_version}',  defaultStyle:'#fbbf24',      when:'update' },
      { type:'version_plain', label:{ko:'현재 버전만',     en:'Current Version'}, defaultFmt:'v{version}',                defaultStyle:'#4b5563',      when:'always' },
    ]},
  ];
}

export const ICON_GROUPS = [
  { name: '심볼',    icons: ['◆','▶','▸','●','◉','◎','▪','◇','◈','⊕','⊗','✦','★','✓','✗','≡','∞','◐','◑','◍','◌'] },
  { name: 'Git',     icons: ['⎇','⊞','⊟','∓','±','↑','↓','↕','⟳','⊘','↑↓','⊶','⊷'] },
  { name: '방향',    icons: ['→','←','↑','↓','⇒','⇐','⇑','⇓','⟶','≫','≪','▸','◂','▴','▾','↗','↘','↙','↖'] },
  { name: '시간',    icons: ['◷','⏱','⌚','⏳','⌛','⧗','⧖'] },
  { name: '상태',    icons: ['✓','✗','!','?','◉','○','●','◈','⚡','⚠','⛔','✦','❯','❮'] },
  { name: '구분자',  icons: ['│','┃','╎','╏','┆','┇','┊','┋','╷','╻','╽','|','/',':','-','·','•','…','∎'] },
  { name: '이모지',  icons: ['🌿','💰','⚡','🔖','☸','🐳','🧠','🎯','📁','🔥','💡','🚀','⚙️','🎨','🐍','🦀','🟢','🔋','🧪','🔑','🛡️','🌐','📊','🖥️','☁️'] },
] as const;
