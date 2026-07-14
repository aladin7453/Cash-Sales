"use client";

import { FaBoxesStacked } from "react-icons/fa6";

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import Export from "@/components/data-table/Export";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";
import CancelButton from "@/components/form/ActionButton/Cancel";
import ResetButton from "@/components/form/ActionButton/Reset";
import SaveButton from "@/components/form/ActionButton/Save";
import { SVGService } from "@/components/icons/svg-repo/SVGService";
import { Button } from "@/components/ui/button";

// Mobile View (Imports)
import MobilePopoverActionGroupStart from "@/components/form/MobilePopoverActionGroupStart";
import MobilePopoverActionGroupEnd from "@/components/form/MobilePopoverActionGroupEnd";

type Props = {
  table: any;
  setOpen: any;
  totalNumOfRows?: number;
  handleSave: (prop) => void;
  setSelectedRow: (row) => void;
  saveDisabled: boolean;
  dataStatusBadgeDisplay?: React.ReactNode;
  setSaveDisabled: (state: boolean) => void;
  revalidateItemListData: any;
  setItemType: any,
  form: any
};

export default function VerifyVoucherPopoverToolbar({
  table,
  setOpen,
  handleSave,
  setSelectedRow,
  saveDisabled,
  setSaveDisabled,
  revalidateItemListData,
  setItemType,
  totalNumOfRows,
  dataStatusBadgeDisplay,
  form
}: Props) {
  const handleReset = () => {
    table.getSelectedRowModel().rows.forEach((row) => {
      row.toggleSelected();
    });
    // revalidateQuotationDetails();

    setSelectedRow(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        {/* Mobile View (Start Action Buttons) */}
        {/* Web View (Start Action Buttons) */}
        <div className="hidden md:grid auto-cols-fr grid-flow-col gap-x-1.5">
          <SaveButton
            onClick={() => {
              handleSave({ table: table });
            }}
            disabled={false}
          />
          <ResetButton onClick={handleReset} />
          <CancelButton
            onClick={() => {
              form.setValue("voucher","")
              form.setValue("voucherCode","")
              setOpen(false)
            }}
          />
        </div>

        {/* Mobile View (Hide Pagination) */}
        <div className="hidden md:block">
          <Pagination table={table} totalNumOfRows={totalNumOfRows} />
        </div>

        <MobilePopoverActionGroupEnd
        >

          {/* Mobile View (Hide Refresh and ColumnVisibilityToggle) */}
          <div className="hidden md:flex items-center gap-x-1">
            {/* <Refresh refreshTable={revalidateItemListData} /> */}
            <ColumnVisibilityToggle table={table} />
          </div>
        </MobilePopoverActionGroupEnd>


      </div>
    </>
  );
}
