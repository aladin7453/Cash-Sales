"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { cn } from '@/lib/utils/cn';

interface DragHandleProps {
  id: string;
  value: string | number; // Add value prop to display actual value
  disabled?: boolean;
  className?: string;
}

export default function DragHandle({ 
  id, 
  value, 
  disabled = false, 
  className,
}: DragHandleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-1 cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...attributes}
      {...listeners}
    >
      <RxDragHandleDots2 className="h-4 w-4 text-gray-400" />
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}