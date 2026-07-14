import React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SubmitErrorMessageDialog = ({ open, setOpen, errorMessage }) => {
  const handleClose = () => {
    setOpen(false);
  };

  const formatMessage = (msg: string) => {
    return msg.split("<br>").map((line, index) => (
      <p key={index} className="text-sm">
        {line.trim()}
      </p>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[600px] max-h-[80vh]">
        <ScrollArea className="w-full h-full">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-center">E-Invoice Submission Details</h2>

            <div className="mb-6">
              <h3 className="text-red-600 font-semibold mb-2">Error</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-500 pl-4">
                  {errorMessage && errorMessage.includes("<br>") ? (
                    formatMessage(errorMessage)
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: errorMessage }} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <Button onClick={handleClose} variant="outline" className="hover:bg-erp-blue-10">
                OK
              </Button>
            </div>
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SubmitErrorMessageDialog;