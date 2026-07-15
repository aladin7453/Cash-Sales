"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import type {
  ColumnFiltersState,
  ColumnOrderState,
  ColumnSizingState,
  OnChangeFn,
  PaginationState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

import { useToast } from "@/components/ui/use-toast";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import { DEFAULT_DATA_TABLE_PAGE_SIZE, getAuthHeaders, removeAuthData } from "@/lib/constants";

type IndexResponse<TRow> = {
  total: string;
  rows: TRow[];
};

type TableStorageKeys = {
  columnFilters: string;
  columnOrdering: string;
  columnSizing: string;
  columnVisibility: string;
  pagination: string;
  sorting: string;
};

function createTableStorageKeys(moduleName: string): TableStorageKeys {
  const base = `${moduleName}.bs.table`;

  return {
    columnFilters: `${base}.filters`,
    columnOrdering: `${base}.ordering`,
    columnSizing: `${base}.sizing`,
    columnVisibility: `${base}.columns`,
    pagination: `${base}.pagination`,
    sorting: `${base}.sorting`,
  };
}

export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  // Replace <br> and <br/> with newlines
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  // Replace <p> with nothing, </p> with newline
  text = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n");
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, "");
  // Replace HTML entities
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

  return text;
}

type UseGridViewDataTableOptions<TRow, TData> = {
  // Used to namespace the six localStorage keys, e.g. "sales-invoice" 
  moduleName: string;
  apiUrl: string;
  initialColumnOrder: string[];
  defaultColumnVisibility: VisibilityState;
  redirectOnSessionExpiry?: string;
  mapRow?: (row: TRow) => TData;
};

export function useGridViewDataTable<TRow = any, TData = TRow>({
  moduleName,
  apiUrl,
  initialColumnOrder,
  defaultColumnVisibility,
  redirectOnSessionExpiry = "/login",
  mapRow,
}: UseGridViewDataTableOptions<TRow, TData>) {
  const router = useRouter();
  const { toast } = useToast();

  const STORAGE_KEYS = createTableStorageKeys(moduleName);

  const [tableData, setTableData] = useState<TData[]>([]);
  const [forbiddenMessage, setForbiddenMessage] = useState<string | null>(null);
  const [totalNumOfRows, setTotalNumOfRows] = useState(0);

  const [columnFilters, setColumnFiltersRaw] = useLocalStorage<ColumnFiltersState>(
    STORAGE_KEYS.columnFilters,
    [],
  );
  const [columnOrder, setColumnOrder] = useLocalStorage<ColumnOrderState>(
    STORAGE_KEYS.columnOrdering,
    initialColumnOrder,
  );
  const [columnSizing, setColumnSizing] = useLocalStorage<ColumnSizingState>(
    STORAGE_KEYS.columnSizing,
    {},
  );
  const [columnVisibility, setColumnVisibility] = useLocalStorage<VisibilityState>(
    STORAGE_KEYS.columnVisibility,
    defaultColumnVisibility,
  );
  const [pagination, setPagination] = useLocalStorage<PaginationState>(STORAGE_KEYS.pagination, {
    pageIndex: 0,
    pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
  });
  const [sorting, setSorting] = useLocalStorage<SortingState>(STORAGE_KEYS.sorting, []);

  const handleColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    setColumnFiltersRaw((old) => {
      const next = typeof updater === "function" ? updater(old) : updater;
      if (JSON.stringify(old) !== JSON.stringify(next)) {
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
      }
      return next;
    });
  };

  const handleResetColumnOrdering = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.columnOrdering);
    } catch {
      // ignore storage errors
    }
    setColumnOrder([...initialColumnOrder]);
  };

  const {
    data: indexData,
    error,
    isLoading,
    isValidating,
    mutate: mutateTableData,
  } = useSWR<IndexResponse<TRow>, Error>(
    [apiUrl, columnFilters, pagination, sorting],
    async ([url]) => {
      const columnFiltersWithoutValid = columnFilters.filter((f) => f.id !== "valid");

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
      const response = await fetch(url, { method: "POST", headers, body: params });

      if (response.status === 401) {
        throw new Error("Session expired");
      }
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }
      return response.json();
    },
    { revalidateOnFocus: false },
  );

  useEffect(() => {
    if (indexData) {
      const rows = mapRow ? indexData.rows.map(mapRow) : (indexData.rows as unknown as TData[]);
      setTableData(rows);
      setTotalNumOfRows(+indexData.total);
    }
  }, [indexData]);

  useEffect(() => {
    if (!error) return;

    if (error.message === "Session expired") {
      toast({
        variant: "destructive",
        title: "Session Expired",
        description: "Your session has expired. Redirecting to login page.",
      });
      removeAuthData();
      setTimeout(() => {
        mutateTableData(undefined, false);
        router.push(redirectOnSessionExpiry);
      }, 500);
    } else {
      setForbiddenMessage(error.message);
    }
  }, [error, router, toast]);

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoadedSuccessfully, setIsLoadedSuccessfully] = useState(false);

  useEffect(() => {
    if (isLoading || !indexData) {
      setLoadingProgress(90);
    } else {
      setIsLoadedSuccessfully(true);
    }
  }, [isLoading, indexData]);

  useEffect(() => {
    if (isValidating) {
      setIsLoadedSuccessfully(false);
      setLoadingProgress(95);
    } else {
      setIsLoadedSuccessfully(true);
    }
  }, [isValidating]);

  return {
    tableData,
    totalNumOfRows,
    forbiddenMessage,
    error,
    isLoadedSuccessfully,
    loadingProgress,
    mutateTableData,
    columnFilters,
    columnOrder,
    columnSizing,
    columnVisibility,
    pagination,
    sorting,
    setColumnOrder,
    setColumnSizing,
    setColumnVisibility,
    setPagination,
    setSorting,
    handleColumnFiltersChange,
    handleResetColumnOrdering,
  };
}