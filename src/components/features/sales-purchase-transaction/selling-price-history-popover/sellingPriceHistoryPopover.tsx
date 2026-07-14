"use client";

import { useEffect, useState, memo } from "react";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  PaginationState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";

import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
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

import { DEFAULT_DATA_TABLE_PAGE_SIZE, getAuthHeaders, ORIGIN } from "@/lib/constants";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";

import SellingPriceHistoryPopoverToolbar from "./sellingPriceHistoryPopoverToolbar";
import { sellingPriceHistoryColumns } from "./sellingPriceHistoryPopoverColumns";

// Mobile View (Imports)
import MobilePopoverDataTable from "@/components/form/MobilePopoverDataTable";

// Column Drag and Drop and Resize (Imports)
import type { MouseEvent } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { ColumnResizer } from "@/components/data-table/ColumnResizer";
import DragableTableHead from "@/components/data-table/DragableTableHead";
import { DATA_TABLE_DEFAULT_COLUMN_SIZING } from "@/lib/constants";
import { useColumnSizeVars } from "@/lib/hooks/useColumnSizeVars";
import { useDndSensors } from "@/lib/hooks/useDndSensors";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import getExcludedColumns from "@/lib/utils/data-table/getExcludedColumns";
import handleDndDragEnd from "@/lib/utils/data-table/handleDndDragEnd";

// Server-Side Filtering (Imports)
import useSWR from "swr";
import LoadingUI from "@/components/LoadingUI";

export type SellingPriceHistoryItem = {
  updatedBy: string;
  docDateFormat: string;
  price: string;
  currencyCode: string;
  customerGroupCode: string;
  sourceModule: string;
  createdByUsername: string;
  quantity: string;
  balanceQuantity: string;
  itemUOM: string;
  docNo: string;
  customerCategoryCode: string;
  preferenceData?: any;
};

// Server-Side Filtering (Define Data Structure)
type SellingPriceHistoryData = {
  total: string;
  rows: SellingPriceHistoryItem[];
};

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  itemId: string;
  preferenceData?: any;
};

// Column Drag and Drop and Resize (Local Storage Keys)
const COLUMN_FILTERS_KEY = "selling.price.history.popover.table.filters";
const COLUMN_ORDERING_KEY = "selling.price.history.popover.table.ordering";
const COLUMN_SIZING_KEY = "selling.price.history.popover.table.sizing";
const COLUMN_VISIBILITY_KEY = "selling.price.history.popover.table.columns";
const PAGINATION_KEY = "selling.price.history.popover.table.pagination";
const SORTING_KEY = "selling.price.history.popover.table.sorting";

