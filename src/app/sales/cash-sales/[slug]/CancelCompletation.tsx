import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  response: { ErrorMessage?: string[]; SuccessMessage?: string[] }[];
};

const CancelCompletionDialog = ({ open, setOpen, response }: Props) => {
  const handleClose = () => setOpen(false);

  // Flatten the lists
  const successMessages = response
    .flatMap((item) => item.SuccessMessage || []);
  const errorMessages = response
    .flatMap((item) => item.ErrorMessage || []);

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
            <h2 className="text-lg font-bold mb-4 text-center">E-Invoice Cancellation Details</h2>

            {successMessages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-green-600 font-semibold mb-2">Success</h3>
                <div className="space-y-3">
                  {successMessages.map((msg, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4 text-sm">
                      <p>{msg}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errorMessages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-red-600 font-semibold mb-2">Errors</h3>
                <div className="space-y-3">
                  {errorMessages.map((msg, idx) => (
                    <div key={idx} className="border-l-4 border-red-500 pl-4">
                      {formatMessage(msg)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {successMessages.length === 0 && errorMessages.length === 0 && (
              <p className="text-center">No cancellation details available.</p>
            )}

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

export default CancelCompletionDialog;
