"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEraser, FaTriangleExclamation } from "react-icons/fa6";

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
import { deleteOffline } from "@/components/offlineDB";

type Props<TData> = {
  model: string;
  module: string;
  id: string;
  indexPath: string;
  account?: string;
  isOfflineDraft?: boolean;
};

type RemoveData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function DeleteButton<TData>({
  module,
  model,
  id,
  indexPath,
  account,
  isOfflineDraft = false,
}: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOkButtonDisabled, setIsOkButtonDisabled] = useState(true);
  const [countdown, setCountdown] = useState(3);

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

  const deleteOfflineDraft = async () => {
    try {
      await deleteOffline(id);
      window.dispatchEvent(new CustomEvent("offlineRecordSynced"));
      router.push(indexPath);

      setTimeout(() => {
        toast({
          title: "Success",
          description: "The local draft has been removed.",
        });
      }, 300);
    } catch (error) {
      console.error("Error removing offline draft:", error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: "Could not remove the local draft.",
      });
    }
  };

  const deleteRows = async () => {
    const form_data = new FormData();
    form_data.append(`UUIDs[]`, id);

    const { dismiss } = showLoadingToast("Deleting document...");

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

        if (data["Success"]) {
          router.push(indexPath);
        }

        setTimeout(() => {
          if (data["Success"]) {
            showSuccessDeleteToast(data["Success"]);
          }

          if (data["Failed"]) {
            showFailedDeleteToast(data["Failed"]);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      dismiss();
    }
  };

  const handleConfirm = () => {
    if (isOfflineDraft) {
      deleteOfflineDraft();
    } else {
      deleteRows();
    }
  };

  const showSuccessDeleteToast = (records: string) => {
    toast({
      title: "Success",
      description: `${records} has been deleted.`,
    });
  };

  const showFailedDeleteToast = (records: string) => {
    toast({
      title: "Failed",
      description: `This record (${records}) cannot be deleted because it is already in use. Please remove the dependencies before trying again.`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          id="delete-btn"
          type="button"
        >
          <FaEraser className="size-4.5 text-erp-red-1" />
          <span className="text-[11px]/none font-medium">Delete</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            <FaTriangleExclamation className="size-12 text-erp-red-1" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center gap-2">
          {isOfflineDraft ? (
            <p className="text-sm text-erp-blue-14">
              This is a local draft that has never been synced. Proceed to{" "}
              <strong>DELETE</strong> it?
            </p>
          ) : (
            <>
              <p className="text-center text-sm text-erp-red-1">
                If you wish to be able to recover this data later, please use the{" "}
                <strong>TRASH</strong> action instead.
              </p>

              <p className="text-sm text-erp-blue-14">
                Proceed to <strong>DELETE</strong> the selected data?
              </p>
            </>
          )}

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
            className="h-9 w-24 bg-erp-red-1 text-white hover:bg-erp-red-1/90"
            onClick={handleConfirm}
            disabled={isOkButtonDisabled}
          >
            OK
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}