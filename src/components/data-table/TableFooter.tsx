// TableFooterSection.tsx
import { TableFooter, TableRow, TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

interface TableFooterSectionProps {
  table: any; // ideally replace with your Table type
}

export function TableFooterSection({ table }: TableFooterSectionProps) {
  return (
    <TableFooter className="sticky bottom-0 z-20 bg-erp-blue-11">
      {table.getFooterGroups().map((footerGroup: any) => (
        <TableRow key={footerGroup.id}>
          {footerGroup.headers.map((header: any) => (
            <TableCell
              key={header.id}
              className="bg-erp-blue-11 font-normal"
              style={{
                width: `calc(var(--col-${header.column.id}-size) * 1px)`,
              }}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                  )}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableFooter>
  );
}