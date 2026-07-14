import ContractApprovalLine from "@/components/icons/svg-repo/ContractApprovalLine";

import type { MenuItem } from "@/lib/types";

export const serviceModule: MenuItem = {
  title: "Service",
  ruleId: "SERVICE",
  shortName:"Service",
  icon: ContractApprovalLine,
  subMenu: [
     {
      title: "Package",
      href: "/service/package",
      ruleId: "view-package",
    },
    {
      title: "Service",
      href: "/service/service",
      ruleId: "view-service",
    },
    {
      title: "Package Type",
      href: "/service/package-type",
      ruleId: "view-package-type",
    },
     {
      title: "Service Category",
      href: "/service/service-category",
      ruleId: "view-service-category",
    },
    {
      title: "Service Group",
      href: "/service/service-group",
      ruleId: "view-service-group",
    }, 
    {
      title: "Service Preference",
      href: "/service/service-preference",
      ruleId: "view-service-preference",
    },
  ],
};
