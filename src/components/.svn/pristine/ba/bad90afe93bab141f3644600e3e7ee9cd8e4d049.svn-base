"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaQrcode } from "react-icons/fa";
import { MdPriceChange } from "react-icons/md";
import { MdLabel } from "react-icons/md"; // <-- Add this for the new icon
import { IoSettingsOutline } from "react-icons/io5";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { SVGPreview } from "@/components/icons/svg-repo/SVGPreview";
import { SVGPreferencePrint } from "@/components/icons/svg-repo/SVGPreferencePrint";
import StockPreferencePopover from "@/app/stock/stock/[slug]/preference/StockPreferencePopover";
import { useStockPreferencePopoverState } from "./useStockPreferencePopoverState";
import SaveButton from "@/components/form/ActionButton/Save";
import CancelButton from "@/components/form/ActionButton/Cancel";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

import type { Dispatch, SetStateAction } from "react";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  row?: any;
  uomOptions: {
    UOM: string;
    StockUOMUUID: string;
    baseUOM: string;
    barcode: string;
    price: string;
    stockCode: string;
    stockName: string;
    description: string;
    stockSecondDescription: string;
    stockMoreDescription: string;
    hasBarcode?: boolean;
  }[];
};

const stockUOMDetailsFormSchema = z.object({
  UOM: z.string().optional(),
});

