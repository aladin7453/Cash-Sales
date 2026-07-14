"use client";

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import Export from "@/components/data-table/Export";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";
import CancelButton from "@/components/form/ActionButton/Cancel";
import ResetButton from "@/components/form/ActionButton/Reset";
import SaveButton from "@/components/form/ActionButton/Save";

// Mobile View (Imports)
import MobilePopoverActionGroupStart from "@/components/form/MobilePopoverActionGroupStart";
import MobilePopoverActionGroupEnd from "@/components/form/MobilePopoverActionGroupEnd";

type Props = {
  table: any;
  setOpen: any;
  savePackageServices: (prop: any) => void;
  fetchPackageData: () => void;
};

export default function PackagePopoverToolbar({
  table,
  setOpen,
  savePackageServices,
  fetchPackageData,
}: Props) {
  const handleReset = () => {
    table.getSelectedRowModel().rows.forEach((row) => {
      row.toggleSelected();
    });
    fetchPackageData();
  };

  const handleSave = () => {
    savePackageServices({ table: table });
  };

  return (
    <>
      <div className="flex items-center justify-between p-1.5">
        {/* Mobile View (Start Action Buttons) */}
        <MobilePopoverActionGroupStart
          config={{
            save: { handler: handleSave },
            reset: { handler: handleReset },
            cancel: { handler: () => setOpen(false) },
          }}
        />

        {/* Web View (Start Action Buttons) */}
        <div className="hidden md:grid auto-cols-fr grid-flow-col gap-x-1.5">
          <SaveButton onClick={handleSave} />
          <ResetButton onClick={handleReset} />
          <CancelButton onClick={() => setOpen(false)} />
        </div>

        {/* Mobile View (Hide Pagination) */}
        <div className="hidden md:block">
          <Pagination table={table} />
        </div>

        {/* Mobile View (End Action Buttons) */}
        <MobilePopoverActionGroupEnd
          table={table}
          config={{
            search: {
              column: "packageCode",
              placeholder: `Search Package Code`,
            },
            sort: {
              column: "packageCode",
            },
          }}
        >
          <Export table={table} />

          {/* Mobile View (Hide Refresh and ColumnVisibilityToggle) */}
          <div className="hidden md:flex items-center gap-x-1">
            <Refresh />
            <ColumnVisibilityToggle table={table} />
          </div>
        </MobilePopoverActionGroupEnd>
      </div>
    </>
  );
}
