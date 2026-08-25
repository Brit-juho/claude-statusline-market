import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCenter, pointerWithin, rectIntersection,
  type DragStartEvent, type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext, horizontalListSortingStrategy, arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { SEGMENT_DEFS, SEGMENT_GROUPS } from '../../lib/segment-defs.ts';
import { TerminalPreview } from './TerminalPreview.tsx';
import { SegmentConfig } from './SegmentConfig.tsx';
import type { CanvasSegment, BuilderTranslations } from './types.ts';

const makeId = () => `seg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── Palette drag item ──────────────────────────────────────────
function PaletteItem({ defId, label, onAdd }: { defId: string; label: string; onAdd: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${defId}`,
    data: { origin: 'palette', defId },
  });
  return (
    <div
      ref={setNodeRef}
      class={`palette-item${isDragging ? ' dragging' : ''}`}
      {...listeners}
      {...attributes}
      onClick={onAdd}
      title="클릭해서 추가 / Click to add"
    >
      {label}
    </div>
  );
}

// Compute a human label for a segment (handles text/empty/whitespace clearly)
function segmentLabel(seg: CanvasSegment, lang: 'ko' | 'en'): string {
  const def = SEGMENT_DEFS.find(d => d.id === seg.defId);
  if (def?.type === 'custom-text') {
    const fmt = seg.format ?? '';
    if (fmt === '') return lang === 'ko' ? '[빈 텍스트]' : '[empty]';
    if (fmt.trim() === '') return lang === 'ko' ? `[공백 ${fmt.length}칸]` : `[${fmt.length} spaces]`;
    return `"${fmt}"`;
  }
  return def?.label[lang] ?? seg.defId;
}

// ── Sortable canvas item ───────────────────────────────────────
function CanvasItem({
  seg, isSelected, onClick, onRemove, lang,
}: {
  seg: CanvasSegment;
  isSelected: boolean;
  onClick: (e: MouseEvent) => void;
  onRemove: (e: MouseEvent) => void;
  lang: 'ko' | 'en';
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: seg.instanceId,
    data: { origin: 'canvas' },
  });

  const def = SEGMENT_DEFS.find(d => d.id === seg.defId);
  const isText = def?.type === 'custom-text';
  const displayLabel = segmentLabel(seg, lang);
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      data-instance-id={seg.instanceId}
      class={`canvas-item${isSelected ? ' selected' : ''}${isDragging ? ' dragging' : ''}${isText ? ' text-type' : ''}`}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <span class="canvas-item-label">{displayLabel}</span>
      <button
        class="canvas-item-remove"
        onClick={onRemove}
        aria-label={`${def?.label.ko ?? seg.defId} 제거`}
      >✕</button>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────
interface Props {
  lang: 'ko' | 'en';
  t: BuilderTranslations;
  base: string;
}

