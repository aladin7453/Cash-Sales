"use client";

import { SVGPrint } from "@/components/icons/svg-repo/SVGPrint";

import type { MouseEvent } from "react";

type Props = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function PrintButton({ onClick }: Props) {
  return (
    <button className="flex flex-col items-center gap-y-1" onClick={onClick} type="button">
      <SVGPrint className="size-4.5 text-erp-blue-11" />
      <span className="text-[11px]/none font-medium">Print</span>
    </button>
  );
}
