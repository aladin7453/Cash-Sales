import { title } from "process";
import { FaScrewdriverWrench } from "react-icons/fa6";

import type { MenuItem } from "@/lib/types";

export const settingModule: MenuItem = {
  title: "Setting",
  ruleId: "SETTING",
  shortName: "Setting",
  icon: FaScrewdriverWrench,
  subMenu: [
    {
      title: "Department",
      href: "/setting/department",
      ruleId: "view-department",
    },
    {
      title: "Job Title",
      href: "/setting/job-title",
      ruleId: "view-job-title",
    },
    {
      title: "User Group",
      href: "/setting/user-group",
      ruleId: "view-user-group",
    },
    {
      title: "Dashboard",
      subMenu: [
        {
          title: "Dashboard Management",
          href: "/setting/dashboard/dashboard-management",
          ruleId: "view-dashboard-management",
        },
      ],
    },
    {
      title: "Location",
      subMenu: [
        {
          title: "Location Type",
          href: "/setting/location/location-type",
          ruleId: "view-location-type",
        },
        {
          title: "Location",
          href: "/setting/location/location",
          ruleId: "view-location",
        },
      ],
    },
    {
      title: "General Tools",
      subMenu: [
        {
          title: "Country Of Origin",
          href: "/setting/tools/country-of-origin",
          ruleId: "view-country-of-origin",
        },
        {
          title: "Project",
          href: "/setting/tools/project",
          ruleId: "view-project",
        },
        {
          title: "E-Invoice Item Classification",
          href: "/setting/tools/e-invoice-item-classification",
          ruleId: "view-classification",
        },
        {
          title: "Payment Method",
          href: "/setting/tools/payment-method",
          ruleId: "view-payment-method",
        },
        {
          title: "Currency",
          href: "/setting/tools/currency",
          ruleId: "view-currency",
        },
        {
          title: "Shipper",
          href: "/setting/tools/shipper",
          ruleId: "view-shipper",
        },
        {
          title: "Credit Terms",
          href: "/setting/tools/credit-term",
          ruleId: "view-credit-term",
        },
        {
          title: "Tag",
          href: "/setting/tools/tag",
          ruleId: "view-tag",
        },
        {
          title: "Tariff",
          href: "/setting/tools/tariff",
          ruleId: "view-tariff",
        },
        {
          title: "Tax Type",
          href: "/setting/tools/tax-type",
          ruleId: "view-tax-type",
        },
        {
          title: "Tax",
          href: "/setting/tools/tax",
          ruleId: "view-tax",
        },
        {
          title: "Withholding Tax",
          href: "/setting/tools/withholding-tax",
          ruleId: "view-withholding-tax",
        },
        {
          title: "UOM",
          href: "/setting/tools/u-o-m",
          ruleId: "view-u-o-m",
        },
        {
          title: "Meeting Agenda",
          href: "/setting/tools/meeting-agenda",
          ruleId: "view-meeting-agenda",
        },
      ],
    },
    {
      title: "Organization Preference",
      href: "/setting/organization-preference",
      ruleId: "view-organization-preference",
    },
    {
      title: "Approval Center",
      href: "/setting/approval-center",
      ruleId: "view-approval-center",
    },
  ],
};
