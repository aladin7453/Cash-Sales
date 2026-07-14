"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type SerialNumberGeneratorProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onGenerate: (serialNumbers: string[]) => void;
};

export default function SerialNumberGenerator({
  open,
  setOpen,
  onGenerate,
}: SerialNumberGeneratorProps) {
  const [format, setFormat] = useState("%.5d");
  const [startFrom, setStartFrom] = useState("1");
  const [count, setCount] = useState("10");
  const [preview, setPreview] = useState("");
  const { toast } = useToast();

  // Generate preview based on current format and start number
  useEffect(() => {
    try {
      const startNumber = parseInt(startFrom) || 1;
      const previewText = generateSerialNumber(format, startNumber);
      setPreview(previewText);
    } catch (error) {
      setPreview("Invalid format");
    }
  }, [format, startFrom]);

  // Function to generate a single serial number based on format
  const generateSerialNumber = (formatStr: string, number: number): string => {
    // Handle format string like %.5d, SD%.3d, etc.
    return formatStr.replace(/%\.(\d+)d/g, (match, digits) => {
      const paddedNumber = number.toString().padStart(parseInt(digits), '0');
      return paddedNumber;
    });
  };

  const handleGenerate = () => {
    const startNumber = parseInt(startFrom);
    const totalCount = parseInt(count);

    // Validation
    if (isNaN(startNumber) || startNumber < 0) {
      toast({
        title: "Invalid Start Number",
        description: "Start number must be a valid positive number.",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(totalCount) || totalCount <= 0 || totalCount > 1000) {
      toast({
        title: "Invalid Count",
        description: "Count must be between 1 and 1000.",
        variant: "destructive",
      });
      return;
    }

    // Validate format string
    if (!format.includes("%.") || !format.includes("d")) {
      toast({
        title: "Invalid Format",
        description: "Format must include %.Nd pattern (e.g., %.5d).",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate serial numbers
      const generatedSerials: string[] = [];
      for (let i = 0; i < totalCount; i++) {
        const serialNumber = generateSerialNumber(format, startNumber + i);
        generatedSerials.push(serialNumber);
      }

      onGenerate(generatedSerials);
      setOpen(false);

      toast({
        title: "Generation Successful",
        description: `Successfully generated ${totalCount} serial numbers.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate serial numbers. Please check your format.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  // Reset to defaults when dialog opens
  useEffect(() => {
    if (open) {
      setFormat("%.5d");
      setStartFrom("1");
      setCount("10");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Stock Serial Number Generator</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Format Field */}
          <div className="space-y-2">
            <Label htmlFor="format">Format</Label>
            <Input
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              placeholder="%.5d"
            />
            <p className="text-xs text-gray-500">
              Use %.Nd pattern where N is the number of digits (e.g., %.5d for 5 digits)
            </p>
          </div>

          {/* Preview */}
          <Card>
            <CardContent className="p-3">
              <div className="text-sm">
                <span className="font-medium">Preview:</span>{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {preview}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Start From Field */}
          <div className="space-y-2">
            <Label htmlFor="startFrom">Start From</Label>
            <Input
              id="startFrom"
              type="number"
              value={startFrom}
              onChange={(e) => setStartFrom(e.target.value)}
              min="0"
            />
          </div>

          {/* Count Field */}
          <div className="space-y-2">
            <Label htmlFor="count">Count</Label>
            <Input
              id="count"
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="1000"
            />
            <p className="text-xs text-gray-500">Maximum 1000 serial numbers</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} className="bg-erp-blue-12 hover:bg-erp-blue-14">
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
