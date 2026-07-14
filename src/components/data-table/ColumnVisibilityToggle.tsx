"use client";

import { FaSliders } from "react-icons/fa6";
import type { Table, VisibilityState } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";

type Props<TData> = {
  table: Table<TData>;
  defaultColumns?: VisibilityState;
  exceptionColumnsOnAll?: VisibilityState;
  onResetColumnOrdering?: () => void;
};

export default function ColumnVisibilityToggle<TData>({
  table,
  defaultColumns,
  exceptionColumnsOnAll,
  onResetColumnOrdering,
}: Props<TData>) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => {
      const basicCheck = typeof column.accessorFn !== "undefined" && column.getCanHide();
      const shouldHide = exceptionColumnsOnAll && exceptionColumnsOnAll[column.id] === false;
      
      return basicCheck && !shouldHide;
    });

  // Count visible columns for minimum visibility enforcement
  const visibleColumnsCount = columns.filter((column) => column.getIsVisible()).length;

  const areAllRequiredColumnsVisible = () => {
    // Get only columns that should be considered (exclude exceptions that should remain hidden)
    const considerableColumns = columns.filter(column => {
      return !exceptionColumnsOnAll || exceptionColumnsOnAll[column.id] !== false;
    });
    
    // Check if all considerable columns are visible
    return considerableColumns.length > 0 && 
           considerableColumns.every(column => column.getIsVisible());
  };

  // Derive initial leaf column order from the original column defs passed to the table
  const getInitialLeafColumnIds = (): string[] => {
    const leafIdsSet = new Set(table.getAllLeafColumns().map((c) => c.id));

    const flatten = (defs: any[]): string[] => {
      const out: string[] = [];
      for (const def of defs || []) {
        if (def?.columns && Array.isArray(def.columns)) {
          out.push(...flatten(def.columns));
        } else {
          const id =
            (def?.id != null ? String(def.id) : undefined) ??
            (typeof def?.accessorKey === "string"
              ? def.accessorKey
              : def?.accessorKey != null
              ? String(def.accessorKey)
              : undefined);

          if (id && leafIdsSet.has(id)) out.push(id);
        }
      }
      return out;
    };

    return flatten((table.options as any).columns || []);
  };

  const handleResetOrderingInternal = () => {
    const initialIds = getInitialLeafColumnIds();
    if (initialIds.length > 0) {
      table.setColumnOrder(initialIds);
    } else {
      // Fallback: keep current leaf IDs order if initial couldn't be resolved
      const currentIds = table.getAllLeafColumns().map((c) => c.id);
      table.setColumnOrder(currentIds);
    }
  };

  const handleOnAllCheckedChange = () => {
    // Using defaultColumns pattern
    if (defaultColumns) {
      if (areAllRequiredColumnsVisible()) {
        // Reset to default columns configuration
        const mergedVisibility = { ...defaultColumns };
        
        // Apply exceptions to override defaults if needed
        if (exceptionColumnsOnAll) {
          Object.keys(exceptionColumnsOnAll).forEach((key) => {
            if (exceptionColumnsOnAll[key] === false) {
              mergedVisibility[key] = false;
            }
          });
        }
        
        table.setColumnVisibility(mergedVisibility);
      } else {
        // Show all columns (with exceptions)
        const newVisibility: VisibilityState = {};
        
        // Set all columns to visible by default
        columns.forEach(column => {
          newVisibility[column.id] = true;
        });
        
        // Apply exceptions by keeping them hidden
        if (exceptionColumnsOnAll) {
          Object.keys(exceptionColumnsOnAll).forEach(key => {
            if (exceptionColumnsOnAll[key] === false) {
              newVisibility[key] = false;
            }
          });
        }
        
        table.setColumnVisibility(newVisibility);
      }
    } else {
      // No default columns specified - use first two columns or all columns toggle
      if (areAllRequiredColumnsVisible()) {
        // Get only the first two columns IDs
        const firstTwoColumns = columns.slice(0, 2).map(col => col.id);
        
        // Create a new visibility state with only first two columns visible
        const newVisibility: VisibilityState = {};
        columns.forEach(column => {
          newVisibility[column.id] = firstTwoColumns.includes(column.id);
        });
        
        // Apply exceptions (keep them hidden)
        if (exceptionColumnsOnAll) {
          Object.keys(exceptionColumnsOnAll).forEach(key => {
            if (exceptionColumnsOnAll[key] === false) {
              newVisibility[key] = false;
            }
          });
        }
        
        table.setColumnVisibility(newVisibility);
      } else {
        // Show all columns (except exceptions)
        const newVisibility: VisibilityState = {};
        
        // Set all columns to visible by default
        columns.forEach(column => {
          newVisibility[column.id] = true;
        });
        
        // Apply exceptions by keeping them hidden
        if (exceptionColumnsOnAll) {
          Object.keys(exceptionColumnsOnAll).forEach(key => {
            if (exceptionColumnsOnAll[key] === false) {
              newVisibility[key] = false;
            }
          });
        }
        
        table.setColumnVisibility(newVisibility);
      }
    }
  };

  return (
    <DropdownMenu>
      <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <div className="flex flex-col items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:text-erp-blue-14 active:bg-erp-blue-14 active:text-white size-8"
                >
                  <FaSliders className="size-5.5" />
                </Button>
                <span className="text-[11px]/none font-medium text-black">Columns</span>
              </div>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">Columns</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end" className="max-h-[400px] overflow-y-auto p-2">
        {/* Always show Reset Ordering; call prop if provided, else internal reset */}
        <DropdownMenuItem
          className="pr-8"
          onClick={(e) => {
            e.preventDefault();
            if (onResetColumnOrdering) {
              onResetColumnOrdering();
            } else {
              handleResetOrderingInternal();
            }
          }}
          onSelect={(e) => e.preventDefault()}
        >
          Reset Ordering
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="pr-8 active:ring-2 active:ring-primary"
          checked={areAllRequiredColumnsVisible()}
          onCheckedChange={handleOnAllCheckedChange}
          onSelect={(e) => e.preventDefault()}
        >
          All
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <div className="grid auto-cols-fr grid-flow-row gap-x-2">
          {columns.map((column) => (
            <DropdownMenuCheckboxItem
              className="pr-8"
              checked={column.getIsVisible()}
              onCheckedChange={(value) => {
                // Ensure at least 2 columns remain visible
                if (visibleColumnsCount > 2 || !column.getIsVisible()) {
                  column.toggleVisibility(!!value);
                }
              }}
              onSelect={(e) => e.preventDefault()}
              key={column.id}
            >
              {column.columnDef.header?.toString()}
            </DropdownMenuCheckboxItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}