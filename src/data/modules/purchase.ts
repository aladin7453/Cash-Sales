import { FaCartShopping } from "react-icons/fa6";

import type { MenuItem } from "@/lib/types";

export const purchaseModule: MenuItem = {
  title: "Purchase",
  ruleId: "PURCHASE",
  shortName: "Purchase",
  icon: FaCartShopping,
  subMenu: [
    {
      title: "Purchase Requisition",
      href: "/purchase/purchase-requisition",
      ruleId: "view-purchase-requisition",
    },
    {
      title: "Purchase Order",
      href: "/purchase/purchase-order",
      ruleId: "view-purchase-order",
    },
    {
      title: "Supplier Delivery Order",
      href: "/purchase/supplier-delivery-order",
      ruleId: "view-supplier-delivery-order",
    },
    {
      title: "Purchase Invoice",
      href: "/purchase/purchase-invoice",
      ruleId: "view-purchase-invoice",
    },
    {
      title: "Purchase Credit Note",
      href: "/purchase/purchase-credit-note",
      ruleId: "view-purchase-credit-note",
    },
    {
      title: "Purchase Debit Note",
      href: "/purchase/purchase-debit-note",
      ruleId: "view-purchase-debit-note",
    },
    {
      title: "Supplier Payment",
      href: "/purchase/supplier-payment",
      ruleId: "view-supplier-payment",
    },
    {
      title: "Supplier Contra",
      href: "/purchase/supplier-contra",
      ruleId: "view-supplier-contra",
    },
    {
      title: "Consolidated Purchase e-Invoice",
      href: "/purchase/consolidated-purchase-invoice",
      ruleId: "view-consolidated-purchase-invoice",
    },
    {
      title: "Cash Purchase",
      href: "/purchase/cash-purchase",
      ruleId: "view-cash-purchase",
    },

    {
      title: "Supplier",
      href: "/purchase/supplier",
      ruleId: "view-supplier",
    },
    {
      title: "Supplier Category",
      href: "/purchase/supplier-category",
      ruleId: "view-supplier-category",
    },
    {
      title: "Supplier Group",
      href: "/purchase/supplier-group",
      ruleId: "view-supplier-group",
    },
    {
      title: "Supplier Tag",
      href: "/purchase/supplier-tag",
      ruleId: "view-supplier-tag",
    },
    // {
    //   title: "Supplier Deposit",
    //   href: "/purchase/supplier-deposit",
    // },
    {
      title: "DIY Field",
      href: "/purchase/DIY-field",
      ruleId: "view-purchase-preference",
    },
    {
      title: "Purchase Preference",
      href: "/purchase/purchase-preference",
      ruleId: "view-purchase-preference",
    },
    {
      title: "Purchase Report",
      subMenu: [
        {
          title: "Supplier Monthly Purchase Report",
          href: "/purchase/purchase-report/supplier-monthly-purchase-report",
          ruleId: "view-supplier-monthly-purchase-report",
        },
        {
          title: "Supplier Payment Report",
          href: "/purchase/purchase-report/supplier-payment-report",
          ruleId: "view-supplier-payment-report",
        },
        {
          title: "Purchase Document Listing",
          href: "/purchase/purchase-report/purchase-document-listing",
          ruleId: "view-purchase-document-listing",
        },
        {
          title: "Purchase Analysis By Document",
          href: "/purchase/purchase-report/purchase-analysis-by-document",
          ruleId: "view-purchase-analysis-by-document",
        },
        {
          title: "Supplier Balance Report",
          href: "/purchase/purchase-report/supplier-balance-report",
          ruleId: "view-supplier-balance-report",
        },
        {
          title: "Supplier Due Document Listing",
          href: "/purchase/purchase-report/supplier-due-document-listing",
          ruleId: "view-supplier-due-document-listing",
        },
        {
          title: "Supplier Post Dated Cheque Listing",
          href: "/purchase/purchase-report/supplier-post-dated-cheque-listing",
          ruleId: "view-supplier-post-dated-cheque-listing",
        },
        {
          title: "Supplier Document (Interbank GIRO) Listing",
          href: "/purchase/purchase-report/supplier-document-interbank-giro-listing",
          ruleId: "view-supplier-document-interbank-giro-listing",
        },
        {
          title: "Supplier Bills And Payment Analysis",
          href: "/purchase/purchase-report/supplier-bills-and-payment-analysis",
          ruleId: "view-supplier-bills-and-payment-analysis",
        },
        {
          title: "Supplier Analysis By Document",
          href: "/purchase/purchase-report/supplier-analysis-by-document",
          ruleId: "view-supplier-analysis-by-document",
        },
        {
          title: "Supplier Aging Report",
          href: "/purchase/purchase-report/supplier-aging-report",
          ruleId: "view-supplier-aging-report",
        },
        {
          title: "Supplier Statement Report",
          href: "/purchase/purchase-report/supplier-statement-report",
          ruleId: "view-supplier-statement-report",
        },
        {
          title: "Outstanding Purchase Document Listing",
          href: "/purchase/purchase-report/outstanding-purchase-document-listing",
          ruleId: "view-outstanding-purchase-document-listing",
        },
        {
          title: "Purchase Price History Report",
          href: "/purchase/purchase-report/purchase-price-history-report",
          ruleId: "view-purchase-price-history-report",
        },
        // {
        //   title: "Purchase Summary Report",
        //   href: "/purchase/purchase-report/purchase-summary-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Top Purchase Items Report",
        //   href: "/purchase/purchase-report/top-purchase-items-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase by Product Category",
        //   href: "/purchase/purchase-report/purchase-by-product-category",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase Order Fulfilment Report",
        //   href: "/purchase/purchase-report/purchase-order-fulfilment-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Pending/Draft Purchase Report",
        //   href: "/purchase/purchase-report/pending-draft-purchase-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Overdue Purchase Orders Report",
        //   href: "/purchase/purchase-report/overdue-purchase-orders-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase Return Report",
        //   href: "/purchase/purchase-report/purchase-return-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Aging Payables Report",
        //   href: "/purchase/purchase-report/aging-payables-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Supplier Performance Report",
        //   href: "/purchase/purchase-report/supplier-performance-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase by Location/Branch",
        //   href: "/purchase/purchase-report/purchase-by-location-branch",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Tax Input Report(Purchase)",
        //   href: "/purchase/purchase-report/tax input report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Cancelled Purchase Orders Report",
        //   href: "/purchase/purchase-report/cancelled-purchase-orders-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase Forecast Report",
        //   href: "/purchase/purchase-report/purchae-forecast-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Frequent Supplier Report",
        //   href: "/purchase/purchase-report/frequent-supplier-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase Price Variance Report",
        //   href: "/purchase/purchase-report/purchase-price-variance-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Bulk Purchase Discount Report",
        //   href: "/purchase/purchase-report/bulk-purchase-discount-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase by Payment Method Report",
        //   href: "/purchase/purchase-report/purchase-by-payment-method-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Item Costing Report",
        //   href: "/purchase/purchase-report/item-costing-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Delivery Delay Report",
        //   href: "/purchase/purchase-report/delivery-delay-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Multi-Currency Purchase Report",
        //   href: "/purchase/purchase-report/multi-currency-purchase-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Purchase Contract Tracking Report",
        //   href: "/purchase/purchase-report/purchase-contract-tracking-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Supplier Credit Note Report",
        //   href: "/purchase/purchase-report/supplier-credit-note-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Low Stock Purchase Suggestion Report",
        //   href: "/purchase/purchase-report/low-stock-purchase-suggestion-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Last Purchase Price Report",
        //   href: "/purchase/purchase-report/last-purchase-price-report",
        //   ruleId: "view-purchase-report-document",
        // },
        // {
        //   title: "Year-to-Date Purchase Comparison",
        //   href: "/purchase/purchase-report/year-to-date-purchase-comparison",
        //   ruleId: "view-purchase-report-document",
        // },
      ],
    },
  ],
};
