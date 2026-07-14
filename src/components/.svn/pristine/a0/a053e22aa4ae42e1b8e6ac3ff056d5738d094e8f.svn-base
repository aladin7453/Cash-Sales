import { TableCell, TableRow } from "../ui/table";
import type { ColumnDef } from "@tanstack/react-table";

export default function NoResultsTableRow<TData>({
  columns,
  message,
}: {
  columns: ColumnDef<TData>[];
  message?: string;
}) {
  return (
    <TableRow>
      <TableCell className="h-24 text-center" colSpan={columns.length}>
        {message || "No results."}
      </TableCell>
    </TableRow>
  );
}
