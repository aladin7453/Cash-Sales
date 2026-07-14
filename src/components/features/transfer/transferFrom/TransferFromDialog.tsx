"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TransferFromDialogProps } from './types';

export default function TransferFromDialog({
  open,
  setOpen,
  sources,
  onSourceSelect,
  title = "Transfer from",
}: TransferFromDialogProps) {
  const handleSourceClick = (docType: string) => {
    onSourceSelect(docType);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96 bg-erp-blue-3 p-4">
        <h2 className="text-sm font-bold text-black">{title}</h2>

        <div className="grid grid-row justify-center gap-2">
          {sources.map((source) => (
            <Button
              key={source.key}
              onClick={() => handleSourceClick(source.key)}
              variant="outline"
              className="group flex items-center gap-x-3 rounded-md border border-erp-blue-11 bg-white px-4 py-3 text-left transition-all duration-150 hover:bg-erp-blue-11 hover:shadow-md active:scale-95"
            >
              <span className="text-sm font-semibold text-erp-blue-11 group-hover:text-white">
                {source.label}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
