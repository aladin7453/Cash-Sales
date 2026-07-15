"use client";

//Currency
import currency from 'currency.js';

import { closestCenter, DndContext } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import React, { memo, useEffect, useRef, useState } from "react";

import { ColumnResizer } from "@/components/data-table/ColumnResizer";
import DragableTableHead from "@/components/data-table/DragableTableHead";
import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import {
  DragDropDataTable,
  DraggableRow,
  DragHandle,
  useDragDropTable,
} from "@/components/data-table/row-drag-drop";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
import { TableHeadValidityFilter } from "@/components/data-table/TableHeadValidityFilter";
import {
  DateInputCellComponent,
  DescriptionInputCellComponent,
  DropdownInputCellComponent,
  NumberInputCellComponent,
  TextInputCellComponent,
  UOMDropdownInputCell,
} from "@/components/features/sales-purchase-transaction/charges-details/inputCell";
import SellingPriceHistoryPopover from "@/components/features/sales-purchase-transaction/selling-price-history-popover/sellingPriceHistoryPopover";
import SerialNumberPopover from "@/components/features/sales-purchase-transaction/serial-number-popover/serialNumberPopover";
import MobileFormDataTable from "@/components/form/MobileFormDataTable";
import DataTableTotals from "@/components/form/MobileFormDataTableTotals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { DropdownData } from "@/components/data-table/GetAllDropdown";
import LoadingUI from "@/components/LoadingUI";
import {
  cacheItems,
  getCachedItems,
  cachePackages,
  getCachedPackages,
  cacheDetails
} from "@/components/offlineDB";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DATA_TABLE_DEFAULT_COLUMN_SIZING,
  DEFAULT_DATA_TABLE_PAGE_SIZE_NEW,
  getAuthHeaders,
  getCurrentCompanyUUID,
  getCurrentUserID,
  ORIGIN,
} from "@/lib/constants";
import { useColumnSizeVars } from "@/lib/hooks/useColumnSizeVars";
import { useDndSensors } from "@/lib/hooks/useDndSensors";
import { useHandleRowSelect } from "@/lib/hooks/useHandleRowSelect";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import authorizedFetcher from "@/lib/utils/authorizedFetcher";
import { cn } from "@/lib/utils/cn";
import formatNumber from "@/lib/utils/data-table/formatNumber";
import getExcludedColumns from "@/lib/utils/data-table/getExcludedColumns";
import handleDndDragEnd from "@/lib/utils/data-table/handleDndDragEnd";

import CashSalesDetailsDataTableToolbar from "./DataTableToolbar";
import { ServiceColumns, StockColumns } from "./itemColumns";
import ItemPopover from "./ItemPopover";
import { PackageColumns } from "./packageColumns";
import PackagePopover from "./PackagePopover";

