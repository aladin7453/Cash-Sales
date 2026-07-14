"use client";

import React from "react";
import type { ColumnDef } from "@tanstack/react-table";

export type ItemList = {
  UUID: string;
  itemCode: string;
  itemName: string;
  type: string;
  quantity: string

};

export const VerifyVoucherColumns: ColumnDef<ItemList>[] = [
  {
    id: "itemCode",
    accessorKey: "itemCode",
    header: "Item",
    filterFn: "includesString",
  },
  {
    id: "itemName",
    accessorKey: "itemName",
    header: "Item Name",
    filterFn: "includesString",
  },
  {
    id: "type",
    accessorKey: "type",
    header: "Type",
    filterFn: "includesString",
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: "Quantity",
    filterFn: "includesString",
  },


];

