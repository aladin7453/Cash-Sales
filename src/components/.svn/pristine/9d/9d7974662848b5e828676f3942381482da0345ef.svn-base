"use client";

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import Export from "@/components/data-table/Export";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";
import CancelButton from "@/components/form/ActionButton/Cancel";
import { Button } from "@/components/ui/button";

// Mobile View (Imports)
import MobilePopoverActionGroupStart from "@/components/form/MobilePopoverActionGroupStart";
import MobilePopoverActionGroupEnd from "@/components/form/MobilePopoverActionGroupEnd";

type Props = {
  table: any;
  setOpen: any;
  refreshData: () => void;
  isLoading: boolean;
  totalNumOfRows?: number;
};

export default function SellingPriceHistoryPopoverToolbar({
  table,
  setOpen,
  refreshData,
  isLoading,
  totalNumOfRows,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        {/* Mobile View (Start Action Buttons) */}
        <MobilePopoverActionGroupStart
          config={{
            cancel: { handler: () => setOpen(false) },
          }}
        />
        
        {/* Web View (Start Action Buttons) */}
        <div className="hidden md:grid auto-cols-fr grid-flow-col gap-x-1.5">
          <CancelButton onClick={() => setOpen(false)} />
        </div>

        {/* Mobile View (Hide Pagination) */}
        <div className="hidden md:block">
          <Pagination table={table} totalNumOfRows={totalNumOfRows} />
        </div>
        
        {/* Mobile View (End Action Buttons) */}
        <MobilePopoverActionGroupEnd
          table={table}
          config={{
            search: {
              column: "docNo",
              placeholder: "Search Document No",
            },
            sort: {
              column: "docDateFormat",
            },
          }}
        >
          {/* Mobile View (Hide Refresh and ColumnVisibilityToggle) */}
          <div className="hidden md:flex items-center gap-x-1">
            <Refresh refreshTable={refreshData} disabled={isLoading} />
            <ColumnVisibilityToggle table={table} />
          </div>
        </MobilePopoverActionGroupEnd>
      </div>
    </>
  );
}
