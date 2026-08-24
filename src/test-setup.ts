import '@testing-library/jest-dom';

// dnd-kit uses PointerEvent which jsdom partially supports
// Provide a minimal mock for the PointerEvent constructor if missing
if (typeof PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    constructor(type: string, init?: PointerEventInit) {
      super(type, init);
      this.pointerId = init?.pointerId ?? 1;
    }
  }
  (global as any).PointerEvent = PointerEvent;
}

// Suppress dnd-kit accessibility announcements in tests
Object.defineProperty(global, 'ResizeObserver', {
  writable: true,
  value: class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
});
