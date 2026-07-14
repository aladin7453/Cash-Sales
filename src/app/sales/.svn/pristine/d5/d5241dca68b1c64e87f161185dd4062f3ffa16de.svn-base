import type { TransferToConfig } from "@/components/features/transfer/transferTo";
import { cashSalesTransferToColumns } from "./columns";

export const cashSalesTransferToConfig: TransferToConfig = {
  module: "cash_sales",
  model: "cash-sales",
  apiNamespace: "sales",
  transferDocType: "cashSales",
  itemsEndpointSuffix: "get-update-cash-sales-has-details-data",
  transferEndpointSuffix: "transfer-data",
  queryParam: "id",
  destinations: [
    {
      key: "salesCreditNote",
      label: "Sales Credit Note",
      route: "sales/sales-credit-note",
    },
  ],
  columns: cashSalesTransferToColumns,
  buttonText: "T-To",
  dialogTitle: "Transfer to",
  popoverTitle: "Select Item",
};
