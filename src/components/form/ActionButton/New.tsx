import Link from "next/link";
import { FaRegSquarePlus } from "react-icons/fa6";

export default function NewButton({ destination }: { destination: string }) {
  return (
    <Link
      href={destination}
      className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
    >
      <FaRegSquarePlus className="size-4.5 text-erp-blue-11" />
      <span className="text-[11px]/none font-medium">New</span>
    </Link>
  );
}
