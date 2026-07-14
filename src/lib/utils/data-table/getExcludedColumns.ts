import type { ColumnDef, VisibilityState } from "@tanstack/react-table";

/**
 * @returns a list of columns set to false that are not in the exceptions array
 */
export default function getExcludedColumns<T>(
  columns: ColumnDef<T>[],
  exceptions: Array<keyof T>,
): VisibilityState {
  const result: VisibilityState = {};

  columns.forEach((column) => {
    const accessorKey = (column as ColumnDef<T> & { accessorKey: string }).accessorKey;

    if (accessorKey && !exceptions.includes(accessorKey as keyof T)) {
      result[accessorKey] = false;
    }
  });

  return result;
}
