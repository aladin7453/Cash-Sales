"use client";

import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  selectedRows: any;
};

const ConfirmationDialog = ({ open, setOpen, onConfirm, selectedRows }: Props)  => {
  const total = selectedRows?.length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex flex-col items-center justify-center gap-y-6 bg-white">
        <div className="flex flex-col items-center justify-center gap-y-3">
          <div className="rounded-full bg-[#FFB0AA] p-3.5">
            <FiAlertTriangle className="size-16 text-[#B83D3D]" />
          </div>
          <p className="font-Roboto text-lg">Delete Selected Row Items</p>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-md text-[#646464]">
            Are you sure you want to delete {total} selected rows?
          </p>
          <p className="text-md text-[#646464]">This action cannot be undone</p>
        </div>

        <div className="flex w-full items-center justify-center gap-x-3">
          <Button
            type="button"
            onClick={onConfirm}
            className="hover-none h-10 w-40 transition-all duration-300 ease-in-out border bg-[#B83D3D] text-white hover:bg-[#ED6161]"
          >
            Yes
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
            className="h-10 w-40 transition-all duration-300 ease-in-out bg-white text-black shadow-md hover:bg-gray-400 hover:text-white"
          >
            No
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;