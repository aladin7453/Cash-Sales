import clsx from "clsx";
import { FaBookmark  } from "react-icons/fa6";

import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

import type { Row } from "@tanstack/react-table";
import React from "react";

export default function CompulsoryCellTooltip<T>({ row,columnName }: { row: Row<T> }) {
  
  const InfoIcon = (
    <div
      className={clsx(
        "flex items-center justify-center",
        row.getValue(`${columnName}`)=="1"
          ? "cursor-help text-erp-blue-11"
          : "cursor-help text-erp-gray-5",
      )}
    >
       
      <FaBookmark  className="size-5" />
    </div>
  );

  return row.getValue(`${columnName}`) ? (
    <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
      <Tooltip>
        <TooltipTrigger asChild>{InfoIcon}</TooltipTrigger>
        <TooltipContent>{row.getValue(`${columnName}`)=="1"?`Compulsory`:`Not Compulsory` as React.ReactNode}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    InfoIcon
  );
}
