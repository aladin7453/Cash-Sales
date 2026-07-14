"use client";

import { FaMinus } from "react-icons/fa6";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import type { Table } from "@tanstack/react-table";

export default function RemoveRecordsButton<TData>({
  table,
  onClose,
}: {
  table: Table<TData>;
  onClose?: () => void;
}) {
  const selectedRowModel = table.getSelectedRowModel();
  const numOfSelectedRows = selectedRowModel.rows.length;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={"size-8"} variant="ghost" size="icon" disabled={numOfSelectedRows === 0}>
          <FaMinus className="size-5.5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs">
        <AlertDialogHeader className="items-center">
          <AlertDialogDescription className="text-base text-erp-blue-15">
            {`Remove selected record${numOfSelectedRows > 1 ? "s" : ""}?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <AlertDialogAction className="h-9 w-full" onClick={onClose}>
            OK
          </AlertDialogAction>
          <AlertDialogCancel className="h-9 w-full">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
