import type { TransferFromConfig } from "@/components/features/transfer/transferFrom";
import { cashSalesDocumentColumns } from "./documentColumns";
import { cashSalesItemColumns } from "./itemColumns";

export const cashSalesTransferFromConfig: TransferFromConfig = {
  module: "cash_sales",
  model: "cash-sales",
  apiNamespace: "sales",
  sources: [
    {
      key: "quotation",
      label: "Quotation",
      apiDocType: "quotation",
      transferDocType: "quotation",
    },
    {
      key: "salesOrder",
      label: "Sales Order",
      apiDocType: "salesOrder",
      transferDocType: "sales_order",
    },
    {
      key: "deliveryOrder",
      label: "Sales Delivery Order",
      apiDocType: "deliveryOrder",
      transferDocType: "deliveryOrder",
    },
    {
      key: "jobOrder",
      label: "Job Order",
      apiDocType: "jobOrder",
      transferDocType: "jobOrder",
    },
  ],
  documentColumns: cashSalesDocumentColumns,
  itemColumns: cashSalesItemColumns,
  transferEndpointSuffix: "transfer-from",
  buttonText: "T-From",
  dialogTitle: "Transfer from",
  documentPopoverTitle: "Select Document",
  detailsPopoverTitle: "Transfer Details",
};
