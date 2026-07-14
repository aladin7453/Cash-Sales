"use client";

import { useState, useCallback, useMemo } from 'react';
import { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

interface UseDragDropTableProps<T = any> {
  data: T[];
  onReorder: (newData: T[]) => void;
  idField?: keyof T;
  disabled?: boolean;
}

interface UseDragDropTableReturn<T = any> {
  items: string[];
  activeId: string | null;
  isDragging: boolean;
  handleDragStart: (event: DragStartEvent) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  getRowId: (row: T, index: number) => string;
  disabled: boolean;
}

export default function useDragDropTable<T = any>({
  data,
  onReorder,
  idField = 'UUID' as keyof T,
  disabled = false,
}: UseDragDropTableProps<T>): UseDragDropTableReturn<T> {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Generate items array for SortableContext
  const items = useMemo(() => {
    if (!Array.isArray(data)) return []; // Ensure data is an array
    return data.map((item, index) => {
      const id = item[idField];
      return id ? String(id) : `row-${index}`;
    });
  }, [data, idField]);

  // Helper to get row ID
  const getRowId = useCallback((row: T, index: number): string => {
    const id = row[idField];
    return id ? String(id) : `row-${index}`;
  }, [idField]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id && over) {
      const oldIndex = items.indexOf(active.id as string);
      const newIndex = items.indexOf(over.id as string);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Use arrayMove for proper reordering instead of swapping
        const newData = arrayMove(data, oldIndex, newIndex);
        // Call onReorder with the new data immediately
        onReorder(newData);
      }
    }

    setActiveId(null);
  }, [items, data, onReorder]);

  return {
    items,
    activeId,
    isDragging: activeId !== null,
    handleDragStart,
    handleDragEnd,
    getRowId,
    disabled,
  };
}
