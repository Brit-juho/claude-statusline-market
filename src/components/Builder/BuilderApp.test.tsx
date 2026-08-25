import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/preact';
import { BuilderApp } from './BuilderApp.tsx';
import type { BuilderTranslations } from './types.ts';

// dnd-kit uses requestAnimationFrame internally
vi.stubGlobal('requestAnimationFrame', (cb: () => void) => { cb(); return 0; });
vi.stubGlobal('cancelAnimationFrame', () => {});

const t: BuilderTranslations = {
  palette_title: '세그먼트',
  canvas_title: '현재 구성',
  config_title: '설정',
  canvas_empty: '← 세그먼트를 드래그해 추가하세요',
  config_empty: '세그먼트를 클릭해 설정하세요',
  preview_note: '샘플 값으로 렌더링',
  preview_error: '미리보기 오류',
  download: 'JSON 다운로드',
  copy_install: '설치 명령 복사',
  copy_install_done: '복사됨!',
  apply_title: '이 설정 적용하기',
  apply_step1: 'JSON을 다운로드한 후:',
  apply_step2: 'ccstatusline 미설치 시:',
  back: '갤러리로',
  tab_palette: '세그먼트',
  tab_canvas: '구성',
  tab_config: '설정',
  a11y_drag_start: '{name} 선택됨',
  a11y_drag_over: '{name}, {position}번',
  a11y_drag_end: '{name} 놓음',
  a11y_drag_cancel: '취소됨',
};

const defaultProps = { lang: 'ko' as const, t, base: '/' };

beforeEach(() => cleanup());

describe('BuilderApp — 초기 상태', () => {
  it('팔레트 패널이 렌더링된다', () => {
    render(<BuilderApp {...defaultProps} />);
    // '세그먼트' appears in panel title and mobile tab
    expect(screen.getAllByText('세그먼트').length).toBeGreaterThan(0);
  });

  it('빈 캔버스 안내 메시지가 표시된다', () => {
    render(<BuilderApp {...defaultProps} />);
    expect(screen.getByText('← 세그먼트를 드래그해 추가하세요')).toBeTruthy();
  });

  it('다운로드 버튼이 비활성 상태다', () => {
    render(<BuilderApp {...defaultProps} />);
    const downloadBtn = screen.getByText('JSON 다운로드') as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(true);
  });

  it('팔레트에 모델명 항목이 있다', () => {
    render(<BuilderApp {...defaultProps} />);
    expect(screen.getAllByText('모델명').length).toBeGreaterThan(0);
  });
});

describe('BuilderApp — 세그먼트 추가', () => {
  it('팔레트 항목 클릭 시 캔버스에 추가된다', () => {
    render(<BuilderApp {...defaultProps} />);

    // Find the palette item (has title attribute)
    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명');
    expect(modelItem).toBeTruthy();

    fireEvent.click(modelItem!);

    // Canvas should now show the segment (as a canvas-item-label)
    const canvasLabels = screen.getAllByText('모델명');
    // At least one canvas label (not just palette)
    expect(canvasLabels.length).toBeGreaterThan(1);
  });

  it('같은 세그먼트를 두 번 추가하면 두 개가 생긴다', () => {
    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명')!;

    fireEvent.click(modelItem);
    fireEvent.click(modelItem);

    const canvasLabels = screen.getAllByText('모델명');
    // palette (1) + canvas (2) = 3
    expect(canvasLabels.length).toBe(3);
  });

  it('세그먼트 추가 후 다운로드 버튼이 활성화된다', () => {
    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명')!;
    fireEvent.click(modelItem);

    const downloadBtn = screen.getByText('JSON 다운로드') as HTMLButtonElement;
    expect(downloadBtn.disabled).toBe(false);
  });
});

