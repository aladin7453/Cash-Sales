import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import React, { useEffect, useState } from "react";
import useSWRImmutable from "swr/immutable";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import LoadingUI from "../../LoadingUI";

import type { UseFormReturn } from "react-hook-form";

type Props = {
  form: UseFormReturn<any>;
  formData?: any | null;
  previewType?: string | null;
  docType?: string | null;
  reportType?: string | null;
  modelType: string;
  filterFields?: string[] | null;
  sorting?: any | null;
  generatedReport?: any | null;
  setIsAlertOpen?: any | null;
  showPreviewDialog?: boolean | null;
  setShowPreviewDialog?: any | null;
  sortBy?: any | null;
  defaultValue?: any | null;
};

const fetcher = async (url: string) => {
  const headers = getAuthHeaders();

  const res = await fetch(url, { headers });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Session expired");
    } else {
      const error: any = new Error("Failed to fetch data");
      error.status = res.status;
      throw error;
    }
  }

  return res.json();
};

export default function ReportPreviewButton({
  form,
  formData,
  previewType,
  docType,
  reportType,
  modelType,
  filterFields,
  sorting,
  generatedReport,
  setIsAlertOpen,
  showPreviewDialog,
  setShowPreviewDialog,
  sortBy,
  defaultValue,
}: Props) {
  const [isPDFLoading, setIsPDFLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewTemplatePDFData, setPreviewTemplatePDFData] = useState(null);
  const [isPreviewTemplatePDFOpen, setIsPreviewTemplatePDFOpen] = useState(false);
  const [documentType, setDocumentType] = useState("");

  const formatDocType = (docType: string) => {
    return docType.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
  };

  const currentAccount = JSON.parse(localStorage.getItem("currentAccount") || "null");
  const currentCompany = JSON.parse(localStorage.getItem("currentCompany") || "null");

  let username: string = "";
  let authToken: string = "";
  username = JSON.parse(localStorage.getItem("username") || '""');
  authToken = JSON.parse(localStorage.getItem("authToken") || '""');

  const headers = getAuthHeaders();

  const {
    data: documentList,
    error,
    isLoading,
  } = useSWRImmutable(
    currentAccount && currentCompany
      ? `https://1ofis.infollective.com/application/backend/site/api/site/get-update-module-has-template-data?module=${previewType}&account=${currentAccount.account}&company=${currentCompany.UUID}`
      : null,
    fetcher,
    {
      shouldRetryOnError: false,
    },
  );

  useEffect(() => {
    if (isPreviewTemplatePDFOpen && previewTemplatePDFData) {
      setIsPDFLoading(true);
      generatePdf();
    }
  }, [isPreviewTemplatePDFOpen, previewTemplatePDFData]);

  const generatePdf = async () => {
    const blob = new Blob([previewTemplatePDFData], { type: "application/pdf" });
    setPdfUrl(window.URL.createObjectURL(blob));
    setIsPDFLoading(false);
  };

  const previewTemplatePDF = async (documentType: string, documentName: string, data: any) => {
    setDocumentType(documentName);
    setIsPDFLoading(true);

    var form_data = new FormData();

    form_data.append("previewData", JSON.stringify(data));
    form_data.append("UUIDs", "");
    form_data.append("docDate", "");

    const response = await axios.post(
      `https://1ofis.infollective.com/application/backend/site/api/site/preview-pdf?module=${previewType}&account=${currentAccount.account}&company=${currentCompany.UUID}&fileName=${documentType}`,
      form_data,
      {
        method: "GET",
        responseType: "arraybuffer",
        auth: {
          username: username,
          password: authToken,
        },
      },
    );

    setPreviewTemplatePDFData(response.data);
  };

  const previewReport = async (
    docType: string,
    documentType: string,
    documentName: string,
    form: any,
    formData: any,
    defaultValue: any,
  ) => {
    setPdfUrl(null);
    setPreviewTemplatePDFData(null);
    setIsPDFLoading(true);
    setIsPreviewTemplatePDFOpen(true);

    try {
      const allFormValues = form.getValues();

      const filterObject = {};
      filterFields?.forEach((key) => {
        if (allFormValues[key]) {
          if (previewType == "STATEMENT OF ACCOUNT" && key !== "docType") {
            filterObject[key] = allFormValues[key];
          }
        }
      });

      const params = new FormData();

      params.append(
        "param[filter]",
        Object.keys(filterObject).length > 0 ? JSON.stringify(filterObject) : "{}",
      );

      // params.append("param[offset]", ``);

      // params.append("param[limit]", ``);

      params.append("param[sort]", sorting.length > 0 ? sorting[0].id : sortBy ?? "docNo");

      params.append(
        "param[order]",
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
      );

      const validFormValues = form.getValues();

      const validfilterFields = ["valid"];

      const validfilterObject = {};

      validfilterFields.forEach((key) => {
        if (validFormValues[key]) {
          validfilterObject[key] = validFormValues[key];
        }
      });

      if (validFormValues.valid) {
        params.append("param[valid]", validFormValues.valid);
      }

      Object.entries(formData).forEach(([key, value]) => {
        if (value || (defaultValue !== "" && defaultValue === key))
          params.append(`${modelType}[${key}]`, value as string);
      });

      const groupByMatch = documentName.match(/\[(.*?)\]/);

      const toCamelCase = (str: string) => {
        return str
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .split(" ")
          .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
          .join("");
      };

      let groupByFields: string[] = [];

      if (groupByMatch) {
        groupByFields = groupByMatch[1].split(",").map((item) => toCamelCase(item.trim()));
      }

      groupByFields.forEach((field, index) => {
        params.append(`${modelType}[groupBy][${index}]`, field);
      });

      const cleanDocumentName = documentName.replace(/\[.*?\]/, "").trim();

      const hasLevel = cleanDocumentName.includes("Level");
      const hasParentheses = /\(.*?\)/.test(cleanDocumentName);

      const reportName = hasLevel || hasParentheses ? cleanDocumentName.replace(/_/g, "") : null;

      const response = await fetch(
        `${ORIGIN}/universal/report-preview-pdf?docType=${docType}&reportType=${reportType}&reportName=${reportName}&modelType=${modelType}`,
        {
          method: "POST",
          headers,
          body: params,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to preview report");
      }

      const result = await response.json();
      previewTemplatePDF(documentType, documentName, result);
    } catch (error) {
      console.error("Error previewing report:", error);
      setIsPDFLoading(false);
      setIsPreviewTemplatePDFOpen(false);
    }
  };

  const noFilterPreviewTypes = [
    "STATEMENT OF ACCOUNT",
    "SALES ANALYSIS BY DOCUMENT",
    "SALES COLLECTION",
    "CUSTOMER POST DATED CHEQUE",
    "CUSTOMER ANALYSIS BY DOCUMENT",
    "YEARLY SALES ANALYSIS",
    "SUPPLIER BALANCE",
    "PURCHASE OUTSTANDING DOCUMENT LISTING",
    "SUPPLIER DOCUMENT INTER BANK",
    "SUPPLIER BILLS AND PAYMENT",
    "SUPPLIER STATEMENT",
    "SUPPLIER POST DATED CHEQUE"
  ];

  let selectedDocType = docType ? formatDocType(docType) : "";
  const filteredDocumentList = React.useMemo(() => {
    if (!Array.isArray(documentList)) return [];

    const isAllDocType = !docType || docType.trim() === "" || docType.toLowerCase() === "all";

    if (isAllDocType) {
      return documentList;
    }
    if (noFilterPreviewTypes.includes(previewType)) {
      return documentList;
    }
    if(previewType=="CUSTOMER DUE DOCUMENT" && (selectedDocType=="Sales Invoice" || selectedDocType=="Sales Debit Note" )){       
        selectedDocType=selectedDocType.replace("Sales","")
    }
    if(previewType=="SUPPLIER DUE DOCUMENT" && (selectedDocType=="Purchase Invoice" || selectedDocType=="Purchase Debit Note" )){       
        selectedDocType=selectedDocType.replace("Purchase","")
    }
    return documentList.filter((item) =>
      item.fileName.toLowerCase().includes(selectedDocType.toLowerCase()),
    );
  }, [documentList, docType, selectedDocType]);

  return (
    <>
      <AlertDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <AlertDialogTrigger asChild>
          <Button
            className="erp-blue-12 w-28 text-white hover:bg-blue-800"
            onClick={
              generatedReport && generatedReport.length === 0
                ? () => setIsAlertOpen(true)
                : () => setShowPreviewDialog(true)
            }
          >
            Preview
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="w-auto min-w-[600px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Preview - {previewType}</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="mb-4 h-[300px] space-y-1 overflow-auto border border-gray-300 bg-white px-1 py-1">
            {isLoading ? (
              <LoadingUI />
            ) : (
              filteredDocumentList.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    previewReport(
                      docType,
                      item.filePath,
                      item.fileName,
                      form,
                      formData,
                      defaultValue,
                    );
                  }}
                  className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-100"
                >
                  {item.fileName}
                </div>
              ))
            )}
          </div>

          <AlertDialogFooter className="flex justify-end p-4">
            <AlertDialogCancel className="h-9 w-24" onClick={() => setShowPreviewDialog(false)}>
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isPreviewTemplatePDFOpen} onOpenChange={setIsPreviewTemplatePDFOpen}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>
            {documentType} Preview - {previewType}
          </DialogTitle>
          <div className="relative h-[550px] w-full">
            {(isPDFLoading || isPDFLoading) && <LoadingUI />}
            {!isPDFLoading && pdfUrl ? (
              <iframe src={pdfUrl} className="h-full w-full" title="pdf" />
            ) : (
              !isPDFLoading && <LoadingUI />
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setIsPreviewTemplatePDFOpen(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
