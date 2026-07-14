"use client";

import { useState } from "react";

import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

import type { Table } from "@tanstack/react-table";

export type SelectOption = {
  label: string;
  value: string;
};

type Props<TData> = {
  table: Table<TData>;
  columnId: string;
  selectOptions: SelectOption[] | readonly string[] | string[];
};

export default function TableHeadSelectFilter<TData>({
  table,
  columnId,
  selectOptions,
}: Props<TData>) {
  const [key, setKey] = useState(+new Date());

  // Convert string[] or readonly string[] to SelectOption[] (with label and value)
  const normalizedOptions: SelectOption[] = selectOptions.map((option) =>
    typeof option === "string" ? { label: option, value: option } : option,
  );

  return (
    <Select
      key={key}
      onValueChange={(value) => {
        table.getColumn(columnId)?.setFilterValue(value);
        table.resetPageIndex(); // reset pagination to the first page
      }}
      defaultValue={(table.getColumn(columnId)?.getFilterValue() as string) ?? undefined}
    >
      <SelectTrigger className="h-6.5 rounded-sm bg-erp-blue-7 p-2 text-erp-gray-9 focus:bg-background">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="min-w-36">
        {normalizedOptions.map(({ value, label }) => (
          <SelectItem value={value} key={value}>
            {label}
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
              table.getColumn(columnId)?.setFilterValue(undefined);
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
