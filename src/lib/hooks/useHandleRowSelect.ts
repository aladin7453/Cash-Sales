import { useRef } from "react";

import type { Row, Table } from "@tanstack/react-table";
import { useToast } from "@/components/ui/use-toast";

export const useHandleRowSelect = <TData>(
  table: Table<TData>,
  onDoubleClick?: (row: Row<TData>) => void,
) => {
  const lastRowSelected = useRef<Row<TData> | null>(null);
  const timer = useRef<NodeJS.Timeout>();

  return (row: Row<TData>) => (event: React.MouseEvent<HTMLTableRowElement>) => {
    clearTimeout(timer.current);

    if (event.shiftKey) {
      const lrIndex = lastRowSelected?.current?.index ?? row.index;
      const fromIndex = Math.min(lrIndex, row.index);
      const toIndex = Math.max(lrIndex, row.index);
      const rowSelection: any = {};
      for (let i = fromIndex; i <= toIndex; i++) {
        rowSelection[i] = true;
      }
      table.setRowSelection(rowSelection);
    } else {
      if (event.detail === 1) {
        // single click
        timer.current = setTimeout(() => {
          row.toggleSelected();
        }, 100);
      } else if (event.detail === 2) {
        // double click
        onDoubleClick && onDoubleClick(row);
      }
    }

    lastRowSelected.current = row;
  };
};

export const useHandleRowSelectWithoutDoubleClick = <TData>(
  table: Table<TData>,
  onRowSelect?: (
    row: Row<TData>,
    event: React.MouseEvent<HTMLTableRowElement>,
    forceSelect?: boolean
  ) => void
) => {
  const lastRowSelected = useRef<Row<TData> | null>(null);
  const MAX_SELECTION = 100;
  const { toast } = useToast();

  return (row: Row<TData>) => (event: React.MouseEvent<HTMLTableRowElement>) => {
    const rows = table.getRowModel().rows;
    const currentSelection = table.getState().rowSelection || {};
    const selectedCount = Object.keys(currentSelection).length;

    if (event.shiftKey) {
      const lastIndex = lastRowSelected?.current?.index ?? row.index;
      const fromIndex = Math.min(lastIndex, row.index);
      const toIndex = Math.max(lastIndex, row.index);

      const newRowSelection: Record<number, boolean> = { ...currentSelection };
      let newSelections = 0;

      // Count how many *new* rows would be added (not already selected)
      for (let i = fromIndex; i <= toIndex; i++) {
        if (!newRowSelection[i]) newSelections++;
      }

      // Prevent selecting more than MAX_SELECTION total
      if (selectedCount + newSelections > MAX_SELECTION) {
        // alert(`You can only select up to ${MAX_SELECTION} rows.`);
        toast({
          description: `You can only select up to ${MAX_SELECTION} rows.`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      // Apply the shift selection
      for (let i = fromIndex; i <= toIndex; i++) {
        const targetRow = rows[i];
        if (!targetRow) continue;

        newRowSelection[i] = true;
        onRowSelect?.(targetRow, event, true);
      }

      table.setRowSelection(newRowSelection);
    } else {
      // Single-click toggle logic
      const isCurrentlySelected = !!currentSelection[row.index];
      if (!isCurrentlySelected && selectedCount >= MAX_SELECTION) {
        toast({
          description: `You can only select up to ${MAX_SELECTION} rows.`,
          variant: "destructive",
          duration: 3000,
        });
        return;
      }

      onRowSelect?.(row, event, false);
    }

    lastRowSelected.current = row;
  };
};