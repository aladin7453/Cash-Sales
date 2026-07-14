import { useEffect, useState } from "react";
import { FaTrashCan, FaTriangleExclamation } from "react-icons/fa6";

import { useToast } from "@/components/ui/use-toast";
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

import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  module: string;
  model: string;
  id?: string;
};

type ThrowData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function TrashButton({ module, model, id }: Props) {
  const { toast } = useToast();
  const headers = getAuthHeaders();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [documentId, setDocumentId] = useState<string | null>(null);
  
  useEffect(() => {
    // If id is provided as prop, use it, otherwise try to get from URL
    if (id) {
      setDocumentId(id);
    } else {
      const urlId = searchParams.get("id");
      setDocumentId(urlId);
    }
  }, [id, searchParams]);

  const trashDocument = async () => {
    if (!documentId) {
      toast({
        title: "No document selected",
        description: "Unable to find document ID",
        variant: "destructive",
      });
      return;
    }

    const form_data = new FormData();
    form_data.append(`UUIDs[]`, documentId);

    const { id: loadingToastId, dismiss } = showLoadingToast("Trashing document...");

    try {
      const response = await fetch(
        `${ORIGIN}/${module}/api/${model}/throw`,
        {
          method: "POST",
          headers,
          body: form_data,
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: errorData.message || "Error",
          duration: 2000,
          variant: "destructive",
        });
        throw new Error("Failed to trash document");
      } else {
        const data: ThrowData = await response.json();

        router.push(`/${module}/${model}/`);

        setTimeout(() => {
          if (data["Success"]) {
            showSuccessTrashToast(data["Success"]);

          }
          if (data["Failed"]) {
            showFailedTrashToast(data["Failed"]);
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      dismiss();
    }
  };

  const showSuccessTrashToast = (records: ThrowData["Success"]) => {
    toast({
      title: "Success",
      description: `${records} has been sent to trash.`,
    });
  };

  const showFailedTrashToast = (records: ThrowData["Failed"]) => {
    toast({
      title: "Failed",
      description: `${records} cannot be sent to trash.`,
      variant: "destructive",
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
           id="trash-btn"
          disabled={!documentId}
        >
          <div className="size-4.5 text-erp-blue-11 group-disabled:text-erp-gray-5">
            <FaTrashCan className="h-full w-full" />
          </div>
          <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5">Trash</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            <FaTriangleExclamation className="size-12 text-erp-yellow-2" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <p className="text-sm text-erp-blue-14">
            Proceed to <strong>TRASH</strong> this document?
          </p>
        </div>
        <AlertDialogFooter className="flex justify-center items-center gap-3 mt-2 !justify-center [&>*]:m-0">
          <AlertDialogAction className="h-9 w-24" onClick={() => trashDocument()}>
            OK
          </AlertDialogAction>
          <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
