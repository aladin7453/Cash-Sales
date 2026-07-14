"use client";

import type { Table } from "@tanstack/react-table";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";

interface MobileFormTableActionGroupEndProps<T> {
  table: Table<T>;
  config: {
    search: {
      column: string;           // e.g., "itemCode"
      placeholder: string;      // e.g., "Search Item Code"
    };
    sort: {
      column: string;           // e.g., "itemCode"
    };
  };
  children?: React.ReactNode; // For additional mobile actions if needed
}

export default function MobileFormTableActionGroupEnd<T extends Record<string, any>>({
  table,
  config,
  children,
}: MobileFormTableActionGroupEndProps<T>) {
  return (
    <div className="flex items-center gap-x-2 pr-2 text-erp-blue-14">
      {/* Mobile search */}
      <div className="block md:hidden w-full">
        <TableHeadColumnTextFilter
          column={table.getColumn(config.search.column)}
          table={table}
          placeholder={config.search.placeholder}
          className="bg-white"
        />
      </div>

      {/* Sort button (Mobile View Only) */}
      <div className="flex items-center md:hidden">
        <button
          className="flex items-center gap-1 text-erp-blue-14 hover:text-erp-blue-14"
          onClick={table.getColumn(config.sort.column)?.getToggleSortingHandler()}
        >
          {{
            asc: <FaSortUp className="size-5" />,
            desc: <FaSortDown className="size-5" />,
          }[table.getColumn(config.sort.column)?.getIsSorted() as string] ?? (
            <FaSort className="size-5" />
          )}
        </button>
      </div>

      {children}
    </div>
  );
}
