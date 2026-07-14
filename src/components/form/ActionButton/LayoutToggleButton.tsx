import { MdOutlineChangeCircle } from "react-icons/md";

type LayoutToggleButtonProps = {
  layout: "new" | "old";
  onChange: (layout: "new" | "old") => void;
};

export default function LayoutToggleButton({ layout, onChange }: LayoutToggleButtonProps) {
  const handleClick = () => {
    onChange(layout === "new" ? "old" : "new");
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-y-1"
      >
        <MdOutlineChangeCircle  className="size-4.5 text-erp-blue-11"/>
        <span className="text-[11px]/none font-medium">Switch</span>
      </button>
    </div>
  );
}
