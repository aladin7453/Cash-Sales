// LoadingDialog.tsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";

type LoadingProgressDialogProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    progress: number;
  };
  
  const LoadingProgressDialog: React.FC<LoadingProgressDialogProps> = ({ open, setOpen, progress }) => {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-4 bg-white text-center">
          <div className="flex flex-col items-center">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full border-t-4 border-t-blue-500 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">{progress}%</span>
              </div>
            </div>
            <p className="mt-2">Loading, please wait...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default LoadingProgressDialog;