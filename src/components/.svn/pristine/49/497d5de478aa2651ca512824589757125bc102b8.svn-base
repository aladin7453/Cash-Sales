"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
};

export function TableHeadValidityFilter<TData>({ table }: Props<TData>) {
  const [key, setKey] = useState(+new Date());

  return (
    <Select
      value={(table.getColumn("valid")?.getFilterValue() as string) ?? undefined}
      onValueChange={(value) => {
        table.getColumn("valid")?.setFilterValue(value);
        table.resetPageIndex(); // reset pagination to the first page
      }}
      key={key}
    >
      <SelectTrigger className="h-6.5 rounded-sm bg-erp-blue-7 p-2 text-erp-gray-9 focus:bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-36">
        <SelectItem value="1">Valid</SelectItem>
        <SelectItem value="0">Invalid</SelectItem>
        <Separator />
        <div className="p-2">
          <Button
            className="h-8 w-full"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              table.getColumn("valid")?.setFilterValue(undefined);
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
