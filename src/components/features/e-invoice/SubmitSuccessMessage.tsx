import React from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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

type SubmissionData = {
  docNo?: string;
  Success?: SuccessItem[];
  message?: string;
};

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  submissionData?: SubmissionData[];
};

const SubmitSuccessMessageDialog = ({ open, setOpen, submissionData = [] }: Props) => {
  const handleClose = () => {
    setOpen(false);
  };

  // Get all submissions without filtering
  const allSubmissions = submissionData
    .filter(group => group.Success && group.Success.length > 0)
    .flatMap(group => 
      group.Success?.map(item => ({ ...item, docNo: group.docNo })) || []
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[600px] max-h-[80vh]">
        <ScrollArea className="w-full h-full">
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4 text-center">E-Invoice Submission Details</h2>

            {allSubmissions.length > 0 && (
              <div className="mb-6">
                <div className="space-y-3">
                  {allSubmissions.map((item, index) => {
                    const isValid = item.Status === 'Valid' || item.OverallStatus === 'Valid';
                    const isInvalid = item.Status === 'Invalid' || item.OverallStatus === 'Invalid';
                    
                    return (
                      <div 
                        key={index} 
                        className={`border-l-4 pl-4 text-sm ${
                          isValid ? 'border-green-500' : 
                          isInvalid ? 'border-red-500' : 
                          'border-yellow-500'
                        }`}
                      >
                        {item.docNo && <p><strong>Document No:</strong> {item.docNo}</p>}
                        <p><strong>UUID:</strong> {item.UUID}</p>
                        <p><strong>SubmissionUid:</strong> {item.SubmissionUid}</p>
                        <p><strong>Status:</strong> 
                          <span className={`ml-1 ${
                            isValid ? 'text-green-600' : 
                            isInvalid ? 'text-red-600' : 
                            'text-yellow-600'
                          }`}>
                            {item.Status}
                          </span>
                        </p>
                        <p><strong>Overall Status:</strong> 
                          <span className={`ml-1 ${
                            isValid ? 'text-green-600' : 
                            isInvalid ? 'text-red-600' : 
                            'text-yellow-600'
                          }`}>
                            {item.OverallStatus}
                          </span>
                        </p>
                        <p><strong>Received At:</strong> {item.ReceivedAt}</p>
                        {item.RejectedReason && (
                          <p><strong>Rejected Reason:</strong> 
                            <span className="text-red-600 ml-1">{item.RejectedReason}</span>
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {allSubmissions.length === 0 && (
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

export default SubmitSuccessMessageDialog;