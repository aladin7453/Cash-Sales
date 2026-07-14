"use client";
import { columns as CustomerColumns } from "@/app/sales/customer/columns";
import { columns as SupplierColumns } from "@/app/purchase/supplier/columns";
import { columns as OriginalSalesInvoiceColumns } from "@/app/sales/sales-invoice/columns";
import { columns as CashSalesColumns } from "@/app/sales/cash-sales/columns";
import { columns as SalesCreditNoteColumns } from "@/app/sales/sales-credit-note/columns";
import { columns as SalesDebitNoteColumns } from "@/app/sales/sales-debit-note/columns";
import { columns as PurchaseInvoiceColumns } from "@/app/purchase/purchase-invoice/columns";
import { columns as PurchaseCreditNoteColumns } from "@/app/purchase/purchase-credit-note/columns";
import { columns as PurchaseDebitNoteColumns } from "@/app/purchase/purchase-debit-note/columns";

import type { Customer } from "@/app/sales/customer/columns";
import type { Supplier } from "@/app/purchase/supplier/columns";
import type { SalesInvoice } from "@/app/sales/sales-invoice/columns";
import type { CashSales } from "@/app/sales/cash-sales/columns";
import type { SalesCreditNote } from "@/app/sales/sales-credit-note/columns";
import type { SalesDebitNote } from "@/app/sales/sales-debit-note/columns";
import type { PurchaseInvoice } from "@/app/purchase/purchase-invoice/columns";
import type { PurchaseCreditNote } from "@/app/purchase/purchase-credit-note/columns";
import type { PurchaseDebitNote } from "@/app/purchase/purchase-debit-note/columns";

import type { ColumnDef } from "@tanstack/react-table";

// Use type aliases for consistency
// export type CustomerList = Customer;
export type DocumentList = CashSales;

// Create a fixed version of SalesInvoiceColumns that handles undefined values
// export const SalesInvoiceColumns: ColumnDef<SalesInvoice>[] = OriginalSalesInvoiceColumns.map((column) => {
//   if (column.id === "outstandingAmount") {
//     return {
//       ...column,
//       cell: ({ row }) => {
//         const value = row.original.outstandingAmount;
//         const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
//         return <p className="text-right">{numericValue.toFixed(2)}</p>;
//       },
//     };
//   }
//   return column;
// });

// Export the imported columns directly
export { 
  // CustomerColumns, 
  // SupplierColumns,
  CashSalesColumns,
  // SalesCreditNoteColumns,
  // SalesDebitNoteColumns,
};

// Create a unified DocumentColumns export for backward compatibility
// export const DocumentColumns = SalesInvoiceColumns;