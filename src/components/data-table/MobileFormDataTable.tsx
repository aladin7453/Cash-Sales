"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import type { Row, Table as TableType } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, NumberInputCell } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DATE_FORMAT } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

interface FieldConfig {
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'textarea' | 'readonly' | 'uom';
  label?: string;
  allowDecimal?: boolean;
  allowNegative?: boolean;
  disabled?: boolean;
  options?: Array<{value: string, label: string}>;
  colSpan?: 1 | 2;
  className?: string;
}

interface MobileFormDataTableProps<T> {
  table: TableType<T>;
  headerFields: Array<keyof T>;
  fieldConfigs: Record<string, FieldConfig>;
  initialVisibleFields?: number;
  onFieldChange: (rowId: string, fieldId: string, value: any) => void;
  onRowSelect?: (row: Row<T>) => void;
  className?: string;
  readOnlyFields?: Array<keyof T>;
  checkboxFields?: Array<keyof T>;
  checkboxHandlers?: Record<string, (rowIndex: number, checked: boolean, row: Row<T>) => void>;
  // UOM specific props
  UOMInputs?: Record<string, string>;
  setUOMInputs?: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  setTempRowCashSalesDetailsList?: (updater: (prevList: any[]) => any[]) => void;
}

export default function MobileFormDataTable<T extends Record<string, any>>({
  table,
  headerFields,
  fieldConfigs,
  initialVisibleFields = 4,
  onFieldChange,
  onRowSelect,
  className,
  readOnlyFields = [],
  checkboxFields = [],
  checkboxHandlers = {},
  UOMInputs = {},
  setUOMInputs,
  setTempRowCashSalesDetailsList,
}: MobileFormDataTableProps<T>) {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const renderUOMDropdown = (key: string, value: any, row: Row<T>) => {
    const uomOptions = row.original.UOMDropdown || [];
    const isDisabled = uomOptions.length === 0;

    const onChange = (selectedUOMUUID: string) => {
      const selectedUOM = uomOptions.find((uom: any) => uom.UUID === selectedUOMUUID);

      if (selectedUOM && setUOMInputs && setTempRowCashSalesDetailsList) {
        // Update UOM, Rate, and Price in the row
        row.original["UOM"] = selectedUOMUUID;
        row.original["itemRate"] = selectedUOM.Rate;
        row.original["price"] = selectedUOM.refPrice;

        // Update the UOM state
        setUOMInputs((UOMInputs) => ({ ...UOMInputs, [row.id]: selectedUOMUUID }));
        
        // Update the temp list
        setTempRowCashSalesDetailsList((prevList) =>
          prevList.map((item, idx) => {
            if ((item.UUID && item.UUID === row.original.UUID) || idx === row.index) {
              return {
                ...item,
                UOM: selectedUOMUUID,
                itemRate: selectedUOM.Rate,
                price: selectedUOM.refPrice,
              };
            }
            return item;
          }),
        );
      }
    };

    return (
      <Select
        value={UOMInputs[row.id] ?? row.original.UOM}
        onValueChange={onChange}
        disabled={isDisabled}
      >
        <SelectTrigger className="h-7.5 w-full">
          <SelectValue placeholder={isDisabled ? "No UOM available" : "Select UOM"} />
        </SelectTrigger>
        <SelectContent>
          {uomOptions.map((UOM: any) => (
            <SelectItem key={UOM.UUID} value={UOM.UUID}>
              {UOM.UOM}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  };

  const renderField = (key: string, value: any, row: Row<T>) => {
    const config = fieldConfigs[key];
    if (!config) {
      return (
        <input
          type="text"
          value={value || ""}
          readOnly
          className="truncate rounded-md border border-input bg-background px-2 py-1 text-sm"
          title={value || ""}
        />
      );
    }

    const baseClassName = cn(
      "text-sm h-7.5 w-full border border-input bg-background px-2 py-1 rounded-md",
      config.className
    );

    switch (config.type) {
      case 'uom':
        return renderUOMDropdown(key, value, row);

      case 'text':
      case 'textarea':
        return (
          <Input
            className={baseClassName}
            value={value || ""}
            onChange={(e) => onFieldChange(row.id, key, e.target.value)}
            disabled={config.disabled}
          />
        );

      case 'number':
        return (
          <NumberInputCell
            className="h-7.5"
            onValueChange={(val) => onFieldChange(row.id, key, val)}
            value={value || ""}
            disabled={config.disabled}
            allowDecimal={config.allowDecimal}
            allowNegative={config.allowNegative}
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  "flex h-7.5 w-full justify-between text-left",
                  !value && "text-muted-foreground"
                )}
                variant="outline"
                size="sm"
                disabled={config.disabled}
              >
                {value
                  ? moment.unix(Number(value)).format(DATE_FORMAT)
                  : "Pick a date"}
                <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(Number(value) * 1000) : undefined}
                onSelect={(date) => {
                  const unixTimestamp = date ? Math.floor(date.getTime() / 1000) : "";
                  onFieldChange(row.id, key, unixTimestamp.toString());
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      case 'dropdown':
        return (
          <Select
            value={value || ""}
            onValueChange={(val) => onFieldChange(row.id, key, val)}
            disabled={config.disabled}
          >
            <SelectTrigger className="h-7.5 w-full">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        const handler = checkboxHandlers[key];
        return (
          <div className="flex items-center gap-1">
            <Checkbox
              checked={value === "1"}
              onCheckedChange={(checked) => 
                handler && handler(row.index, !!checked, row)
              }
              aria-label={config.label || key}
              className="h-5 w-5"
              disabled={config.disabled}
            />
            <span className="text-xs">{config.label || key}</span>
          </div>
        );

      case 'readonly':
      default:
        return (
          <input
            type="text"
            value={value || ""}
            readOnly
            className="truncate rounded-md border border-input bg-background bg-gray-100 px-2 py-1 text-sm"
            title={value || ""}
          />
        );
    }
  };

  return (
    <div className={cn("block space-y-2 p-2 md:hidden", className)}>
      {table.getRowModel().rows.map((row) => (
        <div
          key={row.id}
          className={cn(
            "rounded-lg border bg-white px-3 py-2 shadow-sm",
            row.getIsSelected() && "border-erp-blue-14 bg-erp-blue-2",
          )}
          onClick={() => onRowSelect?.(row)}
        >
          {/* Header Section */}
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              {headerFields.map((field, index) => {
                const value = row.original[field];
                const fieldKey = String(field);
                const config = fieldConfigs[fieldKey];
                
                return (
                  <div key={fieldKey}>
                    {index === 0 && (
                      <p className="text-md font-medium">{value || ""}</p>
                    )}
                    {index === 1 && (
                      <p className="text-xs text-muted-foreground">
                        {config?.label || fieldKey}: {value || ""}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Status indicators and selection */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center">
                <span className="rounded-md bg-erp-blue-2 px-2 py-0.5 text-xs">
                  {row.original.type || "Item"}
                </span>
              </div>
              <div className="flex items-center justify-start gap-1">
                <Checkbox
                  checked={row.original.valid === "1"}
                  disabled={true}
                  aria-label="Valid status"
                  className="h-4 w-4"
                />
                <span className="text-xs">Valid</span>
              </div>
              <div></div>
              <div className="flex items-center justify-start gap-1">
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(checked) => row.toggleSelected(!!checked)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Select row"
                  className="h-4 w-4"
                />
                <span className="text-xs">Select</span>
              </div>
            </div>
          </div>

          <hr className="my-2 border-gray-300" />

          {/* Fields Grid */}
          <div className="grid grid-cols-2 gap-2">
            {(() => {
              const displayableColumns = table.getAllColumns().filter((column) => {
                const key = column.id;
                const value = row.original[key];
                return (
                  !headerFields.includes(key as keyof T) &&
                  key !== "type" &&
                  key !== "valid" &&
                  value !== undefined
                );
              });

              const isExpanded = expandedCards[row.id] || false;
              const columnsToRender = isExpanded
                ? displayableColumns
                : displayableColumns.slice(0, initialVisibleFields);

              return columnsToRender.map((column) => {
                const key = column.id;
                const value = row.original[key];
                const config = fieldConfigs[key];
                const colSpanClass = config?.colSpan === 2 ? "col-span-2" : "";

                // For checkbox fields, don't show the top label since the checkbox has its own label
                const isCheckboxField = config?.type === 'checkbox';

                return (
                  <div key={key} className={`flex flex-col ${colSpanClass} ${isCheckboxField ? 'justify-center' : ''}`}>
                    {!isCheckboxField && (
                      <span className="text-xs font-medium text-muted-foreground">
                        {config?.label || (column.columnDef.header as string) || key}
                      </span>
                    )}
                    {renderField(key, value, row)}
                  </div>
                );
              });
            })()}
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
            className="mt-3 w-full text-center text-sm font-medium text-erp-blue-14 hover:underline"
          >
            {expandedCards[row.id] ? "Show Less Fields" : "Show More Fields"}
          </button>
        </div>
      ))}
    </div>
  );
}
