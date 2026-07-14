"use client";

import { cn } from "@/lib/utils/cn";
import { FaFileImport, FaFileExport } from "react-icons/fa6";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface TransferDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelectTransferFrom: () => void;
  onSelectTransferTo: () => void;
  canTransferTo?: boolean;
  showTransferFrom?: boolean;
  showTransferTo?: boolean;
}

export default function TransferDialog({
  open,
  setOpen,
  onSelectTransferFrom,
  onSelectTransferTo,
  canTransferTo = true,
  showTransferFrom = true,
  showTransferTo = true,
}: TransferDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-fit min-w-[320px] max-w-sm bg-erp-blue-3 p-4">
        <h2 className="text-sm font-bold text-black">Select Transfer Type</h2>
        <div className="mt-2 flex flex-col gap-y-2">
          {/* Transfer From */}
          {showTransferFrom && (
          <button
            className="group flex items-center gap-x-3 rounded-md border border-erp-blue-11 bg-white px-4 py-3 text-left transition-all duration-150 hover:bg-erp-blue-11 hover:shadow-md active:scale-95"
            onClick={() => {
              setOpen(false);
              onSelectTransferFrom();
            }}
          >
            <FaFileImport className="size-5 shrink-0 text-erp-blue-11 group-hover:text-white" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-erp-blue-11 group-hover:text-white">
                Transfer From
              </span>
              <span className="text-xs text-erp-gray-7 group-hover:text-erp-blue-3">
                Import items from another document
              </span>
            </div>
          </button>
          )}

          {/* Transfer To */}
          {showTransferTo && (
          <button
            className={cn(
              "group flex items-center gap-x-3 rounded-md border px-4 py-3 text-left transition-all duration-150",
              canTransferTo
                ? "border-erp-blue-11 bg-white hover:bg-erp-blue-11 hover:shadow-md active:scale-95"
                : "cursor-not-allowed border-erp-gray-5 bg-erp-gray-1"
            )}
            onClick={() => {
              if (!canTransferTo) return;
              setOpen(false);
              onSelectTransferTo();
            }}
            disabled={!canTransferTo}
          >
            <FaFileExport
              className={cn(
                "size-5 shrink-0",
                canTransferTo
                  ? "text-erp-blue-11 group-hover:text-white"
                  : "text-erp-gray-5"
              )}
            />
            <div className="flex flex-col gap-y-0.5">
              <span
                className={cn(
                  "text-sm font-semibold",
                  canTransferTo
                    ? "text-erp-blue-11 group-hover:text-white"
                    : "text-erp-gray-5"
                )}
              >
                Transfer To
              </span>
              <span
                className={cn(
                  "text-xs",
                  canTransferTo
                    ? "text-erp-gray-7 group-hover:text-erp-blue-3"
                    : "text-erp-gray-5"
                )}
              >
                Export items to another document
              </span>
              {!canTransferTo && (
                <span className="mt-1 text-[11px] text-amber-600">
                  Please select at least 1 document
                </span>
              )}
            </div>
          </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}