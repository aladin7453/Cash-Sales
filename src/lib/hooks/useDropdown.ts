//Imports
import { useEffect, useRef, useState } from "react";

//Hooks
import useSWR from "swr";
import { UseFormReturn } from "react-hook-form";
import { getAuthHeaders, getCurrentAccount, ORIGIN } from "@/lib/constants";
import type { ColumnFiltersState, PaginationState, SortingState } from "@tanstack/react-table";

//Parameter Type
type DropdownConfig = {
  tableName: string;
  columns: { accessorKey: string; header: string; cell?: any }[];
  valueField: string;
  displayField: string;
  formValueField: string;
  formDisplayField: string;
  additionalMappings?: { sourceField: string; targetFormField: string }[];
};

type DropdownState = {
  currentDropdown: string | null;
  data: any[];
  originalData: any[];
  showTable: boolean;
  totalRows: number;
  pagination: Record<string, PaginationState>;
  sorting: Record<string, SortingState>;
  columnFilters: Record<string, ColumnFiltersState>;
  isLoading: boolean;
};

export function useDropdown(form: UseFormReturn<any>) {

  //State
  const headers = getAuthHeaders();
  const dropdownInputRef = useRef<HTMLInputElement | null>(null);
  const dropdownTableRef = useRef<HTMLDivElement | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const DEFAULT_PAGINATION: PaginationState = { pageIndex: 0, pageSize: 20 };

  const getPagination = (key: string) => dropdownState.pagination[key] ?? DEFAULT_PAGINATION;
  const getSorting = (key: string) => dropdownState.sorting[key] ?? [];
  const getColumnFilters = (key: string) => dropdownState.columnFilters[key] ?? [];

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    currentDropdown: null,
    data: [],
    originalData: [],
    showTable: false,
    totalRows: 0,
    pagination: {},
    sorting: {},
    columnFilters: {},
    isLoading: false,
  });

  const [swrKey, setSwrKey] = useState<{
    dropdownKey: string;
    pagination: PaginationState;
    sorting: SortingState;
    columnFilters: ColumnFiltersState;
  } | null>(null);

  const dropdownConfigs: Record<string, DropdownConfig> = {
    customer: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Customer Code" },
        { accessorKey: "customerGroupCode", header: "Customer Group" },
        { accessorKey: "customerName", header: "Customer Name" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "customerCode",
      formDisplayField: "customerCodeCode",
      additionalMappings: [
        { sourceField: "customerCode", targetFormField: "customerCodeCode" },
        { sourceField: "customerName", targetFormField: "customerName" },
      ],
    },
    customer1: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Customer Code" },
        { accessorKey: "customerName", header: "Customer" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "customer",
      formDisplayField: "customerName",
    },
    customer2: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Customer Code" },
        { accessorKey: "customerName", header: "Customer Name" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "customerCode",
      formDisplayField: "customerCodeCode",
      additionalMappings: [
        { sourceField: "customerCode", targetFormField: "customerCodeCode" },
        { sourceField: "customerName", targetFormField: "customerName" },
      ],
    },
    customerCode: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Customer Code" },
        { accessorKey: "customerGroupCode", header: "Customer Group" },
        { accessorKey: "customerName", header: "Customer Name" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "customer",
      formDisplayField: "customerCode",
    },
    customerCategory: {
      tableName: "customerCategory",
      columns: [
        { accessorKey: "customerCategoryCode", header: "Customer Category Code" },
        { accessorKey: "customerCategory", header: "Customer Category Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "customerCategory",
      formValueField: "customerCategory",
      formDisplayField: "customerCategoryName",
    },
    customerGroup: {
      tableName: "customerGroup",
      columns: [
        { accessorKey: "customerGroupCode", header: "Customer Group Code" },
        { accessorKey: "customerGroupName", header: "Customer Group Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "customerGroupName",
      formValueField: "customerGroup",
      formDisplayField: "customerGroupName",
    },
    deliveryTerm: {
      tableName: "deliveryTerm",
      columns: [
        { accessorKey: "deliveryTermCode", header: "Delivery Term Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "deliveryTermCode",
      formValueField: "deliveryTerm",
      formDisplayField: "deliveryTermCode",
    },
    location: {
      tableName: "location",
      columns: [
        { accessorKey: "locationCode", header: "Location Code" },
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationCode",
      formValueField: "location",
      formDisplayField: "locationCode",
    },
    location1: {
      tableName: "location",
      columns: [
        { accessorKey: "locationCode", header: "Location Code" },
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationName",
      formValueField: "location",
      formDisplayField: "locationName",
    },
    fromLocation: {
      tableName: "location",
      columns: [
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationName",
      formValueField: "sourceLocationCode",
      formDisplayField: "sourceLocationCodeCode",
    },
    fromLocation1: {
      tableName: "location",
      columns: [
        { accessorKey: "locationCode", header: "Location Code" },
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationName",
      formValueField: "sourceLocationCode",
      formDisplayField: "fromLocationName",
    },
    toLocation: {
      tableName: "location",
      columns: [
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationName",
      formValueField: "receivingLocationCode",
      formDisplayField: "receivingLocationCodeCode",
    },
    toLocation1: {
      tableName: "location",
      columns: [
        { accessorKey: "locationCode", header: "Location Code" },
        { accessorKey: "locationName", header: "Location" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationName",
      formValueField: "receivingLocationCode",
      formDisplayField: "toLocationName",
    },
    itemLocation: {
      tableName: "location",
      columns: [
        // { accessorKey: "locationName", header: "Location" },
        { accessorKey: "locationCode", header: "Location Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "locationCode",
      formValueField: "itemLocation",
      formDisplayField: "itemLocationCode",
    },
    shipper: {
      tableName: "shipper",
      columns: [
        // { accessorKey: "shipperName", header: "shipper" },
        { accessorKey: "shipperCode", header: "Shipper Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "shipperCode",
      formValueField: "shipper",
      formDisplayField: "shipperCode",
    },
    currency: {
      tableName: "currency",
      columns: [
        { accessorKey: "currencyCode", header: "Currency Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "currencyCode",
      formValueField: "currency",
      formDisplayField: "currencyCode",
      additionalMappings: [{ sourceField: "exchangeRateSales", targetFormField: "currencyRate" }],
    },
    project: {
      tableName: "project",
      columns: [
        { accessorKey: "projectCode", header: "Project Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "projectCode",
      formValueField: "project",
      formDisplayField: "projectCode",
    },
    paymentProject: {
      tableName: "project",
      columns: [
        { accessorKey: "projectCode", header: "Project Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "projectCode",
      displayField: "projectCode",
      formValueField: "paymentProject",
      formDisplayField: "paymentProject",
    },
    itemProject: {
      tableName: "project",
      columns: [
        { accessorKey: "projectCode", header: "Project Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "projectCode",
      formValueField: "itemProject",
      formDisplayField: "itemProjectCode",
    },
    creditTerm: {
      tableName: "creditTerm",
      columns: [
        { accessorKey: "creditTermCode", header: "Credit Term Code" },
        { accessorKey: "creditTermType", header: "Credit Term Type" },
        { accessorKey: "noOfDay", header: "No. of Days" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "creditTermCode",
      formValueField: "creditTerm",
      formDisplayField: "creditTermCode",
    },
    dealer: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Dealer Code" },
        { accessorKey: "customerName", header: "Dealer Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "dealer",
      formDisplayField: "dealer",
    },
    dealer1: {
      tableName: "customer",
      columns: [
        { accessorKey: "customerCode", header: "Dealer Code" },
        { accessorKey: "customerName", header: "Dealer Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "customerName",
      formValueField: "dealer",
      formDisplayField: "dealerName",
    },
    agent: {
      tableName: "agent",
      columns: [
        { accessorKey: "agentCode", header: "Agent Code" },
        { accessorKey: "agentName", header: "Agent Name" },
      ],
      valueField: "UUID",
      displayField: "agentName",
      formValueField: "agent",
      formDisplayField: "agentName",
    },
    salesAgent: {
      tableName: "agent",
      columns: [
        { accessorKey: "agentName", header: "Agent Name" },
        { accessorKey: "agentTypeName", header: "Agent Type" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "agentName",
      formValueField: "salesAgent",
      formDisplayField: "salesAgentName",
    },
    servicingAgent: {
      tableName: "agent",
      columns: [
        { accessorKey: "agentName", header: "Agent Name" },
        { accessorKey: "agentTypeName", header: "Agent Type" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "agentName",
      formValueField: "servicingAgent",
      formDisplayField: "servicingAgentName",
    },
    collectionAgent: {
      tableName: "agent",
      columns: [
        { accessorKey: "agentName", header: "Agent Name" },
        { accessorKey: "agentTypeName", header: "Agent Type" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "agentName",
      formValueField: "collectionAgent",
      formDisplayField: "collectionAgentName",
    },
    paymentMethod: {
      tableName: "paymentMethod",
      columns: [
        { accessorKey: "paymentMethodCode", header: "Payment Method Code" },
        { accessorKey: "eInvoicePaymentMethodCode", header: "E-Invoice Payment Method Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "paymentMethodCode",
      formValueField: "paymentMethod",
      formDisplayField: "paymentMethodCode",
      additionalMappings: [
        { sourceField: "bankACNo", targetFormField: "bankACNo" },
        { sourceField: "bankACName", targetFormField: "bankACName" },
        { sourceField: "eInvoicePaymentMethodCode", targetFormField: "eInvoicePaymentMethodCode" },
        { sourceField: "QRAttachmentLink", targetFormField: "QRAttachmentLink" },
      ],
    },
    paymentMethod1: {
      tableName: "paymentMethod",
      columns: [
        { accessorKey: "paymentMethodCode", header: "Payment Method" },
        { accessorKey: "eInvoicePaymentMethodCode", header: "E-Invoice Payment Method Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "description",
      formValueField: "paymentMethodCode",
      formDisplayField: "paymentMethod",
    },
    country: {
      tableName: "countryOfOrigin",
      columns: [
        { accessorKey: "code", header: "Country" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "description",
      formValueField: "country",
      formDisplayField: "countryOfOriginCode",
    },
    stockAdjustment: {
      tableName: "stockAdjustment",
      columns: [
        { accessorKey: "docNo", header: "Doc. No." },
        { accessorKey: "docDateFormat", header: "Doc. Date" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "docNo",
      formValueField: "selectedDocUUID",
      formDisplayField: "docNoNo",
    },
    stockGroup: {
      tableName: "stockGroup",
      columns: [
        { accessorKey: "stockGroupCode", header: "Stock Group Code" },
        { accessorKey: "stockGroup", header: "Stock Group" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockGroup",
      formValueField: "itemGroup",
      formDisplayField: "stockGroupCodeCode",
    },
    stockGroup1: {
      tableName: "stockGroup",
      columns: [{ accessorKey: "stockGroupCode", header: "Stock Group" }],
      valueField: "UUID",
      displayField: "stockGroupCode",
      formValueField: "stockGroupCode",
      formDisplayField: "stockGroupCodeCode",
    },
    stockGroup2: {
      tableName: "stockGroup",
      columns: [
        { accessorKey: "stockGroupCode", header: "Stock Group Code" },
        { accessorKey: "stockGroup", header: "Stock Group" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockGroup",
      formValueField: "stockGroup",
      formDisplayField: "stockGroupName",
    },
    stockGroup3: {
      tableName: "stockGroup",
      columns: [
        { accessorKey: "stockGroup", header: "Stock Group" },
        { accessorKey: "stockGroupCode", header: "Stock Group Code" },
      ],
      valueField: "UUID",
      displayField: "stockGroup",
      formValueField: "itemGroup",
      formDisplayField: "itemGroupName",
    },
    stockGroup4: {
      tableName: "stockGroup",
      columns: [
        { accessorKey: "stockGroup", header: "Stock Group" },
        { accessorKey: "stockGroupCode", header: "Stock Group Code" },
      ],
      valueField: "UUID",
      displayField: "stockGroup",
      formValueField: "stockGroupCode",
      formDisplayField: "stockGroupName",
    },
    stockCategory: {
      tableName: "stockCategory",
      columns: [
        { accessorKey: "stockCategoryCode", header: "Stock Category Code" },
        { accessorKey: "stockCategory", header: "Stock Category" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockCategory",
      formValueField: "itemCategory",
      formDisplayField: "stockCategoryCodeCode",
    },
    stockCategory1: {
      tableName: "stockCategory",
      columns: [{ accessorKey: "stockCategoryCode", header: "Stock Category" }],
      valueField: "UUID",
      displayField: "stockCategoryCode",
      formValueField: "stockCategoryCode",
      formDisplayField: "stockCategoryCodeCode",
    },
    stockCategory2: {
      tableName: "stockCategory",
      columns: [
        { accessorKey: "stockCategoryCode", header: "Stock Category Code" },
        { accessorKey: "stockCategory", header: "Stock Category" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockCategoryCode",
      formValueField: "itemCategory",
      formDisplayField: "itemCategoryCode",
    },
    stockCategory3: {
      tableName: "stockCategory",
      columns: [{ accessorKey: "stockCategoryCode", header: "Stock Category" }],
      valueField: "UUID",
      displayField: "stockCategoryCode",
      formValueField: "stockCategory",
      formDisplayField: "stockCategoryCode",
    },
    stock: {
      tableName: "stock",
      columns: [
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "stock", header: "Stock" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stock",
      formValueField: "item",
      formDisplayField: "itemName",
    },
    stock1: {
      tableName: "stock",
      columns: [
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "stock", header: "Stock" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockCode",
      formValueField: "item",
      formDisplayField: "itemCode",
    },
    stock2: {
      tableName: "stock",
      columns: [
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "description", header: "Description" },
        { accessorKey: "secondDescription", header: "Description 2" },
        { accessorKey: "balanceQuantity", header: "Qty" },
      ],
      valueField: "UUID",
      displayField: "stockCode",
      formValueField: "stock",
      formDisplayField: "stockName",
    },
    stock3: {
      tableName: "stock",
      columns: [
        { accessorKey: "stock", header: "Stock" },
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockCode",
      formValueField: "stockItem",
      formDisplayField: "stockItemCode",
    },
    stock4: {
      tableName: "stock",
      columns: [
        { accessorKey: "stock", header: "Stock Name" },
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stock",
      formValueField: "stockItem",
      formDisplayField: "stockName",
    },
    stockItem: {
      tableName: "stock",
      columns: [
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "stock", header: "Stock Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stock",
      formValueField: "stockItem",
      formDisplayField: "stockCode",
    },
    stockItem1: {
      tableName: "stock",
      columns: [
        { accessorKey: "stockCode", header: "Stock Code" },
        { accessorKey: "stock", header: "Stock Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockCode",
      formValueField: "stock",
      formDisplayField: "stockCode",
    },
    stockBatch: {
      tableName: "stockBatch",
      columns: [
        { accessorKey: "stockBatchCode", header: "Stock Batch" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockBatchCode",
      formValueField: "stockBatch",
      formDisplayField: "stockBatchCode",
    },
    stockBatch1: {
      tableName: "stockBatch",
      columns: [
        { accessorKey: "stockBatchCode", header: "Stock Batch" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockBatchCode",
      formValueField: "stockBatch",
      formDisplayField: "stockBatchName",
    },
    stockBatch2: {
      tableName: "stockBatch",
      columns: [
        { accessorKey: "stockBatchCode", header: "Stock Batch Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "stockBatchCode",
      formValueField: "docStockBatch",
      formDisplayField: "docStockBatchCode",
    },
    stockReceived: {
      tableName: "stockReceived",
      columns: [
        { accessorKey: "docNo", header: "Doc. No." },
        { accessorKey: "docDateFormat", header: "Doc. Date" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "docNo",
      formValueField: "document",
      formDisplayField: "docNoNo",
    },
    stockIssued: {
      tableName: "stockIssued",
      columns: [
        { accessorKey: "docNo", header: "Doc. No." },
        { accessorKey: "docDateFormat", header: "Doc. Date" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "docNo",
      formValueField: "selectedDocUUID",
      formDisplayField: "docNoNo",
    },
    stockTransfer: {
      tableName: "stockTransfer",
      columns: [
        { accessorKey: "docNo", header: "Doc. No." },
        { accessorKey: "docDateFormat", header: "Doc. Date" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "docNo",
      formValueField: "selectedDocUUID",
      formDisplayField: "docNoNo",
    },
    service: {
      tableName: "service",
      columns: [
        { accessorKey: "serviceCode", header: "Service Code" },
        { accessorKey: "serviceName", header: "Service Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "serviceName",
      formValueField: "serviceItem",
      formDisplayField: "serviceName",
    },
    serviceGroup: {
      tableName: "serviceGroup",
      columns: [
        // { accessorKey: "serviceGroupName", header: "Service Group Name" },
        { accessorKey: "serviceGroupCode", header: "Service Group Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "serviceGroupCode",
      formValueField: "serviceGroup",
      formDisplayField: "serviceGroupName",
    },
    requestedBy: {
      tableName: "user",
      columns: [
        { accessorKey: "fullName", header: "Full Name" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "fullName",
      formValueField: "createdBy",
      formDisplayField: "createdByName",
    },
    department: {
      tableName: "department",
      columns: [
        { accessorKey: "companyName", header: "Company" },
        { accessorKey: "department", header: "Department" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "department",
      formValueField: "department",
      formDisplayField: "departmentName",
    },
    supplier: {
      tableName: "supplier",
      columns: [
        { accessorKey: "supplierName", header: "Supplier" },
        { accessorKey: "supplierCode", header: "Supplier Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "supplierName",
      formValueField: "supplier",
      formDisplayField: "supplierName",
    },
    supplier1: {
      tableName: "supplier",
      columns: [
        { accessorKey: "supplierCode", header: "Supplier Code" },
        { accessorKey: "supplierGroupCode", header: "Supplier Group" },
        { accessorKey: "supplierName", header: "Supplier Name" },
      ],
      valueField: "UUID",
      displayField: "supplierCode",
      formValueField: "supplierCode",
      formDisplayField: "supplierCodeCode",
    },
    supplier2: {
      tableName: "supplier",
      columns: [
        { accessorKey: "supplierCode", header: "Supplier Code" },
        { accessorKey: "supplierName", header: "Supplier Name" },
      ],
      valueField: "supplierCode",
      displayField: "supplierName",
      formValueField: "supplierCode",
      formDisplayField: "supplierName",
    },
    supplierGroup: {
      tableName: "supplierGroup",
      columns: [
        { accessorKey: "supplierGroupCode", header: "Supplier Group Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "supplierGroupName",
      formValueField: "supplierGroup",
      formDisplayField: "supplierGroupName",
    },
    tariff: {
      tableName: "tariff",
      columns: [
        { accessorKey: "tariffCode", header: "Tariff Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "tariffCode",
      formValueField: "tariff",
      formDisplayField: "tariffCode",
    },
  };

  // Close Dropdown Table Function 
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownTableRef.current &&
      !dropdownTableRef.current.contains(event.target as Node) &&
      dropdownInputRef.current !== event.target
    ) {
      setDropdownState((prev) => ({ ...prev, showTable: false }));
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);
    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // SWR Fetcher 
  const { data: swrData, isLoading: swrIsLoading, isValidating, mutate } = useSWR(
    swrKey,
    async (key) => {
      // Cancel Fetch If Swicth Table
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      const config = dropdownConfigs[key.dropdownKey];
      const { pagination, sorting, columnFilters } = key;

      const form_data = new FormData();
      form_data.append("table[0]", config.tableName);

      if (config) {
        const columnFiltersWithoutValid = columnFilters.filter(f => f.id !== "valid");
        form_data.append("param[limit]", `${pagination.pageSize}`);
        form_data.append("param[offset]", `${pagination.pageIndex * pagination.pageSize}`);
        form_data.append("param[filter]", columnFiltersWithoutValid.length > 0
          ? JSON.stringify(columnFiltersWithoutValid.reduce<Record<string, unknown>>((acc, curr) => {
            acc[curr.id] = curr.value;
            return acc;
          }, {}))
          : "{}"
        );
        form_data.append("param[order]", sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc");
        form_data.append("param[sort]", sorting.length > 0 ? sorting[0].id : "createdAt");
        form_data.append("param[valid]", columnFilters.find(f => f.id === "valid")?.value?.toString() ?? "1");
      }

      const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
        method: "POST",
        headers,
        body: form_data,
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`Failed to fetch ${key.dropdownKey} data`);
      return response.json();
    },
    { revalidateOnFocus: false, dedupingInterval: 8 * 60 * 1000 }
  );

  useEffect(() => {
    if (!swrData || !swrKey) return;

    const config = dropdownConfigs[swrKey.dropdownKey];

    const extractTotal = (data: any) => {
      const totalKey = Object.keys(data).find(key => key.endsWith("Total"));
      return Number(data[totalKey ?? ""] ?? data.total ?? 0);
    };

    setDropdownState((prev) => ({
      ...prev,
      data: swrData.rows,
      originalData: config ? [] : swrData.rows,
      totalRows: extractTotal(swrData),
    }));
  }, [swrData]);

  useEffect(() => {
    setDropdownState((prev) => ({
      ...prev,
      isLoading: swrIsLoading || isValidating
    }));
  }, [swrIsLoading, isValidating]);

  const fetchDropdownData = (
    dropdownKey: string,
    pagination = getPagination(dropdownKey),
    sorting = getSorting(dropdownKey),
    columnFilters = getColumnFilters(dropdownKey),
  ) => {
    const config = dropdownConfigs[dropdownKey];
    if (!config) return;

    const isSwitchingDropdown = dropdownState.currentDropdown !== dropdownKey;

    setDropdownState((prev) => ({
      ...prev,
      currentDropdown: dropdownKey,
      data: isSwitchingDropdown ? [] : prev.data,
      showTable: true,
      pagination: { ...prev.pagination, [dropdownKey]: pagination },
      sorting: { ...prev.sorting, [dropdownKey]: sorting },
      columnFilters: { ...prev.columnFilters, [dropdownKey]: columnFilters },
    }));

    setSwrKey({ dropdownKey, pagination, sorting, columnFilters });
  };

  // Set Field Value Function 
  const onClickRow = (row: any) => {
    const config = dropdownConfigs[dropdownState.currentDropdown!];

    if (config) {
      form.setValue(config.formValueField, row[config.valueField]);
      form.setValue(config.formDisplayField, row[config.displayField]);

      if (config.additionalMappings) {
        config.additionalMappings.forEach((mapping) => {
          let value = row[mapping.sourceField];

          if (Array.isArray(value)) {
            value = value.length > 0 ? value[0] : null;
          }

          if (value !== undefined && value !== null && value !== "") {
            form.setValue(mapping.targetFormField, value);
          }
        });
      }
    }

    setDropdownState((prev) => ({ ...prev, showTable: false }));
  };

  // Search Function 
  const handleDropdownSearchChange = (dropdownKey: string, searchTerm: string) => {
    const config = dropdownConfigs[dropdownKey];
    if (!config) return;

    form.setValue(config.formDisplayField, searchTerm);

    if (searchTerm.trim() === "") {
      form.setValue(config.formValueField, "");

      if (config.additionalMappings) {
        config.additionalMappings.forEach((mapping) => {
          form.setValue(mapping.targetFormField, "");
        });
      }

      return;
    }

    if (!dropdownState.originalData.length || dropdownState.currentDropdown !== dropdownKey) {
      fetchDropdownData(dropdownKey);
      return;
    }

    const filtered = dropdownState.originalData.filter((row: any) =>
      row[config.displayField]?.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setDropdownState((prev) => ({
      ...prev,
      data: filtered,
      showTable: true,
      currentDropdown: dropdownKey,
    }));
  };

  // Shared Props 
  const getDropdownTableProps = (dropdownKey: string, customOnClickRow?: (row: any) => void) => {
    const config = dropdownConfigs[dropdownKey];
    const pagination = getPagination(dropdownKey);
    const sorting = getSorting(dropdownKey);
    const columnFilters = getColumnFilters(dropdownKey);

    return {
      columns: config.columns,
      data: dropdownState.data,
      totalRows: dropdownState.totalRows,
      isLoading: dropdownState.isLoading,
      pagination,
      sorting,
      columnFilters,
      onPaginationChange: (updater: any) => {
        const next = typeof updater === "function" ? updater(pagination) : updater;
        fetchDropdownData(dropdownKey, next, sorting, columnFilters);
      },
      onSortingChange: (updater: any) => {
        const next = typeof updater === "function" ? updater(sorting) : updater;
        fetchDropdownData(dropdownKey, pagination, next, columnFilters);
      },
      onColumnFiltersChange: (updater: any) => {
        const next = typeof updater === "function" ? updater(columnFilters) : updater;
        fetchDropdownData(dropdownKey, { ...pagination, pageIndex: 0 }, sorting, next);
      },
      onClickRow: (row: any) => {
        if (customOnClickRow) {
          customOnClickRow(row);
          setDropdownState((prev) => ({ ...prev, showTable: false }));
        } else {
          onClickRow(row);
        }
      },
      refreshTable: () => mutate(undefined, { revalidate: true }),
    };
  };

  return {
    dropdownState,
    dropdownConfigs,
    dropdownInputRef,
    dropdownTableRef,
    fetchDropdownData,
    onClickRow,
    handleDropdownSearchChange,
    getDropdownTableProps
  };
}