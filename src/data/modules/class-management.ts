import EventDatePlanSchedule from "@/components/icons/svg-repo/EventDatePlanSchedule";

import type { MenuItem } from "@/lib/types";

export const classManagementModule: MenuItem = {
  title: "Class Management",
  icon: EventDatePlanSchedule,
  subMenu: [
    {
      title: "Class Type",
      href: "/class-management/Class-Type",
    },
    {
      title: "Class",
      href: "/class-management/Class",
    },
    {
      title: "Person in Charge Group",
      href: "/class-management/Person-in-Charge-Group",
    },
    {
      title: "Person in Charge",
      href: "/class-management/Person-in-Charge",
    },
    {
      title: "Timetable",
      href: "/class-management/Timetable",
    },
    {
      title: "Schedule",
      href: "/class-management/Schedule",
    },
    {
      title: "Registration",
      href: "/class-management/Registration",
    },
    {
      title: "POS (Studio)",
      href: "/class-management/POS-(Studio)",
    },
    {
      title: "Class Management Report",
      subMenu: [
        {
          title: "Package Subscription",
          href: "/class-management/Class-Management-Report/Package-Subscription",
        },
        {
          title: "Prepaid Credit Top Up",
          href: "/class-management/Class-Management-Report/Prepaid-Credit-Top-Up",
        },
        {
          title: "Registration",
          href: "/class-management/Class-Management-Report/Registration",
        },
        {
          title: "Attendance",
          href: "/class-management/Class-Management-Report/Attendance",
        },
      ],
    },
  ],
};