import type { ColumnDef, Row, SortingState, Column } from "@tanstack/react-table";
import type {
  ColumnOrderState,
  ColumnSizingState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";

import type { CashSales } from "./columns";

type DataTableProps = {
  columns: ColumnDef<CashSales>[];
  data: CashSales[];
  tempRowCashSalesDetailsList: any;
  setTempRowCashSalesDetailsList: (data: any) => void;
  revalidateCashSalesDetails: () => void;
  form: any;
  cashSalesData: any;
  UOMDetails: any[];
  isPaidAmountEmpty: boolean;
  isPaidAmountManuallyUpdated: boolean;
  isPaid: boolean;
  slug: string;
  isMobile?: boolean;
  preferenceData: any;
  allDropdowns: DropdownData;
};

const COLUMN_ORDERING_KEY = "cash-sales.details.bs.table.ordering";
const COLUMN_SIZING_KEY = "cash-sales.details.bs.table.sizing";
const COLUMN_VISIBILITY_KEY = "cash-sales.details.bs.table";

function stripHtml(html: any) {
  if (!html) return "";
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  return text;
}

export default function CashSalesDetailsDataTable({
  columns,
  data,
  tempRowCashSalesDetailsList,
  setTempRowCashSalesDetailsList,
  revalidateCashSalesDetails,
  form,
  cashSalesData,
  UOMDetails,
  isPaidAmountEmpty,
  isPaidAmountManuallyUpdated,
  isPaid,
  slug,
  isMobile,
  preferenceData,
  allDropdowns
}: DataTableProps) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const headers = getAuthHeaders();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const currentUserUUID = getCurrentUserID();

  const initialColumnOrder =
    columns?.filter((column) => column?.id).map((column) => column.id!) || [];
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(
    COLUMN_ORDERING_KEY,
    initialColumnOrder,
  );
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(COLUMN_SIZING_KEY, {});
  const defaultColumns: Array<keyof CashSales> = [
    "itemCode",
    "itemName",
    "type",
    "quantity",
    "price",
    "subtotalTax",
  ];
  const defaultColumnVisibility: VisibilityState = getExcludedColumns(columns || [], defaultColumns);
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    COLUMN_VISIBILITY_KEY,
    defaultColumnVisibility,
  );

  const [additionalDiscount, setAdditionalDiscount] = useState(
    cashSalesData?.additionalDiscount ? Number(cashSalesData.additionalDiscount) : 0,
  );

  useEffect(() => {
    const subscription = form.watch((value: any, name: any) => {
      if (name === "additionalDiscount") {
        const newValue = Number(value.additionalDiscount) || 0;
        setAdditionalDiscount(newValue);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const [currentCurrencyRate, setCurrentCurrencyRate] = useState<number>(1);

  function setTempRowCashSalesDetailsListData(data: any, overwrite: any) {
    if (overwrite) {
      const updatedData = data.map((item: any, index: any) => ({
        ...item,
        master: index === 0 ? "1" : item.master || "0",
        showTemplate: index === 0 ? "1" : item.showTemplate || "0",
      }));
      setTempRowCashSalesDetailsList(updatedData);
    } else {
      setTempRowCashSalesDetailsList((prevList: any) => {
        const currentList = Array.isArray(prevList) ? prevList : [];
        const newData = Array.isArray(data) ? data : [data];
        const updatedData = [...currentList, ...newData];
        return updatedData.map((item, index) => ({
          ...item,
          master: index === 0 ? "1" : item.master || "0",
          showTemplate: index === 0 ? "1" : item.showTemplate || "0",
        }));
      });
    }
  }

  const [sorting, setSorting] = useState<SortingState>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [rowSelection, setRowSelection] = useState({});

  const tableData =
    (tempRowCashSalesDetailsList) || slug === "clone"
      ? tempRowCashSalesDetailsList
      : data;

  const { items, activeId, isDragging, handleDragStart, handleDragEnd, getRowId } =
    useDragDropTable({
      data: tableData,
      onReorder: (newData) => {
        const dataWithUpdatedSeq = newData.map((item, index) => {
          const updatedItem: any = {
            ...item,
            seq: (index + 1).toString(),
          };
          if (index === 0) {
            updatedItem.master = "1";
            updatedItem.showTemplate = "1";
          }
          return updatedItem;
        });

        setTempRowCashSalesDetailsList(dataWithUpdatedSeq);

        const newMasterStates: Record<number, string> = {};
        const newShowInPDFStates: Record<number, string> = {};
        dataWithUpdatedSeq.forEach((item, index) => {
          newMasterStates[index] = item.master || "0";
          newShowInPDFStates[index] = item.showTemplate || "0";
        });
        setMasterServiceStates(newMasterStates);
        setShowInPDFStates(newShowInPDFStates);
        setRefreshKey((prev) => prev + 1);
      },
      idField: "UUID",
      disabled: false,
    });

  const table = useReactTable({
    columns,
    data: tableData,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnOrder,
      columnSizing,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    enableRowSelection: true,
    autoResetPageIndex: false,
    columnResizeMode: "onChange",
    defaultColumn: DATA_TABLE_DEFAULT_COLUMN_SIZING,
    enableColumnResizing: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row, index) => getRowId(row, index),
    initialState: {
      pagination: { pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE_NEW },
      columnVisibility: JSON.parse(localStorage.getItem(COLUMN_VISIBILITY_KEY) || "{}"),
    },
  });

  const sensors = useDndSensors();
  const columnSizeVars = useColumnSizeVars(table);

  useEffect(() => {
    localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
  }, [columnVisibility]);

  const currentCompanyUUID = getCurrentCompanyUUID();

  let userHasRuleData = { userHasRule: [] };
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("userRule");
    if (stored) userHasRuleData = JSON.parse(stored);
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [packageData, setPackageData] = useState([]);
  const [masterServiceStates, setMasterServiceStates] = useState({});
  const [showInPDFStates, setShowInPDFStates] = useState({});
  const [itemType, setItemType] = useState<"stock" | "service">("stock");
  const [textInputs, setTextInputs] = useState({});
  const [numberInputs, setNumberInputs] = useState({});
  const [UOMInputs, setUOMInputs] = useState({});
  const [UOM2Inputs, setUOM2Inputs] = useState<Record<string, string>>({});
  const [UOM3Inputs, setUOM3Inputs] = useState<Record<string, string>>({});
  const [moreDescriptions, setMoreDescriptions] = useState({});
  const [showTables, setShowTables] = useState({});
  const [dropdownDatas, setDropdownDatas] = useState({});
  const [dropdownInputDatas, setDropdownInputDatas] = useState({});

  const [priceHistoryDialogOpen, setPriceHistoryDialogOpen] = useState(false);
  const [selectedItemForPriceHistory, setSelectedItemForPriceHistory] = useState<string>("");
  const [serialNumberDialogOpen, setSerialNumberDialogOpen] = useState(false);
  const [selectedRowForSerialNumber, setSelectedRowForSerialNumber] = useState<any>(null);

  const dropdownTableColumns = {
    classificationCode: [
      { accessorKey: "classificationCode", header: "Classification Code" },
      { accessorKey: "description", header: "Description" },
    ],
    projectCode: [
      { accessorKey: "projectCode", header: "Project Code" },
      { accessorKey: "description", header: "Description" },
    ],
    stockBatchCode: [
      { accessorKey: "stockBatchCode", header: "Stock Batch Code" },
      { accessorKey: "description", header: "Description" },
    ],
    locationCode: [
      { accessorKey: "locationCode", header: "Location Code" },
      { accessorKey: "locationName", header: "Location" },
      { accessorKey: "description", header: "Description" },
    ],
    taxCode: [
      { accessorKey: "taxCode", header: "Tax Code" },
      { accessorKey: "taxTypeCode", header: "Tax Type" },
      { accessorKey: "taxRate", header: "Tax Rate" },
      { accessorKey: "description", header: "Description" },
    ],
    customerCodeCode: [
      { accessorKey: "customerCode", header: "Customer Code" },
      { accessorKey: "customerGroupCode", header: "Customer Group" },
      { accessorKey: "customerName", header: "Customer Name" },
      { accessorKey: "BRN", header: "BRN" },
    ],
  };

  const dropdownTableNames: Record<string, string> = {
    classificationCode: "classification",
    projectCode: "project",
    stockBatchCode: "stockBatch",
    locationCode: "location",
    taxCode: "tax",
    customerCodeCode: "customer",
  };

  useEffect(() => {
    setDropdownDatas({
      classificationCode: allDropdowns.classification ?? [],
      projectCode: allDropdowns.project ?? [],
      stockBatchCode: allDropdowns.stockBatch ?? [],
      locationCode: allDropdowns.location ?? [],
      taxCode: allDropdowns.tax ?? [],
      customerCodeCode: (allDropdowns.customer ?? []).map((row) => ({
        ...row,
        customerCodeCode: row.customerCode,
      })),
    });
  }, [allDropdowns]);

  const handleDropdownDataRefreshed = (dropdownKey: string, freshRows: any[]) => {
    const rows =
      dropdownKey === "customerCodeCode"
        ? freshRows.map((row) => ({ ...row, customerCodeCode: row.customerCode }))
        : freshRows;

    setDropdownDatas((prev) => ({ ...prev, [dropdownKey]: rows }));
  };

  usePreventShiftTextSelect();

  const onDoubleClick = (row: Row<CashSales>) => { };
  const onRowSelection = useHandleRowSelect(table, onDoubleClick);

  const itemTable = useReactTable({
    columns: itemType === "service" ? ServiceColumns : StockColumns,
    data: itemData,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE_NEW } },
  });

  const handleOnAdd = async () => {
    setDialogOpen(true);
    await fetchItemData(itemType);
  };

  useEffect(() => {
    fetchItemData("service");
    fetchItemData("stock");
    fetchPackageData();
  }, []);

  const fetchItemData = async (itemType: "stock" | "service") => {
    if (itemType !== itemType) {
      setItemData([]);
    }
    setIsLoading(true);
    setItemType(itemType);

    if (!navigator.onLine) {
      const cached = await getCachedItems(itemType);
      if (cached) setItemData(cached);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${ORIGIN}/universal/get-all-item-details?itemType=${itemType}&module=sales`,
        {
          headers,
        },
      );
      if (!response.ok) throw new Error(`Failed to fetch ${itemType} item data`);
      const rows = (await response.json()).rows ?? [];

      await cacheItems(itemType, rows);
      setItemData(rows);
    } catch (error) {
      console.error(`Failed to fetch ${itemType} data`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnPackage = async () => {
    setPackageDialogOpen(true);
    fetchPackageData();
  };

  const fetchPackageData = async () => {
    setIsLoading(true);
    if (!navigator.onLine) {
      const cached = await getCachedPackages();
      if (cached) setPackageData(cached);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${ORIGIN}/universal/get-all-package`, { headers });
      if (!response.ok) throw new Error("Failed to fetch package data");
      const rows = (await response.json()).rows ?? [];

      await cachePackages(rows);
      setPackageData(rows);
    } catch (error) {
      console.error("Failed to fetch package data");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = (field: keyof CashSales | string) => {
    let total = 0;
    table.getRowModel().rows.forEach((row) => {
      if (field === "discountAmount") {
        const discount1 = Number(row.original.discountAmount) || 0;
        const discount2 = Number(row.original.discountAmount2) || 0;
        const discount3 = Number(row.original.discountAmount3) || 0;
        total += discount1 + discount2 + discount3;
      } else if (row.original[field as keyof CashSales]) {
        total += Number(row.original[field as keyof CashSales]);
      }
    });
    if (field === "subTotal") {
      const additionalDiscount = parseFloat(form.getValues("additionalDiscount") || "0");
      total -= additionalDiscount;
    }
    if (field === "quantity") {
      return total.toFixed(3);
    }
    return total.toFixed(2);
  };

  const calculateNetTotal = (convertToLocal: boolean) => {
    let total = 0;
    table.getCoreRowModel().rows.forEach((row) => {
      if (row.original.subtotalTax) total += Number(row.original.subtotalTax);
    });
    const additionalDiscount = parseFloat(form.getValues("additionalDiscount") || "0");
    total -= additionalDiscount;
    total = Math.round(total * 20) / 20;
    if (convertToLocal) total *= currentCurrencyRate;
    return total.toFixed(2);
  };

  const calculateTotalDiscount = () => {
    const rowTotalDiscount = table.getRowModel().rows.reduce((sum, row) => {
      const discount1 = Number(row.original.discountAmount) || 0;
      const discount2 = Number(row.original.discountAmount2) || 0;
      const discount3 = Number(row.original.discountAmount3) || 0;
      return sum + discount1 + discount2 + discount3;
    }, 0);
    const additionalDiscount = parseFloat(form.getValues("additionalDiscount") || "0");
    return rowTotalDiscount + additionalDiscount;
  };

  type CellParam = { row: Row<CashSales>; column: { id: string } };

  const textInputCell = ({ row, column: { id } }: CellParam) => (
    <TextInputCellComponent
      row={row} column={{ id }} className="h-7.5 text-[11px]"
      setTextInputs={setTextInputs} setTempRowDetailsList={setTempRowCashSalesDetailsList}
    />
  );

  const descriptionInputCell = ({ row, column: { id } }: CellParam, moduleName: string) => (
    <DescriptionInputCellComponent
      row={row} column={{ id }} className="h-7.5 px-2 py-0 text-[11px]"
      setTextInputs={setTextInputs} setMoreDescriptions={setMoreDescriptions}
      setTempRowDetailsList={setTempRowCashSalesDetailsList} moduleName={"cashSales"}
    />
  );

  const UOMDropdownCell = ({ row, column: { id } }: CellParam) => (
    <UOMDropdownInputCell
      row={row} column={{ id }}
      UOMInputs={UOMInputs} setUOMInputs={setUOMInputs}
      UOM2Inputs={UOM2Inputs} setUOM2Inputs={setUOM2Inputs}
      UOM3Inputs={UOM3Inputs} setUOM3Inputs={setUOM3Inputs}
      setTempRowDetailsList={setTempRowCashSalesDetailsList} isPaid={isPaid}
    />
  );

  const dateInputCell = ({ row, column: { id } }: CellParam) => (
    <DateInputCellComponent row={row} column={{ id }} setTempRowDetailsList={setTempRowCashSalesDetailsList} />
  );

  const dropDownInputCell = ({ row, column: { id } }: CellParam) => (
    <DropdownInputCellComponent
      row={row} column={{ id }}
      dropdownDatas={dropdownDatas} setDropdownDatas={setDropdownDatas}
      dropdownInputDatas={dropdownInputDatas} setDropdownInputDatas={setDropdownInputDatas}
      showTables={showTables} setShowTables={setShowTables}
      setTempRowDetailsList={setTempRowCashSalesDetailsList}
      fetchDropdownData={fetchDropdownData}
      dropdownTableColumns={dropdownTableColumns}
      dropdownTableNames={dropdownTableNames}      
      onDropdownRefreshed={handleDropdownDataRefreshed}
      inputRef={inputRef} dropdownRef={dropdownRef} isPaid={isPaid}
    />
  );

  const numberInputCell = ({ row, column: { id } }: CellParam, allowDecimal: boolean) => {
    let appliedVoucher = false;
    if (id == "discountRate" || id == "discountAmount") {
      appliedVoucher = row.original.voucher ? true : false;
    }
    const disableDiscountFields =
      !userHasRuleData?.userHasRule?.includes("enable-cash-sales-discount-update");


    // Check if negative values are allowed for price field
    const allowNegative =
      id === "price" && userHasRuleData?.userHasRule.includes("update-cash-sales-below-0");
    const isQuantityField = id === "quantity" || id === "quantity2" || id === "quantity3";
    const isBarcodeScanned = !!row.original.specialCase;
    const disableQuantity = isQuantityField && isBarcodeScanned;

    return (
      <NumberInputCellComponent
        row={row} column={{ id }} allowDecimal={allowDecimal}
        setNumberInputs={setNumberInputs} setTempRowDetailsList={setTempRowCashSalesDetailsList}
        userHasRuleData={userHasRuleData} allowNegative={allowNegative}
        disableDiscountFields={disableDiscountFields}
        onPriceHistoryClick={(itemId) => {
          if (!isOnline) {
            toast({
              title: "Offline",
              description: "Selling price history requires an internet connection.",
              variant: "destructive",
              duration: 2500,
            });
            return;
          }
          setSelectedItemForPriceHistory(itemId);
          setPriceHistoryDialogOpen(true);
        }}
        onSerialNumberClick={(row) => {
          setSelectedRowForSerialNumber(row);
          setSerialNumberDialogOpen(true);
        }}
        isPaid={isPaid} appliedVoucher={appliedVoucher}
        disabled={disableQuantity} moduleName='3decimal'
      />
    );
  };

  const fetchDropdownData = (table: string) => {
    setShowTables((prev) => ({
      ...prev,
      [table]: !prev[table],
    }));
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      inputRef.current !== event.target
    ) {
      setShowTables(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  const updateItem = async (prop: any) => {
    setTextInputs({});
    setNumberInputs({});

    const now = new Date();
    const startDayTs = Math.floor(now.getTime() / 1000);
    const lastDayTs = Math.floor(
      new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime() / 1000,
    );

    try {
      const formData = new FormData();
      let selectedRowModel = Array(0);

      if (prop.table) {
        if (prop.selectionOrder && prop.selectionOrder.length > 0) {
          const selectedRowsMap = new Map(
            prop.table.getSelectedRowModel().rows.map((row: any) => [row.id, row]),
          );
          selectedRowModel = prop.selectionOrder
            .filter((rowId: any) => selectedRowsMap.has(rowId))
            .map((rowId: any) => selectedRowsMap.get(rowId));
        } else {
          selectedRowModel = prop.table.getSelectedRowModel().rows;
        }
      } else {
        selectedRowModel.push(prop.row);
      }

      let updatedTotalAmount = table.getRowModel().rows.reduce((sum, row) => {
        return sum + (row.original.amount ? parseFloat(row.original.amount) : 0);
      }, 0);

      const rowTotalDiscount = table.getRowModel().rows.reduce(
        (sum, row) => sum + (row.original.discountAmount ? parseFloat(row.original.discountAmount) : 0), 0,
      );
      const rowTotalDiscount2 = table.getRowModel().rows.reduce(
        (sum, row) => sum + (row.original.discountAmount2 ? parseFloat(row.original.discountAmount2) : 0), 0,
      );
      const rowTotalDiscount3 = table.getRowModel().rows.reduce(
        (sum, row) => sum + (row.original.discountAmount3 ? parseFloat(row.original.discountAmount3) : 0), 0,
      );

      const finalRowTotalDiscount = rowTotalDiscount + rowTotalDiscount2 + rowTotalDiscount3;
      const totalDiscount = finalRowTotalDiscount + additionalDiscount;
      const totalTax = table.getRowModel().rows.reduce(
        (sum, row) => sum + (row.original.taxAmount ? parseFloat(row.original.taxAmount) : 0), 0,
      );
      const totalFeeAmount = 0;

      if (!prop.isUpdate) {
        selectedRowModel.forEach((row) => {
          updatedTotalAmount += row.original.refPrice ? parseFloat(row.original.refPrice) : 0;
        });
      }

      const subtotalTax = updatedTotalAmount - totalDiscount + totalTax;
      const prepaymentAmount = form.getValues("prepaymentAmount");
      const totalPayable = updatedTotalAmount - totalDiscount + totalTax;
      const roundTotalPayable = Math.round(totalPayable * 20) / 20;
      const roundTotalPayableAfterPrepayment = roundTotalPayable - (prepaymentAmount ? prepaymentAmount : 0);
      const localNetTotal = roundTotalPayable * currentCurrencyRate;
      const totalExclTax = updatedTotalAmount - finalRowTotalDiscount;
      const roundingAmount = roundTotalPayable - totalPayable;

      const cashSalesData = {
        totalAmount: updatedTotalAmount.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        totalTax: totalTax.toFixed(2),
        totalPayable: roundTotalPayableAfterPrepayment.toFixed(2),
        totalFeeAmount: totalFeeAmount.toFixed(2),
        totalSubtotal: (updatedTotalAmount - totalDiscount).toFixed(2),
        additionalDiscount: additionalDiscount.toFixed(2),
        outstandingAmount: roundTotalPayableAfterPrepayment.toFixed(2),
        localNetTotal: localNetTotal.toFixed(2),
        netTotal: roundTotalPayable.toFixed(2),
        roundingAmount: roundingAmount.toFixed(2),
        totalNetAmount: totalExclTax.toFixed(2),
        totalExclTax: totalExclTax.toFixed(2),
        totalInclTax: subtotalTax.toFixed(2),
        prepaymentAmount: prepaymentAmount ? prepaymentAmount : "0.00",
      };

      let cashSalesHasDetailsData = [];
      if (prop.isUpdate) {
        cashSalesHasDetailsData = table.getFilteredRowModel().rows.map((row) => row.original);
      } else {
        const existingData = table.getFilteredRowModel().rows.map((row) => row.original);
        const newItems = selectedRowModel.map((row, index) => {
          const item = row.original;
          const existingData = table.getFilteredRowModel().rows.map((row) => row.original);
          const maxSeq =
            existingData.length > 0
              ? Math.max(...existingData.map((item) => parseInt(item.seq) || 0))
              : 0;

          return {
            UUID: "",
            item: item.UUID,
            type: prop.itemType === "service" ? "Service" : "Stock",
            description: stripHtml(item.description) || "",
            "2ndDescription": stripHtml(item["2ndDescription"]) || "",
            moreDescription: stripHtml(item.moreDescription) || "",
            itemGroup: prop.itemType === "service" ? item.serviceGroupCode : item.stockGroupCodeCode,
            itemCategory: prop.itemType === "service" ? item.serviceCategoryCode : item.stockCategoryCodeCode,
            tariff: null,
            classification: item.classification || "",
            permitNo: null,
            project: form.getValues("project") || "",
            quantity: 1,
            quantity2: prop.itemType === "service" ? 1 : 0,
            quantity3: prop.itemType === "service" ? 1 : 0,
            UOM: item.defaultUOMSales || "",
            itemUOM: item.defaultUOMSalesUOM || "",
            rate: prop.itemType === "stock" ? null : undefined,
            price: item.promotionPrice || "",
            discountRate: "",
            discountAmount: "",
            tax: null,
            deliveryDate: "",
            billingFrequency: prop.itemType === "service" ? item.billingFrequency : null,
            billingInterval: prop.itemType === "service" ? item.billingInterval : null,
            startAt: preferenceData?.data?.cashSalesDefaultDate == "1" ? startDayTs : "",
            endAt: preferenceData?.data?.cashSalesDefaultDate == "1" ? lastDayTs : "",
            remark1: "",
            remark2: "",
            seq: (maxSeq + index + 1).toString(),
            amount: item.refPrice || "",
            subTotal: item.refPrice || "",
            subtotalTax: item.refPrice || "",
            taxableAmount: item.refPrice || "",
            amountExclTax: item.refPrice || "",
            amountInclTax: item.refPrice || "",
          };
        });
        cashSalesHasDetailsData = [...existingData, ...newItems];
      }

      const combinedData = {
        cashSales: cashSalesData,
        cashSalesHasDetails: cashSalesHasDetailsData,
      };
      formData.append("data", JSON.stringify(combinedData));

      if (!navigator.onLine) {
        setTempRowCashSalesDetailsList(cashSalesHasDetailsData);

        if (id) {
          await cacheDetails(id, {
            cashSales: cashSalesData,
            cashSalesHasDetails: cashSalesHasDetailsData,
          });
        }

        toast({ title: "Saved offline", description: "Changes saved locally.", duration: 2000 });
        return;
      }

      const response = await fetch(
        `${ORIGIN}/cash_sales/api/cash-sales/update-cash-sales-has-details-data?id=${id}`,
        { method: "POST", headers, body: formData },
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 403) {
          toast({ title: errorData.message, duration: 2000 });
        }
        throw new Error("Failed to fetch data");
      }

      if (id) {
        await cacheDetails(id, {
          cashSales: cashSalesData,
          cashSalesHasDetails: cashSalesHasDetailsData,
        });
      }
      revalidateCashSalesDetails();
    } catch (error) {
      console.error("Error updating service data:", error);
    }
  };

  // Auto-save details to IDB 
  useEffect(() => {
    if (!id || !tempRowCashSalesDetailsList?.length) return;

    cacheDetails(id, {
      cashSales: {},
      cashSalesHasDetails: tempRowCashSalesDetailsList,
    }).catch(() => { });
  }, [tempRowCashSalesDetailsList, id]);

  const [taxInclusiveStates, setTaxInclusiveStates] = useState({});

  useEffect(() => {
    if (data.length > 0) {
      const taxInclusiveMap = data.reduce((result, item, index) => {
        result[index] = parseInt(item["taxInclusive"]);
        return result;
      }, {});
      setTaxInclusiveStates(taxInclusiveMap);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      data.forEach((row, index) => {
        setTaxInclusiveStates((prev) => ({ ...prev, [index]: row.taxInclusive }));
        setMasterServiceStates((prev) => ({ ...prev, [index]: row.master }));
        setShowInPDFStates((prev) => ({ ...prev, [index]: row.showTemplate }));
      });
    }
  }, [data]);

  const handleTaxInclusiveCheckedChanged = (rowIndex, isChecked, row) => {
    const value = isChecked ? "1" : "0";
    setTaxInclusiveStates((prev) => ({ ...prev, [rowIndex]: value }));
    row.original.taxInclusive = value;
    setTempRowCashSalesDetailsList((prevList) =>
      prevList.map((item, idx) => {
        if ((item.UUID && item.UUID === row.original.UUID) || idx === rowIndex) {
          return { ...item, taxInclusive: value };
        }
        return item;
      }),
    );
  };

  const handleMasterServiceCheckedChanged = (rowIndex, isChecked, row) => {
    if (row.index === 0 && !isChecked) return;
    const value = isChecked ? "1" : "0";
    setMasterServiceStates((prev) => ({ ...prev, [row.index]: value }));
    if (isChecked) {
      setShowInPDFStates((prev) => ({ ...prev, [row.index]: "1" }));
      setTempRowCashSalesDetailsList((prevList) =>
        prevList.map((item, idx) => {
          if (idx === row.index) return { ...item, master: value, showTemplate: "1" };
          return item;
        }),
      );
    } else {
      setTempRowCashSalesDetailsList((prevList) =>
        prevList.map((item, idx) => {
          if (idx === row.index) return { ...item, master: value };
          return item;
        }),
      );
    }
    row.original.master = value;
    if (isChecked) row.original.showTemplate = "1";
  };

  const handleShowInPDFCheckedChanged = (rowIndex, isChecked, row) => {
    if (row.index === 0 && !isChecked) return;
    if (masterServiceStates[row.index] === "1" && !isChecked) return;
    const value = isChecked ? "1" : "0";
    setShowInPDFStates((prev) => ({ ...prev, [row.index]: value }));
    setTempRowCashSalesDetailsList((prevList: any) =>
      prevList.map((item: any, idx: any) => {
        if (idx === row.index) return { ...item, showTemplate: value };
        return item;
      }),
    );
    row.original.showTemplate = value;
  };

  const mobileFieldConfigs = {
    description: { type: "text" as const, label: "Description", colSpan: 2 as const },
    "2ndDescription": { type: "text" as const, label: "2nd Description", colSpan: 2 as const },
    moreDescription: { type: "text" as const, label: "More Description", colSpan: 2 as const },
    quantity: { type: "number" as const, label: "Quantity[1]", allowDecimal: false },
    quantity2: { type: "number" as const, label: "Quantity[2]", allowDecimal: false },
    quantity3: { type: "number" as const, label: "Quantity[3]", allowDecimal: false },
    price: {
      type: "number" as const, label: "Price", allowDecimal: true,
      allowNegative: userHasRuleData?.userHasRule.includes("update-cash-sales-below-0"),
    },
    discountRate: { type: "number" as const, label: "Discount %", allowDecimal: true },
    discountAmount: { type: "number" as const, label: "Discount Amount", allowDecimal: true },
    date: { type: "date" as const, label: "Date" },
    startAt: { type: "date" as const, label: "Start Date" },
    endAt: { type: "date" as const, label: "End Date" },
    taxInclusive: { type: "checkbox" as const, label: "Tax Inclusive" },
    master: { type: "checkbox" as const, label: "Master Service" },
    showTemplate: { type: "checkbox" as const, label: "Show in PDF" },
    UOM: { type: "uom" as const, label: "UOM[1]" },
    UOM2: { type: "uom2" as const, label: "UOM[2]" },
    UOM3: { type: "uom3" as const, label: "UOM[3]" },
    itemUOM: { type: "uom" as const, label: "Item UOM[1]" },
    itemUOM2: { type: "uom2" as const, label: "Item UOM[2]" },
    itemUOM3: { type: "uom3" as const, label: "Item UOM[3]" },
    permitNo: { type: "text" as const, label: "Permit No" },
    remark1: { type: "text" as const, label: "Remark 1", colSpan: 2 as const },
    remark2: { type: "text" as const, label: "Remark 2", colSpan: 2 as const },
    subtotalTax: { type: "readonly" as const, label: "Subtotal Tax" },
    itemGroupCode: { type: "readonly" as const, label: "Item Group" },
    itemCategoryCode: { type: "readonly" as const, label: "Item Category" },
    itemRate: { type: "readonly" as const, label: "Item Rate" },
    amount: { type: "readonly" as const, label: "Amount" },
    subTotal: { type: "readonly" as const, label: "Subtotal" },
    taxRate: { type: "readonly" as const, label: "Tax Rate" },
  };

  const handleMobileFieldChange = (rowId: string, fieldId: string, value: any) => {
    const rowIndex = parseInt(rowId);
    const row = table.getRowModel().rows[rowIndex];
    if (!row) return;

    row.original[fieldId] = value;

    if (
      fieldId === "price" || fieldId === "quantity" ||
      fieldId === "quantity2" || fieldId === "quantity3"
    ) {
      const quantity1 = Number(row.original.quantity) || 0;
      const quantity2 = Number(row.original.quantity2) || (row.original.type === "Stock" ? 1 : row.original.quantity2 === 0 ? 0 : 1);
      const quantity3 = Number(row.original.quantity3) || (row.original.type === "Stock" ? 1 : row.original.quantity3 === 0 ? 0 : 1);
      const price = Number(row.original.price) || 0;
      const totalValue = quantity1 * quantity2 * quantity3 * price;
      if (row.original.discountRate) {
        row.original.discountAmount = ((totalValue * Number(row.original.discountRate)) / 100).toFixed(2).toString();
      }
    } else if (fieldId === "discountRate" && value) {
      const quantity1 = Number(row.original.quantity) || 0;
      const quantity2 = Number(row.original.quantity2) || (row.original.type === "Stock" ? 1 : row.original.quantity2 === 0 ? 0 : 1);
      const quantity3 = Number(row.original.quantity3) || (row.original.type === "Stock" ? 1 : row.original.quantity3 === 0 ? 0 : 1);
      const price = Number(row.original.price) || 0;
      const totalValue = quantity1 * quantity2 * quantity3 * price;
      row.original.discountAmount = ((totalValue * Number(value)) / 100).toFixed(2).toString();
    } else if (fieldId === "discountAmount" && value) {
      const quantity1 = Number(row.original.quantity) || 0;
      const quantity2 = Number(row.original.quantity2) || (row.original.type === "Stock" ? 1 : row.original.quantity2 === 0 ? 0 : 1);
      const quantity3 = Number(row.original.quantity3) || (row.original.type === "Stock" ? 1 : row.original.quantity3 === 0 ? 0 : 1);
      const price = Number(row.original.price) || 0;
      const totalValue = quantity1 * quantity2 * quantity3 * price;
      if (totalValue > 0) {
        row.original.discountRate = ((100 * Number(value)) / totalValue).toFixed(2).toString();
      }
    }

    setTempRowCashSalesDetailsList((prevList) =>
      prevList.map((item, idx) => {
        if ((item.UUID && item.UUID === row.original.UUID) || idx === row.index) {
          return { ...item, [fieldId]: value };
        }
        return item;
      }),
    );
  };

  const mobileCheckboxHandlers = {
    taxInclusive: handleTaxInclusiveCheckedChanged,
    master: handleMasterServiceCheckedChanged,
    showTemplate: handleShowInPDFCheckedChanged,
  };

  const totalsConfig = {
    title: "Total",
    sections: [
      {
        fields: [
          { key: "noOfRecord", label: "No. of Record", value: table.getRowModel().rows ? table.getRowModel().rows.length : 0, readOnly: true },
          { key: "quantity", label: "Quantity", value: table.getRowModel().rows ? calculateTotal("quantity") : 0, readOnly: true },
          { key: "subtotal", label: "Subtotal", value: table.getRowModel().rows ? calculateTotal("subTotal") : 0, readOnly: true },
          { key: "taxAmount", label: "Tax Amount", value: table.getRowModel().rows ? calculateTotal("taxAmount") : 0, readOnly: true },
          {
            key: "subtotalTax", label: "Subtotal (Tax)",
            value: table.getRowModel().rows ? formatNumber(parseFloat(calculateTotal("subTotal")) + parseFloat(calculateTotal("taxAmount"))) : 0,
            readOnly: true,
          },
        ],
      },
      {
        fields: [
          { key: "localNetTotal", label: "Local Net Total", value: table.getRowModel().rows ? calculateNetTotal(true) : 0, readOnly: true },
          { key: "netTotal", label: "Net Total (RM)", value: table.getRowModel().rows ? calculateNetTotal(false) : 0, readOnly: true },
        ],
      },
    ],
  };

  const handleUnifiedDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const isColumnDrag = columnOrder.includes(active.id as string);
    if (isColumnDrag) {
      handleDndDragEnd(event, setColumnOrder);
    } else {
      handleDragEnd(event);
    }
  };

  useEffect(() => {
    if (isPaidAmountEmpty && !isPaidAmountManuallyUpdated) {
      const netTotal = calculateNetTotal(false);
      form.setValue("paidAmount", netTotal);
    }
  }, [isPaidAmountEmpty, calculateNetTotal, form, isPaidAmountManuallyUpdated]);

  const calculateRowValues = (rowData: any, rowIndex: number) => {
    const CALC_PRECISION = { precision: 10 };
    const OUT_PRECISION = { precision: 2 };

    const quantity1 = currency(rowData.quantity || 0, CALC_PRECISION);
    const quantity2 = currency(
      rowData.quantity2
        ? Number(rowData.quantity2)
        : rowData.type === "Stock" ? 1 : rowData.quantity2 === 0 ? 0 : 1,
      CALC_PRECISION,
    );
    const quantity3 = currency(
      rowData.quantity3
        ? Number(rowData.quantity3)
        : rowData.type === "Stock" ? 1 : rowData.quantity3 === 0 ? 0 : 1,
      CALC_PRECISION,
    );
    const price = currency(rowData.price || 0, CALC_PRECISION);
    const totalAmount = quantity1.multiply(quantity2).multiply(quantity3).multiply(price);

    const calculateDiscountAmount = (rate: number, base: ReturnType<typeof currency>) =>
      base.multiply(rate).divide(100);
    const calculateDiscountRate = (amount: number, base: ReturnType<typeof currency>) =>
      base.value > 0 ? currency(amount, CALC_PRECISION).divide(base).multiply(100).value : 0;

    let currentAmount = totalAmount;
    let totalDiscountAmount = currency(0, CALC_PRECISION);

    if (rowData.discountAmount && currency(rowData.discountAmount, CALC_PRECISION).value > 0) {
      if (!rowData.discountRate || currency(rowData.discountRate, CALC_PRECISION).value === 0) {
        rowData.discountRate = calculateDiscountRate(Number(rowData.discountAmount), currentAmount).toFixed(2);
      }
      if (slug === "transfer-to" || slug === "transfer-from") {
        if (!rowData.fullQuantityTransfer) {
          rowData.discountAmount = calculateDiscountAmount(Number(rowData.discountRate), currentAmount).value.toFixed(2);
        }
      }
    } else if (rowData.discountRate && Number(rowData.discountRate) > 0) {
      rowData.discountAmount = calculateDiscountAmount(Number(rowData.discountRate), currentAmount).value.toFixed(2);
    }

    const discountAmount1 = currency(rowData.discountAmount || 0, CALC_PRECISION);
    currentAmount = currentAmount.subtract(discountAmount1);
    totalDiscountAmount = totalDiscountAmount.add(discountAmount1);

    if (rowData.discountAmount2 && currency(rowData.discountAmount2, CALC_PRECISION).value > 0) {
      if (!rowData.discountRate2 || currency(rowData.discountRate2, CALC_PRECISION).value === 0) {
        rowData.discountRate2 = calculateDiscountRate(Number(rowData.discountAmount2), currentAmount).toFixed(2);
      }
      if (slug === "transfer-to" || slug === "transfer-from") {
        if (!rowData.fullQuantityTransfer) {
          rowData.discountAmount2 = calculateDiscountAmount(Number(rowData.discountRate2), currentAmount).value.toFixed(2);
        }
      }
    } else if (rowData.discountRate2 && Number(rowData.discountRate2) > 0) {
      rowData.discountAmount2 = calculateDiscountAmount(Number(rowData.discountRate2), currentAmount).value.toFixed(2);
    }

    const discountAmount2 = currency(rowData.discountAmount2 || 0, CALC_PRECISION);
    currentAmount = currentAmount.subtract(discountAmount2);
    totalDiscountAmount = totalDiscountAmount.add(discountAmount2);

    if (rowData.discountAmount3 && currency(rowData.discountAmount3, CALC_PRECISION).value > 0) {
      if (!rowData.discountRate3 || currency(rowData.discountRate3, CALC_PRECISION).value === 0) {
        rowData.discountRate3 = calculateDiscountRate(Number(rowData.discountAmount3), currentAmount).toFixed(2);
      }
      if (slug === "transfer-to" || slug === "transfer-from") {
        if (!rowData.fullQuantityTransfer) {
          rowData.discountAmount3 = calculateDiscountAmount(Number(rowData.discountRate3), currentAmount).value.toFixed(2);
        }
      }
    } else if (rowData.discountRate3 && Number(rowData.discountRate3) > 0) {
      rowData.discountAmount3 = calculateDiscountAmount(Number(rowData.discountRate3), currentAmount).value.toFixed(2);
    }

    const discountAmount3 = currency(rowData.discountAmount3 || 0, CALC_PRECISION);
    currentAmount = currentAmount.subtract(discountAmount3);
    totalDiscountAmount = totalDiscountAmount.add(discountAmount3);

    function safeParseTaxRate(value: any) {
      if (!value) return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }

    const taxRate = safeParseTaxRate(rowData.taxRate);
    const subTotalHighPrec = totalAmount.subtract(totalDiscountAmount);
    const subTotal = currency(subTotalHighPrec.value, OUT_PRECISION);
    const taxAmount = subTotal.multiply(taxRate).divide(100);

    rowData.amount = currency(totalAmount.value, OUT_PRECISION).value;
    rowData.subTotalEInvoice = currency(totalAmount.value, OUT_PRECISION).value;
    rowData.subTotal = subTotal.value;
    rowData.taxAmount = taxAmount.value;

    if (taxInclusiveStates[rowIndex] === "1") {
      rowData.subtotalTax = subTotal.value;
    } else {
      rowData.subtotalTax = subTotal.add(taxAmount).value;
    }

    rowData.taxableAmount = subTotal.value;
    rowData.amountExclTax = currency(rowData.subTotal || 0, OUT_PRECISION).add(rowData.feeAmount || 0).value;
    rowData.amountInclTax = currency(rowData.subtotalTax || 0, OUT_PRECISION).add(rowData.feeAmount || 0).value;

    const currencyRate = form.getValues("currencyRate");
    rowData.localTaxAmount = currency(rowData.taxAmount, OUT_PRECISION).multiply(currencyRate || 1).value;

    return rowData;
  };

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      tableData.forEach((row: any, index: any) => {
        const minQtyStored = row.voucherMinQuantity ? row.voucherMinQuantity : "";
        if (row.voucherMinQuantity && Number(row.quantity) < Number(row.voucherMinQuantity)) {
          row.voucher = "";
          row.voucherCode = "";
          row.discountRate = "";
          row.discountAmount = "";
          row.voucherMinQuantity = "";
          const checkVoucherUsedInRows = tableData.some((r) => r.voucher);
          if (row.voucherOption && row.voucherOption == "Apply to all item") {
            if (!checkVoucherUsedInRows) {
              form.setValue("voucher", "");
              form.setValue("voucherCode", "");
            }
          } else {
            form.setValue("voucher", "");
            form.setValue("voucherCode", "");
          }
          toast({
            title: "Invalid Voucher",
            description: `Minimum quantity of ${minQtyStored} is required for this voucher.`,
            variant: "destructive",
            duration: 3000,
          });
        }
      });

      const updatedData = tableData.map((rowData: any, index: any) => {
        const calculatedRow = calculateRowValues({ ...rowData }, index);
        calculatedRow.localTaxAmount = calculatedRow.taxAmount * currentCurrencyRate;
        if (Number.isNaN(calculatedRow.subtotalTax)) calculatedRow.subtotalTax = 0;
        if (Number.isNaN(calculatedRow.taxAmount)) calculatedRow.taxAmount = 0;
        if (Number.isNaN(calculatedRow.localTaxAmount)) calculatedRow.localTaxAmount = 0;
        return calculatedRow;
      });

      tableData.forEach((row) => {
        row.subtotalTax = row.subtotalTax ? Number(row.subtotalTax) : 0;
        row.taxAmount = row.taxAmount ? Number(row.taxAmount) : 0;
        row.localTaxAmount = row.localTaxAmount ? Number(row.localTaxAmount) : 0;
      });

      const hasChanges = updatedData.some((newRow: any, index: any) => {
        const oldRow = tableData[index];
        return (
          newRow.subTotal !== oldRow.subTotal ||
          newRow.amount !== oldRow.amount ||
          newRow.subtotalTax !== oldRow.subtotalTax ||
          newRow.taxAmount !== oldRow.taxAmount ||
          newRow.localTaxAmount !== oldRow.localTaxAmount
        );
      });

      if (hasChanges) setTempRowCashSalesDetailsList(updatedData);
    }
  }, [tableData, taxInclusiveStates, currentCurrencyRate, tempRowCashSalesDetailsList]);

  type ContextMenu = {
    mouseX: number;
    mouseY: number;
    rowData: any;
  } | null;

  const [contextMenu, setContextMenu] = useState<ContextMenu>(null);

  const handleRowRightClick = (event: any, row: any) => {
    event.preventDefault();
    if (!isPaid) {
      setContextMenu({ mouseX: event.clientX + 2, mouseY: event.clientY - 6, rowData: row });
    }
  };

  const handleCloseContextMenu = () => setContextMenu(null);

  const handleCloneRows = () => {
    const multipleCloneRowCopy = JSON.parse(JSON.stringify(table.getSelectedRowModel().rows));
    if (multipleCloneRowCopy.length > 0) {
      setTempRowCashSalesDetailsList((prev: any) => {
        const newList = [...prev];
        let offset = 0;
        multipleCloneRowCopy.forEach((item2: any) => {
          const cloneIndex = item2.index + offset;
          const cloneRow = { ...item2.original, UUID: "" };
          newList.splice(cloneIndex + 1, 0, cloneRow);
          offset += 1;
        });
        return newList.map((item, index) => ({ ...item, seq: index + 1 }));
      });
    } else {
      const cloneIndex = contextMenu?.rowData.index;
      const cloneRowCopy = JSON.parse(
        JSON.stringify(tempRowCashSalesDetailsList.find((item: any, index: any) => index === cloneIndex)),
      );
      setTempRowCashSalesDetailsList((prev: any) => {
        const newList = [...prev];
        cloneRowCopy.UUID = "";
        newList.splice(cloneIndex + 1, 0, cloneRowCopy);
        return newList.map((item, index) => ({ ...item, seq: index + 1 }));
      });
    }
    setContextMenu(null);
  };

  const rowContextMenu = { handleRowRightClick, handleCloseContextMenu, contextMenu, handleCloneRows };

  const fetchCurrentCurrencyRate = (currencyUUID?: string) => {
    const targetCurrencyUUID = currencyUUID || form.getValues("currency");
    if (!targetCurrencyUUID) {
      setCurrentCurrencyRate(1);
      return;
    }
    setCurrentCurrencyRate(1);
  };

  const fetchCurrentCurrencyRate2 = () => {
    const watchedCurrencyRate = form.getValues("currencyRate");
    watchedCurrencyRate ? setCurrentCurrencyRate(watchedCurrencyRate) : setCurrentCurrencyRate(1);
  };

  useEffect(() => {
    fetchCurrentCurrencyRate2();
  }, [form.watch("currencyRate")]);

  return (
    <Card className={isMobile ? "shadow-none rounded-none border-none p-0" : "w-full shadow-sm mb-2"}>
      {isLoading && <LoadingUI />}
      <div className="flex w-full items-center justify-between p-1">
        <CardTitle className="px-1 hidden lg:block md:hidden sm:block text-nowrap text-sm font-bold">
          Charges Details
        </CardTitle>
        <CashSalesDetailsDataTableToolbar
          table={table}
          onAdd={handleOnAdd}
          setTempRowCashSalesDetailsListData={setTempRowCashSalesDetailsListData}
          tempRowCashSalesDetailsList={tempRowCashSalesDetailsList}
          revalidateCashSalesDetails={revalidateCashSalesDetails}
          handleOnPackage={handleOnPackage}
          isPaid={isPaid}
          slug={slug}
          form={form}
        />
      </div>

      <CardContent className="p-0">
        <div className="flex h-[70cqh] md:h-[100cqh] flex-col justify-between rounded-md bg-erp-blue-3 @container-[size] md:max-h-[472px]">
          <ScrollArea className="flex-1 min-h-0">
            <MobileFormDataTable
              table={table}
              headerFields={["itemCode", "itemName"]}
              fieldConfigs={mobileFieldConfigs}
              initialVisibleFields={4}
              onFieldChange={handleMobileFieldChange}
              checkboxHandlers={mobileCheckboxHandlers}
              UOMInputs={UOMInputs} setUOMInputs={setUOMInputs}
              UOM2Inputs={UOM2Inputs} setUOM2Inputs={setUOM2Inputs}
              UOM3Inputs={UOM3Inputs} setUOM3Inputs={setUOM3Inputs}
              setTempRowDetailsList={setTempRowCashSalesDetailsList}
            />

            <div className="hidden md:block">
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleUnifiedDragEnd}
                sensors={sensors}
              >
                <DragDropDataTable items={items} disabled={false} hasParentDndContext={true}>
                  <Table
                    className="table-fixed border-separate overflow-visible whitespace-nowrap text-[11px]"
                    style={{ ...columnSizeVars, width: table.getTotalSize() }}
                  >
                    <TableHeader className="sticky top-0 z-10">
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                            {headerGroup.headers.map((header) => (
                              <DragableTableHead
                                key={header.id} header={header}
                                className="bg-erp-blue-11 font-normal"
                                style={{ width: `calc(var(--header-${header?.id}-size) * 1px)` }}
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

                    {table.getState().columnSizingInfo.isResizingColumn ? (
                      <MemoizedTableBody
                        table={table} onRowSelection={onRowSelection}
                        rowContextMenu={rowContextMenu} getRowId={getRowId}
                        refreshKey={refreshKey} taxInclusiveStates={taxInclusiveStates}
                        masterServiceStates={masterServiceStates} showInPDFStates={showInPDFStates}
                        handleTaxInclusiveCheckedChanged={handleTaxInclusiveCheckedChanged}
                        handleMasterServiceCheckedChanged={handleMasterServiceCheckedChanged}
                        handleShowInPDFCheckedChanged={handleShowInPDFCheckedChanged}
                        descriptionInputCell={descriptionInputCell} textInputCell={textInputCell}
                        numberInputCell={numberInputCell} dropDownInputCell={dropDownInputCell}
                        dateInputCell={dateInputCell} UOMDropdownCell={UOMDropdownCell}
                        form={form} userHasRuleData={userHasRuleData} isPaid={isPaid}
                        currentCurrencyRate={currentCurrencyRate}
                      />
                    ) : (
                      <NonMemoizedTableBody
                        table={table} onRowSelection={onRowSelection}
                        rowContextMenu={rowContextMenu} getRowId={getRowId}
                        refreshKey={refreshKey} taxInclusiveStates={taxInclusiveStates}
                        masterServiceStates={masterServiceStates} showInPDFStates={showInPDFStates}
                        handleTaxInclusiveCheckedChanged={handleTaxInclusiveCheckedChanged}
                        handleMasterServiceCheckedChanged={handleMasterServiceCheckedChanged}
                        handleShowInPDFCheckedChanged={handleShowInPDFCheckedChanged}
                        descriptionInputCell={descriptionInputCell} textInputCell={textInputCell}
                        numberInputCell={numberInputCell} dropDownInputCell={dropDownInputCell}
                        dateInputCell={dateInputCell} UOMDropdownCell={UOMDropdownCell}
                        form={form} userHasRuleData={userHasRuleData} isPaid={isPaid}
                        currentCurrencyRate={currentCurrencyRate}
                      />
                    )}
                  </Table>

                  {contextMenu && (
                    <ul
                      style={{
                        position: "fixed", top: contextMenu.mouseY, left: contextMenu.mouseX,
                        background: "white", border: "1px solid #ccc",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)", padding: "4px 0",
                        zIndex: 1000, listStyle: "none",
                      }}
                      onMouseLeave={handleCloseContextMenu}
                    >
                      <li style={{ padding: "4px 12px", cursor: "pointer" }} onClick={handleCloneRows}>
                        Clone
                      </li>
                    </ul>
                  )}
                </DragDropDataTable>
              </DndContext>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Totals */}
          <div className={isMobile ? "hidden" : "flex border-t border-border bg-white"}>
            <ScrollArea>
              <div className="flex pt-1">
                {[
                  { label: "Records", value: table.getRowModel().rows ? table.getRowModel().rows.length : 0, className: "w-16" },
                  { label: "Quantity", value: table.getRowModel().rows ? calculateTotal("quantity") : 0, className: "w-16" },
                  { label: "Subtotal", value: table.getRowModel().rows ? calculateTotal("subTotal") : 0, className: "w-16" },
                  { label: "Total Amount", value: table.getRowModel().rows ? calculateTotal("amount") : 0, className: "w-16" },
                  { label: "Total Discount", value: parseFloat(calculateTotalDiscount()).toFixed(2), className: "w-16" },
                  { label: "Tax Amount", value: table.getRowModel().rows ? calculateTotal("taxAmount") : 0, className: "w-16" },
                ].map(({ label, value, className }) => (
                  <div key={label} className="flex min-w-[85px] flex-shrink-0 flex-col gap-y-1 border-r border-border p-2.5">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <Input
                      className={`text-[11px] rounded-none font-medium border-none text-left ${className} h-3 bg-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 !px-0`}
                      readOnly value={value}
                    />
                  </div>
                ))}

                <div className="flex min-w-[100px] flex-shrink-0 flex-col gap-y-1 border-r border-border p-2.5">
                  <span className="text-[11px] text-muted-foreground">Subtotal (tax) - rounding</span>
                  <Input
                    className="netTotal text-[11px] rounded-none font-medium border-none text-left w-20 h-3 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 !px-0"
                    readOnly value={table.getRowModel().rows ? calculateNetTotal(false) : 0}
                  />
                </div>

                <div className="flex min-w-[100px] flex-shrink-0 flex-col gap-y-1 p-2.5">
                  <span className="text-[11px] text-muted-foreground">Local subtotal (tax)</span>
                  <Input
                    className="localNetTotal text-[11px] rounded-none font-medium border-none text-left w-20 h-3 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 !px-0"
                    readOnly value={table.getRowModel().rows ? calculateNetTotal(true) : 0}
                  />
                </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          <ItemPopover
            key={itemType}
            open={dialogOpen} setOpen={setDialogOpen}
            columns={itemType === "service" ? ServiceColumns : StockColumns}
            setTempRowCashSalesDetailsListData={setTempRowCashSalesDetailsListData}
            tempRowCashSalesDetailsList={tempRowCashSalesDetailsList}
            revalidateCashSalesDetails={revalidateCashSalesDetails}
            itemTable={itemTable} fetchItemData={fetchItemData}
            itemType={itemType} form={form} updateItem={updateItem}
            itemData={itemData} slug={slug} preferenceData={preferenceData}
          />

          <PackagePopover
            open={packageDialogOpen} setOpen={setPackageDialogOpen}
            columns={PackageColumns} data={packageData}
            fetchPackageData={fetchPackageData}
            revalidateCashSalesDetails={revalidateCashSalesDetails}
            setTempRowCashSalesDetailsListData={setTempRowCashSalesDetailsListData}
            tempRowCashSalesDetailsList={tempRowCashSalesDetailsList}
            slug={slug} preferenceData={preferenceData}
          />

          <SellingPriceHistoryPopover
            open={priceHistoryDialogOpen} setOpen={setPriceHistoryDialogOpen}
            itemId={selectedItemForPriceHistory}
          />

          <SerialNumberPopover
            open={serialNumberDialogOpen} setOpen={setSerialNumberDialogOpen}
            selectedRow={selectedRowForSerialNumber}
            setTempRowDetailsList={setTempRowCashSalesDetailsList}
          />
        </div>
      </CardContent>
    </Card>
  );
}

