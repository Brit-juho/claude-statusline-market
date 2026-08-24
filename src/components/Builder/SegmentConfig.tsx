import type { CanvasSegment, BuilderTranslations } from './types.ts';
import { SEGMENT_DEFS } from '../../lib/segment-defs.ts';

const COLORS = ['accent', 'green', 'cyan', 'blue', 'yellow', 'orange', 'red', 'magenta', 'pink', 'white', 'gray', 'dim'];

const COLOR_HEX: Record<string, string> = {
  accent:'#00d97e', green:'#00d97e', cyan:'#22d3ee', blue:'#60a5fa',
  yellow:'#fbbf24', orange:'#fb923c', red:'#f87171', magenta:'#c084fc',
  pink:'#f472b6', white:'#d0d0d0', gray:'#6b7280', dim:'#4b5563',
};

interface Props {
  segment: CanvasSegment | null;
  t: BuilderTranslations;
  onUpdate: (updated: CanvasSegment) => void;
}

export function SegmentConfig({ segment, t, onUpdate }: Props) {
  if (!segment) {
    return (
      <div class="config-empty">
        <p>{t.config_empty}</p>
      </div>
    );
  }

  const def = SEGMENT_DEFS.find(d => d.id === segment.defId);
  const isText = def?.type === 'text';

  return (
    <div class="config-panel">
      <h3 class="config-title">{def?.label.ko ?? segment.defId}</h3>

      <div class="config-field">
        <label class="config-label">형식 / Format</label>
        <input
          type="text"
          class="config-input"
          value={segment.format}
          onInput={e => onUpdate({ ...segment, format: (e.target as HTMLInputElement).value })}
        />
      </div>

      <div class="config-field">
        <label class="config-label">색상 / Color</label>
        <div class="color-grid">
          {COLORS.map(c => (
            <button
              key={c}
              class={`color-swatch${segment.color === c ? ' active' : ''}`}
              style={{ background: COLOR_HEX[c] ?? '#555', outline: segment.color === c ? '2px solid #fff' : 'none' }}
              title={c}
              onClick={() => onUpdate({ ...segment, color: c })}
              aria-label={c}
              aria-pressed={segment.color === c}
            />
          ))}
        </div>
      </div>

      <div class="config-field">
        <label class="config-label config-toggle-row">
          <span>굵게 / Bold</span>
          <button
            class={`toggle${segment.bold ? ' active' : ''}`}
            role="switch"
            aria-checked={segment.bold}
            onClick={() => onUpdate({ ...segment, bold: !segment.bold })}
          >
            {segment.bold ? 'ON' : 'OFF'}
          </button>
        </label>
      </div>

      {def && !isText && (
        <p class="config-hint">
          {def.label.en} — 형식 변수 예: <code>{def.defaultConfig.format}</code>
        </p>
      )}
      {isText && (
        <p class="config-hint">구분자 텍스트 — 위 입력란에 원하는 문자를 입력하세요</p>
      )}
    </div>
  );
}
