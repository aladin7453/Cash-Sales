"use client";

import { useState } from "react";

import { assetStatus } from "@/app/asset-management/asset/columns";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
};

export default function TableHeadStatusFilter<TData>({ table }: Props<TData>) {
  const [key, setKey] = useState(+new Date());

  return (
    <Select
      key={key}
      onValueChange={(value) => table.getColumn("status")?.setFilterValue(value)}
      defaultValue={(table.getColumn("status")?.getFilterValue() as string) ?? undefined}
    >
      <SelectTrigger className="h-6.5 rounded-sm bg-erp-blue-7 p-2 text-erp-gray-9 focus:bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-36">
        {assetStatus.map((status) => (
          <SelectItem value={status} key={status}>
            {status}
          </SelectItem>
        ))}
        <Separator />
        <div className="p-2">
          <Button
            className="h-8 w-full"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              table.getColumn("status")?.setFilterValue(undefined);
              table.resetPageIndex(); // reset pagination to the first page
              setKey(+new Date()); // set the key to a new value to force it to re-render
            }}
          >
            Clear
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
}
