"use client";

import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa6";

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import Export from "@/components/data-table/Export";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";
import CancelButton from "@/components/form/ActionButton/Cancel";
import ResetButton from "@/components/form/ActionButton/Reset";
import SaveButton from "@/components/form/ActionButton/Save";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type Props = {
  table: any;
  setOpen: (state: boolean) => void;
  handleSave: (prop: any) => void;
  onOpenSecondDialog?: () => void;
  onUpdate?: (selectedRows: any[]) => void;
  revalidateData?: () => void;
  setSelectedRow: (row: any) => void;
  saveDisabled: boolean;
  isLoading?: boolean;
  totalCount?: number;
};

export default function SelectDialogToolbar({
  table,
  setOpen,
  handleSave,
  onOpenSecondDialog,
  onUpdate,
  revalidateData,
  setSelectedRow,
  saveDisabled,
  isLoading = false,
  totalCount,
}: Props) {
  const handleReset = () => {
    table.getSelectedRowModel().rows.forEach((row: any) => {
      row.toggleSelected();
    });
    // Reset filters and pagination
    table.setColumnFilters([]);
    table.setPagination({
      pageIndex: 0,
      pageSize: table.getState().pagination.pageSize,
    });
    if (revalidateData) revalidateData();
    setSelectedRow(null);
  };

  const handleRefresh = () => {
    if (revalidateData) revalidateData();
  };

  const handleSaveClick = async () => {
    const selectedRows = table.getSelectedRowModel().rows.map(
      (row: any) => row.original
    );

    // Call update function if provided and there are selected rows
    if (onUpdate && selectedRows.length > 0) {
      try {
        await onUpdate(selectedRows);
      } catch (error) {
        console.error("Update failed:", error);
        return; // Don't proceed if update fails
      }
    }

    if (onOpenSecondDialog) {
      // If there's a second dialog function, close current and open next
      setOpen(false); // Close current dialog immediately
      setTimeout(() => {
        onOpenSecondDialog(); // Open next dialog after a brief delay
      }, 100); // Small delay to ensure smooth transition
    } else {
      // Normal save behavior
      handleSave({ table: table });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-1.5">
        {/* Desktop view buttons */}
        <div className="grid auto-cols-fr grid-flow-col gap-x-1.5">
          <SaveButton
            onClick={handleSaveClick}
            disabled={saveDisabled || isLoading}
          />
          <ResetButton onClick={handleReset} disabled={isLoading} />
          <CancelButton onClick={() => setOpen(false)} />
        </div>

        {/* Pagination */}
        <Pagination table={table} totalNumOfRows={totalCount} />

        {/* ActionGroupEnd */}
        <div className="flex items-center gap-x-1 text-erp-blue-14">
          <Export table={table} />
          <Refresh refreshTable={handleRefresh} />
          <ColumnVisibilityToggle table={table} />
        </div>
      </div>
    </>
  );
}