describe('BuilderApp — 세그먼트 삭제', () => {
  it('✕ 버튼 클릭 시 캔버스에서 제거된다', () => {
    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명')!;
    fireEvent.click(modelItem);

    // Click remove button
    const removeBtn = screen.getByLabelText('모델명 제거');
    fireEvent.click(removeBtn);

    // Canvas should be empty again
    expect(screen.queryByText('← 세그먼트를 드래그해 추가하세요')).toBeTruthy();
  });
});

describe('BuilderApp — 설정 패널', () => {
  it('캔버스 세그먼트 클릭 시 설정 패널이 열린다', () => {
    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명')!;
    fireEvent.click(modelItem);

    // Click the canvas item to select it (second '모델명' = canvas copy)
    const allModelLabels = screen.getAllByText('모델명');
    fireEvent.click(allModelLabels[allModelLabels.length - 1]);

    // Config panel should show the segment name
    expect(screen.getByDisplayValue('◆ {model}')).toBeTruthy();
  });
});

describe('BuilderApp — 영문 모드', () => {
  const enT: BuilderTranslations = {
    ...t,
    palette_title: 'Segments',
    canvas_empty: '← Drag segments from the left',
    config_empty: 'Click a segment to configure',
    download: 'Download JSON',
    tab_palette: 'Segments',
    tab_canvas: 'Canvas',
    tab_config: 'Config',
  };

  it('영어 번역이 적용된다', () => {
    render(<BuilderApp lang="en" t={enT} base="/" />);
    // 'Segments' appears in both panel title and mobile tab - check at least one
    expect(screen.getAllByText('Segments').length).toBeGreaterThan(0);
    expect(screen.getByText('← Drag segments from the left')).toBeTruthy();
  });

  it('영문 팔레트에 Model 항목이 있다', () => {
    render(<BuilderApp lang="en" t={enT} base="/" />);
    // 'Model' appears as palette item label
    expect(screen.getAllByText('Model').length).toBeGreaterThan(0);
  });
});

describe('BuilderApp — JSON 직렬화', () => {
  it('다운로드 클릭 시 Blob URL이 생성된다', () => {
    const createObjectURL = vi.fn(() => 'blob:test');
    const revokeObjectURL = vi.fn();
    const click = vi.fn();

    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const modelItem = paletteItems.find(el => el.textContent === '모델명')!;
    fireEvent.click(modelItem);

    // Mock createElement to capture the anchor
    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag);
      if (tag === 'a') (el as HTMLAnchorElement).click = click;
      return el;
    });

    const downloadBtn = screen.getByText('JSON 다운로드');
    fireEvent.click(downloadBtn);

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('커스텀 텍스트의 실제 입력값이 rawValue로 내보내진다 (미리보기-다운로드 divergence 회귀 방지)', async () => {
    let capturedBlob: Blob | null = null;
    const createObjectURL = vi.fn((blob: Blob) => { capturedBlob = blob; return 'blob:test'; });
    const revokeObjectURL = vi.fn();
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL });

    render(<BuilderApp {...defaultProps} />);

    const paletteItems = screen.getAllByTitle('클릭해서 추가 / Click to add');
    const customTextItem = paletteItems.find(el => el.textContent === '커스텀 텍스트')!;
    fireEvent.click(customTextItem);

    // Select the newly added canvas item (by container, not text — its
    // rendered label is ambiguous) to open the config panel
    const canvasItem = document.querySelector('.canvas-item') as HTMLElement;
    fireEvent.click(canvasItem);

    const formatInput = screen.getByDisplayValue('·') as HTMLInputElement;
    fireEvent.input(formatInput, { target: { value: '::' } });

    const origCreate = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = origCreate(tag);
      if (tag === 'a') (el as HTMLAnchorElement).click = vi.fn();
      return el;
    });

    fireEvent.click(screen.getByText('JSON 다운로드'));

    const text = await capturedBlob!.text();
    const data = JSON.parse(text);
    expect(data.lines[0][0].type).toBe('custom-text');
    expect(data.lines[0][0].rawValue).toBe('::');

    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
});
