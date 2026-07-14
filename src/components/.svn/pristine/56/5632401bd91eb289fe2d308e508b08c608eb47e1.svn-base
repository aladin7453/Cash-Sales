"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

import { getAuthHeaders } from "@/lib/constants";
import { ChangelogDetail, ChangelogConfig } from "./types";

interface DetailsPopoverProps {
  id: string;
  action: string;
  isOpen: boolean;
  onClose: () => void;
  config: ChangelogConfig;
}

function LoadingDots() {
  const [dots, setDots] = useState(1);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return <span className="text-md font-medium">Loading details{'.'.repeat(dots)}</span>;
}

export default function ChangelogDetailsPopover({
  id,
  action,
  isOpen,
  onClose,
  config,
}: DetailsPopoverProps) {
  const [details, setDetails] = useState<ChangelogDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { fieldNameMapping, fieldsToFilter = [], getDetailsUrl, valueTransformers = {} } = config;

  useEffect(() => {
    if (isOpen && id && action) {
      fetchDetails();
    }
  }, [isOpen, id, action]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = getAuthHeaders();
      
      const url = getDetailsUrl(id, action);
      
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error("Failed to fetch details");
      }

      const data = await response.json();


      // Check various possible data structures
      if (data && data.data && data.data.history && Array.isArray(data.data.history)) {
        setDetails(data.data.history);
      } else if (data && data.history && Array.isArray(data.history)) {
        setDetails(data.history);
      } else if (data && Array.isArray(data)) {
        setDetails(data);
      } else {
        setDetails([]);
      }
    } catch (err) {
      console.error("Error fetching changelog details:", err);
      setError("Could not load details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get display name for field
  const getFieldDisplayName = (fieldName: string): string => {
    return fieldNameMapping[fieldName] || fieldName;
  };

  // Filter only the fields that actually changed and are not in the filter list
  const changedDetails = details.filter(
    (detail) => {
      // Make sure the detail has the expected structure
      if (!detail || typeof detail.field !== 'string') {
        return false;
      }

      // For NEW actions, include fields with non-empty new values
      if (action === "NEW") {
        return detail.newValue !== null && 
               detail.newValue !== "" && 
               !fieldsToFilter.includes(detail.field);
      }
      
      // For EDIT actions, only include fields where values actually changed
      return detail.oldValue !== detail.newValue && 
             !fieldsToFilter.includes(detail.field);
    }
  ).map((detail) => {
    // Apply transformations from valueTransformers config
    if (detail.field && valueTransformers[detail.field]) {
      const transformer = valueTransformers[detail.field];
      
      let transformedOldValue = detail.oldValue;
      let transformedNewValue = detail.newValue;
      
      // Only transform non-null values
      if (detail.oldValue !== null && detail.oldValue !== undefined) {
        try {
          transformedOldValue = transformer(detail.oldValue);
        } catch (error) {
          console.warn(`Error transforming old value for field ${detail.field}:`, error);
          transformedOldValue = detail.oldValue;
        }
      }
      
      if (detail.newValue !== null && detail.newValue !== undefined) {
        try {
          transformedNewValue = transformer(detail.newValue);
        } catch (error) {
          console.warn(`Error transforming new value for field ${detail.field}:`, error);
          transformedNewValue = detail.newValue;
        }
      }
      
      return {
        ...detail,
        oldValue: transformedOldValue !== null && transformedOldValue !== undefined ? 
          String(transformedOldValue) : "-",
        newValue: transformedNewValue !== null && transformedNewValue !== undefined ? 
          String(transformedNewValue) : "-",
      };
    }
    
    // Return original detail with proper null handling
    return {
      ...detail,
      oldValue: detail.oldValue !== null && detail.oldValue !== undefined ? String(detail.oldValue) : "-",
      newValue: detail.newValue !== null && detail.newValue !== undefined ? String(detail.newValue) : "-",
    };
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] flex flex-col max-h-[90vh]">
        <DialogHeader className="sticky top-0 z-10 pb-2 flex flex-row items-center justify-between">
          <DialogTitle>Change Details</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="overflow-y-auto flex-1">
          {loading ? (
            <p className="py-4 text-center"><LoadingDots /></p>
          ) : error ? (
            <p className="py-4 text-center text-red-500">{error}</p>
          ) : details.length === 0 ? (
            <p className="py-4 text-center">No details available</p>
          ) : changedDetails.length === 0 ? (
            <p className="py-4 text-center">No field changes detected</p>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="bg-erp-blue-11 text-white sticky top-0 z-10">
                  <tr>
                    <th className="py-1 px-2 text-left">Field</th>
                    <th className="py-1 px-2 text-left">Old Value</th>
                    <th className="py-1 px-2 text-center w-8"></th>
                    <th className="py-1 px-2 text-left">New Value</th>
                  </tr>
                </thead>
                <tbody className="relative">
                  {changedDetails.map((detail, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-erp-blue-5" : "bg-erp-blue-1"}
                    >
                      <td className="py-1 px-2 font-medium border-r">{getFieldDisplayName(detail.field)}</td>
                      <td className="py-1 px-2 font-medium text-gray-600">
                        {detail.oldValue || "-"}
                      </td>
                      <td className="py-1 px-2 text-center text-gray-500">→</td>
                      <td className="py-1 px-2 font-medium text-green-700">
                        {detail.newValue || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
