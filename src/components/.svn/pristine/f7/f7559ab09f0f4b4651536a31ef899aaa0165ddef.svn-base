import { useContext } from "react";

import { AccountContext } from "@/app/(main)/system-account/all-account/[slug]/AccountContext";
import GridMasonry from "@/components/icons/svg-repo/GridMasonry";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";

import type { AccountState } from "@/app/(main)/system-account/all-account/[slug]/AccountContext";

type Props = {
  id: string | null;
  refreshTable: () => void;
  companyId?: string;
  closeFormDialog?: () => void;
  disabled?: boolean;
};

export default function ActivateButton({
  id,
  refreshTable,
  companyId,
  closeFormDialog,
  disabled,
}: Props) {
  const { selectedCompanyIds } = useContext(AccountContext) as AccountState;

  const { toast } = useToast();
  const headers = getAuthHeaders();

  const handleConfirmActivate = async () => {
    const formData = new FormData();

    if (companyId) {
      formData.append(`UUIDs[]`, companyId);
    } else {
      for (const id of selectedCompanyIds) {
        formData.append(`UUIDs[]`, id);
      }
    }

    try {
      const response = await fetch(
        `${ORIGIN}/account/api/account/update-company-status?id=${id}&action=active`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message,
          variant: "destructive",
        });
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      if (responseData) {
        toast({
          title: "Success Activate",
          description: responseData.message,
        });

        refreshTable();

        if (closeFormDialog) {
          closeFormDialog();
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
          type="button"
          disabled={disabled}
        >
          <GridMasonry className="size-4.5 text-erp-blue-11 group-disabled:text-erp-gray-5" />
          <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5">Activate</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <div className="flex justify-center py-6">
          <p className="text-erp-blue-14">Activate selected Company?</p>
        </div>
        <AlertDialogFooter className="flex !justify-center gap-x-2">
          <AlertDialogAction className="h-9 w-24" onClick={handleConfirmActivate}>
            Confirm
          </AlertDialogAction>
          <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
