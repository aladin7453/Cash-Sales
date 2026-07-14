"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { TransferToDialogProps } from './types';

export default function TransferToDialog({
  open,
  setOpen,
  destinations,
  onDestinationSelect,
  title = "Transfer to"
}: TransferToDialogProps) {
  const handleDestinationClick = (docType: string) => {
    onDestinationSelect(docType);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96 bg-erp-blue-3 p-4">
        <h2 className="text-sm font-bold text-black">{title}</h2>

        <div className="grid grid-row justify-center gap-2">
          {destinations.map((destination) => (
            <Button
              key={destination.key}
              onClick={() => handleDestinationClick(destination.key)}
              variant="outline"
              className="group flex items-center gap-x-3 rounded-md border border-erp-blue-11 bg-white px-4 py-3 text-left transition-all duration-150 hover:bg-erp-blue-11 hover:shadow-md active:scale-95"
            >
              <span className="text-sm font-semibold text-erp-blue-11 group-hover:text-white">
                {destination.label}
              </span>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
