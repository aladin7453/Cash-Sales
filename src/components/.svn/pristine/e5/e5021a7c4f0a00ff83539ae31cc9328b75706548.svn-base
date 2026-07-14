"use client";

import { useSortable } from "@dnd-kit/sortable";
import { flexRender } from "@tanstack/react-table";
import { GripVertical } from "lucide-react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

import type { Header } from "@tanstack/react-table";

type Props<TData> = {
  header: Header<TData, unknown>;
};

export default function DragableTableHeadTitle<TData>({ header }: Props<TData>) {
  const { attributes, isDragging, listeners } = useSortable({
    id: header.column.id,
  });

  const headerContent = !header.isPlaceholder
    ? flexRender(header.column.columnDef.header, header.getContext())
    : null;

  return (
    <div className="flex items-center justify-between gap-x-1 text-white">
      {/* Column title and tooltip for when the title is too long to fit on smaller column widths */}
      {typeof header.column.columnDef.header === "string" && headerContent ? (
        <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
          <Tooltip>
            <TooltipTrigger className="flex-1 truncate text-left font-bold">
              {headerContent}
            </TooltipTrigger>
            <TooltipContent align="start" className="text-xs">
              {headerContent}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <span className="flex-1 truncate font-bold">{headerContent}</span>
      )}
      {/* Buttons for controlling column sorting and column ordering */}
      <div className="flex flex-shrink-0 items-center">
        <button
          className={cn(
            "flex size-4 items-center justify-center",
            header.column.getCanSort() ? "cursor-pointer select-none" : "",
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          {{
            asc: <FaSortUp className="size-3.5" />,
            desc: <FaSortDown className="size-3.5" />,
          }[header.column.getIsSorted() as string] ?? <FaSort className="size-3.5" />}
        </button>
        <button
          className={cn(
            "flex size-4 items-center justify-center",
            isDragging ? "cursor-grabbing" : "cursor-grab",
          )}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </div>
    </div>
  );
}
