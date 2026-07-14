import React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type SubmissionDetail = {
  UUID: string;
  LongID: string;
  OverallStatus: string;
  ReceivedAt: string;
  Status: string;
  SubmissionUid: string;
  [key: string]: any;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  submissionDetails?: SubmissionDetail[];
};

const GetSubmissionDetails = ({ open, setOpen, submissionDetails = [] }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[600px] max-h-[80vh]">
        <ScrollArea className="w-full h-full">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-center">Submission Details</h2>

            {submissionDetails.length > 0 ? (
              <div className="space-y-3">
                {submissionDetails.map((detail, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 text-sm">
                    <p><strong>UUID:</strong> {detail.UUID}</p>
                    <p><strong>LongID:</strong> {detail.LongID}</p>
                    <p><strong>Overall Status:</strong> {detail.OverallStatus}</p>
                    <p><strong>Status:</strong> {detail.Status}</p>
                    <p><strong>Submission Uid:</strong> {detail.SubmissionUid}</p>
                    <p><strong>Received At:</strong> {detail.ReceivedAt}</p>
                    {detail.RejectedReason && (
                          <p className="text-red-500">
                            <strong>Rejected Reason:</strong> {detail.RejectedReason}
                          </p>
                        )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No submission details available.</p>
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

export default GetSubmissionDetails;