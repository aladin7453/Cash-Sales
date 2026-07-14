"use client";

import { useState } from "react";
import type { Row, Table as TableType } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";

interface MobileDataTableProps<T> {
  table: TableType<T>;
  headerFields: Array<keyof T>;
  initialVisibleFields?: number;
  excludeFromGrid?: Array<keyof T>;
  fieldRenderers?: Record<string, (value: any, row: T) => React.ReactNode>;
  className?: string;
  headerLabels?: Record<string, string>;
}

export default function MobileDataTable<T extends Record<string, any>>({
  table,
  headerFields,
  initialVisibleFields = 4,
  excludeFromGrid = [],
  fieldRenderers = {},
  className,
  headerLabels = {},
}: MobileDataTableProps<T>) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const defaultFieldRenderer = (value: any) => (
    <input
      type="text"
      value={value || ""}
      readOnly
      className="truncate rounded-md border border-input bg-background px-2 py-1 text-sm"
      title={value || ""}
    />
  );

  return (
    <div className={cn("block space-y-2 md:hidden", className)}>
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            "rounded-lg border bg-white px-3 py-2 shadow-sm",
            row.getIsSelected() && "border-erp-blue-14 bg-erp-blue-2",
          )}
        >
          {/* Header Section */}
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              {headerFields.map((field, index) => {
                const value = row.original[field];
                const fieldKey = String(field);
                return (
                  <div key={fieldKey}>
                    {index === 0 && (
                      <p className="text-md font-medium">{value}</p>
                    )}
                    {index === 1 && (
                      <p className="text-xs text-muted-foreground">
                        {headerLabels[fieldKey] || "Doc Date"}: {value}
                      </p>
                    )}
                    {index > 1 && (
                      <p className="text-xs text-muted-foreground">
                        {headerLabels[fieldKey] || fieldKey}: {value}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => {
                row.toggleSelected(!!checked);
              }}
              aria-label="Select row"
              className="h-5 w-5"
            />
          </div>

          <hr className="my-2 border-gray-300" />

          {/* Fields Grid */}
          <div className="grid grid-cols-2 gap-2">
            {table.getAllColumns().map((column, index) => {
              const key = column.id;
              const value = row.original[key];
              const isExpanded = expandedCards[row.id] || false;

              // Skip header fields and excluded fields
              if (headerFields.includes(key as keyof T) || excludeFromGrid.includes(key as keyof T)) {
                return null;
              }

              // Show only the first fields when not expanded
              if (!isExpanded && index > initialVisibleFields && value !== undefined) {
                return null;
              }

              if (value === undefined) return null;

              return (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-muted-foreground">
                    {(column.columnDef.header as string) || key}
                  </span>
                  {fieldRenderers[key] 
                    ? fieldRenderers[key](value, row.original)
                    : defaultFieldRenderer(value)
                  }
                </div>
              );
            })}
          </div>

          {/* Expand/Collapse Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpandedCards((prev) => ({
                ...prev,
                [row.id]: !prev[row.id],
              }));
            }}
            className="mt-2 w-full text-center text-sm font-medium text-erp-blue-14 hover:underline"
          >
            {expandedCards[row.id] ? "Show Less Fields" : "Show More Fields"}
          </button>
        </div>
      ))}
    </div>
  );
}
