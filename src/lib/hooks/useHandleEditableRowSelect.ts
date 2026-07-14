import { useRef } from "react";

import type { Row, Table } from "@tanstack/react-table";

export const useHandleEditableRowSelect = <TData>(table: Table<TData>) => {
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
      if (event.detail === 2) {
        // double click
        timer.current = setTimeout(() => {
          row.toggleSelected();
        }, 100);
      }

      lastRowSelected.current = row;
    }
  };
};
