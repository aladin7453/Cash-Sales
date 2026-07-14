"use client";

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import SerialNumberGenerator from "./serialNumberGenerator";

type SerialNumber = {
  id: string;
  serialNumber: string;
  selected: boolean;
  stock: string;
  UUID: string;
};

type SerialNumberPopoverProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedRow: any;
  setTempRowDetailsList: (updater: (prevList: any[]) => any[]) => void;
};

export default function SerialNumberPopover({
  open,
  setOpen,
  selectedRow,
  setTempRowDetailsList,
}: SerialNumberPopoverProps) {
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>([]);
  const [selectedSerialIds, setSelectedSerialIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [generatorDialogOpen, setGeneratorDialogOpen] = useState(false);

  // Store original quantity when dialog opens (before any modifications)
  const [originalQuantity, setOriginalQuantity] = useState<string>("");

  // Initialize serial numbers when dialog opens
  useEffect(() => {
    if (open && selectedRow) {
      // Store the original quantity from the row data - this is the quantity before any serial number modifications
      // If the row has never had serial numbers, use the current quantity as original
      // If the row has had serial numbers before, we need to check if there's a stored original value
      const currentQuantity = selectedRow.original.quantity || "0";

      // Check if this row has an original quantity stored (from previous serial number operations)
      // If not, use the current quantity as the original
      if (!selectedRow.original.originalQuantity) {
        selectedRow.original.originalQuantity = currentQuantity;
      }

      setOriginalQuantity(selectedRow.original.originalQuantity);
      // Initialize with existing serial numbers or empty array
      const existingSerialNumbers = selectedRow.original.serialNumbers || [];
      const initialSerialNumbers = existingSerialNumbers.length > 0
        ? existingSerialNumbers.map((sn: any, index: number) => ({
          id: sn.UUID ? sn.UUID : `serial-${Date.now()}-${index}`,
          serialNumber: sn.serialNumber || "",
          selected: false,
          UUID: sn.UUID || "",
          stock: sn.stock || ""
        }))
        : [];

      setSerialNumbers(initialSerialNumbers);
      setSelectedSerialIds(new Set());
    }
  }, [open, selectedRow]);

  // Check if item supports serial numbers
  const itemSupportsSerialNumbers = selectedRow?.original?.itemSerialNo === "1" || selectedRow?.original?.itemSerialNo === 1;
  const itemName = selectedRow?.original?.itemName || "Unknown Item";

  // Helper function to show unsupported serial number toast
  const showUnsupportedToast = () => {
    toast({
      title: "Serial Number Not Supported",
      description: `Item "${itemName}" does not support serial numbers.`,
      variant: "destructive",
      duration: 4000,
    });
  };

  const addSerialNumber = () => {
    const selectedStock = selectedRow.original.item

    if (!itemSupportsSerialNumbers) {
      showUnsupportedToast();
      return;
    }

    const newSerial: SerialNumber = {
      id: `serial-${Date.now()}-${Math.random()}`,
      serialNumber: "",
      selected: false,
      stock: selectedStock,
      UUID: ""
    };
    setSerialNumbers([...serialNumbers, newSerial]);
  };

  const deleteSelectedSerials = () => {
    if (!itemSupportsSerialNumbers) {
      showUnsupportedToast();
      return;
    }

    const updatedSerials = serialNumbers.filter(serial => !selectedSerialIds.has(serial.id));
    setSerialNumbers(updatedSerials);
    setSelectedSerialIds(new Set());
  };

  const updateSerialNumber = (id: string, newValue: string) => {
    const selectedStock = selectedRow.original.item
    setSerialNumbers(serialNumbers.map(serial =>
      serial.id === id ? { ...serial, serialNumber: newValue, stock: selectedStock, UUID: serial.UUID || "" } : serial
    ));
  };

  // Validate for duplicate serial numbers
  const validateSerialNumber = (id: string, value: string) => {
    if (!value.trim()) return; // Don't validate empty values

    const duplicates = serialNumbers.filter(serial =>
      serial.id !== id && serial.serialNumber.trim() === value.trim()
    );

    if (duplicates.length > 0) {
      toast({
        title: "Duplicate Serial Number",
        description: `Serial number "${value}" already exists.`,
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const toggleSerialSelection = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedSerialIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    setSelectedSerialIds(newSelectedIds);
  };

  const selectAllSerials = (checked: boolean) => {
    if (checked) {
      setSelectedSerialIds(new Set(serialNumbers.map(s => s.id)));
    } else {
      setSelectedSerialIds(new Set());
    }
  };

  const handleSave = () => {
    if (!itemSupportsSerialNumbers) {
      showUnsupportedToast();
      return;
    }

    // Filter out empty serial numbers
    const validSerialNumbers = serialNumbers.filter(serial => serial.serialNumber.trim() !== "");

    // Check for duplicates before saving
    const serialNumberValues = validSerialNumbers.map(sn => sn.serialNumber.trim());
    const duplicates = serialNumberValues.filter((item, index) => serialNumberValues.indexOf(item) !== index);

    if (duplicates.length > 0) {
      toast({
        title: "Duplicate Serial Numbers Found",
        description: `Please remove duplicate serial numbers: ${duplicates.join(", ")}`,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Determine quantity based on serial numbers:
    // - If there are valid serial numbers, use the count
    // - If no serial numbers, restore the original quantity (before any serial number modifications)
    // - If use save with empty serial numbers, it will update quantity to 1
    const finalQuantity = validSerialNumbers.length > 0
      ? validSerialNumbers.length.toString()
      : "1";


    // Update the row data
    setTempRowDetailsList((prevList) =>
      prevList.map((item, idx) => {
        if ((item.UUID && item.UUID === selectedRow.original.UUID) || idx === selectedRow.index) {
          return {
            ...item,
            quantity: finalQuantity,
            serialNumbers: validSerialNumbers.map(sn => ({ serialNumber: sn.serialNumber, stock: sn.stock, UUID: sn.UUID || "" })),
            // Keep the original quantity for future reference
            originalQuantity: originalQuantity
          };
        }
        return item;
      })
    );

    // Update the original row data as well
    if (selectedRow && selectedRow.original) {
      selectedRow.original.quantity = finalQuantity;
      selectedRow.original.serialNumbers = validSerialNumbers.map(sn => ({ serialNumber: sn.serialNumber, stock: sn.stock, UUID: "" }));
      selectedRow.original.originalQuantity = originalQuantity;
    }
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleImport = () => {
    if (!itemSupportsSerialNumbers) {
      showUnsupportedToast();
      return;
    }

    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.txt')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a .txt file.",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      const content = await file.text();

      // Split content by lines and filter out empty lines
      const lines = content
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line !== "");

      if (lines.length === 0) {
        toast({
          title: "Empty File",
          description: "The selected file contains no serial numbers.",
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      // Check for duplicates within the file
      const duplicatesInFile = lines.filter((item, index) => lines.indexOf(item) !== index);
      if (duplicatesInFile.length > 0) {
        toast({
          title: "Duplicates in File",
          description: `The file contains duplicate serial numbers: ${[...new Set(duplicatesInFile)].join(", ")}`,
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      // Check for duplicates with existing serial numbers
      const existingSerialNos = serialNumbers.map(sn => sn.serialNumber.trim());
      const duplicatesWithExisting = lines.filter(line => existingSerialNos.includes(line));
      const selectedStock = selectedRow.original.item

      if (duplicatesWithExisting.length > 0) {
        toast({
          title: "Duplicates Found",
          description: `The following serial numbers already exist: ${duplicatesWithExisting.join(", ")}`,
          variant: "destructive",
          duration: 4000,
        });
        return;
      }

      // Create new serial number entries
      const newSerialNumbers = lines.map((line, index) => ({
        id: `serial-${Date.now()}-import-${index}`,
        serialNumber: line,
        selected: false,
        UUID: "",
        stock: selectedStock
      }));

      // Add to existing serial numbers
      setSerialNumbers([...serialNumbers, ...newSerialNumbers]);

      toast({
        title: "Import Successful",
        description: `Successfully imported ${lines.length} serial numbers.`,
        duration: 4000,
      });

    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGenerate = () => {
    if (!itemSupportsSerialNumbers) {
      showUnsupportedToast();
      return;
    }

    setGeneratorDialogOpen(true);
  };

  const handleGeneratedSerials = (generatedSerials: string[]) => {
    // Check for duplicates with existing serial numbers
    const existingSerialNos = serialNumbers.map(sn => sn.serialNumber.trim());
    const duplicatesWithExisting = generatedSerials.filter(serial => existingSerialNos.includes(serial));
    const selectedStock = selectedRow.original.item

    if (duplicatesWithExisting.length > 0) {
      toast({
        title: "Duplicates Found",
        description: `The following generated serial numbers already exist: ${duplicatesWithExisting.join(", ")}`,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    // Create new serial number entries from generated serials
    const newSerialNumbers = generatedSerials.map((serial, index) => ({
      id: `serial-${Date.now()}-gen-${index}`,
      serialNumber: serial,
      selected: false,
      UUID: "",
      stock: selectedStock
    }));

    // Add to existing serial numbers
    setSerialNumbers([...serialNumbers, ...newSerialNumbers]);
  };

  const allSelected = serialNumbers.length > 0 && selectedSerialIds.size === serialNumbers.length;
  const someSelected = selectedSerialIds.size > 0 && selectedSerialIds.size < serialNumbers.length;
  // For Radix UI checkbox, we'll use a different approach for indeterminate state
  const getCheckboxState = () => {
    if (allSelected) return true;
    if (someSelected) return "indeterminate";
    return false;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            <div className="px-4 text-md">
              <span className="font-medium">Item Name:</span> {selectedRow?.original?.itemName || "N/A"}
              {!itemSupportsSerialNumbers && (
                <span className="ml-2 text-sm text-red-600 font-normal">
                  (Serial numbers not supported)
                </span>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1">
          <div className="p-2 space-y-2">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />

            {/* Serial Numbers Table */}
            <div className="border rounded-lg">
              <div className="flex items-center justify-between p-2 bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={getCheckboxState()}
                    onCheckedChange={selectAllSerials}
                  />
                  <span className="text-sm font-medium">
                    Select All ({serialNumbers.length})
                  </span>
                </div>
              </div>

              <div className="relative">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="w-16">#</TableHead>
                      <TableHead>Serial Number</TableHead>
                    </TableRow>
                  </TableHeader>
                </Table>

                <div className="h-72 overflow-y-auto">
                  <Table>
                    <TableBody>
                      {serialNumbers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                            No data to display
                          </TableCell>
                        </TableRow>
                      ) : (
                        serialNumbers.map((serial, index) => (
                          <TableRow key={serial.id}>
                            <TableCell className="pl-2 w-24">
                              <Checkbox
                                checked={selectedSerialIds.has(serial.id)}
                                onCheckedChange={(checked) =>
                                  toggleSerialSelection(serial.id, checked as boolean)
                                }
                              />
                            </TableCell>
                            <TableCell className="pl-2 w-24 font-mono text-sm">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <Input
                                value={serial.serialNumber}
                                onChange={(e) => updateSerialNumber(serial.id, e.target.value)}
                                onBlur={(e) => validateSerialNumber(serial.id, e.target.value)}
                                placeholder="Enter serial number"
                                className="h-7.5"
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Tools Section */}
              <div className="flex items-center justify-between p-2 bg-gray-50 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSerialNumber}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={deleteSelectedSerials}
                    disabled={selectedSerialIds.size === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleImport}
                    title="Import serial numbers from .txt file"
                  >
                    Import
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerate}
                    title="Generate serial numbers with custom format"
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>

            {/* Summary */}
            <Card>
              <CardContent className="p-2">
                <div className="text-sm">
                  <span className="font-medium">Total Count:</span> {serialNumbers.filter(s => s.serialNumber.trim() !== "").length}
                  <span className="text-gray-500 ml-2">
                    (Quantity will be updated to match this count)
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="border-t p-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-erp-blue-12 hover:bg-erp-blue-14">
            Save & Update Quantity
          </Button>
        </DialogFooter>

        {/* Serial Number Generator Dialog */}
        <SerialNumberGenerator
          open={generatorDialogOpen}
          setOpen={setGeneratorDialogOpen}
          onGenerate={handleGeneratedSerials}
        />
      </DialogContent>
    </Dialog>
  );
}
