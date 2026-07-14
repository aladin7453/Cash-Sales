"use client";

import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus, FaPrint, FaUndo } from "react-icons/fa";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { downloadFilePath } from "@/lib/constants";

type Props = {
  open: boolean;
  setOpen: any;
  quotationData: any;
  previewType: any;
  documentType: any;
};

export default function TemplateViewer({
  open,
  setOpen,
  quotationData,
  previewType,
  documentType,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [zoom, setZoom] = useState(1);
  const [pdfFileName, setPdfFileName] = useState("Quotation");
  const currentAccount = JSON.parse(localStorage.getItem("currentAccount") || "null");
  const currentCompany = JSON.parse(localStorage.getItem("currentCompany") || "null");
  const isReady = currentAccount?.account && currentCompany?.UUID;

  const handleClose = () => setOpen(false);

  const sendViewerMessage = () => {
    if (!iframeRef.current?.contentWindow) return;

    iframeRef.current.contentWindow.postMessage(
      {
        type: "VIEWER_CONTROL",
        payload: {
          quotationData,
          zoom,
        },
      },
      "*",
    );
  };

  const sendViewerCommand = (command: string) => {
    if (!iframeReadyRef.current) {
      console.warn("Iframe not ready");
      return;
    }

    iframeRef.current?.contentWindow?.postMessage({ type: command }, "*");
  };

  const handlePrint = () => {
    sendViewerCommand("PRINT");
  };

  const handleDownload = () => {
    sendViewerCommand("DOWNLOAD_PDF");
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  const iframeReadyRef = useRef(false);

  const handleIframeLoad = () => {
    iframeReadyRef.current = true;
    sendViewerMessage();
  };

  useEffect(() => {
    sendViewerMessage();
  }, [zoom, quotationData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "0") {
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "SET_PDF_FILENAME") {
        setPdfFileName(event.data.payload);
        document.title = event.data.payload;
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[95vh] w-[92vw] max-w-[92vw] flex-col overflow-hidden">
        <div className="w-full border-b bg-white px-4 py-2 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}>
              <FaMinus />
            </button>

            <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>

            <button onClick={() => setZoom((z) => Math.min(2, z + 0.1))}>
              <FaPlus />
            </button>

            <button
              onClick={handleResetZoom}
              className="rounded bg-white px-3 py-1 hover:bg-gray-200"
            >
              <FaUndo />
            </button>

            <button
              onClick={handlePrint}
              className="ml-auto rounded bg-gray-100 px-3 py-1 hover:bg-blue-400"
            >
              <FaPrint />
            </button>
          </div>
        </div>

        <div className="h-0 w-full flex-1 overflow-auto bg-black">
          {isReady && (
            <iframe
              ref={iframeRef}
              src={`${downloadFilePath}/${currentAccount.account}/${currentCompany.UUID}/${previewType}/${documentType}`}
              className="h-full w-full border-none"
              onLoad={handleIframeLoad}
            />
          )}
        </div>

        <div className="mt-auto flex w-full items-center justify-center gap-4 border-t bg-white px-4 py-3 shadow-md">
          <button
            onClick={handleDownload}
            className="rounded bg-blue-400 px-5 py-2 text-white transition hover:bg-blue-200"
          >
            Download PDF
          </button>

          <button
            onClick={handleClose}
            className="rounded border px-5 py-2 transition hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
