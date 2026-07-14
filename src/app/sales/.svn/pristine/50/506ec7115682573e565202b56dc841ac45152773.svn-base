"use client";
import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import filterWithStringConversion from "@/lib/utils/data-table/filterWithStringConversion";

import type { ColumnDef } from "@tanstack/react-table";
import React from "react";
import moment from 'moment';
import { DATE_FORMAT } from "@/lib/constants";

export type PackageList = {
  packageTypeCodeCode: string;
  packageCode: string;
  packageName: string;
  description: string;
  createdAt: string;
  createdBy: string;
  updatedBy: string;
  updatedAt: string;
};

export const PackageColumns: ColumnDef<PackageList>[] = [
  {
    id: "packageCode",
    accessorKey: "packageCode",
    header: "Package Code",
    filterFn: "includesString"
  },
  {
    id: "packageTypeCodeCode",
    accessorKey: "packageTypeCodeCode",
    header: "Package Type Code",
    filterFn: "includesString"
  },
  {
    id: "packageName",
    accessorKey: "packageName",
    header: "Package Name",
    filterFn: "includesString"
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
    filterFn: "includesString"
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created at",
    cell: ({ row }) => (
      row.original.createdAt
        ? moment.unix(row.original.createdAt).format(DATE_FORMAT)
        : ""
    ),
    filterFn: "includesString"
  },
  {
    id: "CreatedByUsername",
    accessorKey: "CreatedByUsername",
    header: "Created by",
    filterFn: "includesString"
  },
  {
    id: "updatedAt",
    accessorKey: "updatedAt",
    header: "Updated at",
    cell: ({ row }) => (
      row.original.updatedAt 
        ? moment.unix(row.original.updatedAt).format(DATE_FORMAT) 
        : ""
    ),
    filterFn: "includesString"
  },
  {
    id: "UpdatedByUsername",
    accessorKey: "UpdatedByUsername",
    header: "Updated by",
    filterFn: "includesString"
  },
];