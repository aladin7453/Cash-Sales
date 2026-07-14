"use client";

import { useState, useEffect, useCallback } from "react";
import { FaCheck, FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import type { SortingState, RowSelectionState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
import TableHeadStatusFilter from "@/components/data-table/TableHeadStatusFilter";
import { TableHeadValidityFilter } from "@/components/data-table/TableHeadValidityFilter";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DEFAULT_DATA_TABLE_PAGE_SIZE } from "@/lib/constants";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import { cn } from "@/lib/utils/cn";

import TransferFromDocumentToolbar from "./TransferFromDocumentToolbar";
import type { TransferFromDocumentPopoverProps } from './types';

export default function TransferFromDocumentPopover({
  open,
  setOpen,
  setOpenDialog,
  setOpenDetailsPopover,
  columns,
  data,
  docType,
  onDocumentSelect,
  fetchDocuments,
  title = "Select Document",
}: TransferFromDocumentPopoverProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const table = useReactTable({
    columns,
    data,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    enableMultiRowSelection: true,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: { pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE },
    },
  });

  // Reset selection when dialog closes
  useEffect(() => {
    if (!open) {
      setRowSelection({});
      setLastSelectedId(null);
    }
  }, [open]);

  usePreventShiftTextSelect();

  const confirmSelection = useCallback(() => {
    const selectedUUIDs = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.UUID);

    if (selectedUUIDs.length === 0) return;

    onDocumentSelect(selectedUUIDs.length === 1 ? selectedUUIDs[0] : selectedUUIDs);
    setOpen(false);
    setOpenDetailsPopover(true);
  }, [table, onDocumentSelect, setOpen, setOpenDetailsPopover]);

  const handleRowClick = useCallback(
    (_e: React.MouseEvent, row) => {
      const rowId = row.id;

      setRowSelection((prev) => ({
        ...prev,
        [rowId]: !prev[rowId],
      }));
      setLastSelectedId(rowId);
    },
    [],
  );
  const handleRowDoubleClick = useCallback(
    (_e: React.MouseEvent, row) => {
      setRowSelection({ [row.id]: true });
      onDocumentSelect(row.original.UUID);
      setOpen(false);
      setOpenDetailsPopover(true);
    },
    [onDocumentSelect, setOpen, setOpenDetailsPopover],
  );

  const selectedCount = Object.values(rowSelection).filter(Boolean).length;
  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="min-h-[75vh] min-w-[75vw] max-w-3xl bg-erp-blue-3 p-2">
        <div className="h-[73cqh] w-full p-4">
          <div className="flex h-[70cqh] flex-col bg-erp-blue-3 @container-[size]">
            <h2 className="text-sm font-bold">{title}</h2>
            <TransferFromDocumentToolbar
              table={table}
              setOpen={setOpen}
              setOpenDialog={setOpenDialog}
              refreshTable={() => fetchDocuments(docType)}
              fetchDocuments={fetchDocuments}
              docType={docType}
              selectedCount={selectedCount}
              onConfirm={confirmSelection}
            />

            <Separator className="bg-erp-blue-11" />
            <ScrollArea className="h-[100cqh] bg-erp-gray-3">
              <Table className="border-separate border-spacing-[3px] whitespace-nowrap border bg-erp-gray-1">
                <TableHeader className="sticky top-0">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead className="bg-erp-blue-11 font-normal" key={header.id}>
                          <div className="flex flex-col gap-y-0.5">
                            <div
                              className={cn(
                                "flex items-center gap-x-0.5 text-white",
                                header.column.getCanSort() ? "cursor-pointer select-none" : "",
                              )}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              <span className="font-bold">
                                {header.isPlaceholder
                                  ? null
                                  : flexRender(header.column.columnDef.header, header.getContext())}
                              </span>
                              {{
                                asc: <FaSortUp />,
                                desc: <FaSortDown />,
                              }[header.column.getIsSorted() as string] ?? <FaSort />}
                            </div>
                            {header.column.id === "status" ? (
                              <TableHeadStatusFilter table={table} />
                            ) : header.column.id === "valid" ? (
                              <TableHeadValidityFilter table={table} />
                            ) : (
                              <TableHeadColumnTextFilter column={header.column} table={table} />
                            )}
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        className="odd:bg-erp-blue-5 even:bg-erp-blue-1 hover:bg-erp-blue-7 data-[state=selected]:bg-erp-blue-17"
                        data-state={row.getIsSelected() && "selected"}
                        onClick={(e) => handleRowClick(e, row)}
                        onDoubleClick={(e) => handleRowDoubleClick(e, row)}
                        key={row.id}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <NoResultsTableRow columns={columns} />
                  )}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>

            {selectedCount > 0 && (
              <div className="flex items-center justify-between gap-x-3 border-t border-erp-blue-11 bg-erp-blue-3 px-3 py-2">
                <span className="text-xs font-semibold text-black">
                  {selectedCount} document{selectedCount > 1 ? "s" : ""} selected
                </span>

                <button
                  className="flex shrink-0 items-center gap-x-1.5 rounded-md bg-erp-blue-11 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-erp-blue-14 hover:shadow-md active:scale-95"
                  onClick={confirmSelection}
                >
                  <FaCheck className="size-3.5" />
                  Confirm Selection
                </button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}