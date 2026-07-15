//Imports
import { useEffect, useRef, useState } from "react";

//Hooks
import useSWR from "swr";
import { UseFormReturn } from "react-hook-form";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

//Parameter Type
interface DeliveryAddressRow {
  UUID: string;
  deliveryLocation: string;
  deliveryAddress: string;
  contact: string;
  phoneNo: string;
  email: string;
  description: string;
}

type DeliveryAddressState = {
  data: DeliveryAddressRow[];
  showTable: boolean;
  totalRows: number;
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  isLoading: boolean;
};

export function useDeliveryAddressDropdown(form: UseFormReturn<any>, role?: string) {
  const headers = getAuthHeaders();
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<DeliveryAddressState>({
    data: [],
    showTable: false,
    totalRows: 0,
    pagination: { pageIndex: 0, pageSize: 20 },
    sorting: [],
    columnFilters: [],
    isLoading: false,
  });

  const [swrKey, setSwrKey] = useState<{
    customerUUID: string;
    supplierUUID: string;
    pagination: PaginationState;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
  } | null>(null);

  const columns = [
    { accessorKey: "deliveryLocation", header: "Delivery Location" },
    { accessorKey: "deliveryAddress", header: "Delivery Address" },
    { accessorKey: "description", header: "Remark" },
  ];

  // Close Dropdown Table Function
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setState((prev) => ({ ...prev, showTable: false }));
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // SWR Fetcher
  const { data: swrData, isLoading: swrIsLoading, isValidating, mutate } = useSWR(
    swrKey,
    async (key) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const { pagination, sorting, columnFilters } = key;
      const formData = new FormData();

      formData.append("param[limit]", `${pagination.pageSize}`);
      formData.append("param[offset]", `${pagination.pageIndex * pagination.pageSize}`);
      formData.append("param[order]", sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc");
      formData.append("param[sort]", sorting.length > 0 ? sorting[0].id : "createdAt");

      const columnFiltersWithoutValid = columnFilters.filter(f => f.id !== "valid");
      formData.append(
        "param[filter]",
        columnFiltersWithoutValid.length > 0
          ? JSON.stringify(
            columnFiltersWithoutValid.reduce<Record<string, unknown>>((acc, curr) => {
              acc[curr.id] = curr.value;
              return acc;
            }, {})
          )
          : "{}"
      );

      const apiURL = role === "supplier"
        ? `${ORIGIN}/universal/get-supplier-has-delivery-location-by-supplier?id=${key.supplierUUID}`
        : `${ORIGIN}/universal/get-customer-has-delivery-location-by-customer?id=${key.customerUUID}`;

      const res = await fetch(apiURL, {
        method: "POST",
        headers,
        body: formData,
        signal: abortControllerRef.current.signal,
      }
      );

      if (!res.ok) throw new Error("Failed to fetch delivery address data");
      return res.json();
    },
    { revalidateOnFocus: false, dedupingInterval: 0 }
  );

  useEffect(() => {
    if (!swrData) return;
    setState((prev) => ({
      ...prev,
      data: swrData.rows ?? [],
      totalRows: swrData.total ?? swrData.rows?.length ?? 0,
    }));
  }, [swrData]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isLoading: swrIsLoading || isValidating,
    }));
  }, [swrIsLoading, isValidating]);

  // Fetch Data Function
  const fetchData = (
    pagination = state.pagination,
    sorting = state.sorting,
    columnFilters = state.columnFilters,
  ) => {
    const customerUUID = form.getValues("customerCode");
    const supplierUUID = form.getValues("supplierCode");

    if (role === "supplier") {
      if (!supplierUUID) return;
    } else {
      if (!customerUUID) return;
    }

    setState((prev) => ({
      ...prev,
      showTable: true,
      pagination,
      sorting,
      columnFilters,
    }));

    setSwrKey({ customerUUID, supplierUUID, pagination, sorting, columnFilters });
  };

  // Set Field Value Function
  const onClickRow = (row: DeliveryAddressRow) => {
    form.setValue("deliveryAddressUUID", row.UUID);
    form.setValue("deliveryAddress", row.deliveryAddress);
    form.setValue("deliveryAttention", row.contact);
    form.setValue("deliveryPhoneNo", row.phoneNo);
    form.setValue("deliveryEmail", row.email);
    setState((prev) => ({ ...prev, showTable: false }));
  };

  // Shared Props
  const getTableProps = () => ({
    columns,
    data: state.data,
    totalRows: state.totalRows,
    isLoading: state.isLoading,
    pagination: state.pagination,
    sorting: state.sorting,
    columnFilters: state.columnFilters,
    onPaginationChange: (updater: any) => {
      const next = typeof updater === "function" ? updater(state.pagination) : updater;
      fetchData(next, state.sorting, state.columnFilters);
    },
    onSortingChange: (updater: any) => {
      const next = typeof updater === "function" ? updater(state.sorting) : updater;
      fetchData(state.pagination, next, state.columnFilters);
    },
    onColumnFiltersChange: (updater: any) => {
      const next = typeof updater === "function" ? updater(state.columnFilters) : updater;
      fetchData({ ...state.pagination, pageIndex: 0 }, state.sorting, next);
    },
    onClickRow,
    refreshTable: () => mutate(undefined, { revalidate: true }),
  });

  return {
    state,
    setState,
    inputRef,
    tableRef,
    fetchData,
    onClickRow,
    getTableProps,
  };
}