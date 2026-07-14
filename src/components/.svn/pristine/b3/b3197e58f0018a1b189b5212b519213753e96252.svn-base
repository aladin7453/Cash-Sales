import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";

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
          <div className="max-w-xs truncate">{description}</div>
        </TooltipTrigger>
        <TooltipContent>
          {description.split("\n").map((line, index) => (
            <div key={index}>{line}</div>
          ))}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
