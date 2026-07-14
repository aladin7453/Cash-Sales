"use client";

import React, { useState } from "react";
import { TfiLayoutGrid3Alt } from "react-icons/tfi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CancelButton from "@/components/form/ActionButton/Cancel";
import ResetButton from "@/components/form/ActionButton/Reset";
import SaveButton from "@/components/form/ActionButton/Save";
import NewButton from "@/components/form/ActionButton/New";
import CloneButton from "@/components/form/ActionButton/Clone";
import DeleteButton from "@/components/form/ActionButton/Delete";

interface MobileFormActionGroupProps {
  config: {
    // Required: Core form actions
    onSave: () => void;
    onReset: () => void;
    onCancel: () => void;

    // Optional: CRUD destinations (if applicable)
    newDestination?: string;
    cloneDestination?: string;

    // Optional: Delete configuration (if applicable)
    deleteConfig?: {
      module: string;
      model: string;
      id: string;
      indexPath: string;
    };

    // Conditional display
    showNew?: boolean;
    showClone?: boolean;
    showDelete?: boolean;
  };
  children?: React.ReactNode; // For additional menu items
}

export default function MobileFormActionGroup({
  config,
  children,
}: MobileFormActionGroupProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleActionClick = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="block md:hidden">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="p-2 rounded-sm flex items-center gap-2 text-erp-blue-14 hover:text-erp-blue-14 aria-expanded:bg-erp-blue-14 aria-expanded:text-white">
            <TfiLayoutGrid3Alt className="size-5.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col items-center">
          {/* Core Form Actions */}
          <DropdownMenuItem>
            <SaveButton onSubmit={config.onSave} />
          </DropdownMenuItem>

          {config.showNew && config.newDestination && (
            <DropdownMenuItem>
              <NewButton destination={config.newDestination} />
            </DropdownMenuItem>
          )}

          {config.showClone && config.cloneDestination && (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <div
                onClick={() => {
                  setDropdownOpen(false); // close dropdown first
                  setTimeout(() => {
                    document.getElementById("clone-btn")?.click(); // trigger dialog
                  }, 0);
                }}
              >
                <CloneButton destination={config.cloneDestination} id="clone-btn" />
              </div>
            </DropdownMenuItem>
          )}

          <DropdownMenuItem>
            <ResetButton onClick={config.onReset} />
          </DropdownMenuItem>

          {config.showDelete && config.deleteConfig && (
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
                  module={config.deleteConfig.module}
                  model={config.deleteConfig.model}
                  id={config.deleteConfig.id}
                  indexPath={config.deleteConfig.indexPath}
                />
              </div>
            </DropdownMenuItem>
          )}

          {/* Additional Actions passed as children */}
          {children}

          <DropdownMenuItem>
            <CancelButton onClick={config.onCancel} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
