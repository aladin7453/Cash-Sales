"use client";

import type { ColumnDef } from "@tanstack/react-table";

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

// Preference (Format Number Function)
const formatNumber = (value: string | number, decimalPlaces: number = 2): string => {
  if (value === null || value === undefined || value === '') {
    return (0).toFixed(decimalPlaces);
  }
  
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return (0).toFixed(decimalPlaces);
  }
  
  return numValue.toFixed(decimalPlaces);
};

export const sellingPriceHistoryColumns: ColumnDef<SellingPriceHistoryItem>[] = [
  {
    id: "docNo",
    accessorKey: "docNo",
    header: "Doc No",
    cell: ({ row }) => {
      return <p> {row.original.docNo} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "docDateFormat",
    accessorKey: "docDateFormat",
    header: "Effective Date",
    cell: ({ row }) => {
      return <p> {row.original.docDateFormat} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "price",
    accessorKey: "price",
    header: "Selling Price",
    cell: ({ row }) => {
      const decimal = row.original.preferenceData?.data?.decimal ?? 2; // Use nullish coalescing with default 2
      return <p className="text-right">{formatNumber(row.original.price, decimal)}</p>;
    },
    filterFn: "includesString",
  },
  {
    id: "currencyCode",
    accessorKey: "currencyCode",
    header: "Currency",
    cell: ({ row }) => {
      return <p> {row.original.currencyCode} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "customerCategoryCode",
    accessorKey: "customerCategoryCode",
    header: "Customer Category",
    cell: ({ row }) => {
      return <p> {row.original.customerCategoryCode} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "sourceModule",
    accessorKey: "sourceModule",
    header: "Source Module",
    cell: ({ row }) => {
      return <p> {row.original.sourceModule} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "createdByUsername",
    accessorKey: "createdByUsername",
    header: "Updated by",
    cell: ({ row }) => {
      return <p> {row.original.createdByUsername} </p>;
    },
    filterFn: "includesString",
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Quantity Sold",
    cell: ({ row }) => {
      const decimal = row.original.preferenceData?.data?.decimal ?? 2; // Use nullish coalescing with default 2
      return <p className="text-right">{formatNumber(row.original.quantity, decimal)}</p>;
    },
    filterFn: "includesString",
  },
  {
    id: "balanceQuantity",
    accessorKey: "balanceQuantity",
    header: "Balance Quantity",
    cell: ({ row }) => {
      const decimal = row.original.preferenceData?.data?.decimal ?? 2; // Use nullish coalescing with default 2
      return <p className="text-right">{formatNumber(row.original.balanceQuantity, decimal)}</p>;
    },
    filterFn: "includesString",
  },  
  {
    id: "itemUOM",
    accessorKey: "itemUOM",
    header: "UOM",
    cell: ({ row }) => {
      return <p> {row.original.itemUOM} </p>;
    },
    filterFn: "includesString",
  },  
];