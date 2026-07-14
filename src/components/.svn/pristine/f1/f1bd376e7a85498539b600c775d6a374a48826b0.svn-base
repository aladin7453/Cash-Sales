"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { cn } from "@/lib/utils/cn";

import { TableHead } from "../ui/table";
import DragableTableHeadTitle from "./DragableTableHeadTitle";

import type { Header } from "@tanstack/react-table";
import type { CSSProperties } from "react";

type Props<TData> = {
  header: Header<TData, unknown>;
  children: React.ReactNode;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export default function DragableTableHead<TData>({
  header,
  children,
  className,
  style: externalStyle,
  ...props
}: Props<TData>) {
  const { isDragging, setNodeRef, transform, transition } = useSortable({
    id: header.column.id,
  });

  const style: CSSProperties = {
    ...externalStyle,
    transform: CSS.Translate.toString(transform), // translate instead of transform to avoid squishing
    transition,
  };

  return (
    <TableHead
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative min-w-0",
        isDragging ? "z-[1] opacity-75" : "z-[0] opacity-100",
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-y-0.5">
        <DragableTableHeadTitle header={header} />
        {children}
      </div>
    </TableHead>
  );
}
