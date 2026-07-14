"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteDialog({ open, setOpen, onConfirm }: Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <p>Are you sure you want to delete the selected row(s)?</p>
        <div className="mt-4 flex justify-end gap-4">
          <AlertDialogAction onClick={onConfirm}>Yes</AlertDialogAction>
          <AlertDialogCancel>No</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
