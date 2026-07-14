"use client";

import React from 'react';

import SaveButton from "@/components/form/ActionButton/Save";
import ResetButton from "@/components/form/ActionButton/Reset";
import CancelButton from "@/components/form/ActionButton/Cancel";
import BackButton from '@/components/form/ActionButton/Back';

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";

import type { TransferFromDetailsToolbarProps } from './types';

export default function TransferFromDetailsToolbar({
  table, 
  setOpen, 
  setOpenDocumentPopover, 
  id,
  docUUID, 
  docType,
  onSave,
  refreshTable,
  fetchDocumentDetails 
}: TransferFromDetailsToolbarProps) {
  const handleBack = () => {
    setOpenDocumentPopover(true);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-1.5">
        <div className="grid auto-cols-fr grid-flow-col gap-x-1.5">
          <SaveButton onClick={() => onSave({ table: table })}/>
          <ResetButton onClick={() => console.log("reset")}/>
          <CancelButton onClick={() => setOpen(false)} />
          <BackButton onClick={handleBack}/>
        </div>

        <Pagination table={table} />
        
        <div className="grid grid-cols-2 items-center text-erp-blue-14">
          <Refresh refreshTable={() => fetchDocumentDetails(docUUID)}/>
          <ColumnVisibilityToggle table={table} />
        </div>
      </div>
    </>
  );
}
