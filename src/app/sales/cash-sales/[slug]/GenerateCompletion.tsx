import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const GenerateCompletionDialog = ({ open, setOpen }) => {
  const { toast } = useToast();

  const handleClose = () => {
    setOpen(false);
    showCompletionToast();
  };

  const showCompletionToast = () => {
    toast({
      title: "Completed",
      description: "New version of e-Invoice has been generated.",
      action: (
        <ToastAction
          className={cn(buttonVariants({ variant: "default", size: "sm" }))}
          altText="OK"
        >
          OK
        </ToastAction>
      ),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-96">
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <p>New version of e-Invoice has been generated.</p>
          <div className="flex gap-4 mt-4">
            <Button onClick={handleClose} variant="outline" className="hover:bg-erp-blue-10">
              OK
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateCompletionDialog;
