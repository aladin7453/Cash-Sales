"use client";

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils/cn';

interface DraggableRowProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  'data-state'?: string;
}

export default function DraggableRow({
  id,
  children,
  className,
  disabled = false,
  onClick,
  onDoubleClick,
  'data-state': dataState,
}: DraggableRowProps) {
  const {
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
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        className,
        isDragging && "opacity-50 shadow-lg z-50",
        disabled && "cursor-not-allowed"
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      data-state={dataState}
    >
      {children}
    </TableRow>
  );
}
