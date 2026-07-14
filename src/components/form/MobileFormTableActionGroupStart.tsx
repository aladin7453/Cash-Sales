"use client";

import React, { useState } from "react";
import type { Table } from "@tanstack/react-table";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileFormTableActionGroupStartProps<T> {
  table: Table<T>;
  config: {
    core: {
      add: {
        handler: () => void;
        tooltip?: string;
      };
      remove: {
        handler: () => void;
      };
    };
  };
  children?: React.ReactNode | ((closeDropdown: () => void) => React.ReactNode); // Support function children
}

export default function MobileFormTableActionGroupStart<T extends Record<string, any>>({
  table,
  config,
  children,
}: MobileFormTableActionGroupStartProps<T>) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAddClick = () => {
    setDropdownOpen(false);
    config.core.add.handler();
  };

  const handleRemoveClick = () => {
    setDropdownOpen(false);
    config.core.remove.handler();
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <>
      {/* Mobile view dropdown */}
      <div className="block md:hidden">
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <button className="mx-2 p-1 rounded-sm flex items-center text-erp-blue-14 hover:text-erp-blue-14 aria-expanded:bg-erp-blue-14 aria-expanded:text-white">
              <TfiLayoutGrid2Alt className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-center text-erp-blue-14">
            <DropdownMenuItem>
              {/* Add Button */}
              <div className="flex flex-col items-center w-full">
                <Button variant="ghost" size="icon" onClick={handleAddClick}>
                  <FaPlus className="size-5" />
                </Button>
                <span className="text-[11px]/none font-medium text-black">Add</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {/* Remove Button */}
              <div className="flex flex-col items-center w-full">
                <Button variant="ghost" size="icon" onClick={handleRemoveClick}>
                  <FaMinus className="size-5" />
                </Button>
                <span className="text-[11px]/none font-medium text-black">Remove</span>
              </div>
            </DropdownMenuItem>
            {/* Additional custom actions */}
            {typeof children === 'function' ? children(closeDropdown) : children}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
