import { cn } from "@/lib/utils/cn";

import { Progress } from "./ui/progress";

type Params = {
  progressValue?: number;
  isMobile?: boolean;
};

export default function LoadingUI({ progressValue = 75, isMobile }: Params) {
  return (
    <div
      className={cn(
        "z-[9999] items-center justify-center pointer-events-auto cursor-not-allowed",
        isMobile
          ? "hidden md:fixed md:inset-0 md:flex md:size-full md:bg-black/15"
          : "fixed inset-0 flex size-full bg-black/15",
      )}
    >
      <Progress value={progressValue} className="w-1/4 bg-erp-gray-1" />
    </div>
  );
}
