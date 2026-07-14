"use client";

import React, { useEffect, useState } from "react";
import type { Table } from "@tanstack/react-table";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CloneButton from "@/components/data-table/ActionButton/Clone";
import DeleteButton from "@/components/data-table/ActionButton/Delete";
import EditButton from "@/components/data-table/ActionButton/Edit";
import NewButton from "@/components/data-table/ActionButton/New";
import RestoreButton from "@/components/data-table/ActionButton/Restore";
import TrashButton from "@/components/data-table/ActionButton/Trash";

interface MobileActionGroupStartProps<T> {
  table: Table<T>;
  refreshTable: () => void;
  config: {
    // Required: Core CRUD destinations
    newDestination: string;
    editDestination: (row: T) => string;
    cloneDestination: (row: T) => string;

    // Required: Module info for API calls
    module: string;        // e.g., "cash_sales"
    model: string;         // e.g., "cash-sales"
  };
  children?: React.ReactNode; // For additional menu items
}

export default function MobileActionGroupStart<T extends Record<string, any>>({
  table,
  refreshTable,
  config,
  children,
}: MobileActionGroupStartProps<T>) {
  const [selectedRow, setSelectedRow] = useState<T | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedRowModel = table.getSelectedRowModel();

  useEffect(() => {
    if (selectedRowModel.rows.length === 1) {
      setSelectedRow(selectedRowModel.rows[0].original);
    } else {
      setSelectedRow(null);
    }
  }, [selectedRowModel]);

  const handleActionClick = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="block md:hidden">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-sm p-2 text-erp-blue-14 hover:text-erp-blue-14 aria-expanded:bg-erp-blue-14 aria-expanded:text-white">
            <TfiLayoutGrid3Alt className="size-5.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col items-center">
          {/* Core CRUD Actions */}
          <DropdownMenuItem>
            <NewButton destination={config.newDestination} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <EditButton
              table={table}
              destination={selectedRow ? config.editDestination(selectedRow) : ""}
            />
          </DropdownMenuItem>
          <div
            onClick={() => {
              setDropdownOpen(false); // close dropdown first
              setTimeout(() => {
                document.getElementById("clone-btn")?.click(); // trigger dialog
              }, 0);
            }}
          >
            <CloneButton
              id="clone-btn"
              table={table}
              destination={selectedRow ? config.cloneDestination(selectedRow) : ""}
            />
          </div>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <div
              onClick={() => {
                setDropdownOpen(false); // close dropdown first
                setTimeout(() => {
                  document.getElementById("trash-btn")?.click(); // trigger dialog
                }, 0);
              }}
            >
              <TrashButton
                table={table}
                id="trash-btn"
                module={config.module}
                model={config.model}
                refreshTable={refreshTable}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div
              onClick={() => {
                setDropdownOpen(false); // close dropdown first
                setTimeout(() => {
                  document.getElementById("restore-btn")?.click(); // trigger dialog
                }, 0);
              }}
            >
              <RestoreButton
                table={table}
                module={config.module}
                model={config.model}
                refreshTable={refreshTable}
              />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
             <div
              onClick={() => {
                setDropdownOpen(false); // close dropdown first
                setTimeout(() => {
                  document.getElementById("delete-btn")?.click(); // trigger dialog
                }, 0);
              }}
            >
              <DeleteButton
                table={table}
                module={config.module}
                model={config.model}
                refreshTable={refreshTable}
              />
            </div>
          </DropdownMenuItem>

          {/* Additional Actions passed as children */}
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
