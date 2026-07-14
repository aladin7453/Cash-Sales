"use client";

import { FaTable } from "react-icons/fa6";

import type { MouseEvent } from "react";

type Props = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export default function BrowseButton({ onClick }: Props) {
  return (
    <button className="flex flex-col items-center gap-y-1" onClick={onClick} type="button" >
      <FaTable className="size-4.5 text-erp-blue-11"/>
      <span className="text-[11px]/none font-medium">Browse</span>
    </button>
  );
}
