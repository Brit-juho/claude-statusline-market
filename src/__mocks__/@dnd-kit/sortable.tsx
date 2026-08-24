import { h } from 'preact';
import type { ComponentChildren } from 'preact';

export function SortableContext({ children }: { children: ComponentChildren; [k: string]: any }) {
  return <>{children}</>;
}

export function useSortable({ id, data }: { id: string; data?: any }) {
  return {
    attributes: { role: 'button', tabIndex: 0, 'aria-roledescription': 'sortable' },
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
    over: null,
  };
}

export function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const result = [...arr];
  const [item] = result.splice(from, 1);
  result.splice(to, 0, item);
  return result;
}

export const horizontalListSortingStrategy = () => null;
export const verticalListSortingStrategy = () => null;
