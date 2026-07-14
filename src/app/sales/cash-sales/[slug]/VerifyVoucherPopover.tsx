"use client";

import { useEffect, useState, memo } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";
import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useSearchParams } from "next/navigation";

import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
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

import { DEFAULT_DATA_TABLE_PAGE_SIZE, getAuthHeaders } from "@/lib/constants";
import { useHandleRowSelect } from "@/lib/hooks/useHandleRowSelect";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import { cn } from "@/lib/utils/cn";

import VerifyVoucherPopoverToolbar from "./VerifyVoucherPopoverToolbar";
import type { ItemList } from "./VerifyVoucherColumn";
import { VerifyVoucherColumns } from "./VerifyVoucherColumn";

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
import type {
  ColumnOrderState,
  ColumnSizingState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";
import { set } from "date-fns";

type Props = {
  open: boolean;
  setOpen: (state: boolean) => void;
  data: any;
  tempRowCashSalesDetailsList: any;
  updateSelectedVoucherData: any;
  form:any;
};

// Column Drag and Drop and Resize (Local Storage Keys)
const COLUMN_ORDERING_KEY = "cash-sales-verify-voucher.bs.table.ordering";
const COLUMN_SIZING_KEY = "cash-sales-verify-voucher.bs.table.sizing";
const COLUMN_VISIBILITY_KEY = "cash-sales-verify-voucher.item.bs.table.columns";

// HTML Utility Function
function stripHtml(html) {
  if (!html) return "";
  // Replace <br> and <br/> with newlines
  let text = html.replace(/<br\s*\/?>/gi, '\n');
  // Replace <p> with nothing, </p> with newline
  text = text.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n');
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, '');
  // Replace HTML entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

  return text;
};


