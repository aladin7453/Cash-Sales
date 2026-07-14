"use client";

import type { Table } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";

interface MobilePopoverActionGroupEndProps<T> {
  table: Table<T>;
  config?: {
    search?: {
      column: string;           // e.g., "serviceCode"
      placeholder: string;      // e.g., "Search Service Code"
    };
    sort?: {
      column: string;           // e.g., "serviceCode"
    };
  };
  children?: React.ReactNode;   // For additional actions/buttons
}

export default function MobilePopoverActionGroupEnd<T extends Record<string, any>>({
  table,
  config,
  children,
}: MobilePopoverActionGroupEndProps<T>) {
  return (
    <div className="flex items-center gap-x-1 text-erp-blue-14">
      {/* Mobile View (Text Filter) - only if search config provided */}
      {config?.search && (
        <div className="block md:hidden w-full">
          <TableHeadColumnTextFilter
            column={table.getColumn(config.search.column)}
            table={table}
            placeholder={config.search.placeholder}
            className="bg-white"
          />
        </div>
      )}

      {/* Mobile View (Sort Button) - only if sort config provided */}
      {config?.sort && (
        <div className="flex items-center md:hidden">
          <button
            className="flex items-center gap-1 text-erp-blue-14 hover:text-erp-blue-14"
            onClick={table.getColumn(config.sort.column)?.getToggleSortingHandler()}
          >
            {{
              asc: <FaSortUp className="size-5" />,
              desc: <FaSortDown className="size-5" />,
            }[table.getColumn(config.sort.column)?.getIsSorted() as string] ?? <FaSort className="size-5" />}
          </button>
        </div>
      )}

      {/* Additional Actions/Buttons */}
      {children}
    </div>
  );
}
