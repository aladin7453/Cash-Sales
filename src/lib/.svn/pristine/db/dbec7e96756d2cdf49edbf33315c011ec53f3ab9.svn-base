import type { Table } from "@tanstack/react-table";

export default function getTableMeta<Meta extends {}>() {
  return (table: Table<any>): Meta => table.options.meta as Meta;
}
