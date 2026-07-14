import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "@/components/ui/use-toast";

export function showLoadingToast(message = "Loading...") {
  const { id, dismiss } = toast({
    title: (
      <div className="flex items-center gap-x-1.5">
        <LoadingSpinner />
        <p>{message}</p>
      </div>
    ),
  });

  return { id, dismiss };
}
