"use client";

import { useRouter } from "next/navigation";
import { FaPenToSquare } from "react-icons/fa6";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  destination: string;
  isMobile?: boolean;
};

export default function EditButton<TData>({ table, destination, isMobile }: Props<TData>) {
  const router = useRouter();

  const selectedRows = table.getSelectedRowModel().rows;
  const isSingleSelected = selectedRows.length === 1;
  const selectedRow = isSingleSelected ? (selectedRows[0].original as any) : null;
  const isOfflinePending = !!selectedRow?._isOfflinePending;

  const handleClick = () => {
    if (!isSingleSelected) return;

    if (isOfflinePending) {
      router.push(`/sales/cash-sales/edit?draft=${selectedRow._offlineId}`);
      return;
    }

    router.push(destination);
  };

  return (
    <button
      className={isMobile ? "w-full flex jutify-start items-center gap-2" : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"}
      onClick={handleClick}
      disabled={!isSingleSelected}
    >
      <FaPenToSquare className={isMobile ? "size-4.5 text-erp-blue-11" : "size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5"} />
      <span className={isMobile ? "text-[10px]/none font-normal" : "text-[11px]/none font-medium group-disabled:text-erp-gray-5"}>Edit</span>
    </button>
  );
}
