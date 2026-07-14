"use client";

import React, { useState } from "react";
import { TfiLayoutGrid2Alt } from "react-icons/tfi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import SaveButton from "@/components/form/ActionButton/Save";
import ResetButton from "@/components/form/ActionButton/Reset";
import CancelButton from "@/components/form/ActionButton/Cancel";

interface MobilePopoverActionGroupStartProps {
  config: {
    save?: {
      handler: () => void;
      disabled?: boolean;
    };
    reset?: {
      handler: () => void;
    };
    cancel: {
      handler: () => void;
    };
  };
  children?: React.ReactNode; // For additional menu items
}

export default function MobilePopoverActionGroupStart({
  config,
  children,
}: MobilePopoverActionGroupStartProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleActionClick = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="block md:hidden">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button className="mx-2 p-1 rounded-sm flex items-center text-erp-blue-14 hover:text-erp-blue-14 aria-expanded:bg-erp-blue-14 aria-expanded:text-white">
            <TfiLayoutGrid2Alt className="size-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col items-center text-erp-blue-14">
          {config.save && (
            <DropdownMenuItem>
              <div
                className="flex items-center gap-2 w-full"
                onClick={() => {
                  config.save?.handler();
                  handleActionClick();
                }}
              >
                <SaveButton disabled={config.save?.disabled || false} />
              </div>
            </DropdownMenuItem>
          )}
          {config.reset && (
            <DropdownMenuItem>
              <div
                className="flex items-center gap-2 w-full"
                onClick={() => {
                  config.reset?.handler();
                  handleActionClick();
                }}
              >
                <ResetButton />
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <div
              className="flex items-center gap-2 w-full"
              onClick={() => {
                config.cancel.handler();
                handleActionClick();
              }}
            >
              <CancelButton />
            </div>
          </DropdownMenuItem>

          {/* Additional Actions passed as children */}
          {children}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
