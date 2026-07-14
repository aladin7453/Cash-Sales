import SVGMoneyBag from "@/components/icons/svg-repo/SVGMoneyBag";

import type { MenuItem } from "@/lib/types";

export const assetModule: MenuItem = {
  title: "Asset",
  ruleId: "ASSET",
  shortName: "Asset",
  icon: SVGMoneyBag,
  subMenu: [
    {
      title: "Asset Assignment",
      href: "/asset-management/asset-assignment",
      ruleId: "view-asset-assign",
    },
    {
      title: "Asset Borrow",
      href: "/asset-management/asset-borrow",
      ruleId: "view-asset-borrow",
    },
    {
      title: "Asset Disposal",
      href: "/asset-management/asset-disposal",
      ruleId: "view-asset-disposal",
    },

    {
      title: "Asset Lease",
      href: "/asset-management/asset-lease",
      ruleId: "view-asset-lease",
    },
    {
      title: "Asset Maintenance",
      href: "/asset-management/asset-maintenance",
      ruleId: "view-asset-maintenance",
    },
    {
      title: "Asset Maintenance Request",
      href: "/asset-management/asset-maintenance-request",
      ruleId: "view-asset-maintenance-request",
    },
    {
      title: "Asset",
      href: "/asset-management/asset",
      ruleId: "view-asset",
    },
    {
      title: "Asset Category",
      href: "/asset-management/asset-category",
      ruleId: "view-asset-category",
    },
    {
      title: "Asset Group",
      href: "/asset-management/asset-group",
      ruleId: "view-asset-group",
    },
    {
      title: "Asset Type",
      href: "/asset-management/asset-type",
      ruleId: "view-asset-type",
    },
    {
      title: "Asset Maintenance Type",
      href: "/asset-management/asset-maintenance-type",
      ruleId: "view-asset-maintenance-type",
    },
    {
      title: "Asset Preference",
      href: "/asset-management/asset-preference",
      ruleId: "view-asset-management-preference",
    },
    {
      title: "Asset Report",
      subMenu: [
        {
          title: "Asset Inventory Report",
          href: "/asset-management/asset-report/asset-inventory",
          ruleId: "view-asset-inventory-report",
        },
        {
          title: "Asset Assignment Report",
          href: "/asset-management/asset-report/asset-assignment",
          ruleId: "view-asset-assignment-report",
        },
        {
          title: "Asset Lease Report",
          href: "/asset-management/asset-report/asset-lease",
          ruleId: "view-asset-lease-report",
        },
        {
          title: "Asset Borrow Report",
          href: "/asset-management/asset-report/asset-borrow",
          ruleId: "view-asset-borrow-report",
        },
        {
          title: "Asset Disposal Report",
          href: "/asset-management/asset-report/asset-disposal",
          ruleId: "view-asset-disposal-report",
        },
        // {
        //   title: "Asset Valuation Report",
        //   href: "/asset-management/asset-report/asset-valuation-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Movement Report",
        //   href: "/asset-management/asset-report/asset-movement-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Maintenance Report",
        //   href: "/asset-management/asset-report/asset-maintenance-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Audit Report",
        //   href: "/asset-management/asset-report/asset-audit-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Depreciation Report",
        //   href: "/asset-management/asset-report/asset-depreciation-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: " Asset Warranty Report",
        //   href: "/asset-management/asset-report/asset-warranty-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Insurance Report",
        //   href: "/asset-management/asset-report/asset-insurance-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Purchase Report",
        //   href: "/asset-management/asset-report/asset-purchase-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Location Report",
        //   href: "/asset-management/asset-report/asset-location-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Tagging Report",
        //   href: "/asset-management/asset-report/asset-tagging-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Return Report",
        //   href: "/asset-management/asset-report/asset-return-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Condition Report",
        //   href: "/asset-management/asset-report/asset-condition-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Transfer Report",
        //   href: "/asset-management/asset-report/asset-transfer-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Lifecycle Report",
        //   href: "/asset-management/asset-report/asset-lifecycle-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Overdue Report",
        //   href: "/asset-management/asset-report/asset-overdue-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Utilization Report",
        //   href: "/asset-management/asset-report/asset-utilization-report",
        //   ruleId: "view-asset-report",
        // },
        // {
        //   title: "Asset Compliance Report",
        //   href: "/asset-management/asset-report/asset-compliance-report",
        //   ruleId: "view-asset-report",
        // },
      ],
    },
  ],
};
