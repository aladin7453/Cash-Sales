import React, { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa"; // Upload icon
import { ORIGIN, getAuthHeaders } from "@/lib/constants"; // Adjust as needed
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

type Props<TData> = {
  table: Table<TData>;
  module: string;
  model: string;
  account?: string;
  refreshTable: () => void;
  disabled:boolean;
};

type ThrowData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function UploadButton<TData>({
  table,
  module,
  model,
  account,
  refreshTable,
  disabled
}: Props<TData>) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null); // Store the selected file
  const [uploading, setUploading] = useState(false); // Track uploading status
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null); // Track upload result

  const [openMessageDialog, setOpenMessageDialog] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null);

  // This handler is called when the user selects a file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile); // Store the selected file
      await handleUpload(selectedFile); // Trigger the upload immediately after file selection
    }
  };

  // This function triggers the file upload
  const handleUpload = async (selectedFile: File) => {
    setUploading(true);
    const { id: loadingToastId, dismiss } = showLoadingToast("Uploading data...");
    const headers = getAuthHeaders();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `${ORIGIN}/${module}/api/${module}/upload`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );


      if (!response.ok) {
        const errorData = await response.json();

        toast({
          title: errorData.name,
          description: errorData.message,
          variant: "destructive",
          duration: 5000,
        });

        throw new Error("Failed to upload file");
      }

      const result = await response.json();

      setUploadSuccess(true);

      if (result.message === "Success") {
        toast({
          description: result.message,
          duration: 5000,
        });

        refreshTable();
      } else {
        const cleanMessage = result.message.replace(/<br\s*\/?>/gi, "\n");
        setOpenMessageDialog(true);
        setUploadMessage(cleanMessage);
      }
    } catch (error) {
      setUploadSuccess(false);

      console.error("Error uploading the file:", error);
    } finally {
      setUploading(false);
      dismiss();
      // IMPORTANT:
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div>
      {/* Hidden file input that opens when button is clicked */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange} // Trigger the upload immediately
        accept=".xls,.xlsx,.csv" // Supported file types
        className="hidden"
      />

      {/* Button to trigger file input */}
      <button
        onClick={() => document.querySelector('input[type="file"]')?.click()} // Trigger file input click
        disabled={uploading || disabled}
        className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
      >
        <FaUpload size={24} className="text-erp-blue-11 group-disabled:text-erp-gray-5" />
        <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5" >
          {uploading ? "Uploading..." : "Upload File"}
        </span>
      </button>

      {/* Feedback message */}
      {/* {uploadSuccess !== null && (
        <p>{uploadSuccess ? "Upload successful!" : "Upload failed!"}</p>
      )} */}

      <Dialog
        open={openMessageDialog}
        onOpenChange={setOpenMessageDialog}
      >
        <DialogContent className="max-h-[75vh] min-w-[30vw] max-w-3xl bg-erp-blue-3 p-4">

          <div className="mb-1">
            <h2 className="text-lg font-semibold">
              Message
            </h2>
          </div>

          {/* Scrollable area */}
          <div className="max-h-[40vh] overflow-y-auto pr-2">
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {uploadMessage}
            </p>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setOpenMessageDialog(false)}
            >
              Cancel
            </Button>
          </div>

        </DialogContent>
      </Dialog>
    </div>




  );
}
