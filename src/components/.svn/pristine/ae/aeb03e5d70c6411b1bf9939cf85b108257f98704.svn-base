"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { TableCell } from "../ui/table";

import type { Cell } from "@tanstack/react-table";
import type { CSSProperties } from "react";

type Props<TData> = {
  cell: Cell<TData, unknown>;
  children: React.ReactNode;
} & React.TdHTMLAttributes<HTMLTableCellElement>;

export default function DragAlongTableCell<TData>({ cell, children, ...props }: Props<TData>) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: cell.column.id,
  });

  const style: CSSProperties = {
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell ref={setNodeRef} style={style} {...props}>
      {children}
    </TableCell>
  );
}
