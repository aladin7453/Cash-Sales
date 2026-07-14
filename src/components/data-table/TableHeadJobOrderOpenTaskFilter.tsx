"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
};

export function TableHeadJobOrderOpenTaskFilter<TData>({ table }: Props<TData>) {
  const [key, setKey] = useState(+new Date());

  return (
    <Select
      key={key}
      onValueChange={(value) => {
        table.getColumn("jobOrderOpenTask")?.setFilterValue(value);
        table.resetPageIndex(); // reset pagination to the first page
      }}
      defaultValue={(table.getColumn("jobOrderOpenTask")?.getFilterValue() as string) ?? undefined}
    >
      <SelectTrigger className="h-6.5 rounded-sm bg-erp-blue-7 p-2 text-erp-gray-9 focus:bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-36">
        <SelectItem value="1">Open</SelectItem>
        <SelectItem value="0">Assigned</SelectItem>
        <Separator />
        <div className="p-2">
          <Button
            className="h-8 w-full"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              table.getColumn("jobOrderOpenTask")?.setFilterValue(undefined);
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