export default function PrintPopover({ open, setOpen, row, uomOptions }: Props) {
  // State for StockPreferencePopover
  const {
    open: stockPrefOpen,
    setOpen: setStockPrefOpen,
    tempStockPreferences,
    setTempStockPreferences,
  } = useStockPreferencePopoverState();

  // Example onSubmit handler for StockPreferencePopover
  const handleStockPrefSubmit = (data: any) => {
    setTempStockPreferences(data);
    setStockPrefOpen(false);
    // You can add logic to persist preferences if needed
  };

  const { toast } = useToast();

  const [selectedStockCode, setSelectedStockCode] = useState("");
  const [selectedUOM, setSelectedUOM] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedBarcode, setSelectedBarcode] = useState("");

  const form = useForm<z.infer<typeof stockUOMDetailsFormSchema>>({
    resolver: zodResolver(stockUOMDetailsFormSchema),
    defaultValues: {
      UOM: "",
    },
  });

  const headers = getAuthHeaders();


  const PREFERENCE_STORAGE_KEY = "printBarcodePreferences";
  const [titleDisplayPreference, setTitleDisplayPreference] = useState("Show");
  const [titlePreference, setTitlePreference] = useState("Stock Name");
  const [barcodeDisplayPreference, setBarcodeDisplayPreference] = useState("Show");
  const [barcodePreference, setBarcodePreference] = useState("UOM Barcode");
  const [barcodeDescriptionDisplayPreference, setBarcodeDescriptionDisplayPreference] = useState("Show");
  const [barcodeDescriptionPreference, setBarcodeDescriptionPreference] = useState("UOM Barcode");
  const [referencePriceDisplayPreference, setReferencePriceDisplayPreference] = useState("Show");
  const [referencePricePreference, setReferencePricePreference] = useState("With UOM");
  const [labelType, setLabelType] = useState("barcode");

  // Helper to reload preferences from localStorage
  const loadPreferencesFromStorage = () => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences);
      if (parsedPreferences.titleDisplayPreference) {
        setTitleDisplayPreference(parsedPreferences.titleDisplayPreference);
      }
      if (parsedPreferences.titlePreference) {
        setTitlePreference(parsedPreferences.titlePreference);
      }
      if (parsedPreferences.barcodeDisplayPreference) {
        setBarcodeDisplayPreference(parsedPreferences.barcodeDisplayPreference);
      }
      if (parsedPreferences.barcodePreference) {
        setBarcodePreference(parsedPreferences.barcodePreference);
      }
      if (parsedPreferences.barcodeDescriptionDisplayPreference) {
        setBarcodeDescriptionDisplayPreference(parsedPreferences.barcodeDescriptionDisplayPreference);
      }
      if (parsedPreferences.barcodeDescriptionPreference) {
        setBarcodeDescriptionPreference(parsedPreferences.barcodeDescriptionPreference);
      }
      if (parsedPreferences.referencePriceDisplayPreference) {
        setReferencePriceDisplayPreference(parsedPreferences.referencePriceDisplayPreference);
      }
      if (parsedPreferences.referencePricePreference) {
        setReferencePricePreference(parsedPreferences.referencePricePreference);
      }
    }
  };

  useEffect(() => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);

    if (storedPreferences) {
      const parsedPreferences = JSON.parse(storedPreferences);
      
      if (parsedPreferences.titleDisplayPreference) {
        setTitleDisplayPreference(parsedPreferences.titleDisplayPreference);
      }
      if (parsedPreferences.titlePreference) {
        setTitlePreference(parsedPreferences.titlePreference);
      }
      if (parsedPreferences.barcodeDisplayPreference) {
        setBarcodeDisplayPreference(parsedPreferences.barcodeDisplayPreference);
      }
      if (parsedPreferences.barcodePreference) {
        setBarcodePreference(parsedPreferences.barcodePreference);
      }
      if (parsedPreferences.barcodeDescriptionDisplayPreference) {
        setBarcodeDescriptionDisplayPreference(parsedPreferences.barcodeDescriptionDisplayPreference);
      }
      if (parsedPreferences.barcodeDescriptionPreference) {
        setBarcodeDescriptionPreference(parsedPreferences.barcodeDescriptionPreference);
      }
      if (parsedPreferences.referencePriceDisplayPreference) {
        setReferencePriceDisplayPreference(parsedPreferences.referencePriceDisplayPreference);
      }
      if (parsedPreferences.referencePricePreference) {
        setReferencePricePreference(parsedPreferences.referencePricePreference);
      }
    }
  }, [open, row, form]);

  // Update displayed values when UOM selection changes
  const handleUOMChange = (selectedUUID: string) => {
    const selectedUOMData = uomOptions.find((uom) => uom.StockUOMUUID === selectedUUID);
    if (selectedUOMData) {
      setSelectedStockCode(selectedUOMData.stockCode);
      setSelectedUOM(selectedUOMData.UOM);
      setSelectedPrice(selectedUOMData.price);
      setSelectedBarcode(selectedUOMData.barcode);
      form.setValue("UOM", selectedUUID); // Ensure form updates
    }
  };


  // --- New function for Price Tag printing ---
  const handlePriceTagPrint = (uomData) => {
    // Always get preferences directly from localStorage
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDisplayPreference = prefs.barcodeDisplayPreference || "Show";
    const barcodePreference = prefs.barcodePreference || "UOM Barcode";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";

    if (!uomData.barcode) {
      toast({
        title: "Missing Barcode",
        description: `No barcode found for UOM "${uomData.UOM}". Please add a barcode to this UOM before printing.`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Section 1: Title
    let title = "";
    if (titleDisplayPreference === "Show") {
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    }

    // Section 2: Barcode Description
    let barcodeDescription = "";
    if (barcodeDescriptionDisplayPreference === "Show") {
      if (barcodeDescriptionPreference === "UOM Barcode") {
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    }

    // Section 3: Reference Price
    let price = "";
    if (referencePriceDisplayPreference === "Show") {
      if (referencePricePreference === "With UOM") {
        price = `RM${uomData.price}/${uomData.UOM}`;
      } else {
        price = `RM${uomData.price}`;
      }
    }

    // Section 4: Barcode (always at the bottom)
    let barcode = "";
    let displayValue = true;

    if (barcodeDisplayPreference === "Show") {
      if (barcodePreference === "UOM Barcode") {
        barcode = uomData.barcode;
      } else if (barcodePreference === "Stock Code") {
        barcode = uomData.stockCode;
      }
    } else {
      displayValue = false;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print {
              @page {
                size: 9cm 8cm;
                margin: 0;
                orientation: landscape;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              width: 9cm;
              height: 8cm;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              align-items: flex-end; /* Align to the right */
              justify-content: flex-start;
              direction: rtl; /* Right-to-left layout */
              background: #fff;
            }
              .pricetag-container {
                width: 8.8cm;
                height: 7.8cm;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding: 0.2cm 0.2cm 0.2cm 0.2cm;
                box-sizing: border-box;
                border: 1px solid #eee;
              }
              .pricetag-title {
                font-size: 30px;
                font-weight: bold;
                color: #222;
                margin-bottom: 0.1cm;
                text-align: center;
                width: 100%;
                word-break: break-word;

                line-height: 1.2em;
                max-height: 2.4em; /* 2 lines max */
                overflow: hidden;
              }
              .pricetag-barcode-description {
                font-size: 28px;
                color: #333;
                margin-bottom: 0cm;
                text-align: center;
                width: 100%;
                word-break: break-word;
              }
              .pricetag-price {
                font-size: 30px;
                font-weight: bold;
                color:rgb(11, 11, 11);
                margin-bottom: 0cm;
                justify-content: center;
                text-align: center;
                width: 100%;
                overflow: hidden;
              }
              .pricetag-barcode {
                width: 8cm;
                height: 2.5cm;
                display: flex;
                justify-content: center;
                align-items: flex-end;
                margin-bottom: 0.4cm;
                
              }
              #barcode-img {
                width: 8cm;
                height: 2.5cm;
                object-fit: contain;
              }
            </style>
          </head>
          <body>
            <div class="pricetag-container">
              <div class="pricetag-title">${title}</div>
              <div class="pricetag-barcode-description">${barcodeDescription}</div>
              <div class="pricetag-price">${price}</div>
              <div class="pricetag-barcode">
                ${barcode ? `<img id="barcode-img" />` : ""}
              </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script>
              const canvas = document.createElement('canvas');
              canvas.width = 800;
              canvas.height = 250;
              JsBarcode(canvas, "${barcode}", {
                displayValue: ${displayValue},
                text: "${barcodeDescription}",
                fontSize: 40,
                height: 220,
                width: 6,
                margin: 0,
              });
              document.getElementById('barcode-img').src = canvas.toDataURL('image/png');
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // --- New function for Price Tag 2 printing (no barcode) ---
  const handlePriceTag2Print = (uomData) => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";
    // Section 1: Title
    let title = "";
    if (titleDisplayPreference === "Show") {
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    }

    // Section 2: Barcode Description (not shown in this template)
    let barcodeDescription = "";
    if (barcodeDescriptionDisplayPreference === "Show") {
      if (barcodeDescriptionPreference === "UOM Barcode") {
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    }
    // Section 3: Reference Price
    let price = "";
    if (referencePriceDisplayPreference === "Show") {
      if (referencePricePreference === "With UOM") {
        price = `RM${uomData.price}/${uomData.UOM}`;
      } else {
        price = `RM${uomData.price}`;
      }
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
            @page {
              size: 9cm 8cm;
              margin: 0;
              orientation: landscape;
            }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 9cm;
            height: 8cm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: flex-end; /* Align to the right */
            justify-content: flex-start;
            direction: rtl; /* Right-to-left layout */
            background: #fff;
          }
            .pricetag-container {
              width: 8.8cm;
              height: 7.8cm;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              align-items: center;
              padding: 0.5cm 0.2cm 0.2cm 0.2cm;
              box-sizing: border-box;
              border: 1px solid #eee;
              position: relative;
            }
            .pricetag-title-spacer {
              height: 2.2cm; /* Reserve space for title */
              width: 100%;
              flex-shrink: 0;
            }
            .pricetag-title {
              font-size: 30px;
              font-weight: bold;
              color: #222;
              margin-bottom: 0.1cm;
              text-align: center;
              width: 100%;
              word-break: break-word;
              line-height: 1.2em;
              max-height: 3.6em;
              overflow: hidden;
              position: absolute;
              top: 0.7cm;
              left: 0;
              right: 0;
            }
            .pricetag-barcode-description {
              font-size: 28px;
              color: #333;
              margin-bottom: 0.3cm;
              text-align: center;
              width: 100%;
              word-break: break-word;
            }
            .pricetag-price {
              font-size: 30px;
              font-weight: bold;
              color:rgb(11, 11, 11);
              margin-bottom: 0.5cm;
              justify-content: center;
              text-align: center;
              width: 100%;
              overflow: hidden;
            }
          </style>
        </head>
        <body>
          <div class="pricetag-container">
            <div class="pricetag-title">${title}</div>
            <div style="margin-top:auto;"></div>
            <div class="pricetag-barcode-description">${barcodeDescription}</div>
            <div class="pricetag-price">${price}</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = function () {
      printWindow.print();
      printWindow.close();
    };
  } else {
    toast({
      title: "Error",
      description: "Unable to open print window. Please check your browser settings.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

  // --- New function for Price Tag 3 printing (portrait 5cm x 3cm) ---
  const handlePriceTag3Print = (uomData) => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDisplayPreference = prefs.barcodeDisplayPreference || "Show";
    const barcodePreference = prefs.barcodePreference || "UOM Barcode";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";
    if (!uomData.barcode) {
      toast({
        title: "Missing Barcode", 
        description: `No barcode found for UOM "${uomData.UOM}". Please add a barcode to this UOM before printing.`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Section 1: Title
    let title = "";
    if (titleDisplayPreference === "Show") {
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    }

    // Section 2: Barcode Description
    let barcodeDescription = "";
    if (barcodeDescriptionDisplayPreference === "Show") {
      if (barcodeDescriptionPreference === "UOM Barcode") {
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    }

    // Section 3: Reference Price
    let price = "";
    if (referencePriceDisplayPreference === "Show") {
      if (referencePricePreference === "With UOM") {
        price = `RM${uomData.price}/${uomData.UOM}`;
      } else {
        price = `RM${uomData.price}`;
      }
    }

    // Section 4: Barcode (always at the bottom)
    let barcode = "";
    let displayValue = true;

    if (barcodeDisplayPreference === "Show") {
      if (barcodePreference === "UOM Barcode") {
        barcode = uomData.barcode;
      } else if (barcodePreference === "Stock Code") {
        barcode = uomData.stockCode;
      }
    } else {
      displayValue = false;
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
        <head>
          <style>
            @media print {
              @page {
                size: 4cm 5cm;
                margin: 0;
                justify-content: space-between;
              }
            }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                width: 5cm;
                height: 4cm;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                background: #fff;
              }
              .pricetag3-container {
                width: 4.9cm;
                height: 3.9cm;
                border: 1px solid #eee;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 0.1cm 0.15cm 0.1cm 0.15cm;
                }
              .pricetag3-title {
                font-size: 16px;
                font-weight: bold;
                color: #222;
                margin-bottom: 0cm;
                text-align: center;
                width: 100%;
                word-break: break-word;
                line-height: 1.1em;
                max-height: 2.2em;
                overflow: hidden;
              }
              .pricetag3-barcode-description {
                font-size: 15px;
                color: #333;
                margin-bottom: 0.1cm;
                text-align: center;
                width: 100%;
                word-break: break-word;
              }
              .pricetag3-price {
                font-size: 18px;
                font-weight: bold;
                color:rgb(11, 11, 11);
                margin-bottom: 0.1cm;
                justify-content: center;
                text-align: center;
                width: 100%;
                overflow: hidden;
              }
              .pricetag3-barcode {
                width: 4.5cm;
                height: 1cm;
                display: flex;
                justify-content: center;
                align-items: flex-end;
              }
              #barcode-img3 {
                width: 4.3cm;
                height: 1cm;
              }
            </style>
          </head>
          <body>
            <div class="pricetag3-container">
              <div class="pricetag3-title">${title}</div>
              <div class="pricetag3-barcode-description">${barcodeDescription}</div>
              <div class="pricetag3-price">${price}</div>
              <div class="pricetag3-barcode">
                ${barcode ? `<img id="barcode-img3" />` : ""}
              </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script>
              const canvas = document.createElement('canvas');
              canvas.width = 430;
              canvas.height = 100;
              JsBarcode(canvas, "${barcode}", {
                displayValue: ${displayValue},
                text: "${barcodeDescription}",
                fontSize: 18,
                height: 90,
                width: 2,
                margin: 0,
              });
              document.getElementById('barcode-img3').src = canvas.toDataURL('image/png');
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // --- New function for Price Tag 4 printing (non-member tag) ---
  const handlePriceTag4Print = (uomData) => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDisplayPreference = prefs.barcodeDisplayPreference || "Show";
    const barcodePreference = prefs.barcodePreference || "UOM Barcode";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";
    if (!uomData.barcode) {
      toast({
        title: "Missing Barcode",
        description: `No barcode found for UOM "${uomData.UOM}". Please add a barcode to this UOM before printing.`,
        variant: "destructive", 
        duration: 5000,
      });
      return;
    }

    // Section 1: Title
    let title = "";
    if (titleDisplayPreference === "Show") {
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    }

    // Section 2: Barcode Description
    let barcodeDescription = "";
    if (barcodeDescriptionDisplayPreference === "Show") {
      if (barcodeDescriptionPreference === "UOM Barcode") {
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    }

    // Section 3: Reference Price
    let price = "";
    if (referencePriceDisplayPreference === "Show") {
      if (referencePricePreference === "With UOM") {
        price = `RM${uomData.price}`;
      } else {
        price = `RM${uomData.price}`;
      }
    }

    // Section 4: Barcode (always at the bottom)
    let barcode = "";
    let displayValue = true;
    if (barcodeDisplayPreference === "Show") {
      if (barcodePreference === "UOM Barcode") {
        barcode = uomData.barcode;
      } else if (barcodePreference === "Stock Code") {
        barcode = uomData.stockCode;
      }
    } else {
      displayValue = false;
    }
    const Moredescription = uomData.stockMoreDescription || "";
    const [mainPrice, decimalPrice = "00"] = price.replace("RM", "").split(/[.,]/);

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      const showUOMAboveBarcode = referencePricePreference === "With UOM";
      const uomLabel = uomData.UOM || "";

      printWindow.document.write(`
      <html>
        <head>
          <style>
            @media print {
            @page {
              size: 4cm 5cm;
              margin: 0;
              justify-content: space-between;
            }
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 5cm;
            height: 4cm;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            background: #fff;
          }
            .pricetag4-container {
              width: 4.9cm;
              height: 3.9cm;
              border: 1px solid #eee;
              box-sizing: border-box;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 0.1cm 0.15cm 0cm 0.15cm;
            }
            .pricetag4-header {
              text-align: center;
              width: 100%;
            }
            .pricetag4-stockname {
              font-size: 14px;
              font-weight: bold;
              color: #222;
              line-height: 1.1em;
              max-height: 2.2em;
              overflow: hidden;
              white-space: normal;
            }
            .pricetag4-description {
              font-size: 10px;
              color: #444;
              margin-top: 0.01cm;
              line-height: 1.1em;
              max-height: 2.2em;
              overflow: hidden;
              white-space: normal;
            }
            .pricetag4-row {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              width: 100%;
              margin: 0.15cm 0 0.1cm 0;
            }
            .pricetag4-nonmember-col {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              padding-right: 0.15cm;
              min-width: 0; 
              flex-shrink: 0;
            }
            .pricetag4-nonmember-label {
              font-size: 8px;
              font-weight: bold;
              color: #222;
              margin-bottom: 0.05cm;
            }
            .pricetag4-member-col {
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              justify-content: flex-start;
              border: 1.5px solid #222;
              border-radius: 0.18cm;
              padding: 0.08cm 0.18cm 0cm 0.18cm;
              margin-left: 0.15cm;
            }
            .pricetag4-member-label {
              font-size: 8px;
              font-weight: bold;
              color: #222;
              margin-bottom: 0.05cm;
            }
            .pricetag4-price {
              display: flex;
              align-items: flex-end;
              font-weight: bold;
              color: #111;
            }
            .pricetag4-price-rm {
              font-size: 11px;
              font-weight: bold;
              margin-right: 2px;
              line-height: 1.2;
              vertical-align: bottom;
            }
            .pricetag4-price-main {
              font-size: 25px;
              font-weight: bold;
              line-height: 1;
            }
            .pricetag4-price-decimal {
              font-size: 11px;
              font-weight: bold;
              margin-left: 2px;
              line-height: 1.2;
              vertical-align: bottom;
            }
            .pricetag4-barcode-row {
              display: flex;
              flex-direction: row;
              align-items: flex-end;
              width: 100%;
              margin-bottom: 0.2cm;
            }
            .pricetag4-barcode {
              width: 2.5cm;
              height: 0.65cm;
              display: flex;
              margin-top: 0.2cm;
              align-items: flex-end;
            }
            #barcode-img4 {
              width: 2.5cm;
              height: 0.9cm;
              object-fit: contain;
            }
            .pricetag4-stockcode {
              font-size: 9px;
              color: #333;
              font-weight: bold;
              margin-left: 0.2cm;
              margin-bottom: 0.1cm;
              align-self: flex-end;
              white-space: nowrap;
              max-width: 2cm;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .pricetag4-uom-above-barcode {
              font-size: 6px;
              font-weight: bold;
              color: #222;
              text-align: left;
              margin-bottom: 0.01cm;
              margin-top: 0cm;
              width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="pricetag4-container">
            <div class="pricetag4-header">
              <div class="pricetag4-stockname">${title}</div>
              <div class="pricetag4-description">${Moredescription}</div>
            </div>
            <div class="pricetag4-row">
              <div class="pricetag4-nonmember-col">
                <div class="pricetag4-nonmember-label">NON-MEMBER:</div>
                <div class="pricetag4-price" style="white-space:nowrap;">
                  <span class="pricetag4-price-rm">RM</span>
                  <span class="pricetag4-price-main">${mainPrice}</span>
                  <span class="pricetag4-price-decimal">.${decimalPrice}</span>
                </div>
              </div>
              <div class="pricetag4-member-col">
                <div class="pricetag4-member-label">MEMBER:</div>
                <div class="pricetag4-price">
                  <span class="pricetag4-price-rm">RM</span>
                  <span class="pricetag4-price-main">${mainPrice}</span>
                  <span class="pricetag4-price-decimal">.${decimalPrice}</span>
                </div>
              </div>
            </div>
            ${showUOMAboveBarcode ? `<div class="pricetag4-uom-above-barcode">${uomLabel}</div>` : ""}
            <div class="pricetag4-barcode-row">
              <div class="pricetag4-barcode">
                <img id="barcode-img4" />
              </div>
              <div class="pricetag4-stockcode">${barcodeDescription}</div>
            </div>
          </div>
          <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
          <script>
            const canvas = document.createElement('canvas');
            canvas.width = 250;
            canvas.height = 65;
            JsBarcode(canvas, "${barcode}", {
              displayValue: false,
              fontSize: 12,
              height: 80,
              width: 2,
              margin: 0,
            });
            document.getElementById('barcode-img4').src = canvas.toDataURL('image/png');
          </script>
        </body>
      </html>
    `);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // --- Generic function for Price Tag 4 with custom size ---
  const handlePriceTag4CustomSizePrint = (uomData, size: "half_a4" | "full_a4") => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDisplayPreference = prefs.barcodeDisplayPreference || "Show";
    const barcodePreference = prefs.barcodePreference || "UOM Barcode";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";
    if (!uomData.barcode) {
      toast({
        title: "Missing Barcode",
        description: `No barcode found for UOM "${uomData.UOM}". Please add a barcode to this UOM before printing.`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Section 1: Title
    let title = "";
    if (titleDisplayPreference === "Show") {
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    }

    // Section 2: Barcode Description
    let barcodeDescription = "";
    if (barcodeDescriptionDisplayPreference === "Show") {
      if (barcodeDescriptionPreference === "UOM Barcode") {
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    }

    // Section 3: Reference Price
    let price = "";
    if (referencePriceDisplayPreference === "Show") {
      if (referencePricePreference === "With UOM") {
        price = `RM${uomData.price}`;
      } else {
        price = `RM${uomData.price}`;
      }
    }

    // Section 4: Barcode (always at the bottom)
    let barcode = "";
    let displayValue = true;
    if (barcodeDisplayPreference === "Show") {
      if (barcodePreference === "UOM Barcode") {
        barcode = uomData.barcode;
      } else if (barcodePreference === "Stock Code") {
        barcode = uomData.stockCode;
      }
    } else {
      displayValue = false;
    }
    const Moredescription = uomData.stockMoreDescription || "";
    const [mainPrice, decimalPrice = "00"] = price.replace("RM", "").split(/[.,]/);

    // Set size
    let pageStyle = "";
    let containerStyle = "";
    let barcodeImgStyle = "";
    let barcodeCanvasWidth = 900; // 9cm in px (100px/cm)
    let barcodeCanvasHeight = 300; // 3cm in px
    let barcodeFontSize = 120;
    let barcodeHeight = 250;
    let barcodeWidth = 8;
    if (size === "half_a4") {
      pageStyle = `
        @page { size: 148mm 210mm; margin: 0; }
        body { width: 210mm; height: 148mm; }
      `;
      containerStyle = "width: 208mm; height: 146mm;";
      barcodeImgStyle = "width: 9cm; height: 3cm;";
      barcodeCanvasWidth = 900;
      barcodeCanvasHeight = 300;
      barcodeFontSize = 120;
      barcodeHeight = 250;
      barcodeWidth = 8;
    } else if (size === "full_a4") {
      pageStyle = `
        @page { size: 297mm 210mm; margin: 0; }
        body { width: 297mm; height: 210mm; }
      `;
      containerStyle = "width: 295mm; height: 208mm;";
      barcodeImgStyle = "width: 14cm; height: 4cm;";
      barcodeCanvasWidth = 1400;
      barcodeCanvasHeight = 400;
      barcodeFontSize = 200;
      barcodeHeight = 350;
      barcodeWidth = 12;
    }

    const showUOMAboveBarcode = referencePricePreference === "With UOM";
    const uomLabel = uomData.UOM || "";

    const printWindow = window.open("", "_blank", "width=900,height=1200");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print { ${pageStyle} }
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                ${containerStyle}
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: flex-start;
                background: #fff;
              }
              .pricetag4-container {
                ${containerStyle}
                border: 1px solid #eee;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 10mm 10mm 10mm 10mm;
                direction: ltr;
              }
              .pricetag4-header {
                text-align: center;
                width: 100%;
              }
              .pricetag4-stockname {
                font-size: ${size === "half_a4" ? "45px" : "75px"};
                font-weight: bold;
                color: #222;
                line-height: 1.1em;
                max-height: 2.2em;
                overflow: hidden;
                white-space: normal;
              }
              .pricetag4-description {
                font-size: ${size === "half_a4" ? "28px" : "45px"};
                color: #444;
                margin-top: 3mm;
                margin-bottom: 3mm;
                line-height: 1.1em;
                max-height: 2.2em;
                overflow: hidden;
                white-space: normal;
              }
              .pricetag4-row {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: flex-start;
                width: 100%;
                margin: 3mm 0 3mm 0;
              }
              .pricetag4-nonmember-col, .pricetag4-member-col {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: flex-start;
                min-width: 0; 
                flex-shrink: 0;
              }
              .pricetag4-nonmember-label, .pricetag4-member-label {
                font-size: ${size === "half_a4" ? "28px" : "45px"};
                font-weight: bold;
                color: #222;
                margin-bottom: 3mm;
              }
              .pricetag4-member-col {
                border: 6px solid #222;
                border-radius: 10mm;
                padding: 3mm 16mm 0 16mm;
                margin-left: 18mm;
              }
              .pricetag4-price {
                display: flex;
                align-items: flex-end;
                font-weight: bold;
                color: #111;
              }
              .pricetag4-price-rm {
                font-size: ${size === "half_a4" ? "28px" : "50px"};
                font-weight: bold;
                margin-right: 4mm;
                line-height: 1.2;
                vertical-align: bottom;
              }
              .pricetag4-price-main {
                font-size: ${size === "half_a4" ? "60px" : "120px"};
                font-weight: bold;
                line-height: 1;
              }
              .pricetag4-price-decimal {
                font-size: ${size === "half_a4" ? "28px" : "50px"};
                font-weight: bold;
                margin-left: 4mm;
                line-height: 1.2;
                vertical-align: bottom;
              }
              .pricetag4-barcode-row {
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                width: 100%;
                margin-bottom: 3mm;
              }
              .pricetag4-barcode {
                ${barcodeImgStyle}
                display: flex;
                margin-top: 3mm;
                margin-right: 3mm;
                align-items: flex-start;
              }
              #barcode-img4 {
                ${barcodeImgStyle}
                object-fit: contain;
              }
              .pricetag4-stockcode {
                font-size: ${size === "half_a4" ? "36px" : "45px"};
                color: #333;
                font-weight: bold;
                margin-left: 3mm;
                margin-bottom: 3mm;
                align-self: flex-end;
                white-space: nowrap;
                max-width: 120mm;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .pricetag4-uom-above-barcode {
                font-size: ${size === "half_a4" ? "28px" : "50px"};
                font-weight: bold;
                color: #222;
                text-align: left;
                margin-bottom: 4mm;
                margin-top: 0mm;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <div class="pricetag4-container">
              <div class="pricetag4-header">
                <div class="pricetag4-stockname">${title}</div>
                <div class="pricetag4-description">${Moredescription}</div>
              </div>
              <div class="pricetag4-row">
                <div class="pricetag4-nonmember-col">
                  <div class="pricetag4-nonmember-label">NON-MEMBER:</div>
                  <div class="pricetag4-price" style="white-space:nowrap;">
                    <span class="pricetag4-price-rm">RM</span>
                    <span class="pricetag4-price-main">${mainPrice}</span>
                    <span class="pricetag4-price-decimal">.${decimalPrice}</span>
                  </div>
                </div>
                <div class="pricetag4-member-col">
                  <div class="pricetag4-member-label">MEMBER:</div>
                  <div class="pricetag4-price">
                    <span class="pricetag4-price-rm">RM</span>
                    <span class="pricetag4-price-main">${mainPrice}</span>
                    <span class="pricetag4-price-decimal">.${decimalPrice}</span>
                  </div>
                </div>
              </div>
              ${showUOMAboveBarcode ? `<div class="pricetag4-uom-above-barcode">${uomLabel}</div>` : ""}
              <div class="pricetag4-barcode-row">
                <div class="pricetag4-barcode" style="${barcodeImgStyle}">
                  <img id="barcode-img4" style="${barcodeImgStyle}" />
                </div>
                <div class="pricetag4-stockcode">${barcodeDescription}</div>
              </div>
            </div>
            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script>
              const canvas = document.createElement('canvas');
              canvas.width = ${barcodeCanvasWidth};
              canvas.height = ${barcodeCanvasHeight};
              JsBarcode(canvas, "${barcode}", {
                displayValue: false,
                fontSize: ${barcodeFontSize},
                height: ${barcodeHeight},
                width: ${barcodeWidth},
                margin: 0,
              });
              document.getElementById('barcode-img4').src = canvas.toDataURL('image/png');
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof stockUOMDetailsFormSchema>) => {
    // Check if UOM is selected
    if (!values.UOM) {
      toast({
        title: "Error",
        description: "Please select a UOM first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const selectedUOMData = uomOptions.find((uom) => uom.StockUOMUUID === values.UOM);
    if (!selectedUOMData) {
      toast({
        title: "Error",
        description: "Invalid UOM selection",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    handlePrint(selectedUOMData);
    setOpen(false);
  };

  const handleQRCode = async () => {
    

    const selectedUOMUUID = form.watch("UOM");

    if (!selectedUOMUUID) {
      toast({
        title: "Error",
        description: "Please select a UOM first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const { id, dismiss } = showLoadingToast("Generating QR code...");
    
    if (!row?.UUID) {
      toast({
        title: "Error",
        description: "No stock selected",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      const params = new FormData();

      params.append("stockHasUOM[UUID]", selectedUOMUUID);
      
      const response = await fetch(
        `${ORIGIN}/stock/api/stock/generate-q-r-code?id=${row.UUID}`,
        {
          method: "POST",
          headers,
          body: params,
        }
      );

      if (response.ok) {
        dismiss();
        const result = await response.json();
        if (result.data) {
          // Open the base64 image in a new window for printing
          const printWindow = window.open("", "_blank", "width=900,height=1200");
          if (printWindow) {
            printWindow.document.write(`
              <html>
                <head>
                  <title>Print QR Code</title>
                  <style>
                    @media print {
                      @page {
                        size: 35mm 35mm; /* Set the page size */
                        margin: 0; /* Remove margins */
                      }
                    }
                    body {
                      font-family: Arial, sans-serif;
                      text-align: center;
                      padding: 0;
                      margin: 0;
                      width: 35mm; /* Set body width */
                      height: 35mm; /* Set body height to match page size */
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      box-sizing: border-box;
                    }
                    img {
                      width: 20mm; /* QR code size */
                      height: 20mm; /* QR code size */
                      object-fit: contain; /* Ensures no distortion */
                      display: block;
                      margin: 1mm auto; /* Added vertical margin */
                    }
                    h2 {
                      font-size: 13px;
                      font-weight: bold;
                      color: black;
                      margin: 0;
                      width: 100%;
                      display: inline;
                      white-space: nowrap;
                      overflow: hidden;
                      padding-left: 5px;
                    }
                    .barcode-description {
                      font-size: 10px;
                      color: black;
                      margin: 0;
                    }
                    .barcode-price {
                      font-size: 13px;
                      font-weight: bold;
                      color: black;
                      margin: 0;
                    }
                  </style>
                </head>
                <body>
                  <img src="${result.base64}"/>
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.onload = function () {
              printWindow.print();
              printWindow.close();
            };
          }
        } else {
          toast({
            title: "Error",
            description: "QR code data not received",
            variant: "destructive",
            duration: 3000,
          });
        }
      } else {
        console.error("Failed to generate QR code:", response.statusText);
        
        toast({
          title: "Error",
          description: "Failed to generate QR code",
          variant: "destructive",
          duration: 3000,
        });
        dismiss();
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      
      toast({
        title: "Error",
        description: "Error generating QR code",
        variant: "destructive",
        duration: 3000,
      });
      dismiss();
    }
  };

  const handlePrint = (uomData) => {
    const storedPreferences = localStorage.getItem(PREFERENCE_STORAGE_KEY);
    const prefs = storedPreferences ? JSON.parse(storedPreferences) : {};
    const titleDisplayPreference = prefs.titleDisplayPreference || "Show";
    const titlePreference = prefs.titlePreference || "Stock Name";
    const barcodeDisplayPreference = prefs.barcodeDisplayPreference || "Show";
    const barcodePreference = prefs.barcodePreference || "UOM Barcode";
    const barcodeDescriptionDisplayPreference = prefs.barcodeDescriptionDisplayPreference || "Show";
    const barcodeDescriptionPreference = prefs.barcodeDescriptionPreference || "UOM Barcode";
    const referencePriceDisplayPreference = prefs.referencePriceDisplayPreference || "Show";
    const referencePricePreference = prefs.referencePricePreference || "With UOM";
    if (!uomData.barcode) {
      toast({
        title: "Missing Barcode",
        description: `No barcode found for UOM "${uomData.UOM}". Please add a barcode to this UOM before printing.`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Apply Section 1 settings
    let title = "";

    if (titleDisplayPreference === "Show") {
      // Display title based on preference
      if (titlePreference === "Stock Name") {
        title = uomData.stockName;
      } else if (titlePreference === "Description") {
        title = uomData.description;
      } else if (titlePreference === "Second Description") {
        title = uomData.stockSecondDescription;
      }
    } else {
      title = ""; // No title if "Hide" is selected
    }

    // Apply Section 2 settings
    let barcode = "";

    if (barcodeDisplayPreference === "Show") {
      // Display barcode based on preference
      if (barcodePreference === "UOM Barcode") {
        // Default to UOM barcode
        barcode = uomData.barcode;
      } else if (barcodePreference === "Stock Code") {
        barcode = uomData.stockCode;
      }
    } else {
      barcode = ""; // No barcode if "Hide" is selected
    }

    // Apply Section 3 settings
    let barcodeDescription = "";
    let displayValue = true;

    if (barcodeDescriptionDisplayPreference === "Show") {
      // Display barcode description based on preference
      if (barcodeDescriptionPreference === "UOM Barcode") {
        // Default to UOM barcode
        barcodeDescription = uomData.barcode;
      } else if (barcodeDescriptionPreference === "Stock Code") {
        barcodeDescription = uomData.stockCode;
      }
    } else {
      barcodeDescription = ""; // No barcode description if "Hide" is selected
      displayValue = false;
    }

    // Apply Section 4 settings
    let price = "";

    if (referencePriceDisplayPreference === "Show") {
      // Display price based on preference
      if (referencePricePreference === "With UOM") {
        price = `<p>RM${uomData.price}/${uomData.UOM}</p>`;
      } else {
        price = `<p>RM${uomData.price}</p>`;
      }
    } else {
      price = ""; // No price if "Hide" is selected
    }

    const printWindow = window.open("", "_blank", "width=900,height=1200");
  
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              @media print {
                @page {
                  size: 3.5cm 2.5cm;
                  margin: 0;
                }
              }
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                margin: 0;
                padding: 0;
                width: 3.5cm;
                height: 2.5cm;
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
              }
              .barcode-container {
                width: 3.3cm; /* Ensure it fits within the defined body size */
                height: 2.5cm;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 0;
                background: white;
              }
              h2 {
                font-size: 13px;
                font-weight: bold;
                color: black;
                margin: 0;
                width: 100%;
                display: inline;
                white-space: nowrap;
                overflow: hidden;
                padding-left: 5px;
              }
              img {
                width: 3.3cm;
                height: 1.5cm;
                object-fit: contain;
              }
              p {
                font-size: 13px;
                font-weight: bold;
                color: black;
                margin: 0;
              }
              .barcode-description {
                font-weight: 100;
                font-size: 7px;
                padding-bottom: 8px;
              }
            </style>
          </head>
          <body>
            <div class="barcode-container">
              <h2>${title}</h2>
              ${barcode ? `<img id="barcode-img" style="width: 3.3cm; height: 1.5cm;" />` : ""}
              ${barcodeDisplayPreference === "Hide" ? `<p class="barcode-description">${barcodeDescription}</p>` : ""}
              ${price}
            </div>

            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
            <script>
              const scale = 4; // 4x resolution
              const width = 330; // base width in pixels
              const height = 150; // base height in pixels

              // Create a high-res canvas
              const canvas = document.createElement('canvas');
              canvas.width = width * scale;
              canvas.height = height * scale;

              // Set high-resolution barcode
              JsBarcode(canvas, "${barcode}", {
                displayValue: ${displayValue},
                text: "${barcodeDescription}",
                fontSize: 20 * scale,
                height: height * 2,
                width: 2 * scale, // adjust if needed
                margin: 0,
              });

              // Convert to PNG and use in img tag
              const barcodeImg = document.getElementById('barcode-img');
              barcodeImg.src = canvas.toDataURL('image/png');
            </script>
          </body>
        </html>
      `);
  
      printWindow.document.close();
      printWindow.onload = function () {
        printWindow.print();
        printWindow.close();
      };
    } else {
      toast({
        title: "Error",
        description: "Unable to open print window. Please check your browser settings.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-erp-blue-3 p-2">
        <Form {...form}>
          <form className="space-y-0" onSubmit={form.handleSubmit(onSubmit)}>
            {/* --- Top Bar --- */}
            <div className="flex items-center justify-start gap-x-2 mb-1">
              {/* Preview Button */}
              <button
                type="button"
                className="flex flex-col items-center gap-y-1"
                title="Preview & Print"
                onClick={async () => {
                  const selectedUOMUUID = form.watch("UOM");
                  if (!selectedUOMUUID) {
                    toast({
                      title: "Error",
                      description: "Please select a UOM first",
                      variant: "destructive",
                      duration: 3000,
                    });
                    return;
                  }
                  const selectedUOMData = uomOptions.find((uom) => uom.StockUOMUUID === selectedUOMUUID);
                  if (!selectedUOMData) {
                    toast({
                      title: "Error",
                      description: "Invalid UOM selection",
                      variant: "destructive",
                      duration: 3000,
                    });
                    return;
                  }
                  // Handle print based on labelType
                  if (labelType === "barcode") {
                    handlePrint(selectedUOMData);
                  } else if (labelType === "qr") {
                    await handleQRCode();
                  } else if (labelType === "pricetag1") {
                    handlePriceTagPrint(selectedUOMData);
                  } else if (labelType === "pricetag2") {
                    handlePriceTag2Print(selectedUOMData);
                  } else if (labelType === "pricetag3") {
                    handlePriceTag3Print(selectedUOMData);
                  } else if (labelType === "pricetag4") {
                    handlePriceTag4Print(selectedUOMData);
                  } else if (labelType === "pricetag4_half_a4") {
                    handlePriceTag4CustomSizePrint(selectedUOMData, "half_a4");
                  } else if (labelType === "pricetag4_full_a4") {
                    handlePriceTag4CustomSizePrint(selectedUOMData, "full_a4");
                  }
                  setOpen(false);
                }}
              ><div className="size-6 text-erp-blue-11">
              <SVGPreview   />
              </div>
              <span className="text-xs/none font-medium">Preview</span>
              </button>
              {/* Preference Button opens StockPreferencePopover */}
              <StockPreferencePopover
                trigger={
                  <button
                    type="button"
                    className="flex flex-col items-center gap-y-1"
                    title="Preference"
                    onClick={() => setStockPrefOpen(true)}
                  >
                    <SVGPreferencePrint className="size-6 text-erp-blue-11" />
                    <span className="text-xs/none font-medium">Preference</span>
                  </button>
                }
                tempStockPreferences={tempStockPreferences}
                setTempStockPreferences={setTempStockPreferences}
                onSubmit={handleStockPrefSubmit}
              />
              {/* Cancel Button */}
              <DialogClose asChild>
                <CancelButton className="w-8 h-8 flex items-center justify-center" />
              </DialogClose>
            </div>
            {/* --- UOM Dropdown --- */}
            <div className="bg-white p-3 pt-2 rounded">
              <div className="mb-2">
                <label className="block text-sm font-bold mb-1">UOM</label>
                <Select 
                  onValueChange={handleUOMChange} 
                  value={form.watch("UOM")}
                  disabled={!uomOptions || uomOptions.length === 0}
                >
                  <SelectTrigger className="h-7 w-full">
                    <SelectValue 
                      placeholder={
                        !uomOptions || uomOptions.length === 0 
                          ? "No UOM options available" 
                          : "Select UOM"
                      } 
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {uomOptions && uomOptions.length > 0 ? (
                      uomOptions.map((uom) => (
                        <SelectItem key={uom.StockUOMUUID} value={uom.StockUOMUUID}>
                          <div className="flex items-center justify-between w-full">
                            <span>{uom.UOM}</span>
                            {!uom.barcode && (
                              <span className="ml-2 text-xs text-red-600 font-medium">
                                (No Barcode)
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-options" disabled>
                        No UOM options available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {/* Show warning if selected UOM has no barcode */}
                {selectedUOM && !selectedBarcode && (
                  <div className="mt-1 text-xs text-amber-600 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Selected UOM has no barcode. Add a barcode to enable printing.</span>
                  </div>
                )}
              </div>
              {/* --- Label Type Dropdown --- */}
              <div>
                <label className="block text-sm font-bold mb-1">Label Type</label>
                <Select value={labelType} onValueChange={setLabelType}>
                  <SelectTrigger className="h-7 w-full">
                    <SelectValue placeholder="Select Label Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="barcode">Barcode (3.2cm X 2.5cm)</SelectItem>
                    <SelectItem value="qr">QR (3.2cm X 2.5cm)</SelectItem>
                    <SelectItem value="pricetag1">PriceTag1 (8cm X 9cm)</SelectItem>
                    <SelectItem value="pricetag2">PriceTag2 (8cm X 9cm)</SelectItem>
                    <SelectItem value="pricetag3">PriceTag3 (4cm X 5cm)</SelectItem>
                    <SelectItem value="pricetag4">PriceTag4 (4cm X 5cm)</SelectItem>
                    <SelectItem value="pricetag4_half_a4">PriceTag Half A4 (14.8cm X 21.0cm)</SelectItem>
                    <SelectItem value="pricetag4_full_a4">PriceTag Full A4 (21.0cm X 29.7cm)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
