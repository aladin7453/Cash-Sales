import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";
import { TbInfoSquareFilled } from "react-icons/tb";
import useSWR from "swr";

import GetCompletionDialog from "@/app/sales/cash-sales/[slug]/GetCompletation";
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
import { buttonVariants } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import { TiTick } from "react-icons/ti";

import type { Table } from "@tanstack/react-table";

type SuccessItem = {
  SubmissionUid: string;
  UUID: string;
  LongID: string;
  OverallStatus: string;
  ReceivedAt: string;
  Status: string;
  RejectedReason?: string;
  [key: string]: any;
};

type SubmissionGroup = {
  docNo?: string;
  Success?: SuccessItem[];
  message?: string;
};

type Props<TData> = {
  table: Table<TData>;
  module: string;
  model: string;
  isMobile?: boolean;
  isSelectionMode?: boolean;
  refreshTable: () => void;
};

export default function GetEInvoiceButton<TData>({
  table,
  module,
  model,
  isMobile,
  isSelectionMode,
  refreshTable,
}: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();
  const searchParams = useSearchParams();
  const [submissionGroups, setSubmissionGroups] = useState<SubmissionGroup[]>([]);
  const [submitErrorDialogOpen, setSubmitErrorDialogOpen] = useState(false);
  const [getCompletionDialogOpen, setGetCompletionDialogOpen] = useState(false);

  const submitRows = async () => {
    const form_data = new FormData();
    const selectedRows = table.getSelectedRowModel().rows;

    selectedRows.forEach((row) => {
      form_data.append("UUIDs[]", row["original"]["UUID"]);
    });

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/get-submission-details`, {
        method: "POST",
        headers,
        body: form_data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          toast({ title: errorData.message, duration: 2000 });
        }
        throw new Error("Failed to fetch data");
      }

      const responseData = await response.json();

      if (Array.isArray(responseData)) {
        const groups: SubmissionGroup[] = responseData.map((item) => {
          if (item?.Success && Array.isArray(item.Success)) {
            return {
              docNo: item.docNo,
              Success: item.Success,
            };
          } else if (typeof item === "string") {
            return {
              message: item,
            };
          } else {
            return {
              docNo: item?.docNo ?? "-",
              message: item?.message ?? "No submission details found",
            };
          }
        });

        setSubmissionGroups(groups);
      } else if (responseData?.Success) {
        setSubmissionGroups([
          {
            docNo: responseData.docNo || "-",
            Success: responseData.Success,
          },
        ]);
      } else if (typeof responseData === "string") {
        setSubmissionGroups([
          {
            message: responseData,
          },
        ]);
      } else {
        setSubmissionGroups([]);
      }

      setGetCompletionDialogOpen(true);
      revalidateEInvoiceRecordsData();
    } catch (error) {
      setSubmissionGroups([]);
      setSubmitErrorDialogOpen(true);
    }
  };

  const { mutate: mutateEInvoice } = useSWR();

  const revalidateEInvoiceRecordsData = () => {
    mutateEInvoice();
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            className={
              isMobile
                ? isSelectionMode ? "group flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-erp-blue-14 shadow-md transition-all duration-300 ease-in-out" : "group flex w-full items-center justify-start gap-2"
                : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
            }
            disabled={table.getSelectedRowModel().rows.length === 0 ||
              table.getSelectedRowModel().rows.every((row) => row.getValue("valid") === "0") ||
              (model !== "consolidated-invoice" &&
                model !== "consolidated-purchase-invoice" &&
                table
                  .getSelectedRowModel()
                  .rows.some((row) => row.getValue("invoiceType") == null)) ||
              (model !== "consolidated-invoice" &&
                model !== "consolidated-purchase-invoice" &&
                table
                  .getSelectedRowModel()
                  .rows.some((row) => row.getValue("invoiceType") == "None")) ||
              (model !== "consolidated-invoice" &&
                model !== "consolidated-purchase-invoice" &&
                table
                  .getSelectedRowModel()
                  .rows.some((row) => row.getValue("invoiceType") == "Consolidate"))
            }
          >
            <TbInfoSquareFilled
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
              Get E-Inv
            </span>
          </button>
        </AlertDialogTrigger>

        <AlertDialogContent
          className={isMobile ? "max-w-xs gap-y-4.5 !p-5 rounded-md bg-white" : "max-w-sm"}
        >
          {isMobile ? (
            <>
              <div className="flex flex-col items-center justify-center gap-y-3">
                <div className="rounded-full bg-[#D0F3E2] p-2.5">
                  <TiTick className="size-8.5 text-[#307E59]" />
                </div>
                <p className="font-Roboto text-sm">
                  You are about to <strong>Get</strong> E-invoice
                </p>
              </div>

              <div className="flex w-full flex-col items-center justify-center">
                <p className="text-xs text-[#646464] text-center">
                  Are you sure you want to get the selected data rows?
                </p>
              </div>

              <AlertDialogFooter className="mt-2 w-full flex !flex-row justify-center items-center gap-x-3.5 sm:justify-center">
                <AlertDialogAction className="h-8 w-20 text-[11px] bg-[#307E59]" onClick={submitRows}>
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
                  Proceed to <strong>GET</strong> the selected data row(s)?
                </p>
              </div>
              <AlertDialogFooter className="mt-2 flex items-center !justify-center justify-center gap-3 [&>*]:m-0">
                <AlertDialogAction className="h-9 w-24" onClick={submitRows}>
                  OK
                </AlertDialogAction>
                <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>

      <GetCompletionDialog
        open={getCompletionDialogOpen}
        setOpen={setGetCompletionDialogOpen}
        submissionGroups={submissionGroups}
      />
    </>
  );
}
