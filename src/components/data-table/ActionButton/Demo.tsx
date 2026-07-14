import { FaTrashCan, FaTriangleExclamation,FaFile } from "react-icons/fa6";

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
import { getAuthHeaders,ORIGIN } from "@/lib/constants";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

import type { Row, Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  module: string;
  model: string;
  refreshTable: () => void;
};

type ThrowData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function DemoButton<TData>({ table, module, model, refreshTable }: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();

  const generateDemo = async () => {
    const form_data = new FormData();
    const selectedRows = table.getSelectedRowModel().rows;

    selectedRows.forEach((row: Row<TData>) => {
      if ((row.original as any).UUID !== undefined) {
        form_data.append(`UUIDs[]`, (row.original as { UUID: string }).UUID);
      }
    });

    let successMessage = "";
    let failedMessage = "";

    const { id: loadingToastId, dismiss } = showLoadingToast("Generating demo data...");

    try {
      const response = await fetch(
        `${ORIGIN}/${module}/api/${model}/insert-demo-data`,
        {
          method: "POST",
          headers,
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
         await refreshTable();
        const successData = await response.json();
          toast({
          title: successData.message,
          duration: 2000,
        });
       
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error as needed, display error message to user
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
          onClick={() => {}}
           id="demo-btn"
        >
          <FaFile className="size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5" />
          <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5">Demo</span>
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
            Proceed to <strong>GENERATE</strong> the demo data?
          </p>
        </div>
        <AlertDialogFooter className="flex justify-center items-center gap-3 mt-2 !justify-center [&>*]:m-0">
          <AlertDialogAction className="h-9 w-24" onClick={() => generateDemo()}>
            OK
          </AlertDialogAction>
          <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
