import { arrayMove } from "@dnd-kit/sortable";

import type { DragEndEvent } from "@dnd-kit/core";
import type { ColumnOrderState } from "@tanstack/react-table";

/**
 * Reorder table columns after drag & drop
 */
export default function handleDndDragEnd(
  event: DragEndEvent,
  setColumnOrder: (value: ColumnOrderState | ((val: ColumnOrderState) => ColumnOrderState)) => void,
) {
  const { active, over } = event;

  if (active && over && active.id !== over.id) {
    setColumnOrder((columnOrder) => {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
    });
  }
}
