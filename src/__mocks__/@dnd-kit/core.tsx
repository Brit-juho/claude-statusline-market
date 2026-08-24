import { h } from 'preact';
import { useState, useCallback } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

// Minimal dnd-kit mock for Vitest jsdom environment.
// Provides the same API surface without React hook dependencies.

export type DragStartEvent = { active: { id: string; data: { current: any } } };
export type DragEndEvent = { active: { id: string; data: { current: any } }; over: { id: string } | null };

export function DndContext({ children, onDragStart, onDragEnd }: {
  children: ComponentChildren;
  onDragStart?: (e: DragStartEvent) => void;
  onDragEnd?: (e: DragEndEvent) => void;
  [key: string]: any;
}) {
  return <>{children}</>;
}

export function DragOverlay({ children }: { children?: ComponentChildren }) {
  return <>{children || null}</>;
}

export function useDraggable({ id, data }: { id: string; data?: any }) {
  return {
    attributes: { role: 'button', tabIndex: 0, 'aria-disabled': false, 'aria-roledescription': 'draggable' },
    listeners: {},
    setNodeRef: () => {},
    isDragging: false,
    transform: null,
    over: null,
  };
}

export function useDroppable({ id }: { id: string }) {
  return { setNodeRef: () => {}, over: null, active: null, isOver: false };
}

export function PointerSensor() {}
export function KeyboardSensor() {}

export function useSensor(sensor: any, options?: any) {
  return { sensor, options };
}

export function useSensors(...sensors: any[]) {
  return sensors;
}

export const closestCenter = () => null;
