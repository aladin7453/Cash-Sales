"use client";
import React, { useState } from "react";
import { FaRightLeft } from "react-icons/fa6";
import { cn } from "@/lib/utils/cn";
import TransferDialog from "./TransferDialog";
import TransferFromButton from "./transferFrom/TransferFromButton";
import TransferToButton from "./transferTo/TransferToButton";
import type { TransferFromButtonProps } from "./transferFrom/types";
import type { TransferToButtonProps } from "./transferTo/types";

type TransferFromConfig = Omit<TransferFromButtonProps<any>, "isMobile">;
type TransferToConfig = Omit<TransferToButtonProps<any>, "isMobile">;

interface TransferButtonProps {
  transferFromProps?: TransferFromConfig;
  transferToProps?: TransferToConfig;
  isMobile?: boolean;
  showTransferFrom?: boolean;
  showTransferTo?: boolean;
}

export default function TransferButton({
  transferFromProps,
  transferToProps,
  isMobile,
  showTransferFrom = true,
  showTransferTo = true,
}: TransferButtonProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeFlow, setActiveFlow] = useState<"from" | "to" | null>(null);
  const [flowKey, setFlowKey] = useState(0);

  const handleTransferFromSelect = () => {
    setActiveFlow("from");
    setFlowKey((k) => k + 1);
  };

  const handleTransferToSelect = () => {
    setActiveFlow("to");
    setFlowKey((k) => k + 1);
  };

  const handleTransferFromComplete = () => {
    transferFromProps?.onTransferComplete?.();
    setActiveFlow(null);
  };

  const handleRefreshTable = () => {
    transferFromProps?.refreshTable?.();
    setActiveFlow(null);
  };

  const handleButtonClick = () => {
    setPickerOpen(true);
  };

  return (
    <>
      <button
        className={
          isMobile
            ? "group flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-md"
            : "group flex flex-col items-center gap-y-1"
        }
        onClick={handleButtonClick}
      >
        {isMobile ? (
          <FaRightLeft className="size-4.5 text-erp-blue-11" />
        ) : (
          <FaRightLeft
            className={cn(
              "text-erp-blue-11",
              (transferFromProps?.table || transferToProps?.table) ? "size-5.5" : "size-4.5",
            )}
          />
        )}
        {!isMobile && (
          <span className={isMobile? "hidden" : "text-[11px]/none font-medium"}>
            Transfer
          </span>
        )}
      </button>

      <TransferDialog
        open={pickerOpen}
        setOpen={setPickerOpen}
        onSelectTransferFrom={handleTransferFromSelect}
        onSelectTransferTo={handleTransferToSelect}
        canTransferTo={
          transferToProps?.table
            ? transferToProps.table.getSelectedRowModel().rows.length > 0 &&
            transferToProps.table.getSelectedRowModel().rows.every(
              (row) => row.getValue("valid") === "1"
            )
            : true
        }
        showTransferFrom={showTransferFrom}
        showTransferTo={showTransferTo}
      />

      {activeFlow === "from" && transferFromProps && (
        <TransferFromButton
          key={flowKey}
          {...transferFromProps}
          isMobile={false}
          onTransferComplete={handleTransferFromComplete}
          refreshTable={handleRefreshTable}
          forceEnabled
          autoOpen
        />
      )}

      {activeFlow === "to" && transferToProps && (
        <TransferToButton
          key={flowKey}
          {...transferToProps}
          isMobile={false}
          autoOpen
        />
      )}
    </>
  );
}