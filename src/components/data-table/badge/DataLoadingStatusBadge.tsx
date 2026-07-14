import { useEffect, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

type Props = {
  variant: "success" | "error";
};

export default function DataLoadingStatusBadge({ variant }: Props) {
  const icon = variant === "success" ? <FaCircleCheck size={14} /> : null;
  const text = variant === "success" ? "Data Loaded" : "Loading Error";

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isRendered, setIsRendered] = useState<boolean>(true);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // 3000ms = 3s

    const renderTimer = setTimeout(() => {
      setIsRendered(false);
    }, 4000); // 4000ms = 4s

    return () => {
      clearTimeout(timer);
      clearTimeout(renderTimer);
    };
  }, []);

  if (!isRendered) return null;

  return (
    <Badge
      className={cn(
        "mr-3 flex items-center gap-x-1 px-2 py-1 font-bold",
        isVisible ? "animate-[fade-in_ease_0.5s]" : "animate-[fade-out_ease_1s]",
        variant === "success" ? "bg-erp-green-1" : "bg-erp-red-1",
      )}
    >
      {icon}
      {text}
    </Badge>
  );
}
