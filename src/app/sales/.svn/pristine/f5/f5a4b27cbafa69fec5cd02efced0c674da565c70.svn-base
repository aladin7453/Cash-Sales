import { useRouter } from "next/navigation";
import CancelButton from "@/components/form/ActionButton/Cancel";
import SaveButton from "@/components/form/ActionButton/Save";

type TopActionBarProps = {
  onSave: () => void;
};

export default function TopActionBar({ onSave }: TopActionBarProps) {
  const router = useRouter();

  return (
    <div className="-mx-2 -mt-1 flex items-center justify-between bg-erp-gray-3 px-4 py-2">
      <div className="flex space-x-3">
        <SaveButton onSubmit={onSave} />
        {/* <CancelButton onClick={() => router.push("/")} /> */}
      </div>
    </div>
  );
}
