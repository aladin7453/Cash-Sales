import clsx from "clsx";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { DEFAULT_DATA_TABLE_PAGE_SIZE } from "@/lib/constants";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  totalNumOfRows?: number;
  formView?: boolean;
  showGoButton?: boolean;
};

function getPageItems(
  pageIndex: number,
  pageCount: number,
): (number | null)[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, i) => i);
  }

  const SIBLINGS = 1;
  const left = Math.max(pageIndex - SIBLINGS, 2);
  const right = Math.min(pageIndex + SIBLINGS, pageCount - 3);

  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < pageCount - 3;

  return [
    0,
    ...(showLeftEllipsis ? [null] : [1]),
    ...Array.from({ length: right - left + 1 }, (_, i) => left + i),
    ...(showRightEllipsis ? [null] : [pageCount - 2]),
    pageCount - 1,
  ];
}

export function Pagination<TData>({ table, totalNumOfRows, formView, showGoButton = true }: Props<TData>) {
  const paginationSelectOptions = [DEFAULT_DATA_TABLE_PAGE_SIZE, 50, 100, 200];

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = totalNumOfRows ?? table.getFilteredRowModel().rows.length;
  const pageCount = table.getPageCount();

  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalRows);

  const renderPageButtons = () => {
    const items = getPageItems(pageIndex, pageCount);

    return items.map((item, idx) => {
      if (item === null) {
        return (
          <span className="px-2 text-xs" key={`ellipsis-${idx}`}>
            ...
          </span>
        );
      }

      const isActive = item === pageIndex;
      return (
        <Button
          key={item}
          variant="outline"
          type="button"
          className={clsx("size-7 px-0", formView ? isActive 
            ? "text-xs rounded-full border-none bg-blue-300 text-white hover:bg-blue-300 hover:text-white" 
            : "text-xs rounded-full border-none bg-transparent text-black" : 
            isActive
            ? "bg-erp-blue-14 text-white hover:bg-erp-blue-14 hover:text-white"
            : "font-normal")}
          onClick={() => table.setPageIndex(item)}
        >
          {item + 1}
        </Button>
      );
    });
  };

  return (
    <div className="flex items-center gap-x-2">
      <div className="flex items-center gap-x-2">
        <div className={formView ? "hidden" : "text-xs"}>{`${start} – ${end} of ${totalRows}`}</div>
        <Select value={`${pageSize}`} onValueChange={(value) => table.setPageSize(+value)}>
          <SelectTrigger className={formView ? "text-xs h-7 w-14 bg-blue-300 text-white border-none px-2 !ring-0 !ring-offset-0 focus:!ring-0" : "h-7 w-14 bg-background p-2"}>
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent>
            {paginationSelectOptions.map((numOfRows) => (
              <SelectItem key={numOfRows} value={`${numOfRows}`}>
                {numOfRows}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        variant="outline"
        size="icon"
        type="button"
        className={formView ? "size-7 px-0 rounded-full border-none bg-blue-300 text-white transition-all duration-300 ease-in-out hover:bg-blue-300 hover:text-white disabled:bg-blue-300/40" : "size-7 px-0"}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to previous page</span>
        <ChevronLeftIcon size={formView ? 18 : 20} className={formView ? "text-white" : "text-erp-blue-14"} />
      </Button>
      {renderPageButtons()}
      <Button
        variant="outline"
        size="icon"
        type="button"
        className={formView ? "size-7 px-0 rounded-full border-none bg-blue-300 text-white transition-all duration-300 ease-in-out hover:bg-blue-300 hover:text-white disabled:bg-blue-300/40" : "size-7 px-0"}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to next page</span>
        <ChevronRightIcon size={formView ? 18 : 20} className={formView ? "text-white" : "text-erp-blue-14"} />
      </Button>
      <Input
        type="number"
        placeholder="Go"
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          table.setPageIndex(page);
        }}
        className={showGoButton ? "h-7 w-12 [-moz-appearance:textfield] placeholder:italic [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none" : "hidden"}
      />
    </div>
  );
}
