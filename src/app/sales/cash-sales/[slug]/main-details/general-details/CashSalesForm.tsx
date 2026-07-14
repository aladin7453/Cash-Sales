"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass, FaRegNoteSticky } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";

import DropdownTable from "@/components/data-table/DropdownTable";
import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import ShipperDetailsForm from "@/components/form/ShipperDetailsForm";
import ShippingRecipientDetailsForm from "@/components/form/ShippingRecipientDetailsForm";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { DisplayCustomField, CustomFieldHandle, CustomFieldDefinition } from "@/components/DisplayCustomField";
import TextEditorInline from "@/components/custom/TextEditorInline";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { ORIGIN, getAuthHeaders } from "@/lib/constants";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { cn } from "@/lib/utils/cn";
import { DropdownData } from "@/components/data-table/GetAllDropdown";
import { cacheDropdowns, getCachedDropdowns } from "@/components/offlineDB";

interface ContactFormData {
  contact: string;
  phoneNo: string;
  email: string;
  description: string;
}

const contactFormSchema = z.object({
  contact: z.string().min(1, "Contact name is required").trim(),
  phoneNo: z.string().min(1, "Phone number is required").trim(),
  email: z.string().optional(),
  description: z.string().optional(),
});

type Params = {
  form: any;
  isExpand?: boolean;
  setIsExpand: (v: boolean) => void;
  isMobile?: boolean;
  slug?: string;
  id?: string | null;
  docNo?: string;
  preferenceData?: any;
  customFieldRef?: React.Ref<CustomFieldHandle>;
  customFieldDefs: CustomFieldDefinition[];
  customFieldSavedData: Record<string, unknown>;
  submitAttempted?: boolean;
  allDropdowns: DropdownData;
};

