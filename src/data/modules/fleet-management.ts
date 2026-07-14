import { FaMapLocationDot } from "react-icons/fa6";

import type { MenuItem } from "@/lib/types";

export const fleetManagementModule: MenuItem = {
  title: "Fleet Management",
  icon: FaMapLocationDot,
  subMenu: [
    {
      title: "Unit Management",
      subMenu: [
        {
          title: "Manufacturer",
          href: "/fleet-management/Unit-Management/Manufacturer",
        },
        {
          title: "Type",
          href: "/fleet-management/Unit-Management/Type",
        },
        {
          title: "Model",
          href: "/fleet-management/Unit-Management/Model",
        },
        {
          title: "Unit",
          href: "/fleet-management/Unit-Management/Unit",
        },
        {
          title: "Command",
          href: "/fleet-management/Unit-Management/Command",
        },
        {
          title: "Reference Link",
          href: "/fleet-management/Unit-Management/Reference-Link",
        },
      ],
    },
    {
      title: "Vehicle Hiring",
      subMenu: [
        {
          title: "Management",
          href: "/fleet-management/Vehicle-Hiring/Management",
        },
        {
          title: "Case",
          href: "/fleet-management/Vehicle-Hiring/Case",
        },
      ],
    },
    {
      title: "POI",
      href: "/fleet-management/POI",
    },
    {
      title: "Route",
      href: "/fleet-management/Route",
    },
    {
      title: "Job",
      href: "/fleet-management/Job",
    },
    {
      title: "Monitoring",
      href: "/fleet-management/Monitoring",
    },
    {
      title: "Message",
      href: "/fleet-management/Message",
    },
    {
      title: "Playback",
      href: "/fleet-management/Playback",
    },
    {
      title: "Fuel Analysis",
      href: "/fleet-management/Fuel-Analysis",
    },
    {
      title: "Alert",
      href: "/fleet-management/Alert",
    },
    {
      title: "Fleet Management Report",
      subMenu: [
        {
          title: "Motion State",
          href: "/fleet-management/Fleet-Management-Report/Motion-State",
        },
        {
          title: "Connection State",
          href: "/fleet-management/Fleet-Management-Report/Connection-State",
        },
        {
          title: "Alert",
          href: "/fleet-management/Fleet-Management-Report/Alert",
        },
        {
          title: "Route Visit",
          href: "/fleet-management/Fleet-Management-Report/Route-Visit",
        },
        {
          title: "Event",
          href: "/fleet-management/Fleet-Management-Report/Event",
        },
        {
          title: "Vehicle Hiring",
          href: "/fleet-management/Fleet-Management-Report/Vehicle-Hiring",
        },
      ],
    },
  ],
};
