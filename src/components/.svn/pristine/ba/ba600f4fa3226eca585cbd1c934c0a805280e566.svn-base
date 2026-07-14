"use client"

import React, { useState } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CancelEInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string, details?: string) => void;
};

const CANCEL_REASONS = [
  "Wrong buyer details",
  "Wrong Invoice Details",
  "Other"
];

export default function CancelEInvoiceDialog({
  open,
  onOpenChange,
  onConfirm,
}: CancelEInvoiceDialogProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const handleConfirm = () => {
    if (selectedReason) {
      const finalReason = selectedReason === "Other" ? details : selectedReason;
      onConfirm(finalReason, details);
      // Reset form
      setSelectedReason("");
      setDetails("");
    }
  };

  const handleCancel = () => {
    setSelectedReason("");
    setDetails("");
    onOpenChange(false);
  };

  const isOtherSelected = selectedReason === "Other";
  const isConfirmDisabled = !selectedReason || (isOtherSelected && !details.trim());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Document Cancellation</DialogTitle>
        </DialogHeader>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Cancellation</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {CANCEL_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="details">Details (max 60 characters)</Label>
            <Input
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value.slice(0, 60))}
              disabled={!isOtherSelected}
              placeholder={isOtherSelected ? "Enter details..." : ""}
              maxLength={60}
            />
            {isOtherSelected && (
              <p className="text-xs text-muted-foreground">
                {details.length}/60 characters
              </p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex justify-center items-center gap-3 mt-2 !justify-center [&>*]:m-0">
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="h-9 w-24"
          >
            OK
          </Button>
          <Button
            variant="outline"
            onClick={handleCancel}
            className="h-9 w-24"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
