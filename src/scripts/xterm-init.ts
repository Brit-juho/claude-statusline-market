import { Terminal } from 'xterm';

const ANSI = { reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m' };
const ANSI_NAMED: Record<string, string> = {
  green: '\x1b[32m', accent: '\x1b[32m', cyan: '\x1b[36m', blue: '\x1b[34m',
  yellow: '\x1b[33m', orange: '\x1b[38;5;173m', red: '\x1b[31m',
  magenta: '\x1b[35m', pink: '\x1b[38;5;213m', white: '\x1b[37m', dim: '\x1b[2m',
};

function hexToAnsi(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
}

function styleToAnsi(style: string | undefined): string {
  if (!style) return '';
  return style.split(/\s+/).map(p => {
    if (p === 'bold') return ANSI.bold;
    if (p === 'dim') return ANSI.dim;
    if (/^#[0-9a-fA-F]{6}$/.test(p)) return hexToAnsi(p);
    return ANSI_NAMED[p] ?? '';
  }).join('');
}

interface SegmentPreview { text: string; style?: string; when?: string; }

let term: Terminal | null = null;

function writeXterm(segments: SegmentPreview[] | null, separator: string) {
  if (!term) return;
  term.reset();
  term.write('\x1b[90m~/GitHub/my-project\x1b[0m \x1b[2m$\x1b[0m claude\r\n');
  term.write('\x1b[2m▶ Analyzing recent changes...\x1b[0m\r\n');
  term.write('\r\n');
  term.write('\x1b[2m  3 files changed, 156 insertions(+), 23 deletions(-)\x1b[0m\r\n');
  term.write('\r\n');
  term.write('\x1b[2m' + '─'.repeat(90) + '\x1b[0m\r\n');

  if (!segments?.length) {
    term.write('\x1b[2m(세그먼트를 추가하면 여기 표시됩니다)\x1b[0m');
    return;
  }

  // 상시 세그먼트와 조건부 세그먼트를 구분하여 표시
  const alwaysSegs = segments.filter(s => !s.when || s.when === 'always');
  const conditionalSegs = segments.filter(s => s.when && s.when !== 'always');

  const line = segments.map((s, i) => {
    const sep = i > 0 ? '\x1b[2m' + (separator || '  ') + '\x1b[0m' : '';
    const ansi = styleToAnsi(s.style);
    // 조건부 세그먼트는 약간 어둡게 표시
    const dim = (s.when && s.when !== 'always') ? '\x1b[2m' : '';
    return sep + dim + ansi + s.text + ANSI.reset;
  }).join('');

  term.write(line);

  // 조건부 세그먼트 힌트
  if (conditionalSegs.length > 0) {
    term.write('\r\n');
    term.write('\x1b[2m  (흐린 세그먼트는 조건부 — 조건 충족 시 밝게 표시됩니다)\x1b[0m');
  }
}

function initXterm() {
  const container = document.getElementById('xterm-container');
  if (!container) return;
  term = new Terminal({
    theme: {
      background: '#080808', foreground: '#555', cursor: '#00d97e',
      green: '#00d97e', cyan: '#22d3ee', blue: '#60a5fa',
      yellow: '#fbbf24', red: '#f87171', magenta: '#c084fc', white: '#d0d0d0',
    },
    fontFamily: "'Geist Mono','Cascadia Code','Fira Code','SF Mono',monospace",
    fontSize: 13, lineHeight: 1.4, rows: 10, cols: 92,
    disableStdin: true, cursorBlink: false, scrollback: 0,
  });
  term.open(container);
  writeXterm(null, '  ');
}

window.addEventListener('xterm:update', (e: Event) => {
  const ev = e as CustomEvent<{ segments: SegmentPreview[]; separator: string }>;
  writeXterm(ev.detail.segments, ev.detail.separator);
});

// DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initXterm, 100));
} else {
  setTimeout(initXterm, 100);
}
