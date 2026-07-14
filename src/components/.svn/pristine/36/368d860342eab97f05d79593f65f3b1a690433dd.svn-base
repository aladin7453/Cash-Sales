import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";
import { FaCircleInfo } from "react-icons/fa6";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

import type { Row } from "@tanstack/react-table";

export default function DescriptionCellTooltip<T>({
  row,
  columnName = "description",
}: {
  row: Row<T>;
  columnName?: string;
}) {
  const description = row.getValue<string>(columnName);

  if (!description) {
    return <div className="text-erp-gray-5"></div>;
  }

  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-full w-full" title="">
            <FaCircleInfo className="text-erp-blue-11" />
          </div>
        </TooltipTrigger>

        <TooltipContent>
          {/* The tooltip body with full rendered HTML */}
          <div
            className="prose max-w-sm"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
