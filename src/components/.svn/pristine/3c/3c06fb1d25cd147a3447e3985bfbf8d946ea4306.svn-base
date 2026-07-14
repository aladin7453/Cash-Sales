"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

interface DragDropDataTableProps {
  children: React.ReactNode;
  items: string[];
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  disabled?: boolean;
  modifiers?: any[];
  hasParentDndContext?: boolean; // New prop to detect if parent has DndContext
}

export default function DragDropDataTable({
  children,
  items,
  onDragStart,
  onDragEnd,
  disabled = false,
  modifiers = [restrictToVerticalAxis, restrictToParentElement],
  hasParentDndContext = false, // Default to false for backward compatibility
}: DragDropDataTableProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (disabled) {
    return <>{children}</>;
  }

  // If parent has DndContext (column drag and drop), only provide SortableContext
  if (hasParentDndContext) {
    return (
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    );
  }

  // If no parent DndContext (row drag only), provide full DndContext + SortableContext
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      modifiers={modifiers}
    >
      <SortableContext
        items={items}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
      <DragOverlay>
        {/* Drag overlay content will be handled by the consuming component */}
      </DragOverlay>
    </DndContext>
  );
}
