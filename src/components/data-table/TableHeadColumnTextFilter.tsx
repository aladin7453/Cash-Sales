"use client";

import { XIcon } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

import type { Column, Table } from "@tanstack/react-table";

type Props<TData> = {
  column: Column<TData, unknown>;
  table: Table<TData>;
  placeholder?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">;

export default function TableHeadColumnTextFilter<TData>({
  column,
  table,
  className,
  placeholder,
}: Props<TData>) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .map((value) => (value === null || value === undefined ? "" : String(value)))
            .sort(),
    [column.getFacetedUniqueValues()],
  );

  // const onInputValueChange = (value: string | number) => {
  //   column.setFilterValue(value);
  //   table.resetPageIndex();
  // };

  const onInputValueChange = (value: string) => {
    column.setFilterValue(value.trim() ? value : undefined);
  };

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value, index) => (
          <option value={value} key={`${value}-${index}`} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={onInputValueChange}
        className={cn(
          "h-6.5 rounded-sm bg-erp-blue-7 p-2 pr-6.5 text-erp-gray-9 focus-visible:bg-background",
          className,
        )}
        list={column.id + "list"}
        placeholder={placeholder}
        disabled={!column.getCanFilter()}
      />
    </>
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 300,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false); // skip the first time
      return;
    }

    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  const clearValue = () => {
    setValue("");

    onChange("");
  };

  return (
    <div className="relative flex items-center">
      <Input {...props} value={value} onChange={(e) => setValue(e.target.value)} />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearValue}
          className="absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-full text-gray-500 hover:text-gray-900"
        >
          <XIcon className="size-3.5" strokeWidth={2.25} />
          <span className="sr-only">Clear</span>
        </Button>
      )}
    </div>
  );
}