export function BuilderApp({ lang, t, base }: Props) {
  const [segments, setSegments] = useState<CanvasSegment[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPaletteDragging, setIsPaletteDragging] = useState(false);
  const [marquee, setMarquee] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [separator, setSeparator] = useState('  ');
  const [mobileTab, setMobileTab] = useState<'palette' | 'canvas' | 'config'>('palette');
  const [copyDone, setCopyDone] = useState(false);

  // Ref for keydown handler to always see current selectedIds
  const selectedIdsRef = useRef(selectedIds);
  selectedIdsRef.current = selectedIds;
  const segmentsRef = useRef(segments);
  segmentsRef.current = segments;

  // Marquee selection refs
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const marqueeRef = useRef<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const marqueeStartRef = useRef<{ x: number; y: number; additive: boolean } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  // Marquee (drag-rectangle) selection
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const start = marqueeStartRef.current;
      const canvas = canvasRef.current;
      if (!start || !canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
      const dx = Math.abs(x - start.x);
      const dy = Math.abs(y - start.y);
      // Only show marquee after a small movement, to distinguish from clicks
      if (!marqueeRef.current && dx < 4 && dy < 4) return;
      const m = { x1: start.x, y1: start.y, x2: x, y2: y };
      marqueeRef.current = m;
      setMarquee(m);
    };
    const onUp = () => {
      const start = marqueeStartRef.current;
      const m = marqueeRef.current;
      const canvas = canvasRef.current;
      if (!start) return;

      if (m && canvas) {
        const left = Math.min(m.x1, m.x2);
        const right = Math.max(m.x1, m.x2);
        const top = Math.min(m.y1, m.y2);
        const bottom = Math.max(m.y1, m.y2);
        const canvasRect = canvas.getBoundingClientRect();
        const ids: string[] = [];
        canvas.querySelectorAll<HTMLElement>('[data-instance-id]').forEach(el => {
          const r = el.getBoundingClientRect();
          const il = r.left - canvasRect.left;
          const it = r.top - canvasRect.top;
          const ir = r.right - canvasRect.left;
          const ib = r.bottom - canvasRect.top;
          // AABB intersection
          if (ir >= left && il <= right && ib >= top && it <= bottom) {
            const id = el.getAttribute('data-instance-id');
            if (id) ids.push(id);
          }
        });
        if (start.additive) {
          setSelectedIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => next.add(id));
            return next;
          });
        } else {
          setSelectedIds(new Set(ids));
        }
      } else if (!start.additive) {
        // Plain click on empty canvas → deselect all
        setSelectedIds(new Set());
      }

      marqueeStartRef.current = null;
      marqueeRef.current = null;
      setMarquee(null);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  const onCanvasMouseDown = useCallback((e: MouseEvent) => {
    // Only start marquee when pressing on the canvas-area itself (not on items / hint overlay)
    if (e.target !== e.currentTarget) return;
    if (e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    marqueeStartRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      additive: e.metaKey || e.ctrlKey || e.shiftKey,
    };
  }, []);

  // Delete/Backspace key → remove selected items
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const ids = selectedIdsRef.current;
      if (ids.size === 0) return;
      e.preventDefault();
      setSegments(prev => prev.filter(s => !ids.has(s.instanceId)));
      setSelectedIds(new Set());
      setLastSelectedId(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Multi-strategy collision detection — robust even when sources/targets are far apart
  const collisionDetection = useCallback((args: Parameters<typeof closestCenter>[0]) => {
    const isPalette = args.active.data.current?.origin === 'palette';
    if (isPalette) {
      const within = pointerWithin(args);
      if (within.length > 0) return within;
      const rect = rectIntersection(args);
      if (rect.length > 0) return rect;
    }
    return closestCenter(args);
  }, []);

  const handleDragStart = useCallback((e: DragStartEvent) => {
    setActiveId(String(e.active.id));
    setIsPaletteDragging(e.active.data.current?.origin === 'palette');
  }, []);

  const handleDragOver = useCallback(({ over }: { over: any }) => {
    setIsDragOver(over !== null);
  }, []);

  const handleDragEnd = useCallback((e: DragEndEvent) => {
    setActiveId(null);
    setIsDragOver(false);
    setIsPaletteDragging(false);
    const { active, over } = e;
    const origin = active.data.current?.origin;

    if (origin === 'palette') {
      const defId = active.data.current?.defId as string;
      const def = SEGMENT_DEFS.find(d => d.id === defId);
      if (!def) return;
      const newSeg: CanvasSegment = {
        instanceId: makeId(),
        defId,
        format: def.defaultConfig.format,
        color: def.defaultConfig.style.split(' ').find(p => p !== 'bold') ?? 'dim',
        bold: def.defaultConfig.style.includes('bold'),
      };
      setSegments(prev => {
        // Fallback: even if `over` is null, append to canvas (user clearly intended to add)
        if (!over || over.id === 'canvas-drop-zone') return [...prev, newSeg];
        const idx = prev.findIndex(s => s.instanceId === String(over.id));
        if (idx === -1) return [...prev, newSeg];
        const next = [...prev];
        next.splice(idx, 0, newSeg);
        return next;
      });
    } else if (origin === 'canvas' && over) {
      if (active.id !== over.id) {
        setSegments(prev => {
          const from = prev.findIndex(s => s.instanceId === String(active.id));
          const to = prev.findIndex(s => s.instanceId === String(over.id));
          return from !== -1 && to !== -1 ? arrayMove(prev, from, to) : prev;
        });
      }
    }
  }, []);

  // Click: single / Ctrl+Click: toggle / Shift+Click: range
  const handleItemClick = useCallback((instanceId: string, e: MouseEvent) => {
    e.stopPropagation();
    if (e.metaKey || e.ctrlKey) {
      setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(instanceId)) next.delete(instanceId);
        else next.add(instanceId);
        return next;
      });
    } else if (e.shiftKey && lastSelectedId) {
      const ids = segmentsRef.current.map(s => s.instanceId);
      const a = ids.indexOf(lastSelectedId);
      const b = ids.indexOf(instanceId);
      if (a !== -1) {
        const [lo, hi] = [Math.min(a, b), Math.max(a, b)];
        setSelectedIds(new Set(ids.slice(lo, hi + 1)));
      } else {
        setSelectedIds(new Set([instanceId]));
      }
    } else {
      setSelectedIds(new Set([instanceId]));
    }
    setLastSelectedId(instanceId);
  }, [lastSelectedId]);

  const handleRemove = useCallback((instanceId: string) => {
    setSegments(prev => prev.filter(s => s.instanceId !== instanceId));
    setSelectedIds(prev => { const n = new Set(prev); n.delete(instanceId); return n; });
    setLastSelectedId(prev => (prev === instanceId ? null : prev));
  }, []);

  const handleBulkRemove = useCallback(() => {
    const ids = selectedIdsRef.current;
    setSegments(prev => prev.filter(s => !ids.has(s.instanceId)));
    setSelectedIds(new Set());
    setLastSelectedId(null);
  }, []);

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(segmentsRef.current.map(s => s.instanceId)));
  }, []);

  const handleUpdate = useCallback((updated: CanvasSegment) => {
    setSegments(prev => prev.map(s => s.instanceId === updated.instanceId ? updated : s));
  }, []);

  // Config panel: only shows when exactly 1 item selected
  const selectedSegment = selectedIds.size === 1
    ? segments.find(s => s.instanceId === [...selectedIds][0]) ?? null
    : null;

  const downloadJson = useCallback(() => {
    const items = segments.map((s, i) => {
      const def = SEGMENT_DEFS.find(d => d.id === s.defId);
      const item: Record<string, unknown> = {
        id: String(i + 1),
        type: def?.type ?? s.defId,
        color: s.color ?? 'dim',
      };
      if (s.bold) item.bold = true;
      // custom-text / custom-command hold their actual payload in `format`
      // (edited via the config panel) — without this, the widget exports
      // with no text/command at all, silently diverging from the preview.
      if (def?.type === 'custom-text') item.rawValue = s.format;
      if (def?.type === 'custom-command') item.commandPath = s.format;
      return item;
    });
    // ccstatusline's real global-separator mechanism is a top-level
    // `defaultSeparator` string on the settings object (not a per-widget
    // item) — matches what the "전역 구분자" field already shows in preview.
    const data: Record<string, unknown> = { version: 3, lines: [items] };
    if (separator) data.defaultSeparator = separator;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ccstatusline-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [segments, separator]);

  const copyInstall = useCallback(async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText('npx -y ccstatusline@latest');
    setCopyDone(true);
    setTimeout(() => setCopyDone(false), 2000);
  }, []);

  const { setNodeRef: setDropRef } = useDroppable({ id: 'canvas-drop-zone' });
  const setCanvasRef = useCallback((node: HTMLDivElement | null) => {
    setDropRef(node);
    canvasRef.current = node;
  }, [setDropRef]);

  const groupedDefs = Object.entries(SEGMENT_GROUPS).map(([groupKey, groupLabel]) => ({
    key: groupKey,
    label: groupLabel[lang],
    defs: SEGMENT_DEFS.filter(d => d.group === groupKey),
  })).filter(g => g.defs.length > 0);

  const addSegment = useCallback((def: typeof SEGMENT_DEFS[0]) => {
    const newSeg: CanvasSegment = {
      instanceId: makeId(),
      defId: def.id,
      format: def.defaultConfig.format,
      color: def.defaultConfig.style.split(' ').find(p => p !== 'bold') ?? 'dim',
      bold: def.defaultConfig.style.includes('bold'),
    };
    setSegments(prev => [...prev, newSeg]);
  }, []);

  // Drag overlay label: handle palette vs canvas drags separately
  let overlayLabel: string | null = null;
  if (activeId) {
    if (activeId.startsWith('palette-')) {
      const defId = activeId.slice(8);
      const def = SEGMENT_DEFS.find(d => d.id === defId);
      overlayLabel = def?.label[lang] ?? defId;
    } else {
      const seg = segments.find(s => s.instanceId === activeId);
      overlayLabel = seg ? segmentLabel(seg, lang) : activeId;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div class="builder-layout">
        {/* Mobile tabs */}
        <div class="mobile-tabs-bar">
          <div class="mobile-tabs" role="tablist">
            {(['palette', 'canvas', 'config'] as const).map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={mobileTab === tab}
                class={`mobile-tab${mobileTab === tab ? ' active' : ''}`}
                onClick={() => setMobileTab(tab)}
              >
                {tab === 'palette' ? t.tab_palette : tab === 'canvas' ? t.tab_canvas : t.tab_config}
              </button>
            ))}
          </div>
        </div>

        {/* Palette panel */}
        <div class={`panel palette-panel${mobileTab !== 'palette' ? ' mobile-hidden' : ''}`}>
          <h2 class="panel-title">{t.palette_title}</h2>
          <div class="palette-scroll">
            {groupedDefs.map(group => (
              <div key={group.key} class="palette-group">
                <div class="palette-group-label">{group.label}</div>
                {group.defs.map(def => (
                  <PaletteItem
                    key={def.id}
                    defId={def.id}
                    label={def.label[lang]}
                    onAdd={() => addSegment(def)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Canvas panel */}
        <div class={`panel canvas-panel${mobileTab !== 'canvas' ? ' mobile-hidden' : ''}`}>
          <div class="canvas-header">
            <h2 class="panel-title" style="margin-bottom:0">{t.canvas_title}</h2>
            <div class="separator-row">
              <span class="sep-label">전역 구분자</span>
              <input
                class="sep-input"
                type="text"
                value={separator}
                onInput={e => setSeparator((e.target as HTMLInputElement).value)}
                title="모든 세그먼트 사이에 자동 삽입되는 전역 구분자"
              />
            </div>
          </div>

          {/* Toolbar */}
          {segments.length > 0 && (
            <div class="canvas-toolbar">
              <span class="toolbar-count">
                {selectedIds.size > 0
                  ? `${selectedIds.size} / ${segments.length}개 선택`
                  : `${segments.length}개`}
              </span>
              <div class="toolbar-actions">
                {selectedIds.size === 0 ? (
                  <button class="toolbar-btn" onClick={handleSelectAll}>전체 선택</button>
                ) : (
                  <>
                    <button class="toolbar-btn" onClick={() => setSelectedIds(new Set())}>
                      선택 해제
                    </button>
                    <button class="toolbar-btn danger" onClick={handleBulkRemove}>
                      {selectedIds.size}개 제거
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          <SortableContext items={segments.map(s => s.instanceId)} strategy={horizontalListSortingStrategy}>
            <div
              ref={setCanvasRef}
              class={`canvas-area${segments.length === 0 ? ' empty' : ''}${isPaletteDragging ? ' drag-active' : ''}${isDragOver && isPaletteDragging ? ' drag-over' : ''}${marquee ? ' marquee-active' : ''}`}
              id="canvas-drop-zone"
              onMouseDown={onCanvasMouseDown}
            >
              {isPaletteDragging && (
                <div class="canvas-drop-hint">↓ 여기에 놓으세요 ↓</div>
              )}
              {segments.length === 0 && !isPaletteDragging ? (
                <p class="canvas-empty-text">{t.canvas_empty}</p>
              ) : (
                segments.map(seg => (
                  <CanvasItem
                    key={seg.instanceId}
                    seg={seg}
                    lang={lang}
                    isSelected={selectedIds.has(seg.instanceId)}
                    onClick={e => handleItemClick(seg.instanceId, e)}
                    onRemove={e => { e.stopPropagation(); handleRemove(seg.instanceId); }}
                  />
                ))
              )}
              {marquee && (
                <div
                  class="marquee-rect"
                  style={{
                    left: `${Math.min(marquee.x1, marquee.x2)}px`,
                    top: `${Math.min(marquee.y1, marquee.y2)}px`,
                    width: `${Math.abs(marquee.x2 - marquee.x1)}px`,
                    height: `${Math.abs(marquee.y2 - marquee.y1)}px`,
                  }}
                />
              )}
            </div>
          </SortableContext>

          {segments.length > 0 && (
            <p class="canvas-hint">
              빈 공간 드래그: 사각형 선택 · Ctrl+클릭: 토글 · Shift+클릭: 범위 · Delete: 제거
            </p>
          )}
        </div>

        {/* Config panel */}
        <div class={`panel config-panel-wrap${mobileTab !== 'config' ? ' mobile-hidden' : ''}`}>
          <h2 class="panel-title">{t.config_title}</h2>
          {selectedIds.size > 1 ? (
            <div class="config-empty">
              <p>{selectedIds.size}개 선택됨<br />단일 항목을 클릭하여 설정</p>
            </div>
          ) : (
            <SegmentConfig segment={selectedSegment} t={t} onUpdate={handleUpdate} />
          )}
        </div>
      </div>

      {/* Preview */}
      <TerminalPreview
        segments={segments}
        separator={separator}
        previewNote={t.preview_note}
        previewError={t.preview_error}
      />

      {/* Action bar */}
      <div class="action-bar">
        <button
          class="btn btn-primary"
          onClick={downloadJson}
          disabled={segments.length === 0}
        >
          {t.download}
        </button>
        <button class="btn btn-ghost" onClick={copyInstall}>
          {copyDone ? t.copy_install_done : t.copy_install}
        </button>
        <div role="status" aria-live="polite" class="sr-only">
          {copyDone ? t.copy_install_done : ''}
        </div>
      </div>

      {segments.length > 0 && (
        <div class="apply-guide">
          <h3 class="apply-title">{t.apply_title}</h3>
          <p class="apply-step">{t.apply_step1}</p>
          <code class="apply-code">mv ~/Downloads/ccstatusline-settings.json ~/.config/ccstatusline/settings.json</code>
          <p class="apply-step" style="margin-top:0.75rem">{t.apply_step2}</p>
          <code class="apply-code">npx -y ccstatusline@latest</code>
        </div>
      )}

      <DragOverlay>
        {overlayLabel ? (
          <div class="drag-overlay-item">{overlayLabel}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
