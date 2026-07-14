import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type SuccessItem = {
  SubmissionUid: string;
  UUID: string;
  LongID: string;
  OverallStatus: string;
  ReceivedAt: string;
  Status: string;
  RejectedReason?: string;
  [key: string]: any;
};

type SubmissionGroup = {
  docNo?: string;
  Success?: SuccessItem[];
  message?: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  submissionGroups: SubmissionGroup[];
};

const GetCompletionDialog = ({ open, setOpen, submissionGroups }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[600px] max-h-[80vh] p-0">
        <ScrollArea className="max-h-[80vh]">
          <div className="p-4">

            <h2 className="text-lg font-bold mb-4 text-center">Submission Details</h2>

            {submissionGroups.length > 0 ? (
              submissionGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="mb-6">
                  {group.docNo && (
                    <p className="font-semibold mb-2">Document No: {group.docNo}</p>
                  )}

                  {group.Success && group.Success.length > 0 ? (
                    group.Success.map((item, index) => (
                      <div key={index} className="mb-4 border-b pb-3 text-sm pl-4">
                        <p><strong>UUID:</strong> {item.UUID}</p>
                        <p><strong>SubmissionUid:</strong> {item.SubmissionUid}</p>
                        <p><strong>Status:</strong> {item.Status}</p>
                        <p><strong>Overall Status:</strong> {item.OverallStatus}</p>
                        <p><strong>Received At:</strong> {item.ReceivedAt}</p>
                        {item.RejectedReason && (
                          <p className="text-red-500">
                            <strong>Rejected Reason:</strong> {item.RejectedReason}
                          </p>
                        )}
                      </div>
                    ))
                  ) : group.message ? (
                    <p className="text-sm text-center text-red-600 italic">
                      {group.message}
                    </p>
                  ) : (
                    <p className="text-sm text-center">
                      No success data for this document.
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center">No success data available.</p>
            )}

            <div className="flex justify-center mt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="hover:bg-erp-blue-10"
              >
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

export default GetCompletionDialog;