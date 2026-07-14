import { useRouter } from "next/navigation";
import { FaClone, FaTriangleExclamation } from "react-icons/fa6";
import { IoMdInformationCircleOutline } from "react-icons/io";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  destination: string;
  isMobile?: boolean;
};

export default function CloneButton<TData>({
  table,
  destination,
  isMobile,
}: Props<TData>) {
  const router = useRouter();

  const selectedRows = table.getSelectedRowModel().rows;
  const isSingleSelected = selectedRows.length === 1;
  const selectedRow = isSingleSelected ? (selectedRows[0].original as any) : null;
  const isOfflinePending = !!selectedRow?._isOfflinePending;

  const handleConfirm = () => {
    if (isOfflinePending) {
      router.push(`/sales/cash-sales/clone?id=${selectedRow._offlineId}`);
      return;
    }
    router.push(destination);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={
            isMobile
              ? "group flex w-full items-center justify-start gap-2"
              : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          }
          disabled={!(table.getSelectedRowModel().rows.length === 1)}
          id="clone-btn"
        >
          <FaClone
            className={
              isMobile
                ? "size-4.5 text-erp-blue-11 group-disabled:text-erp-gray-5"
                : "size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5"
            }
          />
          <span
            className={
              isMobile
                ? "text-[10px]/none font-normal"
                : "text-[11px]/none font-medium group-disabled:text-erp-gray-5"
            }
          >
            Clone
          </span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={isMobile ? "max-w-xs gap-y-4.5 !p-5 rounded-md bg-white" : "max-w-sm"}
      >
        {isMobile ? (
          <>
            <div className="flex flex-col items-center justify-center gap-y-3">
              <div className="rounded-full bg-[#0d6efd]/20 p-2.5">
                <IoMdInformationCircleOutline className="size-8.5 text-[#0d6efd]" />
              </div>
              <p className="font-Roboto text-sm">
                You are about to <strong>Clone</strong> data
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center">
              <p className="text-xs text-[#646464] text-center">
                Are you sure you want to clone selected data rows? This action cannot be undone
              </p>
            </div>

            <AlertDialogFooter className="mt-2 w-full flex !flex-row justify-center items-center gap-x-3.5 sm:justify-center">
              <AlertDialogAction className="h-8 w-20 text-[11px] bg-[#0d6efd]/65" onClick={handleConfirm}>
                OK
              </AlertDialogAction>
              <AlertDialogCancel className="h-8 w-20 !mt-0 text-[11px] bg-white shadow-md border-none">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogDescription className="flex justify-center">
                <FaTriangleExclamation className="size-12 text-erp-blue-12" />
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="flex justify-center">
              <p className="text-sm text-erp-blue-14">
                Proceed to <strong>CLONE</strong> the selected data row?
              </p>
            </div>

            <AlertDialogFooter className="mt-2 flex items-center !justify-center gap-3 [&>*]:m-0">
              <AlertDialogAction className="h-9 w-24" onClick={handleConfirm}>
                OK
              </AlertDialogAction>
              <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
