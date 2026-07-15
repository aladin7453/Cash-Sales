"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useSWR from "swr";

import { useRouter } from "next/navigation";

import {
  DEFAULT_DATA_TABLE_PAGE_SIZE,
  getAuthHeaders,
  ORIGIN,
} from "@/lib/constants";

import { toast } from "@/components/ui/use-toast";
import LoadingUI from "@/components/LoadingUI";

import SalesPreferencesForm from "./SalesPreferenceForm";
import ConfirmSaveDialog from "./ConfirmSaveDialog";
import {
  CashSalesColumns,
  // CustomerColumns,
  // SalesCreditNoteColumns,
  // SalesDebitNoteColumns,
  // SalesInvoiceColumns,
} from "./CreditTerm/columns";
import SelectDialog from "./CreditTerm/SelectDialog";
import {
  acquireSyncLock,
  releaseSyncLock,
  cachePreferenceData,
  getCachedPreferenceData,
  savePendingPreference,
  getPendingPreference,
  clearPendingPreference
} from "@/components/offlineDB";

// Dialog configuration object
const DIALOG_CONFIGS = {
  // customer: {
  //   docType: "customer",
  //   title: "Select Customer",
  //   nextDialog: "salesInvoice",
  //   columns: CustomerColumns,
  // },
  // salesInvoice: {
  //   docType: "salesInvoice",
  //   title: "Select Sales Invoice",
  //   nextDialog: "cashSales",
  //   columns: SalesInvoiceColumns,
  // },
  cashSales: {
    docType: "cashSales",
    title: "Select Cash Sales",
    nextDialog: "salesCreditNote",
    columns: CashSalesColumns,
  },
  // salesCreditNote: {
  //   docType: "salesCreditNote",
  //   title: "Select Sales Credit Note",
  //   nextDialog: "salesDebitNote",
  //   columns: SalesCreditNoteColumns,
  // },
  // salesDebitNote: {
  //   docType: "salesDebitNote",
  //   title: "Select Sales Debit Note",
  //   nextDialog: "supplier",
  //   columns: SalesDebitNoteColumns,
  // },
};

const fetcher = async (url) => {
  const headers = getAuthHeaders();

  return fetch(url, { headers }).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  });
};

const formSchema = z.object({
  creditTerm: z.string().default("").nullable(),
  currency: z.string().default("").nullable(),
  decimal: z.string().default("").nullable(),
  rounding: z.string().default("1").nullable(),
  customerPaymentMethod: z.string().default("Cash").nullable(),
  customerPaymentMethodCode: z.string().default("").nullable(),
  customerCategoryAutoGenEn: z.enum(["1", "0"]).default("0"),
  customerCategoryFormat: z.string().default("CUSTCATyyyymm???").nullable(),
  customerCategoryNextNum: z.string().default("1").nullable(),
  customerGroupAutoGenEn: z.enum(["1", "0"]).default("0"),
  customerGroupFormat: z.string().default("CGyyyymm???").nullable(),
  customerGroupNextNum: z.string().default("1").nullable(),
  customerTagAutoGenEn: z.enum(["1", "0"]).default("0"),
  customerTagFormat: z.string().default("CTyyyymm???").nullable(),
  customerTagNextNum: z.string().default("1").nullable(),

  agentTypeAutoGenEn: z.enum(["1", "0"]).default("0"),
  agentTypeFormat: z.string().default("ATyyyymm???").nullable(),
  agentTypeNextNum: z.string().default("1").nullable(),


  agentAutoGenEn: z.enum(["1", "0"]).default("0"),
  agentFormat: z.string().default("Ayyyymm???").nullable(),
  agentNextNum: z.string().default("1").nullable(),

  customerAutoGenEn: z.enum(["1", "0"]).default("1"),
  customerFormat: z.string().default("CU-#?????").nullable(),
  customerNextNum: z.string().default("1").nullable(),
  customerCountry: z.string().default("").nullable(),
  customerState: z.string().default("").nullable(),
  quotationAutoGenEn: z.enum(["1", "0"]).default("1"),
  quotationFormat: z.string().default("QT????????").nullable(),
  quotationNextNum: z.string().default("1").nullable(),
  quotationValidity: z.string().default("").nullable(),
  quotationNote: z.string().default("").nullable(),
  salesOrderAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesOrderFormat: z.string().default("SO????????").nullable(),
  salesOrderNextNum: z.string().default("1").nullable(),
  salesOrderValidity: z.string().default("").nullable(),
  salesOrderNote: z.string().default("").nullable(),
  salesOrderTnC: z.string().default("").nullable(),
  salesOrderRemark: z.string().default("").nullable(),
  salesDeliveryOrderAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesDeliveryOrderFormat: z.string().default("DO????????").nullable(),
  salesDeliveryOrderNextNum: z.string().default("1").nullable(),
  salesDeliveryOrderValidity: z.string().default("").nullable(),
  salesDeliveryOrderNote: z.string().default("").nullable(),
  salesInvoiceAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesInvoiceFormat: z.string().default("IV????????").nullable(),
  salesInvoiceNextNum: z.string().default("1").nullable(),
  salesInvoiceValidity: z.string().default("").nullable(),
  salesInvoiceNote: z.string().default("").nullable(),
  cashSalesAutoGenEn: z.enum(["1", "0"]).default("1"),
  cashSalesFormat: z.string().default("CS????????").nullable(),
  cashSalesNextNum: z.string().default("1").nullable(),
  cashSalesValidity: z.string().default("").nullable(),
  cashSalesNote: z.string().default("").nullable(),
  salesDebitNoteAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesDebitNoteFormat: z.string().default("DN????????").nullable(),
  salesDebitNoteNextNum: z.string().default("1").nullable(),
  salesDebitNoteValidity: z.string().default("").nullable(),
  salesDebitNoteNote: z.string().default("").nullable(),
  salesCreditNoteAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesCreditNoteFormat: z.string().default("CN????????").nullable(),
  salesCreditNoteNextNum: z.string().default("1").nullable(),
  salesCreditNoteValidity: z.string().default("").nullable(),
  salesCreditNoteNote: z.string().default("").nullable(),
  consolidateInvoiceAutoGenEn: z.enum(["1", "0"]).default("1"),
  consolidateInvoiceFormat: z.string().default("ES????????").nullable(),
  consolidateInvoiceNextNum: z.string().default("1").nullable(),
  consolidateInvoiceNote: z.string().default("").nullable(),
  customerPaymentAutoGenEn: z.enum(["1", "0"]).default("1"),
  customerPaymentFormat: z.string().default("OR????????").nullable(),
  customerPaymentNextNum: z.string().default("1").nullable(),
  customerPaymentNote: z.string().default("").nullable(),
  salesPurchaseContraAutoGenEn: z.enum(["1", "0"]).default("1"),
  salesPurchaseContraFormat: z.string().default("CT????????").nullable(),
  salesPurchaseContraNextNum: z.string().default("1").nullable(),
  account: z.string().default("").nullable(),
  company: z.string().default("").nullable(),
  currencyCode: z.string().default("").nullable(),
  currencySymbol: z.string().default("").nullable(),
  creditTermCode: z.string().default("").nullable(),
  customerCountryCode: z.string().default("").nullable(),
  customerCountryName: z.string().default("").nullable(),
  formattedCustomerCountryCode: z.string().default("").nullable(),
  customerStateCode: z.string().default("").nullable(),
  customerStateName: z.string().default("").nullable(),
  formattedCustomerStateCode: z.string().default("").nullable(),
  accountName: z.string().default("").nullable(),
  companyName: z.string().default("").nullable(),

  quotationDefaultDate: z.enum(["1", "0"]).default("0"),
  salesOrderDefaultDate: z.enum(["1", "0"]).default("0"),
  deliveryOrderDefaultDate: z.enum(["1", "0"]).default("0"),
  salesInvoiceDefaultDate: z.enum(["1", "0"]).default("0"),
  salesCreditNoteDefaultDate: z.enum(["1", "0"]).default("0"),
  salesDebitNoteDefaultDate: z.enum(["1", "0"]).default("0"),
  cashSalesDefaultDate: z.enum(["1", "0"]).default("0"),
  cashSalesHeader: z.enum(["1", "0"]).default("1"),
});



