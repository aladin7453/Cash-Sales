"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ReleaseNotePopover from "./releaseNotePopover";
import React from "react";
import TransparentBGImage from "../../public/Transparent_BG_ISSB.png";

export default function Footer({
  isDashboardLayout,
}: {
  isDashboardLayout?: boolean;
}) {
  const pathname = usePathname();
  const isDashBoard = pathname.includes("/dashboard");
  return (
    <div
      className={`flex h-10 w-full items-center ${isDashBoard == true && isDashboardLayout === true ? "justify-between" : "justify-end"} bg-gradient-to-l from-erp-blue-10 via-erp-blue-8 px-2`}
    >
      {isDashBoard == true && isDashboardLayout === true && (
        <ReleaseNotePopover />
      )}
      <div className={`${isDashboardLayout === true ? "justify-end" : ""}`}>
       <a
               href=""
               className="flex items-center justify-center"
               title="I"
               target="_blank"
             >
               <Image
                 src={TransparentBGImage}
                 width={1080}
                 height={319}
                 alt="Logo"
                 className="w-20"
               />
             </a>
      </div>
    </div>
  );
}
