"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState, useRef } from "react";
// Server-Side Filtering (Imports)
import useSWR from "swr";

import DataLoadingStatusBadge from "@/components/data-table/badge/DataLoadingStatusBadge";
import { ColumnResizer } from "@/components/data-table/ColumnResizer";
import DragableTableHead from "@/components/data-table/DragableTableHead";
// Mobile View (Imports)
import MobileDataTable from "@/components/data-table/MobileDataTable";
import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
import TableHeadStatusFilter from "@/components/data-table/TableHeadStatusFilter";
import { TableHeadValidityFilter } from "@/components/data-table/TableHeadValidityFilter";
import LoadingUI from "@/components/LoadingUI";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  DATA_TABLE_DEFAULT_COLUMN_SIZING,
  DEFAULT_DATA_TABLE_PAGE_SIZE,
  getAuthHeaders,
  getCurrentAccount,
  getCurrentCompanyUUID,
  ORIGIN,
  removeAuthData,
} from "@/lib/constants";
import { useColumnSizeVars } from "@/lib/hooks/useColumnSizeVars";
import { useDndSensors } from "@/lib/hooks/useDndSensors";
import { useHandleRowSelect } from "@/lib/hooks/useHandleRowSelect";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import getExcludedColumns from "@/lib/utils/data-table/getExcludedColumns";
import handleDndDragEnd from "@/lib/utils/data-table/handleDndDragEnd";
import {
  getOffline,
  cacheOnlineRecords,
  getCachedOnlineRecords,
  cacheLastDocNo,
  deleteOffline,
  markAsSyncing,
  unmarkAsSyncing,
  acquireSyncLock,
  releaseSyncLock
} from "@/components/offlineDB";
import moment from "moment";
import { cn } from "@/lib/utils/cn";

import { columns } from "./columns";
import DataTableToolbar from "./DataTableToolbar";

import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  Table as TableType,
  VisibilityState,
} from "@tanstack/react-table";
import type { MouseEvent } from "react";

import type { CashSales } from "./columns";

export const dynamic = 'force-dynamic';

function filterOfflineRecords(
  records: CashSales[],
  filters: ColumnFiltersState,
): CashSales[] {
  if (!filters.length) return records;

  return records.filter((record) => {
    return filters.every((filter) => {
      const value = filter.value;
      if (value === "" || value === null || value === undefined) return true;

      if (filter.id === "valid") {
        const filterVal = String(value);
        if (filterVal === "") return true;
        return String((record as any)[filter.id] ?? "") === filterVal;
      }

      // All other filters: case-insensitive substring match
      const recordVal = String((record as any)[filter.id] ?? "").toLowerCase();
      return recordVal.includes(String(value).toLowerCase());
    });
  });
}

// Server-Side Filtering (Define Data Structure)
type CashSalesData = {
  total: string;
  rows: CashSales[];
  "daily-summary": boolean;
};

type DataTableProps = {
  columns?: ColumnDef<CashSales>[];
  data?: CashSales[];
  refreshTable?: () => void;
  cashSalesDetails?: any;
  message?: string;
  isError?: boolean;
  isLoading?: boolean;
  viewEInvoiceDetails?: any;
};

const COLUMN_FILTERS_KEY = "cash-sales.bs.table.filters";
const COLUMN_ORDERING_KEY = "cash-sales.bs.table.ordering";
const COLUMN_SIZING_KEY = "cash-sales.bs.table.sizing";
const COLUMN_VISIBILITY_KEY = "cash-sales.bs.table.columns";
const PAGINATION_KEY = "cash-sales.bs.table.pagination";
const SORTING_KEY = "cash-sales.bs.table.sorting";

//  Floating Sync Bar 

type SyncBarProps = {
  totalOffline: number;
  selectedIds: Set<string>;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSyncSelected: () => void;
  onSyncAll: () => void;
  isSyncing: boolean;
};