type TableBodyProps = {
  table: TableType<CashSales>;
  onRowSelection: (row: Row<CashSales>) => (event: MouseEvent) => void;
  rowContextMenu: any;
  getRowId: (row: any, index: number) => string;
  refreshKey: number;
  taxInclusiveStates: any;
  masterServiceStates: any;
  showInPDFStates: any;
  handleTaxInclusiveCheckedChanged: (rowIndex: number, isChecked: boolean, row: any) => void;
  handleMasterServiceCheckedChanged: (rowIndex: number, isChecked: boolean, row: any) => void;
  handleShowInPDFCheckedChanged: (rowIndex: number, isChecked: boolean, row: any) => void;
  descriptionInputCell: (cell: any, className: string, moduleName: string) => JSX.Element;
  textInputCell: (cell: any, className: string) => JSX.Element;
  numberInputCell: (cell: any, allowDecimal: boolean, allowNegative?: boolean) => JSX.Element;
  dropDownInputCell: (cell: any) => JSX.Element;
  dateInputCell: (cell: any) => JSX.Element;
  UOMDropdownCell: (cell: any) => JSX.Element;
  form: any;
  userHasRuleData?: any;
  isPaid: boolean;
  currentCurrencyRate: number;
};

function NonMemoizedTableBody({
  table, onRowSelection, rowContextMenu, getRowId, refreshKey,
  taxInclusiveStates, masterServiceStates, showInPDFStates,
  handleTaxInclusiveCheckedChanged, handleMasterServiceCheckedChanged, handleShowInPDFCheckedChanged,
  descriptionInputCell, textInputCell, numberInputCell, dropDownInputCell, dateInputCell, UOMDropdownCell,
  form, userHasRuleData, isPaid, currentCurrencyRate,
}: TableBodyProps) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row, index) => (
          <DraggableRow
            key={`${getRowId(row.original, index)}-${refreshKey}`}
            id={getRowId(row.original, index)}
            className="bg-erp-blue-5 data-[state=selected]:bg-erp-blue-9"
            onClick={onRowSelection(row)}
            onContextMenu={(e) => rowContextMenu.handleRowRightClick(e, row)}
            data-state={row.getIsSelected() && "selected"}
            disabled={false}
          >
            {row.getVisibleCells().map((cell, cellIndex) => {
              const cellStyle = {
                width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                minWidth: cell.column.columnDef.minSize,
              };
              const cellTitle = (cell.getValue() ?? "").toString();
              const onCtx = (e) => rowContextMenu.handleRowRightClick(e, row);

              if (cell.column.id === "taxInclusive") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    <Checkbox checked={taxInclusiveStates[index] === "1"} onCheckedChange={(state) => handleTaxInclusiveCheckedChanged(index, state, cell.row)} disabled={isPaid} />
                  </TableCell>
                );
              } else if (cell.column.id === "description" || cell.column.id === "2ndDescription" || cell.column.id === "moreDescription" || cell.column.id === "customerDescription") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {descriptionInputCell(cell, "h-7.5 p-0", cell.column.id)}
                  </TableCell>
                );
              } else if (cell.column.id === "itemName" || cell.column.id === "permitNo" || cell.column.id === "remark1" || cell.column.id === "remark2" || cell.column.id === "customerName" || cell.column.id === "customerBRN" || cell.column.id === "customerID" || cell.column.id === "customermembershipID") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {textInputCell(cell, "h-7.5")}
                  </TableCell>
                );
              } else if (cell.column.id === "price") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {numberInputCell(cell, true, userHasRuleData?.userHasRule.includes("update-cash-sales-below-0"))}
                  </TableCell>
                );
              } else if (cell.column.id === "discountRate" || cell.column.id === "discountAmount" || cell.column.id === "discountRate2" || cell.column.id === "discountAmount2" || cell.column.id === "discountRate3" || cell.column.id === "discountAmount3") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {numberInputCell(cell, true)}
                  </TableCell>
                );
              } else if (cell.column.id === "quantity" || cell.column.id === "quantity2" || cell.column.id === "quantity3") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {numberInputCell(cell, true)}
                  </TableCell>
                );
              } else if (cell.column.id === "classificationCode" || cell.column.id === "projectCode" || cell.column.id === "stockBatchCode" || cell.column.id === "locationCode" || cell.column.id === "customerCodeCode" || cell.column.id === "taxCode") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="relative overflow-visible text-center" title={cellTitle} style={{ ...cellStyle, overflow: "visible", position: "relative" }} onContextMenu={onCtx}>
                    {dropDownInputCell(cell)}
                  </TableCell>
                );
              } else if (cell.column.id === "localTaxAmount") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-right" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    <p className="text-right">{`${(row.original.taxAmount * (form.getValues("currencyRate") ? Number(form.getValues("currencyRate")) : 1)).toFixed(2)}`}</p>
                  </TableCell>
                );
              } else if (cell.column.id === "deliveryDate" || cell.column.id === "startAt" || cell.column.id === "date" || cell.column.id === "endAt") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-right" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {dateInputCell(cell)}
                  </TableCell>
                );
              } else if (cell.column.id === "itemUOM" || cell.column.id === "itemUOM2" || cell.column.id === "itemUOM3") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-right" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {UOMDropdownCell(cell)}
                  </TableCell>
                );
              } else if (cell.column.id === "master") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center [&:has([role=checkbox])]:pr-4" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    <Checkbox checked={masterServiceStates[row.index] === "1"} onCheckedChange={(state) => handleMasterServiceCheckedChanged(index, state, cell.row)} disabled={row.index === 0} />
                  </TableCell>
                );
              } else if (cell.column.id === "showTemplate") {
                return (
                  <TableCell key={cell.id} onClick={(e) => e.stopPropagation()} className="truncate text-center [&:has([role=checkbox])]:pr-4" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    <Checkbox checked={showInPDFStates[row.index] === "1"} onCheckedChange={(state) => handleShowInPDFCheckedChanged(index, state, cell.row)} disabled={row.index === 0} />
                  </TableCell>
                );
              } else {
                return (
                  <TableCell key={cell.id} className="truncate" title={cellTitle} style={cellStyle} onContextMenu={onCtx}>
                    {cellIndex === 0 ? (
                      <div className="flex items-center gap-2">
                        <DragHandle id={getRowId(row.original, index)} className="flex-shrink-0" />
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                );
              }
            })}
          </DraggableRow>
        ))
      ) : (
        <NoResultsTableRow columns={table.getVisibleLeafColumns()} />
      )}
    </TableBody>
  );
}

const MemoizedTableBody = memo(
  NonMemoizedTableBody,
  (prev, next) => prev.table.options.data === next.table.options.data,
) as typeof NonMemoizedTableBody;