export default function PreferencesPage() {
  const router = useRouter();
  const [tempSalesPreferences, setTempSalesPreferences] = useState(null);
  const [originalSalesPreferences, setOriginalSalesPreferences] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const headers = getAuthHeaders();
  const [showTableState, setShowTableState] = useState(false);
  const [showTableCountry, setShowTableCountry] = useState(false);
  const [stateDropdownTableData, setStateDropdownTableData] = useState([]);
  const [countryDropdownTableData, setCountryDropdownTableData] = useState([]);

  // Add state to track selected customer and supplier IDs
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);

  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  // Enhanced dialog states with server-side properties
  const [dialogStates, setDialogStates] = useState(() => {
    const initialStates = {};
    Object.keys(DIALOG_CONFIGS).forEach((dialogType) => {
      initialStates[dialogType] = {
        open: false,
        data: [],
        isLoading: false,
        totalCount: 0,
        pagination: { pageIndex: 0, pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE },
        sorting: [],
        columnFilters: [],
      };
    });
    return initialStates;
  });


  const {
    data,
    error,
    isLoading,
    mutate: mutateSales,
  } = useSWR(
    isOnline ? `${ORIGIN}/sales_preference/api/sales-preference/get-index-sales-preference` : null,
    fetcher, { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  const fetchAndSetDefaultCountry = async () => {
    const formData = new FormData();
    formData.append("table[]", "countryOfOrigin");

    if (!showTableCountry) {
      try {
        const response = await fetch(
          `${ORIGIN}/universal/get-all-drop-down-table-data`,
          {
            method: "POST",
            headers,
            body: formData,
          }
        );

        if (!response.ok) throw new Error("Failed to fetch country of origin");

        const data = await response.json();

        setCountryDropdownTableData(data.rows);

        const defaultCountry = data.rows.find((row) => row.code === "MYS");

        if (defaultCountry) {
          handleChange("customerCountry", defaultCountry.UUID);

          handleChange(
            "formattedCustomerCountryCode",
            `${defaultCountry.description}(${defaultCountry.code})`
          );
        }
      } catch (error) {
        console.error("Error fetching country of origin data:", error);
      }
    }
  };

  const fetchAndSetDefaultState = async () => {
    const formData = new FormData();
    formData.append("table[]", "state");

    if (!showTableState) {
      try {
        const response = await fetch(
          `${ORIGIN}/universal/get-all-drop-down-table-data`,
          {
            method: "POST",
            headers,
            body: formData,
          }
        );
        if (!response.ok) throw new Error("Failed to fetch state");
        const data = await response.json();

        setStateDropdownTableData(data.rows);

        const defaultState = data.rows.find((row) => row.code === "13");

        if (defaultState) {
          handleChange("customerState", defaultState.UUID);

          handleChange(
            "formattedCustomerStateCode",
            `${defaultState.description}(${defaultState.code})`
          );
        }
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    }
  };

  const fetchPaymentMethodAndSetDescription = async (paymentMethodUUID = null) => {
    const formData = new FormData();
    formData.append("table[]", "paymentMethod");

    try {
      const response = await fetch(
        `${ORIGIN}/universal/get-all-drop-down-table-data`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );
      if (!response.ok) throw new Error("Failed to fetch payment method");
      const data = await response.json();

      const defaultPaymentMethod =
        paymentMethodUUID
          ? data.rows.find((row) => row.UUID === paymentMethodUUID)
          : data.rows.find((row) => row.paymentMethodCode === "CASH" || row.description === "CASH") || data.rows[0];

      if (defaultPaymentMethod) {
        handleChange("customerPaymentMethod", defaultPaymentMethod.UUID);
        handleChange("customerPaymentMethodCode", defaultPaymentMethod.description);
      }
    } catch (error) {
      console.error("Error fetching payment method data:", error);
    }
  };

  const handleChange = (field: string, value: any) => {
    form.setValue(field, value);
    setTempSalesPreferences((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      creditTerm: "",
      currency: "",
      decimal: "2",
      rounding: "1",
      customerPaymentMethod: "Cash",
      customerPaymentMethodCode: "",
      customerCategoryAutoGenEn: "0",
      customerCategoryFormat: "CUSTCATyyyymm???",
      customerCategoryNextNum: "1",
      customerGroupAutoGenEn: "0",
      customerGroupFormat: "CGyyyymm???",
      customerGroupNextNum: "1",
      customerTagAutoGenEn: "0",
      customerTagFormat: "CTyyyymm???",
      customerTagNextNum: "1",

      agentTypeAutoGenEn: "0",
      agentTypeFormat: "ATyyyymm???",
      agentTypeNextNum: "1",


      agentAutoGenEn: "0",
      agentFormat: "Ayyyymm???",
      agentNextNum: "1",


      customerAutoGenEn: "1",
      customerFormat: "CU-#?????",
      customerNextNum: "1",
      customerCountry: "",
      customerState: "",
      quotationAutoGenEn: "1",
      quotationFormat: "QT????????",
      quotationNextNum: "1",
      quotationValidity: "",
      quotationNote: "",
      salesOrderAutoGenEn: "1",
      salesOrderFormat: "SO????????",
      salesOrderNextNum: "1",
      salesOrderValidity: "",
      salesOrderNote: "",
      salesOrderTnC: "",
      salesOrderRemark: "",
      salesDeliveryOrderAutoGenEn: "1",
      salesDeliveryOrderFormat: "DO????????",
      salesDeliveryOrderNextNum: "1",
      salesDeliveryOrderValidity: "",
      salesDeliveryOrderNote: "",
      salesInvoiceAutoGenEn: "1",
      salesInvoiceFormat: "IV????????",
      salesInvoiceNextNum: "1",
      salesInvoiceValidity: "",
      salesInvoiceNote: "",
      cashSalesAutoGenEn: "1",
      cashSalesFormat: "CS????????",
      cashSalesNextNum: "1",
      cashSalesValidity: "",
      cashSalesNote: "",
      salesDebitNoteAutoGenEn: "1",
      salesDebitNoteFormat: "DN????????",
      salesDebitNoteNextNum: "1",
      salesDebitNoteValidity: "",
      salesDebitNoteNote: "",
      salesCreditNoteAutoGenEn: "1",
      salesCreditNoteFormat: "CN????????",
      salesCreditNoteNextNum: "1",
      salesCreditNoteValidity: "",
      salesCreditNoteNote: "",
      consolidateInvoiceAutoGenEn: "1",
      consolidateInvoiceFormat: "ES????????",
      consolidateInvoiceNextNum: "1",
      consolidateInvoiceNote: "",
      customerPaymentAutoGenEn: "1",
      customerPaymentFormat: "OR????????",
      customerPaymentNextNum: "1",
      customerPaymentNote: "",
      salesPurchaseContraAutoGenEn: "1",
      salesPurchaseContraFormat: "CT????????",
      salesPurchaseContraNextNum: "1",
      account: "",
      company: "",
      currencyCode: "",
      currencySymbol: "",
      creditTermCode: "",
      customerCountryCode: "",
      customerCountryName: "",
      formattedCustomerCountryCode: "",
      customerStateCode: "",
      customerStateName: "",
      formattedCustomerStateCode: "",
      accountName: "",
      companyName: "",

      quotationDefaultDate: "0",
      salesOrderDefaultDate: "0",
      deliveryOrderDefaultDate: "0",
      salesInvoiceDefaultDate: "0",
      salesCreditNoteDefaultDate: "0",
      salesDebitNoteDefaultDate: "0",
      cashSalesDefaultDate: "0",
      cashSalesHeader: "1"
    },
  });

  const fetchAndSetDefaultCurrency = async () => {
    const formData = new FormData();
    formData.append("table[]", "currency");

    try {
      const response = await fetch(
        `${ORIGIN}/universal/get-all-drop-down-table-data`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to fetch currency data");

      const data = await response.json();

      const defaultCurrency = data.rows.find((row) => row.currencyCode === "MYR");

      if (defaultCurrency) {
        handleChange("currency", defaultCurrency.UUID);
        handleChange("currencyCode", defaultCurrency.currencyCode);
        handleChange("currencySymbol", defaultCurrency.currencySymbol);
      }
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    if (isOnline) return;

    const loadOfflineData = async () => {
      const [pending, cached] = await Promise.all([
        getPendingPreference(),
        getCachedPreferenceData(),
      ]);

      const merged = { ...(cached || {}), ...(pending || {}) };

      if (Object.keys(merged).length > 0) {
        setTempSalesPreferences(merged);
        setOriginalSalesPreferences(cached ? { ...cached } : { ...merged });
        form.reset({ ...form.getValues(), ...merged });
      }
    };

    loadOfflineData();
  }, [isOnline]);

  useEffect(() => {
    if (data) {
      setTempSalesPreferences(data.data);
      setOriginalSalesPreferences(data.data ? { ...data.data } : null);

      if (data.data) {
        const preferences = data.data;
        cachePreferenceData(preferences);
        form.reset({
          creditTerm: preferences.creditTerm || "",
          currency: preferences.currency || "",
          decimal: preferences.decimal || "2",
          rounding: preferences.rounding || "1",
          customerPaymentMethod: preferences.customerPaymentMethod || "Cash",
          customerPaymentMethodCode: preferences.customerPaymentMethodCode || "",
          customerCategoryAutoGenEn: preferences.customerCategoryAutoGenEn || "0",
          customerCategoryFormat: preferences.customerCategoryFormat || "CGyyyymm???",
          customerCategoryNextNum: preferences.customerCategoryNextNum || "1",
          customerGroupAutoGenEn: preferences.customerGroupAutoGenEn || "0",
          customerGroupFormat: preferences.customerGroupFormat || "CGyyyymm???",
          customerGroupNextNum: preferences.customerGroupNextNum || "1",
          customerTagAutoGenEn: preferences.customerTagAutoGenEn || "0",
          customerTagFormat: preferences.customerTagFormat || "CTyyyymm???",
          customerTagNextNum: preferences.customerTagNextNum || "1",

          agentTypeAutoGenEn: preferences.agentTypeAutoGenEn || "0",
          agentTypeFormat: preferences.agentTypeFormat || "ATyyyymm???",
          agentTypeNextNum: preferences.agentTypeNextNum || "1",


          agentAutoGenEn: preferences.agentAutoGenEn || "0",
          agentFormat: preferences.agentFormat || "Ayyyymm???",
          agentNextNum: preferences.agentNextNum || "1",


          customerAutoGenEn: preferences.customerAutoGenEn || "1",
          customerFormat: preferences.customerFormat || "CU-#?????",
          customerNextNum: preferences.customerNextNum || "1",
          customerCountry: preferences.customerCountry || "",
          customerState: preferences.customerState || "",
          quotationAutoGenEn: preferences.quotationAutoGenEn || "1",
          quotationFormat: preferences.quotationFormat || "QT????????",
          quotationNextNum: preferences.quotationNextNum || "1",
          quotationValidity: preferences.quotationValidity || "",
          quotationNote: preferences.quotationNote || "",
          salesOrderAutoGenEn: preferences.salesOrderAutoGenEn || "1",
          salesOrderFormat: preferences.salesOrderFormat || "SO????????",
          salesOrderNextNum: preferences.salesOrderNextNum || "1",
          salesOrderValidity: preferences.salesOrderValidity || "",
          salesOrderNote: preferences.salesOrderNote || "",
          salesOrderTnC: preferences.salesOrderTnC || "",
          salesOrderRemark: preferences.salesOrderRemark || "",
          salesDeliveryOrderAutoGenEn: preferences.salesDeliveryOrderAutoGenEn || "1",
          salesDeliveryOrderFormat: preferences.salesDeliveryOrderFormat || "DO????????",
          salesDeliveryOrderNextNum: preferences.salesDeliveryOrderNextNum || "1",
          salesDeliveryOrderValidity: preferences.salesDeliveryOrderValidity || "",
          salesDeliveryOrderNote: preferences.salesDeliveryOrderNote || "",
          salesInvoiceAutoGenEn: preferences.salesInvoiceAutoGenEn || "1",
          salesInvoiceFormat: preferences.salesInvoiceFormat || "IV????????",
          salesInvoiceNextNum: preferences.salesInvoiceNextNum || "1",
          salesInvoiceValidity: preferences.salesInvoiceValidity || "",
          salesInvoiceNote: preferences.salesInvoiceNote || "",
          cashSalesAutoGenEn: preferences.cashSalesAutoGenEn || "1",
          cashSalesFormat: preferences.cashSalesFormat || "CS????????",
          cashSalesNextNum: preferences.cashSalesNextNum || "1",
          cashSalesValidity: preferences.cashSalesValidity || "",
          cashSalesNote: preferences.cashSalesNote || "",
          salesDebitNoteAutoGenEn: preferences.salesDebitNoteAutoGenEn || "1",
          salesDebitNoteFormat: preferences.salesDebitNoteFormat || "DN????????",
          salesDebitNoteNextNum: preferences.salesDebitNoteNextNum || "1",
          salesDebitNoteValidity: preferences.salesDebitNoteValidity || "",
          salesDebitNoteNote: preferences.salesDebitNoteNote || "",
          salesCreditNoteAutoGenEn: preferences.salesCreditNoteAutoGenEn || "1",
          salesCreditNoteFormat: preferences.salesCreditNoteFormat || "CN????????",
          salesCreditNoteNextNum: preferences.salesCreditNoteNextNum || "1",
          salesCreditNoteValidity: preferences.salesCreditNoteValidity || "",
          salesCreditNoteNote: preferences.salesCreditNoteNote || "",
          consolidateInvoiceAutoGenEn: preferences.consolidateInvoiceAutoGenEn || "1",
          consolidateInvoiceFormat: preferences.consolidateInvoiceFormat || "ES????????",
          consolidateInvoiceNextNum: preferences.consolidateInvoiceNextNum || "1",
          consolidateInvoiceNote: preferences.consolidateInvoiceNote || "",
          customerPaymentAutoGenEn: preferences.customerPaymentAutoGenEn || "1",
          customerPaymentFormat: preferences.customerPaymentFormat || "OR????????",
          customerPaymentNextNum: preferences.customerPaymentNextNum || "1",
          customerPaymentNote: preferences.customerPaymentNote || "",
          salesPurchaseContraAutoGenEn: preferences.salesPurchaseContraAutoGenEn || "1",
          salesPurchaseContraFormat: preferences.salesPurchaseContraFormat || "CT????????",
          salesPurchaseContraNextNum: preferences.salesPurchaseContraNextNum || "1",
          account: preferences.account || "",
          company: preferences.company || "",
          currencyCode: preferences.currencyCode || "",
          currencySymbol: preferences.currencySymbol || "",
          creditTermCode: preferences.creditTermCode || "",
          customerCountryCode: preferences.customerCountryCode || "",
          customerCountryName: preferences.customerCountryName || "",
          formattedCustomerCountryCode: preferences.customerCountry
            ? `${preferences.customerCountryName}(${preferences.customerCountryCode})`
            : "",
          customerStateCode: preferences.customerStateCode || "",
          customerStateName: preferences.customerStateName || "",
          formattedCustomerStateCode: preferences.customerState
            ? `${preferences.customerStateName}(${preferences.customerStateCode})`
            : "",
          accountName: preferences.accountName || "",
          companyName: preferences.companyName || "",

          quotationDefaultDate: preferences.quotationDefaultDate || "0",
          salesOrderDefaultDate: preferences.salesOrderDefaultDate || "0",
          deliveryOrderDefaultDate: preferences.deliveryOrderDefaultDate || "0",
          salesInvoiceDefaultDate: preferences.salesInvoiceDefaultDate || "0",
          salesCreditNoteDefaultDate: preferences.salesCreditNoteDefaultDate || "0",
          salesDebitNoteDefaultDate: preferences.salesDebitNoteDefaultDate || "0",
          cashSalesDefaultDate: preferences.cashSalesDefaultDate || "0",
          cashSalesHeader: preferences.cashSalesHeader || "1",
        });


        if (
          !preferences?.customerCountry ||
          preferences?.customerCountry.trim() === ""
        ) {
          fetchAndSetDefaultCountry();
        }

        if (
          !preferences?.customerState ||
          preferences?.customerState.trim() === ""
        ) {
          fetchAndSetDefaultState();
        }

        if (
          !preferences?.customerPaymentMethod ||
          preferences?.customerPaymentMethod.trim() === ""
        ) {
          fetchPaymentMethodAndSetDescription();
        } else {
          fetchPaymentMethodAndSetDescription(preferences.customerPaymentMethod);
        }

        if (!preferences?.currency || preferences?.currency.trim() === "") {
          fetchAndSetDefaultCurrency();
        }
      } else {
        const defaults = form.getValues();
        const preferences = data.data;

        setTempSalesPreferences(defaults);

        if (
          !preferences?.customerCountry ||
          (preferences?.customerCountry && preferences.customerCountry.trim() === "")
        ) {
          fetchAndSetDefaultCountry();
        }

        if (
          !preferences?.customerState ||
          (preferences?.customerState && preferences.customerState.trim() === "")
        ) {
          fetchAndSetDefaultState();
        }

        if (
          !preferences?.customerPaymentMethod ||
          (preferences?.customerPaymentMethod && preferences.customerPaymentMethod.trim() === "")
        ) {
          fetchPaymentMethodAndSetDescription();
        } else {
          fetchPaymentMethodAndSetDescription(preferences.customerPaymentMethod);
        }

        if (!preferences?.currency || preferences?.currency.trim() === "") {
          fetchAndSetDefaultCurrency();
        }

        form.reset(defaults);
      }
    }
  }, [data, form]);

  useEffect(() => {
    if (error) {
      if (error.status == "401") {
        setTimeout(() => {
          mutateSales(undefined, false); //  Clear the error without revalidating
          router.push("/login");
        }, 500);
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching preferences",
          description: "There was an error loading your preferences.",
        });
      }
    }
  }, [error, toast]);

  // Generic fetch function for all dialog types
  const fetchDialogData = async (dialogType, tableState = null) => {
    const config = DIALOG_CONFIGS[dialogType];
    if (!config) return;

    setDialogStates((prev) => ({
      ...prev,
      [dialogType]: { ...prev[dialogType], isLoading: true },
    }));

    try {
      // Get current state or use defaults
      const currentState = dialogStates[dialogType];
      const columnFilters =
        tableState?.getState?.()?.columnFilters || currentState.columnFilters || [];
      const sorting = tableState?.getState?.()?.sorting || currentState.sorting || [];
      const pagination = tableState?.getState?.()?.pagination ||
        currentState.pagination || {
        pageIndex: 0,
        pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
      };

      const columnFiltersWithoutValid = columnFilters.filter((filter) => filter.id !== "valid");

      const params = new FormData();
      params.append("param[limit]", `${pagination.pageSize}`);
      params.append("param[offset]", `${pagination.pageIndex * pagination.pageSize}`);
      params.append(
        "param[filter]",
        columnFiltersWithoutValid.length > 0
          ? JSON.stringify(
            columnFiltersWithoutValid.reduce((acc, curr) => {
              acc[curr.id] = curr.value;
              return acc;
            }, {}),
          )
          : "{}",
      );
      params.append(
        "param[order]",
        sorting.length > 0 ? (sorting[0].desc ? "desc" : "asc") : "desc",
      );
      params.append(
        "param[valid]",
        columnFilters.length > 0
          ? `${columnFilters.find((row) => row.id === "valid")?.value || ""}`
          : "",
      );
      params.append("param[sort]", sorting.length > 0 ? sorting[0].id : "createdAt");
      // Add creditTerm parameter
      const currentCreditTerm =
        tempSalesPreferences?.creditTerm || form.getValues("creditTerm");
      params.append("param[creditTerm]", currentCreditTerm);

      // Build URL with ID parameter based on document type
      let url = `${ORIGIN}/sales_preference/api/sales-preference/get-document-details?docType=${config.docType}`;

      // Add customer ID for sales documents
      if (
        ["salesInvoice", "cashSales", "salesCreditNote", "salesDebitNote"].includes(dialogType) &&
        selectedCustomerId
      ) {
        url += `&id=${selectedCustomerId}`;
      }
      // Add supplier ID for purchase documents
      // else if (
      //   ["purchaseInvoice", "purchaseCreditNote", "purchaseDebitNote"].includes(dialogType) &&
      //   selectedSupplierId
      // ) {
      //   url += `&id=${selectedSupplierId}`;
      // }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: params,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${dialogType} data`);
      }

      const result = await response.json();

      // Handle total count properly - convert string to number if needed
      const totalCount = result.total
        ? typeof result.total === "string"
          ? parseInt(result.total, 10)
          : result.total
        : result.totalCount || result.rows?.length || 0;

      setDialogStates((prev) => ({
        ...prev,
        [dialogType]: {
          ...prev[dialogType],
          data: result.rows || [],
          totalCount: totalCount,
          isLoading: false,
          pagination,
          sorting,
          columnFilters,
        },
      }));
    } catch (error) {
      console.error(`Error fetching ${dialogType} data:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to fetch ${dialogType} data.`,
      });
      setDialogStates((prev) => ({
        ...prev,
        [dialogType]: {
          ...prev[dialogType],
          data: [],
          totalCount: 0,
          isLoading: false,
        },
      }));
    }
  };

  // Generic update function for all dialog types
  const updateDialogData = async (dialogType, selectedRows) => {
    const config = DIALOG_CONFIGS[dialogType];
    if (!config) return;

    try {
      const params = new FormData();

      // Add current credit term
      const currentCreditTerm = form.getValues("creditTerm");
      params.append("salesPreference[creditTerm]", currentCreditTerm);

      // Add selected rows UUIDs
      selectedRows.forEach((row, index) => {
        params.append(`salesPreference[UUIDs][${index}]`, row.UUID);
      });

      const response = await fetch(
        `${ORIGIN}/sales_preference/api/sales-preference/update-document-details?docType=${config.docType}`,
        {
          method: "POST",
          headers,
          body: params,
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to update ${dialogType} data`);
      }

      const result = await response.json();

      toast({
        variant: "default",
        title: "Success",
        description: `${config.title.replace("Select ", "")} updated successfully.`,
      });

      return result;
    } catch (error) {
      console.error(`Error updating ${dialogType} data:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update ${dialogType} data.`,
      });
      throw error;
    }
  };

  const onSubmit = async () => {

    if (!tempSalesPreferences) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No preferences to update.",
      });
      return;
    }

    // Get default values from form schema
    const defaultValues = {
      customerCategoryNextNum: "1",
      customerGroupNextNum: "1",
      customerNextNum: "1",
      quotationNextNum: "1",
      salesOrderNextNum: "1",
      salesDeliveryOrderNextNum: "1",
      salesInvoiceNextNum: "1",
      cashSalesNextNum: "1",
      salesDebitNoteNextNum: "1",
      salesCreditNoteNextNum: "1",
      consolidateInvoiceNextNum: "1",
      customerPaymentNextNum: "1",
      salesPurchaseContraNextNum: "1",
      decimal: "2",
      rounding: "1",
      customerCategoryAutoGenEn: "0",
      customerCategoryFormat: "CUSTCATyyyymm???",
      customerGroupAutoGenEn: "0",
      customerGroupFormat: "CGyyyymm???",
      customerTagAutoGenEn: "0",
      customerTagFormat: "CTyyyymm???",
      customerTagNextNum: "1",

      agentTypeAutoGenEn: "0",
      agentTypeFormat: "ATyyyymm???",
      agentTypeNextNum: "1",

      agentAutoGenEn: "0",
      agentFormat: "Ayyyymm???",
      agentNextNum: "1",

      customerAutoGenEn: "1",
      customerFormat: "CU-#?????",
      quotationAutoGenEn: "1",
      quotationFormat: "QT????????",
      salesOrderAutoGenEn: "1",
      salesOrderFormat: "SO????????",
      salesDeliveryOrderAutoGenEn: "1",
      salesDeliveryOrderFormat: "DO????????",
      salesInvoiceAutoGenEn: "1",
      salesInvoiceFormat: "IV????????",
      cashSalesAutoGenEn: "1",
      cashSalesFormat: "CS????????",
      salesDebitNoteAutoGenEn: "1",
      salesDebitNoteFormat: "DN????????",
      salesCreditNoteAutoGenEn: "1",
      salesCreditNoteFormat: "CN????????",
      consolidateInvoiceAutoGenEn: "1",
      consolidateInvoiceFormat: "ES????????",
      customerPaymentAutoGenEn: "1",
      customerPaymentFormat: "OR????????",
      salesPurchaseContraAutoGenEn: "1",
      salesPurchaseContraFormat: "CT????????",

      quotationDefaultDate: "0",
      salesOrderDefaultDate: "0",
      deliveryOrderDefaultDate: "0",
      salesInvoiceDefaultDate: "0",
      salesCreditNoteDefaultDate: "0",
      salesDebitNoteDefaultDate: "0",
      cashSalesDefaultDate: "0"
    };

    const finalPreferences = { ...tempSalesPreferences };
    Object.keys(defaultValues).forEach((key) => {
      if (!finalPreferences[key] || finalPreferences[key].toString().trim() === "") {
        finalPreferences[key] = defaultValues[key];
      }
    });

    if (!isOnline) {
      await savePendingPreference(finalPreferences);
      setOriginalSalesPreferences({ ...tempSalesPreferences });

      toast({
        variant: "default",
        title: "Saved Offline",
        description: "Changes saved on this device and will sync automatically once you're back online.",
      });
      return;
    }

    try {
      const formData = new FormData();

      // Append finalPreferences data as form data
      for (const key in finalPreferences) {
        if (finalPreferences.hasOwnProperty(key)) {
          formData.append(
            `salesPreference[${key}]`,
            finalPreferences[key] || ""
          );
        }
      }

      const response = await fetch(
        `${ORIGIN}/sales_preference/api/sales-preference/update-sales-preference`,
        {
          headers,
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      await response.json();

      // Update originalSalesPreferences after successful save
      setOriginalSalesPreferences({ ...tempSalesPreferences });
      await cachePreferenceData(finalPreferences);
      await clearPendingPreference();

      toast({
        variant: "default",
        title: "Success",
        description: "Preferences updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating preferences",
        description:
          error.message || "There was an error updating your preferences.",
      });
    }
  };

  // Field labels mapping for better display in confirmation dialog
  const fieldLabels = {
    currencyCode: "Default Currency",
    creditTermCode: "Default Terms",
    decimal: "Decimal Precision",
    customerPaymentMethodCode: "Payment Method",
    rounding: "Rounding Precision",
    quotationAutoGenEn: "Enable Auto Number Generation (Quotation)",
    quotationFormat: "Format (Quotation)",
    quotationNextNum: "Next Number (Quotation)",
    quotationValidity: "Doc Validity Days (Quotation)",
    quotationNote: "Default Note (Quotation)",
    salesOrderAutoGenEn: "Enable Auto Number Generation (Sales Order)",
    salesOrderFormat: "Format (Sales Order)",
    salesOrderNextNum: "Next Number (Sales Order)",
    salesOrderValidity: "Doc Validity Days (Sales Order)",
    salesOrderNote: "Default Note (Sales Order)",
    salesOrderTnC: "Terms & Conditions (Sales Order)",
    salesOrderRemark: "Default Remark (Sales Order)",
    salesDeliveryOrderAutoGenEn: "Enable Auto Number Generation (Sales Delivery)",
    salesDeliveryOrderFormat: "Format (Sales Delivery)",
    salesDeliveryOrderNextNum: "Next Number (Sales Delivery)",
    salesDeliveryOrderValidity: "Doc Validity Days (Sales Delivery)",
    salesDeliveryOrderNote: "Default Note (Sales Delivery)",
    salesInvoiceAutoGenEn: "Enable Auto Number Generation (Sales Invoice)",
    salesInvoiceFormat: "Format (Sales Invoice)",
    salesInvoiceNextNum: "Next Number (Sales Invoice)",
    salesInvoiceValidity: "Doc Validity Days (Sales Invoice)",
    salesInvoiceNote: "Default Note (Sales Invoice)",
    salesCreditNoteAutoGenEn: "Enable Auto Number Generation (Sales Credit Note)",
    salesCreditNoteFormat: "Format (Sales Credit Note)",
    salesCreditNoteNextNum: "Next Number (Sales Credit Note)",
    salesCreditNoteValidity: "Doc Validity Days (Sales Credit Note)",
    salesCreditNoteNote: "Default Note (Sales Credit Note)",
    salesDebitNoteAutoGenEn: "Enable Auto Number Generation (Sales Debit Note)",
    salesDebitNoteFormat: "Format (Sales Debit Note)",
    salesDebitNoteNextNum: "Next Number (Sales Debit Note)",
    salesDebitNoteValidity: "Doc Validity Days (Sales Debit Note)",
    salesDebitNoteNote: "Default Note (Sales Debit Note)",
    customerPaymentAutoGenEn: "Enable Auto Number Generation (Customer Payment)",
    customerPaymentFormat: "Format (Customer Payment)",
    customerPaymentNextNum: "Next Number (Customer Payment)",
    customerPaymentNote: "Default Note (Customer Payment)",
    salesPurchaseContraAutoGenEn: "Enable Auto Number Generation (Sales Purchase Contra)",
    salesPurchaseContraFormat: "Format (Sales Purchase Contra)",
    salesPurchaseContraNextNum: "Next Number (Sales Purchase Contra)",
    consolidateInvoiceAutoGenEn: "Enable Auto Number Generation (Consolidate Invoice)",
    consolidateInvoiceFormat: "Format (Consolidate Invoice)",
    consolidateInvoiceNextNum: "Next Number (Consolidate Invoice)",
    consolidateInvoiceNote: "Default Note (Consolidate Invoice)",
    cashSalesAutoGenEn: "Enable Auto Number Generation (Cash Sales)",
    cashSalesFormat: "Format (Cash Sales)",
    cashSalesNextNum: "Next Number (Cash Sales)",
    cashSalesValidity: "Doc Validity Days (Cash Sales)",
    cashSalesNote: "Default Note (Cash Sales)",
    customerAutoGenEn: "Enable Auto Number Generation (Customer)",
    customerFormat: "Format (Customer)",
    customerNextNum: "Next Number (Customer)",
    customerCategoryAutoGenEn: "Enable Auto Number Generation (Customer Category)",
    customerCategoryFormat: "Format (Customer Category)",
    customerCategoryNextNum: "Next Number (Customer Category)",
    customerGroupAutoGenEn: "Enable Auto Number Generation (Customer Group)",
    customerGroupFormat: "Format (Customer Group)",
    customerGroupNextNum: "Next Number (Customer Group)",
    customerTagAutoGenEn: "Enable Auto Number Generation (Customer Tag)",
    customerTagFormat: "Format (Customer Tag)",
    customerTagNextNum: "Next Number (Customer Tag)",

    agentTypeAutoGenEn: "Enable Auto Number Generation (Agent Type)",
    agentTypeFormat: "Format (Agent Type)",
    agentTypeNextNum: "Next Number (Agent Type)",

    agentAutoGenEn: "Enable Auto Number Generation (Agent)",
    agentFormat: "Format (Agent)",
    agentNextNum: "Next Number (Agent)",



    account: "Account",
    company: "Company",
    currencySymbol: "Currency Symbol",
    customerCountryCode: "Default Country (Customer)",
    customerCountryName: "Customer Country Name",
    formattedCustomerCountryCode: "Customer Country Display",
    customerStateCode: "Default State (Customer)",
    customerStateName: "Customer State Name",
    formattedCustomerStateCode: "Customer State Display",
    accountName: "Account Name",
    companyName: "Company Name",

    quotationDefaultDate: "Default Quotation Start & End Date",
    salesOrderDefaultDate: "Default Sales Order Start & End Date",
    deliveryOrderDefaultDate: "Default Sales Delivery Order Start & End Date",
    salesInvoiceDefaultDate: "Default Sales Invoice Start & End Date",
    salesCreditNoteDefaultDate: "Default Sales Credit Note Start & End Date",
    salesDebitNoteDefaultDate: "Default Sales Debit Note Start & End Date",
    cashSalesDefaultDate: "Default Cash Sales Start & End Date"
  };

  const excludeFields = [
    'currency',
    'currencyRate',
    'creditTerm',
    'customerCountry',
    'customerState',
    'customerPaymentMethod',
    'formattedCustomerCountryCode',
    'formattedCustomerStateCode'
  ];


  const getChangedFields = () => {

    if (!originalSalesPreferences || !tempSalesPreferences) {
      return [];
    }

    const formVal = form.getValues()

    const changes = [];
    Object.keys(formVal).forEach(field => {
      if (excludeFields.includes(field)) return;

      const originalValue = originalSalesPreferences[field];
      const currentValue = formVal[field];

      // Normalize values for comparison (handle null, undefined, empty string)
      const normalizeValue = (val) => {
        if (val === null || val === undefined) return '';
        return val.toString();
      };

      if (normalizeValue(originalValue) !== normalizeValue(currentValue)) {
        changes.push({
          field,
          label: fieldLabels[field] || field,
          oldValue: originalValue,
          newValue: currentValue,
        });
      }
    });

    return changes;
  };

  const handleSaveClick = () => {

    const changes = getChangedFields();
    if (changes.length === 0 && data?.data) {
      toast({
        variant: "default",
        title: "No Changes",
        description: "No changes detected to save.",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmSave = () => {
    const changes = getChangedFields();
    const foundCreditTermChanges = changes.filter(item => { return item.field == "creditTermCode" })
    setShowConfirmDialog(false);
    if (foundCreditTermChanges.length > 0) {
      onSaveAndOpenDialog()
    } else {
      onSubmit();
    }

  };

  const onSaveAndOpenDialog = async () => {
    // First execute the save operation
    await onSubmit();

    if (!isOnline) {
      toast({
        variant: "default",
        title: "Offline",
        description: "Customer selection will be available once you're back online.",
      });
      return;
    }

    // Check if there are changes to the credit term and it's not "None"
    const currentCreditTerm =
      tempSalesPreferences?.creditTerm || form.getValues("creditTerm");

    if (currentCreditTerm !== "None") {
      // Fetch customer data and open dialog
      await fetchDialogData("customer");
      setDialogStates((prev) => ({
        ...prev,
        customer: { ...prev.customer, open: true },
      }));
    }
  };

  // Generic selection handler
  const onSelectDocument = (dialogType) => (document) => {
    // Store selected customer or supplier ID
    if (dialogType === "customer") {
      setSelectedCustomerId(document.UUID);
    } else if (dialogType === "supplier") {
      setSelectedSupplierId(document.UUID);
    }

    // console.log(`Selected ${dialogType}:`, document);
  };

  // Generic dialog opening handler
  const onOpenNextDialog = (currentDialogType) => async () => {
    const config = DIALOG_CONFIGS[currentDialogType];
    const nextDialogType = config?.nextDialog;

    // Close current dialog
    setDialogStates((prev) => ({
      ...prev,
      [currentDialogType]: { ...prev[currentDialogType], open: false },
    }));

    if (nextDialogType) {
      // Fetch data and open next dialog
      await fetchDialogData(nextDialogType);
      setDialogStates((prev) => ({
        ...prev,
        [nextDialogType]: { ...prev[nextDialogType], open: true },
      }));
    }
  };

  const syncPendingPreference = async () => {
    if (!acquireSyncLock()) return;

    try {
      const pending = await getPendingPreference();
      if (!pending) return;

      const formData = new FormData();
      for (const key in pending) {
        if (pending.hasOwnProperty(key)) {
          formData.append(`salesPreference[${key}]`, pending[key] ?? "");
        }
      }

      const response = await fetch(
        `${ORIGIN}/sales_preference/api/sales-preference/update-sales-preference`,
        { headers, method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Failed to sync offline preferences");

      await cachePreferenceData(pending);
      await clearPendingPreference();
      await mutateSales();

      toast({
        variant: "default",
        title: "Synced",
        description: "Your offline preference changes have been saved.",
      });
    } catch (err) {
      console.error("Error syncing pending preference:", err);
    } finally {
      releaseSyncLock();
    }
  };

  useEffect(() => {
    if (isOnline) {
      syncPendingPreference();
    }
  }, [isOnline]);

  return (
    <>
      {isLoading && <LoadingUI />}
      <SalesPreferencesForm
        form={form}
        onSubmit={handleSaveClick}
        onSaveAndOpenDialog={onSaveAndOpenDialog}
        tempSalesPreferences={tempSalesPreferences}
        setTempSalesPreferences={setTempSalesPreferences}
        showTableState={showTableState}
        setShowTableState={setShowTableState}
        showTableCountry={showTableCountry}
        setShowTableCountry={setShowTableCountry}
        stateDropdownTableData={stateDropdownTableData}
        setStateDropdownTableData={setStateDropdownTableData}
        countryDropdownTableData={countryDropdownTableData}
        setCountryDropdownTableData={setCountryDropdownTableData}
        handleChange={handleChange}
      />

      {Object.entries(DIALOG_CONFIGS).map(([dialogType, config]) => (
        <SelectDialog
          key={dialogType}
          open={dialogStates[dialogType].open}
          setOpen={(open) =>
            setDialogStates((prev) => ({
              ...prev,
              [dialogType]: { ...prev[dialogType], open },
            }))
          }
          columns={config.columns}
          data={dialogStates[dialogType].data}
          totalCount={dialogStates[dialogType].totalCount}
          isLoading={dialogStates[dialogType].isLoading}
          onSelectDocument={onSelectDocument(dialogType)}
          onOpenSecondDialog={config.nextDialog ? onOpenNextDialog(dialogType) : undefined}
          onUpdate={(selectedRows) => updateDialogData(dialogType, selectedRows)}
          revalidateData={(tableState) => fetchDialogData(dialogType, tableState)}
          dialogTitle={config.title}
        />
      ))}

      <ConfirmSaveDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSave}
        changes={getChangedFields()}
      />
    </>
  );
}