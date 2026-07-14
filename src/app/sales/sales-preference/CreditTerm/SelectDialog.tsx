"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
import { TableHeadValidityFilter } from "@/components/data-table/TableHeadValidityFilter";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useHandleRowSelect } from "@/lib/hooks/useHandleRowSelect";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import { cn } from "@/lib/utils/cn";

import SelectDialogToolbar from "./SelectDialogToolbar";

import type {
  ColumnDef,
  Row,
  SortingState,
  ColumnFiltersState,
  PaginationState,
} from "@tanstack/react-table";
import type { DocumentList } from "./columns";

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  columns: ColumnDef<DocumentList>[];
  data: DocumentList[];
  onSelectDocument: (doc: any) => void;
  onOpenSecondDialog?: () => void;
  onUpdate?: (selectedRows: any[]) => void;
  revalidateData?: (tableState?: any) => void;
  dialogTitle?: string;
  totalCount?: number;
  isLoading?: boolean;
};

const COLUMN_VISIBILITY_KEY = "document.select.table.columns";

export default function SelectDialog({
  open,
  setOpen,
  columns,
  data,
  onSelectDocument,
  onOpenSecondDialog,
  onUpdate,
  revalidateData,
  dialogTitle = "Select Document",
  totalCount = 0,
  isLoading = false,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
  });
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem(COLUMN_VISIBILITY_KEY) || "{}");
    }
    return {};
  });

  const table = useReactTable({
    columns,
    data: data || [],
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: Math.ceil(totalCount / pagination.pageSize),
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Store column visibility preferences in localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        COLUMN_VISIBILITY_KEY,
        JSON.stringify(columnVisibility)
      );
    }
  }, [columnVisibility]);

  // Reload data when table parameters change
  useEffect(() => {
    if (open && revalidateData) {
      revalidateData(table);
    }
  }, [pagination, sorting, columnFilters, open]);

  usePreventShiftTextSelect();

  const onSave = async (prop: any) => {
    const selectedRows = prop.table.getSelectedRowModel().rows;

    if (selectedRows.length > 0) {
      onSelectDocument(selectedRows[0].original);
    }

    prop.table.resetRowSelection();

    // Close current dialog first
    setOpen(false);
  };

  const onDoubleClick = async (row: Row<DocumentList>) => {
    onSelectDocument(row.original);

    // Call update function if provided (same as save logic)
    // if (onUpdate) {
    //   try {
    //     await onUpdate([row.original]);
    //   } catch (error) {
    //     console.error("Update failed:", error);
    //     return; // Don't proceed if update fails
    //   }
    // }

    // if (onOpenSecondDialog) {
    //   // If there's a second dialog function, close current and open next
    //   setOpen(false); // Close current dialog immediately
    //   setTimeout(() => {
    //     onOpenSecondDialog(); // Open next dialog after a brief delay
    //   }, 100); // Small delay to ensure smooth transition
    // } else {
    //   // Normal behavior - just close dialog
    //   setOpen(false);
    // }
  };

  const onRowSelection = useHandleRowSelect(table, onDoubleClick);

  return (
    <Dialog open={open} onOpenChange={setOpen} className="mx-2">
      <DialogContent className="max-w-3xl bg-erp-blue-3 p-2">
        <div className="flex flex-row">
          <div className="h-[83cqh] w-full p-2">
            <div className="flex h-[80cqh] flex-col bg-erp-blue-3 @container-[size]">
              <h2 className="text-sm font-bold">{dialogTitle}</h2>
              <SelectDialogToolbar
                table={table}
                setOpen={setOpen}
                handleSave={onSave}
                onOpenSecondDialog={onOpenSecondDialog}
                onUpdate={onUpdate}
                revalidateData={() => revalidateData?.(table)}
                setSelectedRow={setSelectedRow}
                saveDisabled={saveDisabled}
                isLoading={isLoading}
                totalCount={totalCount}
              />
              <Separator className="bg-erp-blue-11" />
              <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                <Table className="border-separate border-spacing-[3px] whitespace-nowrap border bg-erp-gray-1">
                  <TableHeader className="sticky top-0 z-10">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead
                            className="bg-erp-blue-11 font-normal"
                            key={header.id}
                          >
                            <div className="flex flex-col gap-y-0.5">
                              <div
                                className={cn(
                                  "flex items-center gap-x-0.5 text-white",
                                  header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : ""
                                )}
                                onClick={header.column.getToggleSortingHandler()}
                              >
                                <span className="font-bold">
                                  {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                </span>
                                {{
                                  asc: <FaSortUp />,
                                  desc: <FaSortDown />,
                                }[header.column.getIsSorted() as string] ?? (
                                  <FaSort />
                                )}
                              </div>
                              {header.column.id === "valid" ? (
                                <TableHeadValidityFilter table={table} />
                              ) : (
                                <TableHeadColumnTextFilter
                                  column={header.column}
                                  table={table}
                                />
                              )}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          className="odd:bg-erp-blue-5 even:bg-erp-blue-1 hover:bg-erp-blue-7 data-[state=selected]:bg-erp-blue-17"
                          data-state={row.getIsSelected() && "selected"}
                          onClick={onRowSelection(row)}
                          key={row.id}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
