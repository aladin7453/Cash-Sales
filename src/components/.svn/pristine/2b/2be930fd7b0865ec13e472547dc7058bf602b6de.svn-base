"use client";

import { useEffect } from "react";
import { FaArrowsRotate } from "react-icons/fa6";

import { TOOLTIP_DELAY_DURATION } from "@/lib/constants";

import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

type Props<TData> = {
  refreshTable: () => void;
  resetRowSelection?: () => void;
  isLoading?: boolean;
  isMobile?: boolean;
};
export default function Refresh<TData>({ refreshTable, resetRowSelection, isLoading, isMobile }: Props<TData>) {
  useEffect(() => {
    // Listen for company switch events
    const handleCompanySwitch = () => {
      handleRefresh();
    };
    
    window.addEventListener('companySwitched', handleCompanySwitch);
    
    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('companySwitched', handleCompanySwitch);
    };
  }, []);

  function handleRefresh() {
    refreshTable();
    if (resetRowSelection) {
      resetRowSelection();
    }
  }
  
  return (
    <TooltipProvider delayDuration={TOOLTIP_DELAY_DURATION}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex flex-col items-center my-2">
            <Button
              onClick={() => handleRefresh()}
              variant="ghost"
              size="icon"
              type="button"
              disabled={isLoading}
              className={isMobile? "group flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-erp-blue-14 shadow-md transition-all duration-300 ease-in-out" : "hover:text-erp-blue-14 active:bg-erp-blue-14 active:text-white size-8"}
            >
              <FaArrowsRotate className={isMobile? "size-4.5 text-erp-blue-11" : "size-5.5"} />
            </Button>
            <span className={isMobile? "hidden" : "text-[11px]/none font-medium text-black"}>Refresh</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className={isMobile? "hidden" : "block"}>
          <p className="font-medium">Refresh</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
