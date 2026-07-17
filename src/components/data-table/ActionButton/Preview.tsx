"use client";

import { pdf, PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import useSWRImmutable from "swr/immutable";

import EInvoice from "@/components/eInvoiceTemplate";
import { SVGPreview } from "@/components/icons/svg-repo/SVGPreview";
import PreviewPDFCP from "@/components/previewTemplateCP";
import PreviewPDF2 from "@/components/templates/sales/previewTemplateCP2";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import PreviewPDF from "../../previewTemplate";
import SimplifiedPDF from "../../simplifiedTemplate";
import SimplifiedPDF2 from "../../simplifiedWithHeaderTemplate";
import PreviewNormal2 from "../../templates/sales/previewNormal2";
import PreviewQuotationTemplate from "../../templates/sales/quotationTemplate";
import { getCachedPreferenceData, getOffline, getCachedCurrentCompany } from "@/components/offlineDB";

import type { Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  previewType: string;
  module: string;
  model: string;
  doc_id: string;
  showEInvoiceButton?: boolean;
  isMobile?: boolean;
  isSelectionMode?: boolean;
  data?: any;
  isOfflineRecord?: boolean;
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

const canShowEInvoice = (documentType: string): boolean => {
  const allowedTypes = [
    "SALES INVOICE",
    "SALES CREDIT NOTE",
    "SALES DEBIT NOTE",
    "CONSOLIDATED INVOICE",
    "PURCHASE INVOICE",
    "PURCHASE DEBIT NOTE",
    "PURCHASE CREDIT NOTE",
    "CASH SALES",
  ];

  return allowedTypes.includes(documentType);
};

const canShowProformaInvoice = (documentType: string): boolean => {
  const allowedTypes = ["SALES ORDER"];

  return allowedTypes.includes(documentType);
};

const canShowNormal = (documentType: string): boolean => {
  const allowedTypes = ["CUSTOMER PAYMENT"];

  return allowedTypes.includes(documentType);
};

export default function PreviewButton<TData>({
  table,
  module,
  model,
  doc_id,
  previewType,
  showEInvoiceButton = true,
  isMobile,
  isSelectionMode,
  data,
  isOfflineRecord = false,
}: Props<TData>) {
  const headers = getAuthHeaders();
  const useLocalData = !!data;

  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [showPreviewPDFDialog, setShowPreviewPDFDialog] = useState(false);
  const [showDefault1ItemizedCG, setShowDefault1ItemizedCG] = useState(false);
  const [showEInvoiceDialog, setShowEInvoiceDialog] = useState(false);
  const [showSimplifiedPDFDialog, setShowSimplifiedPDFDialog] = useState(false);
  const [showNormal2Dialog, setShowNormal2Dialog] = useState(false);
  const [showDefault1SummaryCG, setShowDefault1SummaryCG] = useState(false);
  const [showTemplate3Dialog, setShowTemplate3Dialog] = useState(false);
  const [showPreviewNormalPDFDialog, setShowPreviewNormalPDFDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [currentBankAccount, setCurrentBankAccount] = useState(null);
  const [eInvoiceData, setEInvoiceData] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [itemsData, setItemsData] = useState(null);
  const [currentCompanyData, setCurrentCompanyData] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [PDFPreviewType, setPDFPreviewType] = useState<string | null>(null);
  const [eInvoiceStatus, setEInvoiceStatus] = useState(null);
  const [previewTemplatePDFData, setPreviewTemplatePDFData] = useState(null);
  const [isPreviewTemplatePDFOpen, setIsPreviewTemplatePDFOpen] = useState(false);
  const [isPDFLoading, setIsPDFLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [preferenceData, setPreferenceData] = useState<any>(null);

  const [QrCode, setQrCode] = useState(null);
  const [isProformaInvoice, setIsProformaInvoice] = useState(false);
  const isOfflineRef = useRef(!navigator.onLine);

  const [totalVolume, setTotalVolume] = useState<string | null>(null);
  const [totalWeight, setTotalWeight] = useState<string | null>(null);

  // Loading states
  const [isLoadingEInvoice, setIsLoadingEInvoice] = useState(false);
  const [isLoadingPDFPreview, setIsLoadingPDFPreview] = useState(false);
  const [isLoadingSimplifiedPDF, setIsLoadingSimplifiedPDF] = useState(false);
  const [isLoadingTemplate3, setIsLoadingTemplate3] = useState(false);
  const [isLoadingNormal2, setIsLoadingNormal2] = useState(false);

  const { toast } = useToast();

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [offlineData, setOfflineData] = useState<any>(null);

  useEffect(() => {
    const loadOfflineDraft = async () => {
      if (isOfflineRecord && doc_id && !data) {
        const drafts = await getOffline();
        const pendingDraft = drafts.find((item) => item.id === doc_id);
        const cachedCompany = await getCachedCurrentCompany();

        if (pendingDraft) {
          setOfflineData({
            cashSales: pendingDraft.cashSales,
            cashSalesHasDetails: pendingDraft.cashSalesHasDetails,
            currentCompany: cachedCompany,
          });
        }
      }
    };
    loadOfflineDraft();
  }, [doc_id, data, isOfflineRecord]);

  const effectiveData = data ?? offlineData;

  useEffect(() => {
    const loadPreference = async () => {
      if (!navigator.onLine) {
        const cached = await getCachedPreferenceData();
        setPreferenceData(cached?.preference ?? null);
      }
    };
    loadPreference();
  }, []);

  const generateOfflinePDFBlob = async (component: React.ReactElement): Promise<string> => {
    const blob = await pdf(component).toBlob();
    return URL.createObjectURL(blob);
  };

  const currentAccount = JSON.parse(localStorage.getItem("currentAccount") || "null");
  const currentCompany = JSON.parse(localStorage.getItem("currentCompany") || "null");

  let username: string = "";
  let authToken: string = "";
  let loginUser: string = "";
  username = JSON.parse(localStorage.getItem("username") || '""');
  authToken = JSON.parse(localStorage.getItem("authToken") || '""');
  loginUser = JSON.parse(localStorage.getItem("userFullName") || '"');

  var form_data = new FormData();
  const mapSelectedData = table.getSelectedRowModel().rows.map((item) => {
    return item.original.UUID;
  });
  const mapSelectedDocNo = table.getSelectedRowModel().rows.map((item) => {
    return item.original.docNo;
  });
  const mapSelectedCustomerName = table.getSelectedRowModel().rows.map((item) => {
    return item.original.customerName;
  });

  mapSelectedData.forEach((uuid) => {
    form_data.append("UUIDs[]", uuid);
  });

  useEffect(() => {
    const ua = navigator.userAgent || "";

    const hasTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;

    const smallScreen = window.screen.width <= 1280;

    const isDesktopUA = /Windows NT|Macintosh|X11|Linux x86_64/i.test(ua);

    // Treat touch devices with small screens as mobile/POS
    const isMobileOrPOS = hasTouch && smallScreen;

    setIsMobileDevice(isMobileOrPOS);

    // console.log({
    //   ua,
    //   hasTouch,
    //   smallScreen,
    //   isDesktopUA,
    //   isMobileOrPOS,
    //   width: window.screen.width,
    //   height: window.screen.height,
    //   maxTouchPoints: navigator.maxTouchPoints,
    // });
  }, []);

  // const {
  //   data: documentList,
  //   error,
  //   isLoading,
  // } = useSWRImmutable(
  //   currentAccount && currentCompany && !isOfflineRef.current
  //     ? `https://1ofis.infollective.com/application/backend/site/api/site/get-update-module-has-template-data?module=${previewType}&account=${currentAccount?.account}&company=${currentCompany.UUID}`
  //     : null,
  //   fetcher,
  //   {
  //     shouldRetryOnError: false,
  //   },
  // );

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

  const previewTemplatePDF = async (documentType: string, documentName: string) => {
    setPdfUrl(null);
    setPreviewTemplatePDFData(null);
    setDocumentType(documentName);
    setIsPreviewTemplatePDFOpen(true);
    setIsPDFLoading(true);

    var formData = new FormData();

    const previewData = {
      ...data,
      loginUser: loginUser,
    };

    const mapSelectedData = table.getSelectedRowModel().rows.map((item) => {
      return item.original.UUID;
    });

    mapSelectedData.forEach((uuid) => {
      formData.append("UUIDs[]", uuid);
    });
    form_data.append("previewData", JSON.stringify(previewData));
    formData.append("docDate", "");

    const response = await axios.post(
      `https://1ofis.infollective.com/application/backend/site/api/site/preview-pdf?module=${previewType}&account=${currentAccount?.account}&company=${currentCompany.UUID}&fileName=${documentType}`,

      formData,
      {
        method: "GET",
        responseType: "arraybuffer",
        auth: {
          username: username,
          password: authToken,
        },
      },
    );

    if (isMobileDevice) {
      const blob = new Blob([response.data], {
        type: "application/pdf",
      });

      const url = URL.createObjectURL(blob);

      setPdfUrl(url);
      setIsPDFLoading(false);
    } else {
      setPreviewTemplatePDFData(response.data);
    }
  };

  // Add state for description preferences
  const [descriptionPreferences, setDescriptionPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("preview.description.preference");
      return saved
        ? JSON.parse(saved)
        : {
          description: true,
          secondDescription: true,
          moreDescription: true,
        };
    } catch {
      return {
        description: true,
        secondDescription: true,
        moreDescription: true,
      };
    }
  });

  // Add state for agent preferences
  const [agentPreferences, setAgentPreferences] = useState(() => {
    try {
      const saved = localStorage.getItem("preview.agent.preference");
      return saved
        ? JSON.parse(saved)
        : {
          salesAgent: true,
          servicingAgent: true,
          collectionAgent: true,
        };
    } catch {
      return {
        salesAgent: true,
        servicingAgent: true,
        collectionAgent: true,
      };
    }
  });

  // Effect to save default preferences when dialog opens and no preference exists
  useEffect(() => {
    if (showPreviewDialog) {
      const savedDescription = localStorage.getItem("preview.description.preference");
      const savedAgent = localStorage.getItem("preview.agent.preference");

      if (!savedDescription) {
        const defaultPreferences = {
          description: true,
          secondDescription: true,
          moreDescription: true,
        };
        localStorage.setItem("preview.description.preference", JSON.stringify(defaultPreferences));
      }

      if (!savedAgent) {
        const defaultAgentPreferences = {
          salesAgent: true,
          servicingAgent: true,
          collectionAgent: true,
        };
        localStorage.setItem("preview.agent.preference", JSON.stringify(defaultAgentPreferences));
      }
    }
  }, [showPreviewDialog]);

  // Function to handle checkbox changes
  const handlePreferenceChange = (key: string, checked: boolean) => {
    const newPreferences = {
      ...descriptionPreferences,
      [key]: checked,
    };
    setDescriptionPreferences(newPreferences);
    localStorage.setItem("preview.description.preference", JSON.stringify(newPreferences));
  };

  // Function to handle agent checkbox changes
  const handleAgentPreferenceChange = (key: string, checked: boolean) => {
    const newPreferences = {
      ...agentPreferences,
      [key]: checked,
    };
    setAgentPreferences(newPreferences);
    localStorage.setItem("preview.agent.preference", JSON.stringify(newPreferences));
  };

  const displayMessage = (response: any) => {
    if (response.status === 403) {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "You do not have access towards this content.",
      });
    }
  };

  const previewEInvoice = async () => {
    setShowEInvoiceDialog(true);

    if (!navigator.onLine && data) {
      setPDFPreviewType(previewType);
      setPreviewData(data.cashSales);
      setItemsData(data.cashSalesHasDetails);
      setCurrentCompanyData(data.currentCompany ?? JSON.parse(localStorage.getItem("currentCompany") || "null"));
      setCurrentUser(data.currentUser ?? JSON.parse(localStorage.getItem("currentUser") || "null"));
      return;
    }
    setIsLoadingEInvoice(true);
    try {
      const response = await fetch(
        `${module.includes("purchase") || module.includes("supplier")
          ? `${ORIGIN}/${module}/api/${model}/preview-pdf?id=${doc_id}&type=EInvoice`
          : `${ORIGIN}/${module}/api/${model}/preview-pdf?type=EInvoice`
        }`,
        {
          method: "POST",
          headers,
          body: form_data,
        },
      );

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setEInvoiceData(responseData.data);
      setItemsData(responseData.itemsData);
      setQrCode(responseData.qrCode);
      setCurrentCompanyData(responseData.currentCompany);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingEInvoice(false);
    }
  };

  const previewPDFTemplate = async (variant: number) => {
    variant === 1 ? setShowPreviewPDFDialog(true) : setShowDefault1ItemizedCG(true);

    if (!navigator.onLine && data) {
      setPDFPreviewType(previewType);
      setPreviewData(data.cashSales);
      setItemsData(data.cashSalesHasDetails);
      setCurrentCompanyData(data.currentCompany ?? JSON.parse(localStorage.getItem("currentCompany") || "null"));
      setCurrentUser(data.currentUser ?? JSON.parse(localStorage.getItem("currentUser") || "null"));
      return;
    }

    setIsLoadingPDFPreview(true);

    try {
      const response = await fetch(
        // temporarily not enable multiple preview for job and purchase
        `${module.includes("purchase") || module.includes("supplier") ? `${ORIGIN}/${module}/api/${model}/preview-pdf?id=${doc_id}&type=EInvoice` : `${ORIGIN}/${module}/api/${model}/preview-pdf?type=EInvoice`}`,
        {
          method: "POST",
          headers,
          body: form_data,
        },
      );

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType(previewType);
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
      setEInvoiceData(responseData.eInvoiceData);
      setQrCode(responseData.qrCode);
      setEInvoiceStatus(responseData.eInvoiceStatus);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingPDFPreview(false);
    }
  };

  const simplifiedPDFTemplate = async () => {
    setShowSimplifiedPDFDialog(true);

    if (isOfflineRecord && effectiveData) {
      setIsLoadingSimplifiedPDF(true);
      const url = await generateOfflinePDFBlob(
        <SimplifiedPDF
          previewData={effectiveData.cashSales}
          itemsData={effectiveData.cashSalesHasDetails}
          currentCompanyData={effectiveData.currentCompany ?? currentCompany}
          currentUser={{ loginUser }}
          preferenceData={preferenceData}
        />
      );
      setPdfUrl(url);
      setIsLoadingSimplifiedPDF(false);
      return;
    }
    setIsLoadingSimplifiedPDF(true);

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/preview-pdf`, {
        method: "POST",
        headers,
        body: form_data,
      });

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType("Invoice");
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingSimplifiedPDF(false);
    }
  };

  const simplifiedPDFTemplate2 = async () => {
    setShowSimplifiedPDFDialog(true);

    if (isOfflineRecord && effectiveData) {
      setIsLoadingSimplifiedPDF(true);
      const url = await generateOfflinePDFBlob(
        <SimplifiedPDF2
          previewData={effectiveData.cashSales}
          itemsData={effectiveData.cashSalesHasDetails}
          currentCompanyData={effectiveData.currentCompany ?? currentCompany}
          currentUser={{ loginUser }}
          preferenceData={preferenceData}
        />
      );
      setPdfUrl(url);
      setIsLoadingSimplifiedPDF(false);
      return;
    }
    setIsLoadingSimplifiedPDF(true);

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/preview-pdf`, {
        method: "POST",
        headers,
        body: form_data,
      });

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType("Invoice");
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingSimplifiedPDF(false);
    }
  };

  const previewProformaInvoice = async () => {
    setShowPreviewPDFDialog(true);
    setIsProformaInvoice(true);
    setIsLoadingPDFPreview(true);

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/preview-pdf`, {
        method: "POST",
        headers,
        body: form_data,
      });

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType("PROFORMA INVOICE");
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingPDFPreview(false);
    }
  };

  const previewNormal2 = async (variant: number) => {
    variant === 1 ? setShowNormal2Dialog(true) : setShowDefault1SummaryCG(true);

    if (!navigator.onLine && data) {
      setPDFPreviewType(previewType);
      setPreviewData(data.cashSales);
      setItemsData(data.cashSalesHasDetails);
      setCurrentCompanyData(data.currentCompany ?? JSON.parse(localStorage.getItem("currentCompany") || "null"));
      setCurrentUser(data.currentUser ?? JSON.parse(localStorage.getItem("currentUser") || "null"));
      return;
    }
    setIsLoadingNormal2(true);

    try {
      const response = await fetch(
        // temporarily not enable multiple preview for job and purchase
        `${module.includes("purchase") || module.includes("supplier") ? `${ORIGIN}/${module}/api/${model}/preview-pdf?id=${doc_id}&type=EInvoice` : `${ORIGIN}/${module}/api/${model}/preview-pdf?type=EInvoice`}`,
        {
          method: "POST",
          headers,
          body: form_data,
        },
      );

      displayMessage(response);

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType(previewType);
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
      setEInvoiceData(responseData.eInvoiceData);
      setQrCode(responseData.qrCode);
      setEInvoiceStatus(responseData.eInvoiceStatus);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoadingNormal2(false);
    }
  };

  const previewNormalPDFTemplate = async (template = 1) => {
    setSelectedTemplate(template);
    setShowPreviewNormalPDFDialog(true);

    var form_data = new FormData();
    const mapSelectedData = table.getSelectedRowModel().rows.map((item) => {
      return item.original.UUID;
    });

    mapSelectedData.forEach((uuid) => {
      form_data.append("UUIDs[]", uuid);
    });

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/preview-pdf`, {
        method: "POST",
        headers,
        body: form_data,
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      const responseData = await response.json();

      setPDFPreviewType(previewType);
      setPreviewData(responseData.data);
      setItemsData(responseData.itemsData);
      setCurrentCompanyData(responseData.currentCompany);
      setCurrentUser(responseData.currentUser);
      setCurrentBankAccount(responseData.currentBankAccount);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEInvoicePreview = async () => {
    const blob = await pdf(
      <EInvoice
        eInvoiceData={eInvoiceData}
        itemsData={itemsData}
        QrCode={QrCode}
        currentCompanyData={currentCompanyData}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleItemizedPreview = async () => {
    const blob = await pdf(
      <PreviewPDF
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        currentUser={currentUser}
        PDFPreviewType={PDFPreviewType}
        isProformaInvoice={isProformaInvoice}
        descriptionPreferences={descriptionPreferences}
        agentPreferences={agentPreferences}
        QrCode={QrCode}
        eInvoiceData={eInvoiceData}
        showDefault1ItemizedCG={showDefault1ItemizedCG}
        eInvoiceStatus={eInvoiceStatus}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleDefault1ItemizedCGPreview = async () => {
    const blob = await pdf(
      <PreviewPDF
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        currentUser={currentUser}
        PDFPreviewType={PDFPreviewType}
        isProformaInvoice={isProformaInvoice}
        descriptionPreferences={descriptionPreferences}
        agentPreferences={agentPreferences}
        QrCode={QrCode}
        eInvoiceData={eInvoiceData}
        showDefault1ItemizedCG={showDefault1ItemizedCG}
        eInvoiceStatus={eInvoiceStatus}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleItemizedNoCodePreview = async () => {
    const blob = await pdf(
      <PreviewNormal2
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        currentUser={currentUser}
        PDFPreviewType={PDFPreviewType}
        isProformaInvoice={isProformaInvoice}
        descriptionPreferences={descriptionPreferences}
        agentPreferences={agentPreferences}
        QrCode={QrCode}
        eInvoiceData={eInvoiceData}
        showDefault1SummaryCG={showDefault1SummaryCG}
        eInvoiceStatus={eInvoiceStatus}
        removeDisplayUOM={true}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleDefault1SummaryCGPreview = async () => {
    const blob = await pdf(
      <PreviewNormal2
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        currentUser={currentUser}
        PDFPreviewType={PDFPreviewType}
        isProformaInvoice={isProformaInvoice}
        descriptionPreferences={descriptionPreferences}
        agentPreferences={agentPreferences}
        QrCode={QrCode}
        eInvoiceData={eInvoiceData}
        showDefault1SummaryCG={showDefault1SummaryCG}
        eInvoiceStatus={eInvoiceStatus}
        removeDisplayUOM={undefined}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleSimplifiedReceiptPreview = async () => {
    const blob = await pdf(
      <SimplifiedPDF
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        currentUser={currentUser}
        preferenceData={preferenceData}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleItemizedOptionNoCodePreview = async () => {
    const blob = await pdf(
      <PreviewQuotationTemplate
        previewData={previewData}
        itemsData={itemsData}
        currentCompanyData={currentCompanyData}
        descriptionPreferences={descriptionPreferences}
      />,
    ).toBlob();

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  const handleNormalPreview = async () => {
    let blob;

    if (selectedTemplate === 2) {
      blob = await pdf(
        <PreviewPDF2
          previewData={previewData}
          itemsData={itemsData}
          currentCompanyData={currentCompanyData}
          currentUser={currentUser}
          PDFPreviewType={PDFPreviewType}
          currentBankAccount={currentBankAccount}
        />,
      ).toBlob();
    } else {
      blob = await pdf(
        <PreviewPDFCP
          previewData={previewData}
          itemsData={itemsData}
          currentCompanyData={currentCompanyData}
          currentUser={currentUser}
          PDFPreviewType={PDFPreviewType}
          currentBankAccount={currentBankAccount}
        />,
      ).toBlob();
    }

    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  return (
    <>
      <AlertDialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <AlertDialogTrigger asChild>
          <button
            className={
              isMobile
                ? isSelectionMode
                  ? "flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-transparent bg-white text-erp-blue-14 shadow-md transition-all duration-300 ease-in-out"
                  : "flex w-full items-center justify-start gap-2"
                : "group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
            }
            disabled={table.getSelectedRowModel().rows.length < 1}
            onClick={() => setShowPreviewDialog(true)}
          >
            <div
              className={
                isMobile
                  ? "size-4.5 text-erp-blue-11"
                  : "size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5"
              }
            >
              <SVGPreview />
            </div>
            <span
              className={
                isMobile
                  ? isSelectionMode
                    ? "hidden"
                    : "text-[10px]/none font-normal"
                  : "text-[11px]/none font-medium group-disabled:text-erp-gray-5"
              }
            >
              Preview
            </span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-lg rounded-md bg-white p-6">
          <AlertDialogHeader>
            <AlertDialogTitle className="mb-4 text-center text-lg font-semibold">
              Preview - {previewType}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="mb-4 h-[300px] overflow-auto border border-gray-300 bg-white">
            {/* {isLoading ? (
              <LoadingUI />
            ) : currentAccount?.account !== "1_tridentmed" ? (
              (Array.isArray(documentList) ? documentList : []).map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    previewTemplatePDF(item.filePath, item.fileName, "");
                  }}
                  className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-100"
                >
                  {item.fileName}
                </div>
              ))
            ) : null} */}

            {previewType === "CASH SALES" && (
              <div
                onClick={simplifiedPDFTemplate}
                className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-100"
              >
                Simplified
              </div>
            )}

            {previewType === "CASH SALES" && (
              <div
                onClick={simplifiedPDFTemplate2}
                className="cursor-pointer px-3 py-1 text-sm hover:bg-blue-100"
              >
                Simplified With Header
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card collapsible defaultCollapsed={true} className="mb-3">
              <CardHeader>
                <CardTitle className="text-sm">Charges Description Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="description"
                    checked={descriptionPreferences.description}
                    onChange={(e) => handlePreferenceChange("description", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="description" className="cursor-pointer text-sm font-medium">
                    Description
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="secondDescription"
                    checked={descriptionPreferences.secondDescription}
                    onChange={(e) => handlePreferenceChange("secondDescription", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="secondDescription" className="cursor-pointer text-sm font-medium">
                    2nd Description
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="moreDescription"
                    checked={descriptionPreferences.moreDescription}
                    onChange={(e) => handlePreferenceChange("moreDescription", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="moreDescription" className="cursor-pointer text-sm font-medium">
                    More Description
                  </label>
                </div>
              </CardContent>
            </Card>

            <Card collapsible defaultCollapsed={true} className="mb-3">
              <CardHeader>
                <CardTitle className="text-sm">Agent Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="salesAgent"
                    checked={agentPreferences.salesAgent}
                    onChange={(e) => handleAgentPreferenceChange("salesAgent", e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="salesAgent" className="cursor-pointer text-sm font-medium">
                    Sales Agent
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="servicingAgent"
                    checked={agentPreferences.servicingAgent}
                    onChange={(e) =>
                      handleAgentPreferenceChange("servicingAgent", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="servicingAgent" className="cursor-pointer text-sm font-medium">
                    Servicing Agent
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="collectionAgent"
                    checked={agentPreferences.collectionAgent}
                    onChange={(e) =>
                      handleAgentPreferenceChange("collectionAgent", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="collectionAgent" className="cursor-pointer text-sm font-medium">
                    Collection Agent
                  </label>
                </div>
              </CardContent>
            </Card>
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
            {(isLoadingPDFPreview || isPDFLoading) && <LoadingUI />}
            {!isPDFLoading && !isMobileDevice && pdfUrl && (
              <iframe src={pdfUrl} className="h-full w-full" title="pdf" />
            )}

            {!isPDFLoading && isMobileDevice && pdfUrl && (
              <div className="flex h-full items-center justify-center">
                <Button onClick={() => window.open(pdfUrl, "_blank")}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <a
              href={pdfUrl}
              download={`${mapSelectedData.length >= 2 ? documentType : mapSelectedDocNo + "-" + mapSelectedCustomerName || "Document"}.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              Download PDF
            </a>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowItemizedService(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEInvoiceDialog} onOpenChange={setShowEInvoiceDialog}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>E Invoice Preview - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingEInvoice && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <EInvoice
                  eInvoiceData={eInvoiceData}
                  itemsData={itemsData}
                  QrCode={QrCode}
                  currentCompanyData={currentCompanyData}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleEInvoicePreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <EInvoice
                  eInvoiceData={eInvoiceData}
                  itemsData={itemsData}
                  QrCode={QrCode}
                  currentCompanyData={currentCompanyData}
                />
              }
              fileName={`${eInvoiceData?.[0].docNo + "-" + eInvoiceData?.[0].customerName || "Document"}.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowEInvoiceDialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPreviewPDFDialog}
        onOpenChange={(open) => {
          setShowPreviewPDFDialog(open);
          if (!open) setIsProformaInvoice(false);
        }}
      >
        <DialogContent className="max-w-6xl">
          <DialogTitle>Itemized Preview - {PDFPreviewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingPDFPreview && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <PreviewPDF
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1ItemizedCG={showDefault1ItemizedCG}
                  eInvoiceStatus={eInvoiceStatus}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleItemizedPreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <PreviewPDF
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1ItemizedCG={showDefault1ItemizedCG}
                  eInvoiceStatus={eInvoiceStatus}
                />
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowPreviewPDFDialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showDefault1ItemizedCG}
        onOpenChange={(open) => {
          setShowDefault1ItemizedCG(open);
          if (!open) setIsProformaInvoice(false);
        }}
      >
        <DialogContent className="max-w-6xl">
          <DialogTitle>Default 1 (Itemized + CG) Preview - {PDFPreviewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingPDFPreview && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <PreviewPDF
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1ItemizedCG={showDefault1ItemizedCG}
                  eInvoiceStatus={eInvoiceStatus}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleDefault1ItemizedCGPreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <PreviewPDF
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1ItemizedCG={showDefault1ItemizedCG}
                  eInvoiceStatus={eInvoiceStatus}
                />
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowDefault1ItemizedCG(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNormal2Dialog} onOpenChange={setShowNormal2Dialog}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>Itemized + No Code Preview - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingNormal2 && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <PreviewNormal2
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1SummaryCG={showDefault1SummaryCG}
                  eInvoiceStatus={eInvoiceStatus}
                  removeDisplayUOM={true}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleItemizedNoCodePreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <PreviewNormal2
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1SummaryCG={showDefault1SummaryCG}
                  eInvoiceStatus={eInvoiceStatus}
                  removeDisplayUOM={true}
                />
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowNormal2Dialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDefault1SummaryCG} onOpenChange={setShowDefault1SummaryCG}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>Default 1 (Summary + CG) Preview - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingNormal2 && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <PreviewNormal2
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1SummaryCG={showDefault1SummaryCG}
                  eInvoiceStatus={eInvoiceStatus}
                  removeDisplayUOM={undefined}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleDefault1SummaryCGPreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <PreviewNormal2
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  PDFPreviewType={PDFPreviewType}
                  isProformaInvoice={isProformaInvoice}
                  descriptionPreferences={descriptionPreferences}
                  agentPreferences={agentPreferences}
                  QrCode={QrCode}
                  eInvoiceData={eInvoiceData}
                  showDefault1SummaryCG={showDefault1SummaryCG}
                  eInvoiceStatus={eInvoiceStatus}
                  removeDisplayUOM={undefined}
                />
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowDefault1SummaryCG(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showSimplifiedPDFDialog} onOpenChange={setShowSimplifiedPDFDialog}>
        <DialogContent className="max-w-md">
          <DialogTitle>Simplified Receipt - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingSimplifiedPDF && <LoadingUI />}

            {!isLoadingSimplifiedPDF && pdfUrl && (
              isMobileDevice ? (
                <div className="flex h-full items-center justify-center">
                  <Button onClick={() => window.open(pdfUrl, "_blank")}>Open PDF Preview</Button>
                </div>
              ) : (
                <iframe src={pdfUrl} className="h-full w-full" title="pdf" />
              )
            )}

            {!isLoadingSimplifiedPDF && !pdfUrl && previewData && !isMobileDevice && (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <SimplifiedPDF
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  currentUser={currentUser}
                  preferenceData={preferenceData}
                />
              </PDFViewer>
            )}
            {!isLoadingSimplifiedPDF && !pdfUrl && previewData && isMobileDevice && (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleSimplifiedReceiptPreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            {pdfUrl ? (
              <a
                href={pdfUrl}
                download={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"}.pdf`}
                className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
              >
                Download PDF
              </a>
            ) : (
              previewData && (
                <PDFDownloadLink
                  document={
                    <SimplifiedPDF
                      previewData={previewData}
                      itemsData={itemsData}
                      currentCompanyData={currentCompanyData}
                      currentUser={currentUser}
                      preferenceData={preferenceData}
                    />
                  }
                  fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"}.pdf`}
                  className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
                >
                  {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
                </PDFDownloadLink>
              )
            )}
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowSimplifiedPDFDialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog >

      <Dialog open={showTemplate3Dialog} onOpenChange={setShowTemplate3Dialog}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>Itemized Option No Code Preview - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingTemplate3 && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                <PreviewQuotationTemplate
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  descriptionPreferences={descriptionPreferences}
                />
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleItemizedOptionNoCodePreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                <PreviewQuotationTemplate
                  previewData={previewData}
                  itemsData={itemsData}
                  currentCompanyData={currentCompanyData}
                  descriptionPreferences={descriptionPreferences}
                />
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowTemplate3Dialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreviewNormalPDFDialog} onOpenChange={setShowPreviewNormalPDFDialog}>
        <DialogContent className="max-w-6xl">
          <DialogTitle>Preview PDF - {previewType}</DialogTitle>
          <div className="relative h-[550px] w-full">
            {isLoadingPDFPreview && <LoadingUI />}

            {!isMobileDevice ? (
              <PDFViewer width="100%" height="100%" className="absolute inset-0">
                {selectedTemplate === 2 ? (
                  <PreviewPDF2
                    previewData={previewData}
                    itemsData={itemsData}
                    currentCompanyData={currentCompanyData}
                    currentUser={currentUser}
                    PDFPreviewType={PDFPreviewType}
                    currentBankAccount={currentBankAccount}
                  />
                ) : (
                  <PreviewPDFCP
                    previewData={previewData}
                    itemsData={itemsData}
                    currentCompanyData={currentCompanyData}
                    currentUser={currentUser}
                    PDFPreviewType={PDFPreviewType}
                    currentBankAccount={currentBankAccount}
                  />
                )}
              </PDFViewer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Button onClick={handleNormalPreview}>Open PDF Preview</Button>
              </div>
            )}
          </div>
          <DialogFooter className="flex !justify-center gap-x-2">
            <PDFDownloadLink
              document={
                selectedTemplate === 2 ? (
                  <PreviewPDF2
                    previewData={previewData}
                    itemsData={itemsData}
                    currentCompanyData={currentCompanyData}
                    currentUser={currentUser}
                    PDFPreviewType={PDFPreviewType}
                    currentBankAccount={currentBankAccount}
                  />
                ) : (
                  <PreviewPDFCP
                    previewData={previewData}
                    itemsData={itemsData}
                    currentCompanyData={currentCompanyData}
                    currentUser={currentUser}
                    PDFPreviewType={PDFPreviewType}
                    currentBankAccount={currentBankAccount}
                  />
                )
              }
              fileName={`${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.docNo ?? "Document"
                }-${(Array.isArray(previewData) ? previewData?.[0] : previewData)?.customerName ?? ""
                }.pdf`}
              className={cn(buttonVariants({ variant: "default" }), "mt-2 sm:mt-0")}
            >
              {({ loading }) => (loading ? "Preparing..." : "Download PDF")}
            </PDFDownloadLink>
            <DialogClose
              className={cn(buttonVariants({ variant: "outline" }), "mt-2 sm:mt-0")}
              onClick={() => setShowPreviewPDFDialog(false)}
            >
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