export function CashSalesForm({ form, setIsExpand, isExpand, isMobile, slug, id, docNo, preferenceData, customFieldRef, customFieldDefs, customFieldSavedData, submitAttempted = false, allDropdowns }: Params) {
  const headers = getAuthHeaders();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // Customer Code Dropdown
  const [customerCodeDropdownTableData, setCustomerCodeDropdownTableData] = useState<any[]>([]);
  const [showTableCustomerCode, setShowTableCustomerCode] = useState(false);
  const [customerFilter, setCustomerFilter] = useState("");
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const dropdownCustomerCodeColumns = [
    { accessorKey: "customerCode", header: "Customer Code" },
    { accessorKey: "customerGroupCode", header: "Customer Group" },
    { accessorKey: "customerName", header: "Customer Name" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  // Prefetch customer dropdown on mount
  useEffect(() => {
    setCustomerCodeDropdownTableData(allDropdowns.customer ?? []);
  }, [allDropdowns]);

  const toggleTableCustomerCode = (type: any) => {
    setShowTableCustomerCode((prev) => !prev);
  };

  const onClickRowCustomerCode = (row: any) => {
    form.setValue("customerCode", row.UUID);
    form.setValue("customerCodeCode", row.customerCode, { shouldValidate: true });
    form.setValue("customerName", row.customerName);
    form.setValue("TIN", row.TIN);
    form.setValue("BRN", row.BRN);
    form.setValue("customerBRNOld", row.BRNOld);
    form.setValue("SSTNo", row.SSTNo);
    form.setValue("address", row.address);
    form.setValue("TTXNo", row.TTXNo);
    form.setValue("MISC", row.MISC);
    form.setValue("MSICCode", row.MSICCode);
    form.setValue("businessNature", row.businessNature);

    //Buyer
    form.setValue("buyerName", row.customerName);
    form.setValue("buyerTIN", row.TIN);
    form.setValue("buyerBRN", row.BRN);
    form.setValue("buyerSSTNo", row.SSTNo);
    form.setValue("buyerAddress", row.address);
    form.setValue("buyerTTXNo", row.TTXNo);
    form.setValue("buyerMSICCode", row.MISC);
    form.setValue("buyerMISCCodeCode", row.MSICCode);
    form.setValue("buyerBusinessNature", row.businessNature);

    //Recipient
    form.setValue("recipient", row.customerName);
    form.setValue("recipientTIN", row.TIN);
    form.setValue("recipientBRN", row.BRN);
    form.setValue("recipientSSTNo", row.SSTNo);
    form.setValue("recipientAddress", row.address);
    form.setValue("recipientTTXNo", row.TTXNo);

    //Shipper
    form.setValue("shipperName", row.customerName);
    form.setValue("shipperTIN", row.TIN);
    form.setValue("shipperBRN", row.BRN);
    form.setValue("shipperSSTNo", row.SSTNo);
    form.setValue("shipperAddress", row.address);
    form.setValue("shipperTTXNo", row.TTXNo);

    if (row.creditTerm) {
      form.setValue("creditTerm", row.creditTerm);
      form.setValue("creditTermCode", row.creditTermCode);
    }

    const defaultCheck = row.customerHasBillingContacts?.find((r: any) => r.default == "1");
    form.setValue("attention", defaultCheck?.UUID ?? "");
    form.setValue("attentionName", defaultCheck?.contact ?? "");
    form.setValue("phoneNo", defaultCheck?.phoneNo ?? "");
    form.setValue("email", defaultCheck?.email ?? "");

    setShowTableCustomerCode(false);
    setCustomerFilter("");
  };

  // Attention Dropdown
  const [attentionDropdownTableData, setAttentionDropdownTableData] = useState<any[]>([]);
  const [showTableAttention, setShowTableAttention] = useState(false);
  const [attentionFilter, setAttentionFilter] = useState("");
  const attentionInputRef = useRef(null);
  const attentionDropdownRef = useRef(null);

  const dropdownAttentionColumns = [
    { accessorKey: "contact", header: "Contact" },
    { accessorKey: "phoneNo", header: "Phone No." },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const fetchAttentionData = async (customerUUID: string) => {
    if (!customerUUID) return;

    if (!navigator.onLine) {
      const cached = await getCachedDropdowns(DEFAULT_ATTENTION_CACHE_KEY);
      if (cached) setAttentionDropdownTableData(cached);
      return;
    }

    try {
      const formData = new FormData();
      const response = await fetch(
        `${ORIGIN}/universal/get-attention-by-customer?id=${customerUUID}`,
        { method: "POST", headers, body: formData },
      );
      if (!response.ok) throw new Error("Failed to fetch attention data");
      const data = await response.json();
      setAttentionDropdownTableData(data.rows);
    } catch (error) {
      console.error("Error fetching attention data:", error);
    }
  };

  const toggleTableAttention = async () => {
    if (showTableAttention) {
      setShowTableAttention(false);
      return;
    }

    const customerUUID = form.getValues("customerCode");
    await fetchAttentionData(customerUUID);
    setShowTableAttention(true);
  };

  const fetchDeliveryAddressData = async (customerUUID: string) => {
    if (!customerUUID) return;

    if (!navigator.onLine) {
      const cached = await getCachedDropdowns(DEFAULT_DELIVERY_CACHE_KEY);
      if (cached) setDeliveryAddressDropdownTableData(cached);
      return;
    }

    try {
      const response = await fetch(
        `${ORIGIN}/universal/get-customer-has-delivery-location-by-customer?id=${customerUUID}`,
        { method: "POST", headers, body: new FormData() },
      );
      if (!response.ok) throw new Error("Failed to fetch delivery address data");
      const data = await response.json();
      setDeliveryAddressDropdownTableData(data.rows);
    } catch (error) {
      console.error("Error fetching delivery address data:", error);
    }
  };

  const fetchDropdownDeliveryAddress = async () => {
    if (showTableDeliveryAddress) {
      setShowTableDeliveryAddress(false);
      return;
    }

    const customerUUID = form.getValues("customerCode");
    await fetchDeliveryAddressData(customerUUID);
    setShowTableDeliveryAddress(true);
  };

  const onClickRowAttention = (row: any) => {
    form.setValue("attention", row.UUID);
    form.setValue("attentionName", row.contact);
    form.setValue("phoneNo", row.phoneNo);
    form.setValue("email", row.email);
    setShowTableAttention(false);
    setAttentionFilter("");
  };

  // Delivery Address Dropdown
  const [showTableDeliveryAddress, setShowTableDeliveryAddress] = useState(false);
  const [deliveryAddressDropdownTableData, setDeliveryAddressDropdownTableData] = useState<any[]>([]);
  const deliveryAddressInputRef = useRef(null);
  const deliveryAddressDropdownRef = useRef(null);

  const dropdownDeliveryAddressColumns = [
    { accessorKey: "deliveryLocation", header: "Delivery Location" },
    {
      accessorKey: "deliveryAddress",
      header: "Delivery Address",
      cell: ({ row }) => {
        const address = row.original.deliveryAddress || "";
        return (
          <span style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
            {address}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: "Remark",
      cell: ({ row }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const DEFAULT_ATTENTION_CACHE_KEY = "default-customer-attention";
  const DEFAULT_DELIVERY_CACHE_KEY = "default-customer-delivery";

  const prefetchDefaultCustomerDropdowns = async (customerUUID: string) => {
    if (!customerUUID) return;

    if (!navigator.onLine) {
      const [cachedAttention, cachedDelivery] = await Promise.all([
        getCachedDropdowns(DEFAULT_ATTENTION_CACHE_KEY),
        getCachedDropdowns(DEFAULT_DELIVERY_CACHE_KEY),
      ]);
      if (cachedAttention) setAttentionDropdownTableData(cachedAttention);
      if (cachedDelivery) setDeliveryAddressDropdownTableData(cachedDelivery);
      return;
    }

    try {
      const formData = new FormData();
      const response = await fetch(
        `${ORIGIN}/universal/get-attention-by-customer?id=${customerUUID}`,
        { method: "POST", headers, body: formData },
      );
      if (response.ok) {
        const data = await response.json();
        setAttentionDropdownTableData(data.rows);
        await cacheDropdowns(DEFAULT_ATTENTION_CACHE_KEY, data.rows);
      }
    } catch (error) {
      console.error("Error prefetching default customer attention data:", error);
    }

    try {
      const response = await fetch(
        `${ORIGIN}/universal/get-customer-has-delivery-location-by-customer?id=${customerUUID}`,
        { method: "POST", headers, body: new FormData() },
      );
      if (response.ok) {
        const data = await response.json();
        setDeliveryAddressDropdownTableData(data.rows);
        await cacheDropdowns(DEFAULT_DELIVERY_CACHE_KEY, data.rows);
      }
    } catch (error) {
      console.error("Error prefetching default customer delivery address data:", error);
    }
  };

  const onClickRowDeliveryAddress = (row: any) => {
    form.setValue("deliveryAddress", row.deliveryAddress);
    form.setValue("deliveryAttention", row.contact);
    form.setValue("deliveryPhoneNo", row.phoneNo);
    form.setValue("deliveryEmail", row.email);
    setShowTableDeliveryAddress(false);
  };

  // Add Contact Dialog 
  const [showAddAttentionDialog, setShowAddAttentionDialog] = useState(false);
  const [billingContactFiles, setBillingContactFiles] = useState<File[]>([]);

  const contactForm = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { contact: "", phoneNo: "", email: "", description: "" },
  });

  const handleAddContact = async () => {
    const isValid = await contactForm.trigger();
    if (!isValid) return;

    const data = contactForm.getValues();
    const customerId = form.getValues("customerCode");
    const formData = new FormData();

    formData.append("customerHasBillingContact[contact]", data.contact);
    formData.append("customerHasBillingContact[phoneNo]", data.phoneNo);
    formData.append("customerHasBillingContact[email]", data.email ?? "");
    formData.append("customerHasBillingContact[description]", data.description || "");

    for (let i = 0; i < billingContactFiles.length; i++) {
      const file = billingContactFiles[i];

      if (file.size) {
        try {
          const base64 = await getFileToBase64(file);
          formData.append(`customerHasBillingContact[attachment][${i}][Name]`, file.name);
          formData.append(`customerHasBillingContact[attachment][${i}][File]`, base64);
        } catch (error) {
          console.error("Error converting file to base64:", error);
          toast({ title: "Error", description: "Failed to process file attachment", variant: "destructive" });
          return;
        }
      } else {
        formData.append(`customerHasBillingContact[attachment][${i}][Name]`, file.name);
        formData.append(`customerHasBillingContact[attachment][${i}][File]`, "");
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${ORIGIN}/customer/api/customer/update-customer-has-billing-contact-data?id=${customerId}`,
        { method: "POST", headers, body: formData },
      );
      if (!response.ok) throw new Error("Failed to add new contact");

      await toggleTableAttention();
      contactForm.reset();
      setBillingContactFiles([]);
      setShowAddAttentionDialog(false);
      toast({ title: "Success", description: "Contact added successfully" });
    } catch (error) {
      console.error("Error adding new contact:", error);
      toast({ title: "Error", description: "Failed to add new contact", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Click Outside Handler 
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setShowTableCustomerCode(false);
      }
      if (
        attentionDropdownRef.current &&
        !attentionDropdownRef.current.contains(event.target as Node) &&
        attentionInputRef.current !== event.target
      ) {
        setShowTableAttention(false);
      }
      if (
        deliveryAddressDropdownRef.current &&
        !deliveryAddressDropdownRef.current.contains(event.target as Node)
      ) {
        setShowTableDeliveryAddress(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  // Default Customer 
  const setDefaultCustomer = () => {
    if (slug !== "new" || form.getValues("customerCodeCode")) return;

    const defaultCustomer = (allDropdowns.customer ?? []).find(
      (row) => row.customerCode === "Cash001",
    );
    const defaultCashTerm = (allDropdowns.creditTerm ?? []).find(
      (row) => row.creditTermCode === "CASH",
    );
    const defaultCurrency = (allDropdowns.currency ?? []).find(
      (row) => row.UUID === preferenceData?.data?.currency,
    );
    const defaultPaymentMethod = (allDropdowns.paymentMethod ?? []).find(
      (row) => row.UUID === preferenceData?.data?.customerPaymentMethod,
    );

    if (defaultCashTerm && !form.getValues("creditTerm")) {
      form.setValue("creditTerm", defaultCashTerm.UUID);
      form.setValue("creditTermCode", defaultCashTerm.creditTermCode);
      form.setValue("creditTermType", defaultCashTerm.creditTermType);
    }

    if (defaultCustomer) {
      form.setValue("customerCode", defaultCustomer.UUID);
      form.setValue("customerCodeCode", defaultCustomer.customerCode);
      form.setValue("customerName", defaultCustomer.customerName);
      form.setValue("BRN", defaultCustomer.BRN || "");
      form.setValue("TIN", defaultCustomer.TIN || "");
      form.setValue("SSTNo", defaultCustomer.SSTNo || "");
      form.setValue("address", defaultCustomer.address || "");
      form.setValue("taxExNo", defaultCustomer.TaxExNo || "");

      prefetchDefaultCustomerDropdowns(defaultCustomer.UUID);
    }

    if (defaultPaymentMethod) {
      form.setValue("paymentMethod", defaultPaymentMethod.UUID);
      form.setValue("paymentMethodCode", defaultPaymentMethod.paymentMethodCode);
    }

    if (defaultCurrency) {
      form.setValue("currency", defaultCurrency.UUID);
      form.setValue("currencyCode", defaultCurrency.currencyCode);
      form.setValue("currencySymbol", defaultCurrency.currencySymbol);
      form.setValue("currencyRate", defaultCurrency.exchangeRateSales);
    }
  };

  useEffect(() => {
    if (
      preferenceData?.data?.currency &&
      slug === "new" &&
      (allDropdowns.customer ?? []).length > 0
    ) {
      setDefaultCustomer();
    }
  }, [preferenceData, allDropdowns]);

  return (
    <>
      <Card className={cn("w-full shadow-sm", isMobile ? "h-auto" : isExpand ? "h-[533px]" : "h-[245px]")}>
        <CardContent className="px-1.5 py-1">
          <Form {...form}>
            <form>
              <Tabs
                className="flex w-full flex-col"
                onSelect={(index) => {
                  if (index === 3 || index === 4) {
                    setActiveTabIndex(index);
                    setIsExpand(true);
                  } else {
                    setIsExpand(false);
                  }
                }}
              >
                <TabList className="flex">
                  {["Customer", "Shipper", "Recipient", "Note", "More"].map((label) => (
                    <Tab
                      key={label}
                      className="cursor-pointer rounded-tl-md rounded-tr-md border-[1px] border-gray-200 bg-transparent px-2 py-1 text-[12px] text-black outline-none transition-all duration-300 ease-in-out"
                      selectedClassName="!bg-blue-300 border-blue-300 text-white"
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>

                {/* Tab Customer Details */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  {/* First Row */}
                  <div className="mt-1.5 grid grid-cols-3 items-center gap-x-2">
                    {/* Customer UUID */}
                    <FormField
                      control={form.control}
                      name="customerCode"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormLabel>Customer UUID:</FormLabel>
                          <FormControl>
                            <Input className="h-7.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Customer Code */}
                    <FormField
                      control={form.control}
                      name="customerCodeCode"
                      render={({ field }) => (
                        <FormItem className="col-span-1 flex flex-col space-y-1">
                          <FormControl className="relative">
                            <div>
                              <TooltipProvider delayDuration={1000}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Input
                                      className={cn(
                                        "h-7 rounded-md px-2 pr-9 text-[11px] outline-none transition-all duration-300 ease-in-out",
                                        form.formState.errors.customerCodeCode &&
                                        "border-red-500 placeholder:text-red-500 focus-visible:ring-red-500",
                                      )}
                                      {...field}
                                      onClick={() => toggleTableCustomerCode("")}
                                      onChange={(e) => {
                                        field.onChange(e);
                                        setCustomerFilter(e.target.value);
                                      }}
                                      ref={inputRef}
                                      autoComplete="off"
                                      placeholder={form.formState.errors.customerCodeCode ? "Required" : "Customer Code"}
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent side="top" align="start">
                                    Customer Code
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <FaMagnifyingGlass className="size-3 text-gray-400" />
                              </div>
                              {showTableCustomerCode && (
                                <div
                                  ref={dropdownRef}
                                  className="absolute top-full z-50 h-[190px] rounded border border-gray-200 bg-white shadow-md"
                                >
                                  <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                    <DropdownTable
                                      columns={dropdownCustomerCodeColumns}
                                      data={customerCodeDropdownTableData}
                                      onClickRow={onClickRowCustomerCode}
                                      filterValue={customerFilter}
                                      filterColumn="customerName"
                                    />
                                    <ScrollBar orientation="vertical" />
                                  </ScrollArea>
                                </div>
                              )}
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Customer Name */}
                    <FormField
                      control={form.control}
                      name="customerName"
                      render={({ field }) => (
                        <FormItem className="col-span-2 flex flex-col space-y-1">
                          <FormControl>
                            <TooltipProvider delayDuration={1000}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Input
                                    className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                    {...field}
                                    moduleName="cashSales"
                                    fieldName="customerName"
                                    columnName="Customer Name"
                                    placeholder="Customer Name"
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="start">
                                  Customer Name
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Second Row */}
                  <div className="mt-1.5 grid grid-cols-3 items-center gap-x-2">
                    {/* BRN */}
                    <FormField
                      control={form.control}
                      name="BRN"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1">
                          <FormControl>
                            <TooltipProvider delayDuration={1000}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Input
                                    className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                    {...field}
                                    placeholder="BRN"
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="start">
                                  BRN
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TIN */}
                    <FormField
                      control={form.control}
                      name="TIN"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1">
                          <FormControl>
                            <TooltipProvider delayDuration={1000}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Input
                                    className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                    {...field}
                                    moduleName="salesInvoice"
                                    fieldName="TIN"
                                    columnName="TIN"
                                    placeholder="TIN"
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="start">
                                  TIN
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* TaxEx No */}
                    <FormField
                      control={form.control}
                      name="TTXNo"
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <FormLabel>TaxEx No.:</FormLabel>
                          <FormControl>
                            <Input className="h-7.5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* SST No */}
                    <FormField
                      control={form.control}
                      name="SSTNo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-y-1">
                          <FormControl>
                            <TooltipProvider delayDuration={1000}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Input
                                    className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                    {...field}
                                    placeholder="SST No"
                                  />
                                </TooltipTrigger>
                                <TooltipContent side="top" align="start">
                                  SST No
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tab Section (Billing and Delivery) */}
                  <Tabs className="mt-2 flex flex-col">
                    <TabList className="flex">
                      {["Billing Details", "Delivery Details"].map((label) => (
                        <Tab
                          key={label}
                          className="cursor-pointer rounded-tl-md rounded-tr-md border-[1px] border-gray-200 bg-transparent px-2 py-1 text-[12px] text-black outline-none transition-all duration-300 ease-in-out"
                          selectedClassName="!bg-blue-300 border-blue-300 text-white"
                        >
                          {label}
                        </Tab>
                      ))}
                    </TabList>

                    {/* Tab Billing Address */}
                    <TabPanel
                      forceRender
                      className="hidden"
                      selectedClassName="react-tabs__tab-panel--selected"
                    >
                      <div className="flex items-center justify-center gap-x-2.5 pt-1.5">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormControl>
                                  <Textarea
                                    className="h-[95px] resize-none text-[11px] px-2 outline-none transition-all duration-300 ease-in-out"
                                    placeholder="Billing Address"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-y-1.5">
                          {/* Attention Name */}
                          <FormField
                            control={form.control}
                            name="attentionName"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl className="relative">
                                  <div>
                                    <TooltipProvider delayDuration={1000}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Input
                                            className="h-7 rounded-md px-2 pr-9 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                            {...field}
                                            onClick={toggleTableAttention}
                                            onChange={(e) => {
                                              field.onChange(e);
                                              setAttentionFilter(e.target.value);
                                            }}
                                            ref={attentionInputRef}
                                            autoComplete="off"
                                            placeholder="Attention"
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="start">
                                          Attention
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                      <FaMagnifyingGlass className="size-3 text-gray-400" />
                                    </div>
                                    {showTableAttention && (
                                      <div
                                        ref={attentionDropdownRef}
                                        className="absolute bottom-[10px] left-full z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md"
                                      >
                                        <div className="flex items-center border-t bg-white p-2">
                                          Billing Contact Details
                                        </div>
                                        <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                          <DropdownTable
                                            columns={dropdownAttentionColumns}
                                            data={attentionDropdownTableData}
                                            onClickRow={onClickRowAttention}
                                            filterValue={attentionFilter}
                                            filterColumn="contact"
                                          />
                                          <ScrollBar orientation="vertical" />
                                        </ScrollArea>
                                        <div className="flex items-center justify-end border-t bg-white p-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setShowTableAttention(false);
                                              setShowAddAttentionDialog(true);
                                            }}
                                          >
                                            + Add
                                          </Button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Attention UUID */}
                          <FormField
                            control={form.control}
                            name="attention"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Attention UUID:</FormLabel>
                                <FormControl>
                                  <Input className="h-7.5" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Phone No */}
                          <FormField
                            control={form.control}
                            name="phoneNo"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl>
                                  <TooltipProvider delayDuration={1000}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Input
                                          className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                          {...field}
                                          placeholder="Phone No"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" align="start">
                                        Phone No
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Email */}
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl>
                                  <TooltipProvider delayDuration={1000}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Input
                                          className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                          {...field}
                                          placeholder="Email"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" align="start">
                                        Email
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabPanel>

                    {/* Tab Delivery Address */}
                    <TabPanel
                      forceRender
                      className="hidden"
                      selectedClassName="react-tabs__tab-panel--selected"
                    >
                      <div className="flex items-center justify-center gap-x-2.5 pt-1.5">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="deliveryAddress"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl className="relative">
                                  <div>
                                    <Textarea
                                      className="h-[95px] px-2 resize-none pr-9 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                      {...field}
                                      onClick={fetchDropdownDeliveryAddress}
                                      ref={deliveryAddressInputRef}
                                      autoComplete="off"
                                      placeholder="Delivery Address"
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 bottom-[60%] right-0 flex items-center pr-3">
                                      <FaMagnifyingGlass className="size-3 text-gray-400" />
                                    </div>
                                    {showTableDeliveryAddress && (
                                      <div
                                        ref={deliveryAddressDropdownRef}
                                        className="absolute top-[50px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md"
                                      >
                                        <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                          <DropdownTable
                                            columns={dropdownDeliveryAddressColumns}
                                            data={deliveryAddressDropdownTableData}
                                            onClickRow={onClickRowDeliveryAddress}
                                          />
                                        </ScrollArea>
                                      </div>
                                    )}
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-y-1.5">
                          <FormField
                            control={form.control}
                            name="deliveryAttention"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl className="relative">
                                  <div>
                                    <TooltipProvider delayDuration={1000}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Input
                                            className="h-7 rounded-md px-2 pr-9 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                            {...field}
                                            autoComplete="off"
                                            moduleName="cashSales"
                                            fieldName="deliveryAttention"
                                            columnName="Attention"
                                            placeholder="Attention"
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="start">
                                          Attention
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deliveryPhoneNo"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl>
                                  <TooltipProvider delayDuration={1000}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Input
                                          className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                          {...field}
                                          moduleName="cashSales"
                                          fieldName="deliveryPhoneNo"
                                          columnName="Phone No."
                                          placeholder="Phone No"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" align="start">
                                        Phone No
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="deliveryEmail"
                            render={({ field }) => (
                              <FormItem className="flex flex-col space-y-1">
                                <FormControl>
                                  <div className="relative">
                                    <TooltipProvider delayDuration={1000}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Input
                                            className="h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                            {...field}
                                            moduleName="cashSales"
                                            fieldName="deliveryEmail"
                                            columnName="Email"
                                            placeholder="Email"
                                          />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" align="start">
                                          Email
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </TabPanel>
                  </Tabs>
                </TabPanel>

                {/* Shipper Details */}
                <TabPanel forceRender className="hidden" selectedClassName="react-tabs__tab-panel--selected">
                  <ShipperDetailsForm form={form} />
                </TabPanel>

                {/* Recipient Details */}
                <TabPanel forceRender className="hidden" selectedClassName="react-tabs__tab-panel--selected">
                  <ShippingRecipientDetailsForm form={form} />
                </TabPanel>

                {/* Note */}
                <TabPanel forceRender className="hidden" selectedClassName="react-tabs__tab-panel--selected">
                  <Tabs className="h-[500px] pt-1.5 flex">
                    <div className="min-w-0 flex-1">
                      {["note", "note2", "note3", "note4", "note5", "note6", "note7", "note8"].map((name) => (
                        <TabPanel key={name} forceRender className="hidden" selectedClassName="react-tabs__tab-panel--selected">
                          <FormField
                            control={form.control}
                            name={name}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <TextEditorInline
                                    value={field.value || (name === "note" ? preferenceData?.data?.cashSalesNote || "" : "")}
                                    onChange={(val) => field.onChange(val)}
                                    className="h-[335px]"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TabPanel>
                      ))}
                    </div>
                    <TabList className="ml-1 flex flex-col gap-y-1">
                      {["Note", "Note 2", "Note 3", "Note 4", "Note 5", "Note 6", "Note 7", "Note 8"].map((label, index) => (
                        <Tab
                          key={index}
                          className="flex h-11 w-12 cursor-pointer flex-col items-center justify-center gap-y-0.5 rounded-md border border-gray-200 bg-white text-[9px] text-gray-600 outline-none transition-all duration-200 ease-in-out"
                          selectedClassName="!bg-blue-300 border-blue-300 text-white"
                        >
                          <FaRegNoteSticky className="size-3.5" />
                          <span>{label}</span>
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                </TabPanel>

                {/* More Field */}
                <TabPanel forceRender className="hidden" selectedClassName="react-tabs__tab-panel--selected">
                  <ScrollArea className="h-[495px]">
                    <DisplayCustomField
                      ref={customFieldRef}
                      form={form}
                      module="sales"
                      docUUID={id ?? ""}
                      docType="cashSales"
                      docNo={docNo ?? ""}
                      fieldDefs={customFieldDefs}
                      savedFieldData={customFieldSavedData}
                      submitAttempted={submitAttempted}
                    />
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </TabPanel>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Add Contact Dialog */}
      <Dialog open={showAddAttentionDialog} onOpenChange={setShowAddAttentionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <FormProvider {...contactForm}>
            <form>
              <div className="space-y-4">
                <FormField control={contactForm.control} name="contact" render={({ field }) => (
                  <FormItem><FormLabel>Contact Name:</FormLabel><FormControl><Input {...field} placeholder="Contact Name" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={contactForm.control} name="phoneNo" render={({ field }) => (
                  <FormItem><FormLabel>Phone No.:</FormLabel><FormControl><Input {...field} placeholder="Phone No." /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={contactForm.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email:</FormLabel><FormControl><Input {...field} placeholder="Email" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={contactForm.control} name="description" render={({ field }) => (
                  <FormItem><FormLabel>Description:</FormLabel><FormControl><Input {...field} placeholder="Description" /></FormControl><FormMessage /></FormItem>
                )} />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowAddAttentionDialog(false)} disabled={isLoading}>Cancel</Button>
                  <Button type="button" onClick={handleAddContact} disabled={isLoading}>{isLoading ? "Saving..." : "Save"}</Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </>
  );
}