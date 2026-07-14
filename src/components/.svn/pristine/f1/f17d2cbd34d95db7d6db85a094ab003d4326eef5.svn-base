"use client";

import { cn } from "@/lib/utils/cn";

import type { Header } from "@tanstack/react-table";

export function ColumnResizer<TData>({ header }: { header: Header<TData, unknown> }) {
  if (header.column.getCanResize() === false) return <></>;

  return (
    <div
      onDoubleClick={() => header.column.resetSize()}
      onMouseDown={header.getResizeHandler()}
      onTouchStart={header.getResizeHandler()}
      className={cn(
        "absolute right-0 top-0 h-full w-1.5 cursor-col-resize touch-none select-none bg-transparent hover:bg-erp-blue-13",
        header.column.getIsResizing() && "bg-erp-blue-14 hover:bg-erp-blue-14",
      )}
      title={
        typeof header.column.columnDef.header === "string"
          ? `Resizing column: ${header.column.columnDef.header}`
          : undefined
      }
    />
  );
}