export default function ItemPopover({
  open,
  setOpen,
  data,
  tempRowCashSalesDetailsList,
  updateSelectedVoucherData,
  form
}: Props) {

  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const headers = getAuthHeaders();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [saveDisabled, setSaveDisabled] = useState(false);

  // Selection Order (State)
  const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

  // Column Drag and Drop and Resize (State)
  const initialColumnOrder = VerifyVoucherColumns?.filter(column => column?.id).map((column) => column.id!) || [];

  const [verifyVoucherColumnOrder, setVerifyVoucherColumnOrder] = useLocalStorage<ColumnOrderState>(
    COLUMN_ORDERING_KEY,
    initialColumnOrder
  );
  const [verifyVoucherColumnSizing, setVerifyVoucherColumnSizing] = useLocalStorage<ColumnSizingState>(
    COLUMN_SIZING_KEY,
    {}
  );

  const verifyVoucherDefaultColumns: Array<keyof ItemList> = [
    "itemName",
    "itemCode",
    "type"
  ];

  const verifyVoucherDefaultColumnVisibility: VisibilityState = getExcludedColumns(
    VerifyVoucherColumns || [],
    verifyVoucherDefaultColumns
  );


  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    COLUMN_VISIBILITY_KEY,
    verifyVoucherDefaultColumnVisibility
  );

  const table = useReactTable({
    columns: VerifyVoucherColumns,
    data: data || [], // Use passed itemData instead of extracting from itemTable
    state: {
      sorting,
      columnVisibility,
      columnOrder: verifyVoucherColumnOrder,
      columnSizing: verifyVoucherColumnSizing,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setVerifyVoucherColumnOrder,
    onColumnSizingChange: setVerifyVoucherColumnSizing,
    autoResetPageIndex: false,
    columnResizeMode: "onChange",
    defaultColumn: DATA_TABLE_DEFAULT_COLUMN_SIZING,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableMultiRowSelection: false,
    initialState: {
      pagination: {
        pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
      },
      columnVisibility: JSON.parse(localStorage.getItem(COLUMN_VISIBILITY_KEY) || "{}"),
    },
  });



  // Column Drag and Drop and Resize (Hooks)
  const sensors = useDndSensors();
  //const columnSizeVars = useColumnSizeVars(table);

  useEffect(() => {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  usePreventShiftTextSelect();

  const onSave = async (prop) => {
    // if (id && slug !== "clone") {
    //   // Selection Order (Pass Selection Order)
    //   await updateItem({
    //     ...prop,
    //     selectionOrder: selectionOrder,
    //   });

    //   revalidatePromotionVoucherDetails();
    // } else {
    let selectedRows = Array(0);

    // Selection Order (Logic)
    if (prop.table) {
      const selectedRowsMap = new Map(
        prop.table.getSelectedRowModel().rows.map(row => [row.id, row])
      );

      selectedRows = selectionOrder
        .filter(rowId => selectedRowsMap.has(rowId))
        .map(rowId => selectedRowsMap.get(rowId));
    } else {
      selectedRows.push(prop.row);
    }
    // Selection Order (Add Index and Sequence)
    selectedRows.forEach((row, index) => {
      // Get the maximum existing sequence number
      const existingData = tempRowCashSalesDetailsList || [];
      const maxSeq = existingData.length > 0
        ? Math.max(...existingData.map(item => parseInt(item.seq) || 0))
        : 0;

      let item = row.original;
      updateSelectedVoucherData(item, false);
    });
    //}

    if (prop.table) {
      prop.table.resetRowSelection();

      // Selection Order (Reset)
      setSelectionOrder([]);
    }

    setOpen(false);
  };

  const onDoubleClick = (row: Row<ItemList>) => {
    onSave({ row: row });
  };

   const checkSelectedRow = () => {
    form.setValue("voucher","")
     form.setValue("voucherCode","")
  };

  // Selection Order (Handler)
  const onItemRowSelection = (row: Row<ItemList>) => (event: React.MouseEvent) => {
    const isSelected = row.getIsSelected();

    if (event.detail === 2) {
      // Double click
      onDoubleClick(row);
      return;
    }

    // Handle selection order
    if (isSelected) {
      // Deselecting - remove from order
      setSelectionOrder(prev => prev.filter(id => id !== row.id));
    } else {
      // Selecting - add to end of order
      setSelectionOrder(prev => [...prev, row.id]);
    }

    row.toggleSelected();
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
    if (!nextOpen) {
      checkSelectedRow();
    }
    setOpen(nextOpen);
  }} className="mx-2">
      <DialogContent className="min-h-[75vh] min-w-[75vw] max-w-3xl bg-erp-blue-3 p-2">
        <div className="flex flex-row">
          <div className="h-[73cqh] w-full p-4">
            <div className="flex h-[70cqh] flex-col bg-erp-blue-3 @container-[size]">
              <h2 className="text-sm font-bold">Select Item</h2>
              <VerifyVoucherPopoverToolbar
                table={table}
                setOpen={setOpen}
                handleSave={onSave}
                // revalidateQuotationDetails={revalidateQuotationDetails}
                // fetchItemData={fetchItemData}
                // itemType={itemType}
                setSelectedRow={setSelectedRow}
                saveDisabled={saveDisabled}
                setSaveDisabled={setSaveDisabled}
                form={form}
              />
              <Separator className="bg-erp-blue-11" />
              <ScrollArea className="h-[100cqh] bg-erp-gray-3">



                {/* Web View (Data Table) */}
                <div className="hidden md:block">
                  {/* Column Drag and Drop and Resize (DND Context) */}
                  <DndContext
                    collisionDetection={closestCenter}
                    modifiers={[restrictToHorizontalAxis]}
                    onDragEnd={(event) => handleDndDragEnd(event, setVerifyVoucherColumnOrder)}
                    sensors={sensors}
                  >
                    {/* Column Drag and Drop and Resize (Table) */}
                    <Table
                      className="table-fixed border-separate border-spacing-[3px] whitespace-nowrap border bg-erp-gray-1"
                    // style={{ ...columnSizeVars, width: table.getTotalSize() }}
                    >
                      <TableHeader className="sticky top-0 z-10">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {/* Column Drag and Drop and Resize (Sortable Context) */}
                            <SortableContext
                              items={verifyVoucherColumnOrder}
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
                                  {header.column.id === "valid" ? (
                                    <TableHeadValidityFilter table={table} />
                                  ) : (
                                    <TableHeadColumnTextFilter column={header.column} table={table} />
                                  )}
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
                          onItemRowSelection={onItemRowSelection}
                          columns={VerifyVoucherColumns}
                        />
                      ) : (
                        <NonMemoizedTableBody
                          table={table}
                          onItemRowSelection={onItemRowSelection}
                          columns={VerifyVoucherColumns}
                        />
                      )}
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
  table: TableType<ItemList>;
  onItemRowSelection: (row: Row<ItemList>) => (event: MouseEvent<HTMLTableRowElement>) => void;
  columns: ColumnDef<ItemList>[];
};

function NonMemoizedTableBody({ table, onItemRowSelection, columns }: TableBodyProps) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            className="odd:bg-erp-blue-5 even:bg-erp-blue-1 hover:bg-erp-blue-7 data-[state=selected]:bg-erp-blue-17"
            data-state={row.getIsSelected() && "selected"}
            onClick={onItemRowSelection(row)}
            key={row.id}
          >
            {row.getVisibleCells().map((cell) => {
              if (
                cell.column.id === "description" ||
                cell.column.id === "2ndDescription" ||
                cell.column.id === "moreDescription"
              ) {
                return (
                  <TableCell
                    key={cell.id}
                    className="truncate"
                    title={stripHtml((cell.getValue() ?? "").toString())}
                    style={{
                      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                      minWidth: cell.column.columnDef.minSize,
                    }}
                  >
                    {stripHtml((cell.getValue() ?? "").toString())}
                  </TableCell>
                );
              } else {
                return (
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
                );
              }
            })}
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
