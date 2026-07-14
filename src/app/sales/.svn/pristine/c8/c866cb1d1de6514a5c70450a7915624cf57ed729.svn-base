"use client";

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const SubmitConfirmationDialog = ({ open, setOpen, onConfirm }) => {

  const handleNoClick = () => {
    setOpen(false); // Close the dialog when "No" is clicked
  };

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <div className="flex flex-col items-center justify-center p-6">
            <p className="text-center mb-4">Confirm to Submit?</p>
            <div className="flex gap-4">
              <Button onClick={onConfirm}>Yes</Button>
              <Button onClick={handleNoClick} variant="destructive">No</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  
  export default SubmitConfirmationDialog;