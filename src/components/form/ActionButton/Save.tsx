import { FaFloppyDisk } from "react-icons/fa6";

import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"button"> & {
  onSubmit?: () => void;
  label?: string;
};

export default function SaveButton({ onSubmit, label = "Save", disabled, ...props }: Props) {
  const handleSubmit = () => {
    if (!disabled && onSubmit) {
      onSubmit(); // Call the onClick function passed via props
    }
  };
  return (
    <button
      className={`flex flex-col items-center gap-y-1 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      type="submit"
      onClick={handleSubmit}
      disabled={disabled}
      {...props}
    >
      <FaFloppyDisk
        className={`size-4.5 ${disabled ? "text-gray-400" : "text-erp-blue-11"}`}
      />
      <span className="text-[11px]/none font-medium">{label}</span>
    </button>
  );
}
