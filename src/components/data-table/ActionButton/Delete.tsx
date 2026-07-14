"use client";

import { useEffect, useState } from "react";
import { FaEraser, FaTriangleExclamation } from "react-icons/fa6";
import { FiAlertTriangle } from "react-icons/fi";

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
  model: string;
  module: string;
  account?: string;
  refreshTable: () => void;
  isMobile?: boolean;
  isSelectionMode?: boolean;
  disabled?: boolean;
  // Called with the offline id(s) instead of hitting the API,
  // for rows where row.original._isOfflinePending is true.
  onDeleteOffline?: (offlineIds: string[]) => void | Promise<void>;
};

type RemoveData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function DeleteButton<TData>({
  table,
  module,
  model,
  account,
  refreshTable,
  isMobile,
  isSelectionMode,
  disabled = false,
  onDeleteOffline,
}: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(3);

  const selectedRows = table.getSelectedRowModel().rows;

  // Split selection into offline-pending vs real server rows
  const offlineRows = selectedRows.filter((row) => (row.original as any)._isOfflinePending);
  const serverRows = selectedRows.filter((row) => !(row.original as any)._isOfflinePending);
  const isOfflineOnlySelection = selectedRows.length > 0 && offlineRows.length === selectedRows.length;
  const isMixedSelection = offlineRows.length > 0 && serverRows.length > 0;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isDialogOpen) {
      setIsOkButtonDisabled(true);
      setCountdown(3);

      timer = setInterval(() => {
        setCountdown((prevCount) => {
          const newCount = prevCount - 1;
          if (newCount <= 0) {
            clearInterval(timer);
            setIsOkButtonDisabled(false);
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }

    return () => {
      clearInterval(timer);
    };
  }, [isDialogOpen]);

  const deleteOfflineRows = async () => {
    const offlineIds = offlineRows.map((row) => (row.original as any)._offlineId as string);

    if (onDeleteOffline) {
      await onDeleteOffline(offlineIds);
    }

    table.resetRowSelection();

    toast({
      title: "Removed",
      description: `${offlineIds.length} local record${offlineIds.length > 1 ? "s" : ""} removed.`,
    });
  };

  const deleteRows = async () => {
    const form_data = new FormData();

    serverRows.forEach((row: Row<TData>) => {
      if ((row.original as any).UUID !== undefined) {
        form_data.append(`UUIDs[]`, (row.original as { UUID: string }).UUID);
      }
    });

    let successMessage = "";
    let failedMessage = "";
    let message = "";

    const { id: loadingToastId, dismiss } = showLoadingToast("Deleting rows...");

    try {
      const response = await fetch(
        account
          ? `${ORIGIN}/${module}/api/${model}/remove?account=${account}`
          : `${ORIGIN}/${module}/api/${model}/remove`,
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
        const data: RemoveData = await response.json();

        table.resetRowSelection();

        await refreshTable();

        successMessage = data["Success"];
        failedMessage = data["Failed"];
        message = data["message"];
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      dismiss();

      setTimeout(() => {
        if (successMessage) {
          showSuccessDeleteToast(successMessage, message);
        }

        if (failedMessage) {
          showFailedDeleteToast(failedMessage, message);
        }
      }, 2000);
    }
  };

  // Confirm handler: routes to local delete, server delete, or both
  const handleConfirm = async () => {
    if (offlineRows.length > 0) {
      await deleteOfflineRows();
    }
    if (serverRows.length > 0) {
      await deleteRows();
    }
    setIsDialogOpen(false);
  };

  const showSuccessDeleteToast = (rows: RemoveData["Success"], records: RemoveData["message"]) => {
    toast({
      title: `${records}`,
      description: `${rows} has been deleted.`,
    });
  };

  const showFailedDeleteToast = (rows: RemoveData["Failed"], records: RemoveData["message"]) => {
    records = `This record cannot be deleted because it is already in use. Please remove the dependencies before trying again.`;
    toast({
      title: `${rows} Delete Failed`,
      description: `${records}`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          className={
            isMobile
              ? isSelectionMode ? "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-erp-blue-14 shadow-md transition-all duration-300 ease-in-out" : "flex w-full items-center justify-start gap-2"
              : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          }
          disabled={disabled || selectedRows.length === 0}
          type="button"
          id="delete-btn"
        >
          <FaEraser
            className={
              isMobile
                ? "size-4.5 text-erp-blue-11"
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
            Delete
          </span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className={isMobile ? "max-w-xs gap-y-4.5 !p-5 rounded-md bg-white" : "max-w-sm"}>
        {isMobile ? (
          <>
            <div className="flex flex-col items-center justify-center gap-y-3">
              <div className="rounded-full bg-[#FFB0AA] p-2.5">
                <FiAlertTriangle className="size-8.5 text-[#B83D3D]" />
              </div>
              <p className="font-Roboto text-sm">
                You are about to <strong>Delete</strong> data
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center">
              <p className="text-xs text-[#646464] text-center">
                {isOfflineOnlySelection
                  ? "These are local drafts that have never been synced. This cannot be undone."
                  : isMixedSelection
                    ? "Your selection includes unsynced local drafts and saved records. This action cannot be undone."
                    : "Are you sure you want to delete selected data rows? This action cannot be undone"}
              </p>
            </div>

            <AlertDialogFooter className="mt-2 w-full flex !flex-row justify-center items-center gap-x-3.5 sm:justify-center">
              <AlertDialogAction
                className="hover-none h-8 w-20 text-[11px] transition-all duration-300 ease-in-out border bg-[#B83D3D] text-white hover:bg-[#ED6161]"
                onClick={handleConfirm}
              >
                OK
              </AlertDialogAction>
              <AlertDialogCancel className="h-8 w-20 !mt-0 text-[11px] bg-white shadow-md border-none">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </>
        ) : (<>
          <AlertDialogHeader>
            <AlertDialogTitle className="sr-only">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center">
              <FaTriangleExclamation className="size-12 text-erp-red-1" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col items-center gap-2">
            {!isOfflineOnlySelection && (
              <p className="text-center text-sm text-erp-red-1">
                If you wish to be able to recover this data later, please use the <strong>TRASH</strong>{" "}
                action instead.
              </p>
            )}

            <p className="text-sm text-erp-blue-14">
              {isOfflineOnlySelection
                ? <>These local drafts have never been synced. Proceed to <strong>DELETE</strong> them?</>
                : isMixedSelection
                  ? <>Proceed to <strong>DELETE</strong> the selected local drafts and saved data row(s)?</>
                  : <>Proceed to <strong>DELETE</strong> the selected data row(s)?</>}
            </p>

            {isOkButtonDisabled && (
              <p className="text-xs italic text-gray-500">
                Please wait {countdown} {countdown === 1 ? "second" : "seconds"} before confirming...
              </p>
            )}
          </div>
          <AlertDialogFooter className="mt-2 flex items-center !justify-center justify-center gap-3 [&>*]:m-0">
            <AlertDialogCancel className="h-9 w-24" autoFocus>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="h-9 w-24 bg-[#B83D3D] text-white hover:bg-[#ED6161]"
              onClick={handleConfirm}
              disabled={isOkButtonDisabled}
            >
              OK
            </AlertDialogAction>
          </AlertDialogFooter></>)}
      </AlertDialogContent>
    </AlertDialog>
  );
}