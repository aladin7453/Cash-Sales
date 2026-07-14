import type { Row } from "@tanstack/react-table";

/**
 * Custom filter function that first converts the row's value to a string
 */
export default function filterWithStringConversion<TData>(
  row: Row<TData>,
  columnId: string,
  filterValue: any,
) {
  return String(row.getValue(columnId)).includes(filterValue);
}
