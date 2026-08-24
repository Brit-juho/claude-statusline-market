import { useMemo } from 'preact/hooks';
import { renderSegmentsWithStyle } from '../../lib/preview.ts';
import type { CanvasSegment } from './types.ts';

interface Props {
  segments: CanvasSegment[];
  separator: string;
  previewNote: string;
  previewError: string;
}

export function TerminalPreview({ segments, separator, previewNote, previewError }: Props) {
  const rendered = useMemo(() => {
    try {
      const defs = segments.map(s => ({
        type: s.defId,
        format: s.format,
        style: [s.color !== 'dim' ? s.color : 'dim', s.bold ? 'bold' : ''].filter(Boolean).join(' '),
        enabled: true,
      }));
      return renderSegmentsWithStyle(defs);
    } catch {
      return null;
    }
  }, [segments]);

  return (
    <div class="preview-wrap">
      <div class="mock-terminal">
        <div class="mock-bar">
          <span class="dot r" /><span class="dot y" /><span class="dot g" />
          <span class="mock-title">bash — ~/GitHub/my-project</span>
        </div>
        <div class="mock-content">
          <div class="mock-line"><span class="prompt">~/GitHub/my-project</span> <span class="dimtext">$</span> claude</div>
          <div class="mock-line dimtext">▶ Reviewing recent changes...</div>
          <div class="mock-line">&nbsp;</div>
        </div>
        <div class="mock-statusline">
          {rendered === null ? (
            <span class="preview-error">{previewError}</span>
          ) : segments.length === 0 ? (
            <span class="preview-empty">—</span>
          ) : (
            rendered.map((seg, i) => (
              <>
                {i > 0 && <span class="separator">{separator}</span>}
                <span key={i} style={seg.cssStyle}>{seg.text}</span>
              </>
            ))
          )}
        </div>
      </div>
      <p class="preview-note">{previewNote}</p>
    </div>
  );
}
