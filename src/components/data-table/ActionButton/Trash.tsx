import { FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";
import { CgDanger } from "react-icons/cg";

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
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

import type { Row, Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  module: string;
  model: string;
  account?: string;
  refreshTable: () => void;
  isMobile?: boolean;
  isSelectionMode?: boolean;
};

type ThrowData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function TrashButton<TData>({
  table,
  module,
  model,
  account,
  refreshTable,
  isMobile,
  isSelectionMode
}: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();

  const trashRows = async () => {
    const form_data = new FormData();
    const selectedRows = table.getSelectedRowModel().rows;

    selectedRows.forEach((row: Row<TData>) => {
      if ((row.original as any).UUID !== undefined) {
        form_data.append(`UUIDs[]`, (row.original as { UUID: string }).UUID);
      }
    });

    let successMessage = "";
    let failedMessage = "";
    let message = "";

    const { id: loadingToastId, dismiss } = showLoadingToast("Trashing rows...");

    try {
      const response = await fetch(
        account
          ? `${ORIGIN}/${module}/api/${model}/throw?account=${account}`
          : `${ORIGIN}/${module}/api/${model}/throw`,
        {
          method: "POST",
          headers,
          body: form_data,
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: errorData.message,
          duration: 2000,
        });
        throw new Error("Failed to fetch data");
      } else {
        const data: ThrowData = await response.json();

        table.resetRowSelection();

        await refreshTable();

        successMessage = data["Success"];
        failedMessage = data["Failed"];
        message = data["message"];
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error as needed, display error message to user
    } finally {
      dismiss();

      setTimeout(() => {
        if (successMessage) {
          showSuccessTrashToast(successMessage, message);
        }

        if (failedMessage) {
          showFailedTrashToast(failedMessage, message);
        }
      }, 2000);
    }
  };

  const showSuccessTrashToast = (rows: ThrowData["Success"], records: ThrowData["message"]) => {
    toast({
      title: `${records}`,
      description: `${rows} has been sent to trash.`,
    });
  };

  const showFailedTrashToast = (rows: ThrowData["Failed"], records: ThrowData["message"]) => {
    records = `This record cannot be sent to trash because it is already in use. Please remove the dependencies before trying again.`;
    toast({
      title: `${rows} Trash Failed`,
      description: `${records} cannot be sent to trash.`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className={
            isMobile
              ? isSelectionMode ? "group flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-erp-blue-14 shadow-md transition-all duration-300 ease-in-out" : "group flex w-full items-center justify-start gap-2"
              : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          }
          onClick={() => { }}
          disabled={table.getSelectedRowModel().rows.length < 0 ||
            table.getSelectedRowModel().rows.every((row) => row.getValue("valid") === "0")
          }
          id="trash-btn"
        >
          <FaTrashCan
            className={
              isMobile
                ? "size-4.5 text-erp-blue-11 group-disabled:text-erp-gray-5"
                : "size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5"
            }
          />
          <span
            className={
              isMobile
                ? isSelectionMode ? "hidden" : "text-[10px]/none font-normal"
                : "text-[11px]/none font-medium group-disabled:text-erp-gray-5"
            }
          >
            Trash
          </span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent
        className={isMobile ? "max-w-xs gap-y-4.5 !p-5 rounded-md bg-white" : "max-w-sm"}
      >
        {isMobile ? (
          <>
            <div className="flex flex-col items-center justify-center gap-y-3">
              <div className="rounded-full bg-[#FFF0D3] p-2.5">
                <CgDanger className="size-8.5 text-[#D7A946]" />
              </div>
              <p className="font-Roboto text-sm">
                You are about to <strong>Trash</strong> data
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center">
              <p className="text-xs text-[#646464] text-center">
                Are you sure you want to trash selected data rows? This action cannot be undone
              </p>
            </div>

            <AlertDialogFooter className="mt-2 w-full flex !flex-row justify-center items-center gap-x-3.5 sm:justify-center">
              <AlertDialogAction className="h-8 w-20 text-[11px] bg-[#D7A946]" onClick={() => trashRows()}>
                OK
              </AlertDialogAction>
              <AlertDialogCancel className="h-8 w-20 !mt-0 text-[11px] bg-white shadow-md border-none">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle className="sr-only">Are you sure absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="flex justify-center">
                <FaTriangleExclamation className="size-12 text-erp-yellow-2" />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center">
              <p className="text-sm text-erp-blue-14">
                Proceed to <strong>TRASH</strong> the selected data row(s)?
              </p>
            </div>
            <AlertDialogFooter className="mt-2 flex items-center !justify-center justify-center gap-3 [&>*]:m-0">
              <AlertDialogAction className="h-9 w-24" onClick={() => trashRows()}>
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
