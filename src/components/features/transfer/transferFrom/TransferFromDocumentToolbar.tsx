"use client";

import React from 'react';

import BackButton from '@/components/form/ActionButton/Back';

import ColumnVisibilityToggle from "@/components/data-table/ColumnVisibilityToggle";
import { Pagination } from "@/components/data-table/Pagination";
import Refresh from "@/components/data-table/Refresh";

import type { TransferFromDocumentToolbarProps } from './types';

export default function TransferFromDocumentToolbar({
  table, 
  setOpen, 
  setOpenDialog,
  refreshTable,
  fetchDocuments,
  docType
}: TransferFromDocumentToolbarProps) {
  const handleBack = () => {
    setOpenDialog(true);
    setOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between p-1.5">
        <div className="grid auto-cols-fr grid-flow-col gap-x-1.5">
          <BackButton onClick={handleBack}/>
        </div>

        <Pagination table={table} />
        
        <div className="grid grid-cols-2 items-center text-erp-blue-14">
          <Refresh refreshTable={() => fetchDocuments(docType)}/>
          <ColumnVisibilityToggle table={table} />
        </div>
      </div>
    </>
  );
}