export default function SellingPriceHistoryPopover({
  open,
  setOpen,
  itemId,
  preferenceData,
}: Props) {
  const headers = getAuthHeaders();
  
  // Server-Side Filtering (State)
  const [tableData, setTableData] = useState<SellingPriceHistoryItem[]>([]);
  const [totalNumOfRows, setTotalNumOfRows] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoadedSuccessfully, setIsLoadedSuccessfully] = useState<boolean>(false);

  const [columnFilters, setColumnFilters] = useLocalStorage<ColumnFiltersState>(
    COLUMN_FILTERS_KEY,
    []
  );
  const initialColumnOrder = sellingPriceHistoryColumns?.filter(column => column?.id).map((column) => column.id!) || [];
  
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(
    COLUMN_ORDERING_KEY,
    initialColumnOrder
  );
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(
    COLUMN_SIZING_KEY,
    {}
  );
  const [pagination, setPagination] = useLocalStorage<PaginationState>(
    PAGINATION_KEY,
    {
      pageIndex: 0,
      pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
    }
  );
  const [sorting, setSorting] = useLocalStorage<SortingState>(SORTING_KEY, []);

  const defaultColumns: Array<keyof SellingPriceHistoryItem> = [
    "docNo",
    "docDateFormat",
    "price",
    "currencyCode",
    "sourceModule",
  ];

  const defaultColumnVisibility: VisibilityState = getExcludedColumns(
    sellingPriceHistoryColumns || [],
    defaultColumns
  );

  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    COLUMN_VISIBILITY_KEY,
    defaultColumnVisibility
  );

  // Add preference data to columns with safe defaults
  const columnsWithPreference = sellingPriceHistoryColumns.map(column => ({
    ...column,
    cell: column.cell ? (props) => {
      const cellProps = {
        ...props,
        row: {
          ...props.row,
          original: {
            ...props.row.original,
            preferenceData: preferenceData || { data: { decimal: 2 } } // Provide default if undefined
          }
        }
      };
      return column.cell(cellProps);
    } : undefined
  }));

  // Server-Side Filtering (Data Fetching)
  const {
    data: sellingPriceHistoryData,
    error,
    isLoading,
    isValidating,
    mutate: mutateTableData,
  } = useSWR<SellingPriceHistoryData, Error>(
    open && itemId ? [`${ORIGIN}/stock/api/stock/get-selling-price-history`, itemId, columnFilters, pagination, sorting] : null,
    async ([url, id]) => {
      const params = new FormData();

      // Remove the id from FormData since it's now in the URL
      params.append("param[limit]", `${pagination.pageSize}`);
      params.append(
        "param[offset]",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      params.append(
        "param[filter]",
        columnFilters.length > 0
          ? JSON.stringify(
              columnFilters.reduce<Record<string, unknown>>(
                (acc, curr) => {
                  acc[curr.id] = curr.value;
                  return acc;
                },
                {}
              )
            )
          : "{}"
      );
      params.append(
        "param[order]",
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc"
      );
      params.append(
        "param[sort]",
        sorting.length > 0 ? sorting[0].id : "docDateFormat"
      );

      try {
        // Append the id as a query parameter to the URL
        const urlWithId = `${url}?id=${id}`;
        const response = await fetch(urlWithId, {
          method: "POST",
          headers,
          body: params,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch selling price history data");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
    }
  );

  useEffect(() => {
    if (sellingPriceHistoryData) {
      // Add preference data to each row with safe defaults
      const dataWithPreferences = (sellingPriceHistoryData.rows || []).map((row) => ({
        ...row,
        preferenceData: preferenceData || { data: { decimal: 2 } }, // Provide default if undefined
      }));

      setTableData(dataWithPreferences);
      setTotalNumOfRows(+sellingPriceHistoryData.total);
    }
  }, [sellingPriceHistoryData, preferenceData]);

  // Server-Side Filtering (Table)
  const table = useReactTable({
    columns: columnsWithPreference,
    data: tableData || [],
    state: { 
      columnFilters,
      columnOrder,
      columnSizing,
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    autoResetPageIndex: false,
    columnResizeMode: "onChange",
    defaultColumn: DATA_TABLE_DEFAULT_COLUMN_SIZING,
    enableColumnResizing: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalNumOfRows
      ? Math.ceil(totalNumOfRows / pagination.pageSize)
      : -1,
    getCoreRowModel: getCoreRowModel(),
  });

  // Column Drag and Drop and Resize (Hooks)
  const sensors = useDndSensors();
  const columnSizeVars = useColumnSizeVars(table);

  useEffect(() => {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  usePreventShiftTextSelect();

  // Server-Side Filtering (Loading State)
  useEffect(() => {
    if (isLoading || !sellingPriceHistoryData) {
      setLoadingProgress(90);
      setIsLoadedSuccessfully(false);
    } else {
      setIsLoadedSuccessfully(true);
    }
  }, [isLoading, sellingPriceHistoryData]);

  // Server-Side Filtering (Handle Validation State Changes)
  useEffect(() => {
    if (isValidating) {
      setIsLoadedSuccessfully(false);
      setLoadingProgress(95);
    } else {
      setIsLoadedSuccessfully(true);
    }
  }, [isValidating]);

  // Manual refresh function for toolbar
  const refreshData = () => {
    mutateTableData();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="mx-2">
      <DialogContent className="min-h-[75vh] min-w-[75vw] max-w-3xl bg-erp-blue-3 p-2">
        <div className="flex flex-row">
          <div className="h-[73cqh] w-full p-4">
            <div className="flex h-[70cqh] flex-col bg-erp-blue-3 @container-[size]">
              <h2 className="text-sm font-bold">Selling Price History</h2>
              <SellingPriceHistoryPopoverToolbar
                table={table}
                setOpen={setOpen}
                refreshData={refreshData}
                isLoading={isLoading || isValidating}
                totalNumOfRows={totalNumOfRows}
              />
              <Separator className="bg-erp-blue-11" />
              <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                {/* Mobile View (Data Table) */}
                <MobilePopoverDataTable
                  table={table}
                  headerFields={["docNo", "docDateFormat"]}
                  initialVisibleFields={4}
                  excludeFromGrid={["docNo"]}
                  showSelection={false}
                />

                {/* Web View (Data Table) */}
                <div className="hidden md:block">
                  {/* Column Drag and Drop and Resize (DND Context) */}
                  <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={(event) => handleDndDragEnd(event, setColumnOrder)}
                    sensors={sensors}
                  >
                    {/* Column Drag and Drop and Resize (Table) */}
                    <Table 
                      className="table-fixed border-separate border-spacing-[3px] whitespace-nowrap border bg-erp-gray-1"
                      style={{ ...columnSizeVars, width: table.getTotalSize() }}
                    >
                      <TableHeader className="sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {/* Column Drag and Drop and Resize (Sortable Context) */}
                            <SortableContext
                              items={columnOrder}
                              strategy={horizontalListSortingStrategy}
                            >
                              {headerGroup.headers.map((header) => (
                                // Column Drag and Drop and Resize (Dragable Table Head)
                                <DragableTableHead
                                  key={header.id}
                                  header={header}
                                  className="bg-erp-blue-11 font-normal"
                                  style={{
                                    width: `calc(var(--header-${header?.id}-size) * 1px)`,
                                  }}
                                >
                                  <TableHeadColumnTextFilter column={header.column} table={table} />
                                  <ColumnResizer header={header} />
                                </DragableTableHead>
                              ))}
                            </SortableContext>
                          </TableRow>
                        ))}
                      </TableHeader>
                      {/* Column Drag and Drop and Resize (Table Body) */}
                      {table.getState().columnSizingInfo.isResizingColumn ? (
                        <MemoizedTableBody
                          table={table}
                          columns={columnsWithPreference}
                        />
                      ) : (
                        <NonMemoizedTableBody
                          table={table}
                          columns={columnsWithPreference}
                          
                        />
                      )}
                      {!isLoadedSuccessfully && <LoadingUI progressValue={loadingProgress} />}
                    </Table>
                  </DndContext>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Column Drag and Drop and Resize (Table Body)
type TableBodyProps = {
  table: TableType<SellingPriceHistoryItem>;
  columns: ColumnDef<SellingPriceHistoryItem>[];
};

function NonMemoizedTableBody({ table, columns }: TableBodyProps) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            className="odd:bg-erp-blue-5 even:bg-erp-blue-1 hover:bg-erp-blue-7"
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell 
                key={cell.id} 
                className="truncate"
                title={(cell.getValue() ?? "").toString()}
                style={{
                  width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                  minWidth: cell.column.columnDef.minSize,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <NoResultsTableRow columns={columns} />
      )}
    </TableBody>
  );
}

const MemoizedTableBody = memo(
  NonMemoizedTableBody,
  (prev, next) => prev.table.options.data === next.table.options.data
) as typeof NonMemoizedTableBody;
