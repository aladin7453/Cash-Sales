"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type ConfirmSaveDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  changes: Array<{
    field: string;
    label: string;
    oldValue: any;
    newValue: any;
  }>;
};

export default function ConfirmSaveDialog({
  isOpen,
  onClose,
  onConfirm,
  changes,
}: ConfirmSaveDialogProps) {
  // Fields that represent checkboxes/toggles
  const checkboxFields = [
    "rounding",
    "quotationAutoGenEn",
    "customerCategoryAutoGenEn",
    "customerGroupAutoGenEn",
    "customerTagAutoGenEn",
    "agentTypeAutoGenEn",
    "agentAutoGenEn",
    "customerAutoGenEn",
    "salesOrderAutoGenEn",
    "salesDeliveryOrderAutoGenEn",
    "salesInvoiceAutoGenEn",
    "cashSalesAutoGenEn",
    "salesDebitNoteAutoGenEn",
    "salesCreditNoteAutoGenEn",
    "consolidateInvoiceAutoGenEn",
    "customerPaymentAutoGenEn",
    "salesPurchaseContraAutoGenEn",
  ];

  // Fields that contain HTML content (notes and remarks)
  const htmlFields = [
    "quotationNote",
    "salesOrderNote",
    "salesOrderTnC",
    "salesOrderRemark",
    "salesDeliveryOrderNote",
    "salesInvoiceNote",
    "cashSalesNote",
    "salesDebitNoteNote",
    "salesCreditNoteNote",
    "consolidateInvoiceNote",
    "customerPaymentNote",
  ];

  const convertHtmlToText = (html: string) => {
    if (!html) return "";
    // Replace <br> and <br/> with newlines
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    // Replace <p> with nothing, </p> with newline
    text = text.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n');
    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Replace HTML entities
    text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    
    return text;
  };

  const formatValue = (value: any, fieldName: string) => {
    if (value === null || value === undefined || value === "") {
      return "(Empty)";
    }

    // Handle HTML fields (notes and remarks)
    if (htmlFields.includes(fieldName)) {
      return convertHtmlToText(value.toString());
    }

    // Handle checkbox fields
    if (checkboxFields.includes(fieldName)) {
      return value === "1" || value === 1 ? "Checked" : "Unchecked";
    }

    return value.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Confirm Save Changes</DialogTitle>
          <DialogDescription>
            The following {changes.length} field(s) will be updated. Please review
            the changes before saving.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-96">
          <div className="space-y-2">
            {changes.map((change, index) => (
              <div key={index} className="border rounded p-2 bg-gray-50">
                <div className="font-medium text-sm text-gray-900 mb-1">
                  {change.label}
                </div>
                <div className="grid grid-cols-1 gap-1 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">From:</span>
                    <span className="text-red-600 bg-red-50 px-2 py-1 rounded">
                      {formatValue(change.oldValue, change.field)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-16">To:</span>
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded">
                      {formatValue(change.newValue, change.field)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