function FloatingSyncBar({
  totalOffline,
  selectedIds,
  onSelectAll,
  onDeselectAll,
  onSyncSelected,
  onSyncAll,
  isSyncing,
}: SyncBarProps) {
  const selectedCount = selectedIds.size;
  const allSelected = selectedCount === totalOffline && totalOffline > 0;

  // Only render if there are offline records
  if (totalOffline === 0) return null;

  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 mx-1.5 mb-1.5 flex items-center gap-3 rounded-md border px-4 py-2.5 shadow-lg transition-all",
        "border-amber-300 bg-amber-50",
      )}
    >
      {/* Indicator dot */}
      <span className="flex h-2 w-2 shrink-0">
        <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400">
          {isSyncing && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
          )}
        </span>
      </span>

      {/* Status text */}
      <span className="text-sm text-amber-800">
        {isSyncing ? (
          "Syncing…"
        ) : selectedCount > 0 ? (
          <>
            <span className="font-semibold">{selectedCount}</span> of {totalOffline} pending record
            {totalOffline !== 1 ? "s" : ""} selected
          </>
        ) : (
          <>
            <span className="font-semibold">{totalOffline}</span> pending record
            {totalOffline !== 1 ? "s" : ""} waiting to sync
          </>
        )}
      </span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Select / deselect all toggle */}
      {!isSyncing && (
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="rounded px-2 py-1 text-xs text-amber-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          {allSelected ? "Deselect all" : "Select all"}
        </button>
      )}

      {/* Sync Selected — only shown when something is selected */}
      {selectedCount > 0 && !isSyncing && (
        <button
          onClick={onSyncSelected}
          className="rounded-md border border-amber-400 bg-white px-3 py-1.5 text-xs font-medium text-amber-800 shadow-sm transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Sync selected ({selectedCount})
        </button>
      )}

      {/* Sync All */}
      {!isSyncing && (
        <button
          onClick={onSyncAll}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
        >
          Sync all ({totalOffline})
        </button>
      )}
    </div>
  );
}

