"use client";

import { SVGPrint } from "@/components/icons/svg-repo/SVGPrint";
import type { MouseEvent } from "react";

type Props = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  row?: any; // Selected row data
};

export default function PrintButton({ onClick, row }: Props) {
  return (
    <button
      className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={!row} // Disable if no row is selected
    >
      <SVGPrint 
        className={`size-5.5 ${row ? "text-erp-blue-11" : "text-erp-gray-5"}`}
      />
      <span
        className={`text-[11px]/none font-medium ${row ? "text-black" : "text-erp-gray-5"}`}
      >
        Print
      </span>
    </button>
  );
}
