import { useRouter } from "next/navigation";
import { FaClone, FaTriangleExclamation } from "react-icons/fa6";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CloneButton({ destination }) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          id="clone-btn"
        >
          <FaClone className="size-4.5 text-erp-blue-11" />
          <span className="text-[11px]/none font-medium">Clone</span>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="sr-only">Are you sure absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="flex justify-center">
            <FaTriangleExclamation className="size-12 text-erp-blue-12" />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex justify-center">
          <p className="text-sm text-erp-blue-14">
            Proceed to <strong>CLONE</strong> the selected data?
          </p>
        </div>
        <AlertDialogFooter className="mt-2 flex items-center !justify-center justify-center gap-3 [&>*]:m-0">
          <AlertDialogAction className="h-9 w-24" onClick={() => router.push(destination)}>
            OK
          </AlertDialogAction>
          <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