// Main Component 
export default function CashSalesDataTable({ }: DataTableProps) {
  // Server-Side Filtering (Declare)
  const router = useRouter();
  const { toast } = useToast();

  // Server-Side Filtering (State)
  const [tableData, setTableData] = useState<CashSalesData[]>([]);
  const [forbiddenMessage, setForbiddenMessage] = useState<string | null>(null);
  const [totalNumOfRows, setTotalNumOfRows] = useState<number>(0);
  const [offlineRecords, setOfflineRecords] = useState<CashSales[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Selective sync state — tracks which offline record IDs are checked
  const [selectedOfflineIds, setSelectedOfflineIds] = useState<Set<string>>(new Set());

  const loadOfflineRecords = async () => {
    try {
      const dbItems = await getOffline();
      const mapped = dbItems
        .filter((item) => !item.synced && (item.slug === "edit" || item.slug === "clone" || !item.slug))
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
        .map((item) => {
          const ts = Number(item.cashSales?.docDate);
          const docDateFormat = (!ts || isNaN(ts))
            ? moment().format("YY-MM-DD")
            : moment.unix(ts).format("YY-MM-DD");

          return {
            UUID: item.id,
            docNo: item.cashSales?.docNo || "",
            docDate: docDateFormat,
            docDateFormat,
            customerCodeCode: item.cashSales?.customerCodeCode ?? "",
            customerName: item.cashSales?.customerName ?? "",
            BRN: item.cashSales?.BRN ?? "",
            TIN: item.cashSales?.TIN ?? "",
            SSTNo: item.cashSales?.SSTNo ?? "",
            address: item.cashSales?.address ?? "",
            attentionName: item.cashSales?.attentionName ?? "",
            phoneNo: item.cashSales?.phoneNo ?? "",
            email: item.cashSales?.email ?? "",
            salesAgentName: item.cashSales?.salesAgentName ?? "",
            servicingAgentName: item.cashSales?.servicingAgentName ?? "",
            collectionAgentName: item.cashSales?.collectionAgentName ?? "",
            dealerName: item.cashSales?.dealerName ?? "",
            paymentMethodCode: item.cashSales?.paymentMethodCode ?? "",
            currencyCode: item.cashSales?.currencyCode ?? "",
            currencyRate: item.cashSales?.currencyRate ?? "",
            paidAmount: item.cashSales?.paidAmount ?? "",
            bankCharge: item.cashSales?.bankCharge ?? "",
            chequeNo: item.cashSales?.chequeNo ?? "",
            totalSubtotal: item.cashSales?.totalSubtotal ?? "",
            totalTax: item.cashSales?.totalTax ?? "",
            totalTaxAmount: item.cashSales?.totalTax ?? "",
            totalLocalTaxAmount: "",
            totalSubtotalTax: item.cashSales?.totalPayable ?? "",
            totalPayable: item.cashSales?.totalPayable ?? "",
            netTotal: item.cashSales?.netTotal ?? "",
            localNetTotal: item.cashSales?.localNetTotal ?? "",
            totalExclTax: item.cashSales?.totalExclTax ?? "",
            totalInclTax: item.cashSales?.totalInclTax ?? "",
            totalNetAmount: item.cashSales?.totalNetAmount ?? "",
            totalAmount: item.cashSales?.totalAmount ?? "",
            totalDiscount: item.cashSales?.totalDiscount ?? "",
            additionalDiscount: item.cashSales?.additionalDiscount ?? "",
            roundingAmount: item.cashSales?.roundingAmount ?? "",
            remark1: item.cashSales?.remark1 ?? "",
            remark2: item.cashSales?.remark2 ?? "",
            remark3: item.cashSales?.remark3 ?? "",
            remark4: item.cashSales?.remark4 ?? "",
            description: item.cashSales?.description ?? "",
            note: item.cashSales?.note ?? "",
            invoiceType: item.cashSales?.invoiceType ?? "",
            projectCode: item.cashSales?.projectCode ?? "",
            deliveryAddress: item.cashSales?.deliveryAddress ?? "",
            creditTermCode: item.cashSales?.creditTermCode ?? "",
            approvalStatus: "",
            rejectReason: "",
            valid: item.cashSales?.valid ?? "1",
            createdAtFormat: moment.unix(item.createdAt / 1000).format("YY-MM-DD HH:mm:ss"),
            _isOfflinePending: true,
            _offlineId: item.id,
            _slug: "edit",
          };
        });
      setOfflineRecords(mapped as any);
    } catch (err) {
      console.error("Failed to load offline records:", err);
    }
  };

  useEffect(() => {
    loadOfflineRecords();

    const handleOnline = () => {
      setIsOffline(false);
      loadOfflineRecords();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const handleSynced = () => loadOfflineRecords();
    window.addEventListener("offlineRecordSynced", handleSynced);
    return () => window.removeEventListener("offlineRecordSynced", handleSynced);
  }, []);

  // Preference (State)
  const [preferenceData, setPreferenceData] = useState<any>(null);

  const [columnFilters, setColumnFilters] = useLocalStorage<ColumnFiltersState>(
    COLUMN_FILTERS_KEY,
    [],
  );
  const initialColumnOrder = columns.map((column) => column.id!);
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(
    COLUMN_ORDERING_KEY,
    initialColumnOrder,
  );
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(COLUMN_SIZING_KEY, {});
  const defaultColumns: Array<keyof CashSales> = [
    "docNo",
    "docDate",
    "agentName",
    "dealerName",
    "customerName",
  ];
  const defaultColumnVisibility: VisibilityState = getExcludedColumns(columns, defaultColumns);
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    COLUMN_VISIBILITY_KEY,
    defaultColumnVisibility,
  );

  const [pagination, setPagination] = useLocalStorage<PaginationState>(PAGINATION_KEY, {
    pageIndex: 0,
    pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
  });

  const [sorting, setSorting] = useLocalStorage<SortingState>(SORTING_KEY, []);
  const [viewDailySummary, setViewDailySummary] = useState(false);

  // Server-Side Filtering (Get Current Account and Company)
  const currentAccount = getCurrentAccount();
  const currentCompanyUUID = getCurrentCompanyUUID();

  let apiUrl = `${ORIGIN}/cash_sales/api/cash-sales/get-index-cash-sales`;

  if (currentAccount && currentCompanyUUID) {
    apiUrl += `?byCom=${currentCompanyUUID}&byAcc=${currentAccount}`;
  }

  const fetcher = async (url) => {
    const headers = getAuthHeaders();

    return fetch(url, { headers }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    });
  };

  // Preference (Fetch Function)
  const fetchPreferenceData = async () => {
    if (!navigator.onLine) {
      return;
    }
    try {
      const headers = getAuthHeaders();

      const response = await fetch(`${ORIGIN}/universal/get-preference?module=sales`, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch preference data");
      }

      const data = await response.json();
      setPreferenceData(data);
    } catch (error) {
      console.error("Error fetching preference data:", error);
    }
  };

  useEffect(() => {
    fetchPreferenceData();
  }, []);

  // Server-Side Filtering (Data Fetching)
  const {
    data: cashSalesIndexData,
    error,
    isLoading,
    isValidating,
    mutate: mutateTableData,
  } = useSWR<CashSalesData, Error>(
    !isOffline ? [apiUrl, columnFilters, pagination, sorting] : null,
    async ([url]) => {
      const columnFiltersWithoutValid = columnFilters.filter((filter) => filter.id !== "valid");

      const params = new FormData();
      params.append("param[limit]", `${pagination.pageSize}`);
      params.append("param[offset]", `${pagination.pageIndex * pagination.pageSize}`);
      params.append(
        "param[filter]",
        columnFiltersWithoutValid.length > 0
          ? JSON.stringify(
            columnFiltersWithoutValid.reduce<Record<string, unknown>>((acc, curr) => {
              acc[curr.id] = curr.value;
              return acc;
            }, {}),
          )
          : "{}",
      );
      params.append(
        "param[order]",
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
      );
      params.append(
        "param[valid]",
        columnFilters.length > 0
          ? `${columnFilters.find((row) => row.id === "valid")?.value ?? ""}`
          : "",
      );
      params.append("param[sort]", sorting.length > 0 ? sorting[0].id : "createdAt");

      const headers = getAuthHeaders();

      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: params,
          credentials: "omit",
        });

        if (response.status === 401) {
          throw new Error("Session expired");
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    },
    {
      revalidateOnFocus: false,
    },
  );

  useEffect(() => {
    if (isOffline) {
      const filtered = filterOfflineRecords(offlineRecords, columnFilters);
      setTableData(filtered as any);
      setTotalNumOfRows(filtered.length);
      return;
    }

    if (cashSalesIndexData) {
      const dataWithPreferences = cashSalesIndexData.rows.map((row) => ({
        ...row,
        preferenceData: preferenceData,
        note: stripHtml(row.note),
      }));

      // Offline records filtered client-side to match current column filters
      const filteredOffline = filterOfflineRecords(offlineRecords, columnFilters);
      const merged = [...filteredOffline, ...dataWithPreferences];
      setTableData(merged as any);
      setViewDailySummary(cashSalesIndexData["daily-summary"]);
      setTotalNumOfRows(+cashSalesIndexData.total + filteredOffline.length);
    }
  }, [cashSalesIndexData, offlineRecords, isOffline, columnFilters]);

  useEffect(() => {
    if (cashSalesIndexData?.rows) {
      cacheOnlineRecords(cashSalesIndexData.rows);

      const updateLastDocNo = async () => {
        const offlineDrafts = await getOffline();

        const allDocNos = [
          ...cashSalesIndexData.rows.map((r) => r.docNo),
          ...offlineDrafts.filter((d) => !d.synced).map((d) => d.cashSales?.docNo),
        ].filter(Boolean);

        let maxDocNo = "";
        let maxNum = -1;

        allDocNos.forEach((docNo) => {
          const match = docNo?.match(/^([A-Za-z\-\/]+)(\d+)$/);
          if (match) {
            const n = parseInt(match[2]);
            if (n > maxNum) {
              maxNum = n;
              maxDocNo = docNo;
            }
          }
        });

        if (maxDocNo) cacheLastDocNo(maxDocNo);
      };

      updateLastDocNo();
    }
  }, [cashSalesIndexData]);

  // Server-Side Filtering: Handle errors and session expiration
  useEffect(() => {
    if (error) {
      if (error.message === "Session expired") {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Redirecting to login page.",
        });

        removeAuthData();

        setTimeout(() => {
          mutateTableData(undefined, false);
          router.push("/login");
        }, 500);
      } else if (!navigator.onLine) {
        setForbiddenMessage(null);
      } else {
        setForbiddenMessage(error.message);
      }
    }
  }, [error, router, toast]);

  // Reset Ordering Function
  const handleResetColumnOrdering = () => {
    try {
      localStorage.removeItem(COLUMN_ORDERING_KEY);
    } catch {
      // ignore storage errors
    }
    setColumnOrder([...initialColumnOrder]);
  };

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFilters((old) => {
      const newFilters = typeof updater === "function" ? updater(old) : updater;
      if (JSON.stringify(old) !== JSON.stringify(newFilters)) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
      return newFilters;
    });
  };

  const syncItems = useCallback(
    async (itemsToSync: Awaited<ReturnType<typeof getOffline>>) => {
      if (!itemsToSync.length) return;
      if (!acquireSyncLock()) return;

      setIsSyncing(true);

      // Sort by docNo so server receives records in order
      itemsToSync.sort((a, b) => {
        const matchA = a.cashSales?.docNo?.match(/^([A-Za-z\-\/]+)(\d+)$/);
        const matchB = b.cashSales?.docNo?.match(/^([A-Za-z\-\/]+)(\d+)$/);
        if (matchA && matchB) return parseInt(matchA[2]) - parseInt(matchB[2]);
        return (a.createdAt ?? 0) - (b.createdAt ?? 0);
      });

      toast({
        title: "Syncing",
        description: `Syncing ${itemsToSync.length} record${itemsToSync.length > 1 ? "s" : ""}…`,
        duration: 3000,
      });

      const headers = getAuthHeaders();

      for (const item of itemsToSync) {
        try {
          await markAsSyncing(item.id);

          const form_data = new FormData();
          form_data.append("id", item.cashSales?.UUID || item.id);
          const cashSalesForSync = { ...item.cashSales, docNo: "" };
          form_data.append(
            "data",
            JSON.stringify({
              cashSales: cashSalesForSync,
              cashSalesHasDetails: item.cashSalesHasDetails,
            }),
          );

          item.attachments?.forEach((file: any, index: number) => {
            form_data.append(`cashSales[attachment][${index}][Name]`, file.name);
            form_data.append(`cashSales[attachment][${index}][File]`, file.base64 || "");
          });

          const url = `${ORIGIN}/cash_sales/api/cash-sales/${item.saveType}${item.transferType}`;

          const response = await fetch(url, {
            method: "POST",
            headers,
            body: form_data,
            credentials: "omit",
          });

          if (response.status === 401) {
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Your session has expired. Redirecting to login page.",
            });
            await unmarkAsSyncing(item.id);
            router.push("/login");
            return;
          }

          if (!response.ok) {
            const errorData = await response.json();
            toast({
              title: errorData.name || "Sync Failed",
              description: errorData.message || "Failed to sync record.",
              variant: "destructive",
              duration: 3000,
            });
            continue;
          }

          const responseData = await response.json();

          // Sync custom field data
          if (item.customFieldData && responseData?.data) {
            try {
              const cfPayload = item.customFieldData as {
                customFieldData: Record<string, unknown>;
                attachments: { name: string; base64?: string; link?: string }[];
                module?: string;
                docType?: string;
              };

              const cfFormData = new FormData();
              cfFormData.append("customDIYFieldData[docType]", cfPayload.docType ?? "");
              cfFormData.append("customDIYFieldData[docNo]", responseData.item ?? item.cashSales?.docNo ?? "");
              cfFormData.append("customDIYFieldData[docUUID]", responseData.data);
              cfFormData.append(
                "customDIYFieldData[customFieldData]",
                JSON.stringify(cfPayload.customFieldData ?? {}),
              );

              (cfPayload.attachments ?? []).forEach((file, index) => {
                cfFormData.append(`customDIYFieldData[attachment][${index}][Name]`, file.name ?? "");
                cfFormData.append(`customDIYFieldData[attachment][${index}][File]`, file.base64 ?? "");
              });

              const cfRes = await fetch(
                `${ORIGIN}/custom_d_i_y_field_data/api/custom-d-i-y-field-data/update-custom-d-i-y-field-data?id=${responseData.data}&module=${cfPayload.module ?? "sales"}`,
                { method: "POST", headers, body: cfFormData },
              );

              if (!cfRes.ok) {
                console.error("Failed to sync custom field data for offline record", item.id);
              }
            } catch (cfErr) {
              console.error("Custom field sync error:", cfErr);
            }
          }

          await deleteOffline(item.id);
          window.dispatchEvent(new CustomEvent("offlineRecordSynced"));
        } catch (err) {
          console.error("Sync error:", err);
        }
      }

      toast({
        title: "Sync Complete",
        description: "Records synced successfully.",
        duration: 3000,
      });

      setSelectedOfflineIds(new Set());
      setIsSyncing(false);
      releaseSyncLock();
      mutateTableData();
    },
    [router, toast, mutateTableData],
  );

  // Sync all pending records
  const handleSyncAll = useCallback(async () => {
    if (isOffline) return;
    const dbItems = await getOffline();
    const pending = dbItems.filter((item) => !item.synced && !item.syncing);
    await syncItems(pending);
  }, [isOffline, syncItems]);

  // Sync only the selected records
  const handleSyncSelected = useCallback(async () => {
    if (isOffline || selectedOfflineIds.size === 0) return;
    const dbItems = await getOffline();
    const pending = dbItems.filter(
      (item) => !item.synced && !item.syncing && selectedOfflineIds.has(item.id),
    );
    await syncItems(pending);
  }, [isOffline, selectedOfflineIds, syncItems]);

  const handleSelectAllOffline = useCallback(() => {
    const visibleOfflineIds = (tableData as any[])
      .filter((r) => r._isOfflinePending)
      .map((r) => r._offlineId as string);
    setSelectedOfflineIds(new Set(visibleOfflineIds));
  }, [tableData]);

  const handleDeselectAllOffline = useCallback(() => {
    setSelectedOfflineIds(new Set());
  }, []);

  // Toggle a single offline record checkbox
  const handleToggleOfflineId = useCallback((id: string) => {
    setSelectedOfflineIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // Server-Side Filtering (Table)
  const table = useReactTable({
    columns,
    data: tableData,
    state: {
      columnFilters,
      columnOrder,
      columnSizing,
      columnVisibility,
      pagination,
      sorting,
    },
    onColumnFiltersChange: handleColumnFiltersChange,
    onColumnOrderChange: setColumnOrder,
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    columnResizeMode: "onChange",
    enableColumnResizing: true,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    pageCount: totalNumOfRows ? Math.ceil(totalNumOfRows / pagination.pageSize) : -1,
    getCoreRowModel: getCoreRowModel(),
  });

  usePreventShiftTextSelect();

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoadedSuccessfully, setIsLoadedSuccessfully] = useState<boolean>(false);

  // Server-Side Filtering (Loading State)
  useEffect(() => {
    if (isOffline) {
      setIsLoadedSuccessfully(true);
      return;
    }
    if (isLoading || !cashSalesIndexData) {
      setLoadingProgress(90);
    } else {
      setIsLoadedSuccessfully(true);
    }
  }, [isLoading, cashSalesIndexData, isOffline]);

  const onDoubleClick = (row: Row<CashSales>) => {
    if ((row.original as any)._isOfflinePending) {
      window.location.href = `/sales/cash-sales/edit?draft=${(row.original as any)._offlineId}`;
      return;
    }
    window.location.href = `/sales/cash-sales/edit?item=${encodeURIComponent(row.original.docNo)}&id=${row.original.UUID}`;
  };

  const onRowSelection = useHandleRowSelect(table, onDoubleClick);
  const sensors = useDndSensors();
  const columnSizeVars = useColumnSizeVars(table);

  return (
    <div className="flex h-full flex-col bg-erp-blue-3 @container-[size]">
      <DataTableToolbar
        table={table}
        refreshTable={mutateTableData}
        totalNumOfRows={totalNumOfRows}
        defaultColumns={defaultColumnVisibility}
        dataStatusBadgeDisplay={
          (isLoadedSuccessfully && <DataLoadingStatusBadge variant="success" />) ||
          (!!error && <DataLoadingStatusBadge variant="error" />)
        }
        onResetColumnOrdering={handleResetColumnOrdering}
        viewDailySummary={viewDailySummary}
      />
      <Separator className="bg-erp-blue-11" />
      <ScrollArea className="h-[100cqh] p-1.5">
        {forbiddenMessage ? (
          <NoResultsTableRow columns={columns} message={forbiddenMessage} />
        ) : (
          <>
            {/* Mobile View (Data Table) */}
            <MobileDataTable
              table={table}
              headerFields={["docNo", "docDate"]}
              initialVisibleFields={3}
              excludeFromGrid={["docNo", "docDate"]}
              headerLabels={{ docDate: "Doc Date" }}
            />

            {/* Web View (Data Table) */}
            <div className="hidden md:block">
              <DndContext
                collisionDetection={closestCenter}
                modifiers={[restrictToHorizontalAxis]}
                onDragEnd={(event) => handleDndDragEnd(event, setColumnOrder)}
                sensors={sensors}
              >
                <Table
                  className="table-fixed border-separate border-spacing-[3px] whitespace-nowrap border bg-erp-gray-1"
                  style={{ ...columnSizeVars, width: table.getTotalSize() }}
                >
                  <TableHeader className="sticky top-0">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        <SortableContext
                          items={columnOrder}
                          strategy={horizontalListSortingStrategy}
                        >
                          {headerGroup.headers.map((header) => (
                            <DragableTableHead
                              key={header.id}
                              header={header}
                              className="bg-erp-blue-11 font-normal"
                              style={{
                                width: `calc(var(--header-${header?.id}-size) * 1px)`,
                              }}
                            >
                              {header.column.id === "status" ? (
                                <TableHeadStatusFilter table={table} />
                              ) : header.column.id === "valid" ? (
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
                      table={table}
                      onRowSelection={onRowSelection}
                      selectedOfflineIds={selectedOfflineIds}
                      onToggleOfflineId={handleToggleOfflineId}
                      isSyncing={isSyncing}
                    />
                  ) : (
                    <NonMemoizedTableBody
                      table={table}
                      onRowSelection={onRowSelection}
                      selectedOfflineIds={selectedOfflineIds}
                      onToggleOfflineId={handleToggleOfflineId}
                      isSyncing={isSyncing}
                    />
                  )}
                </Table>
              </DndContext>
            </div>
          </>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <FloatingSyncBar
        totalOffline={(tableData as any[]).filter((r) => r._isOfflinePending).length}
        selectedIds={selectedOfflineIds}
        onSelectAll={handleSelectAllOffline}
        onDeselectAll={handleDeselectAllOffline}
        onSyncSelected={handleSyncSelected}
        onSyncAll={handleSyncAll}
        isSyncing={isSyncing}
      />
      {!isLoadedSuccessfully && <LoadingUI progressValue={loadingProgress} />}
    </div>
  );
}

//  Table Body 

type TableBodyProps = {
  table: TableType<CashSales>;
  onRowSelection: (row: Row<CashSales>) => (event: MouseEvent<HTMLTableRowElement>) => void;
  selectedOfflineIds: Set<string>;
  onToggleOfflineId: (id: string) => void;
  isSyncing: boolean;
};

function NonMemoizedTableBody({
  table,
  onRowSelection,
  selectedOfflineIds,
  onToggleOfflineId,
  isSyncing,
}: TableBodyProps) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => {
          const isOfflinePending = (row.original as any)._isOfflinePending;
          const offlineId: string = (row.original as any)._offlineId;
          const isChecked = isOfflinePending && selectedOfflineIds.has(offlineId);

          return (
            <TableRow
              className={cn(
                "odd:bg-erp-blue-5 even:bg-erp-blue-1 hover:bg-erp-blue-7 data-[state=selected]:bg-erp-blue-17",
                isOfflinePending &&
                "border-l-2 border-l-amber-400 bg-amber-50 odd:bg-amber-50 even:bg-amber-50 hover:bg-amber-100",
                isOfflinePending && isChecked && "bg-amber-100 odd:bg-amber-100 even:bg-amber-100",
              )}
              data-state={row.getIsSelected() && "selected"}
              onClick={onRowSelection(row)}
              key={row.id}
            >
              {row.getVisibleCells().map((cell, cellIndex) => {
                // Inject checkbox as the very first cell for offline-pending rows
                const isFirstCell = cellIndex === 0;

                return (
                  <TableCell
                    key={cell.id}
                    className="truncate"
                    title={isFirstCell && isOfflinePending ? "" : (cell.getValue() ?? "").toString()}
                    style={{
                      width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
                      minWidth: cell.column.columnDef.minSize,
                    }}
                  >
                    {isFirstCell && isOfflinePending ? (
                      // Checkbox + original cell content stacked side by side
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          disabled={isSyncing}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => onToggleOfflineId(offlineId)}
                          className="h-3.5 w-3.5 shrink-0 cursor-pointer accent-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
                          aria-label={`Select record ${(row.original as any).docNo || offlineId} for sync`}
                        />
                        <span className="truncate" title={(cell.getValue() ?? "").toString()}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </div>
                    ) : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })
      ) : (
        <NoResultsTableRow columns={table.getVisibleLeafColumns()} />
      )}
    </TableBody>
  );
}

const MemoizedTableBody = memo(
  NonMemoizedTableBody,
  (prev, next) =>
    prev.table.options.data === next.table.options.data &&
    prev.selectedOfflineIds === next.selectedOfflineIds &&
    prev.isSyncing === next.isSyncing,
) as typeof NonMemoizedTableBody;

// HTML Utility 
function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  return text;
}