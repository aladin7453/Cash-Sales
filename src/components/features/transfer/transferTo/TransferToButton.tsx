"use client";

import React from "react";
import { FaFileExport } from "react-icons/fa6";
import { useEffect } from "react";
import { cn } from "@/lib/utils/cn";

import { useTransferToAPI } from "./hooks/useTransferToAPI";
import { useTransferToConfig } from "./hooks/useTransferToConfig";
import { useTransferToState } from "./hooks/useTransferToState";
import TransferToDialog from "./TransferToDialog";
import TransferToPopover from "./TransferToPopover";

import type { TransferToButtonProps } from "./types";

export default function TransferToButton<TData>({
  table,
  id,
  config,
  isMobile,
  autoOpen,
}: TransferToButtonProps<TData>) {
  const processedConfig = useTransferToConfig(config);
  const { fetchItems } = useTransferToAPI(processedConfig);
  const {
    dialogOpen,
    popoverOpen,
    selectedDocType,
    itemData,
    setDialogOpen,
    setPopoverOpen,
    setSelectedDocType,
    setItemData,
    resetState,
  } = useTransferToState();

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  useEffect(() => {
    if (autoOpen) setDialogOpen(true);
  }, [autoOpen]);

  const handleDestinationSelect = async (docType: string) => {
    setSelectedDocType(docType);
    setDialogOpen(false);
    setPopoverOpen(true);

    // Collect all selected valid row UUIDs
    const ids = table
      ? table.getSelectedRowModel().rows.map((row) => row.original.UUID)
      : [id];

    const items = await fetchItems(ids);
    setItemData(items);
  };

  // Allow 1 or more valid rows
  const isDisabled = table
    ? table.getSelectedRowModel().rows.length === 0 ||
    table.getSelectedRowModel().rows.some((row) => row.getValue("valid") !== "1")
    : false;

  return (
    <>
      {isMobile && <div>
        <button
          className="group flex w-full items-center justify-start gap-2"
          onClick={handleDialogOpen}
          disabled={isDisabled}
        >
          <FaFileExport className="text-erp-blue-11 group-disabled:text-erp-gray-5 size-4.5" />

          <span className="text-[10px]/none font-normal">{processedConfig.buttonText}</span>
        </button>
      </div>
      }

      <TransferToDialog
        open={dialogOpen}
        setOpen={(open) => setDialogOpen(open)}
        destinations={processedConfig.destinations}
        onDestinationSelect={handleDestinationSelect}
        title={processedConfig.dialogTitle}
      />

      <TransferToPopover
        open={popoverOpen}
        setOpenDialog={setDialogOpen}
        setOpen={setPopoverOpen}
        columns={processedConfig.columns}
        data={itemData}
        fetchItems={() => fetchItems(id).then(setItemData)}
        id={id}
        docType={selectedDocType}
        config={processedConfig}
      />
    </>
  );
}