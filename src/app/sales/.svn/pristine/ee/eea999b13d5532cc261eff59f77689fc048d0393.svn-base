import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

const SubmitRejectDialog = ({ open, setOpen, rejectMessage }) => {
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
              <h3 className="text-yellow-600 font-semibold mb-2">Reject</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-yellow-500 pl-4">
                  {rejectMessage && rejectMessage.includes("<br>") ? (
                    formatMessage(rejectMessage)
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: rejectMessage }} />
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

export default SubmitRejectDialog;