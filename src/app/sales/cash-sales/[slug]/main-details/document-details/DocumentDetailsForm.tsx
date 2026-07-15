"use client";

import React, { useEffect, useRef, useState } from "react";
import { CalendarIcon } from "lucide-react";

//Icon
import { FaMagnifyingGlass, FaHotel } from "react-icons/fa6";
import { FiAlignLeft, FiUser } from "react-icons/fi";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { GoFileDirectory } from "react-icons/go";

import moment from "moment";
import { useWatch } from "react-hook-form";
import { DropdownData } from "@/components/data-table/GetAllDropdown";
import DropdownTable from "@/components/data-table/DropdownTable";
import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Input, NumberInputField } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import TextEditorInline from "@/components/custom/TextEditorInline";
import { BuyerDetailsForm } from "../../e-invoice-details/buyer-details/BuyerDetailsForm";
import { SupplierDetailsForm } from "../../e-invoice-details/supplier-details/SupplierDetailsForm";
import { EInvoiceDetailsForm } from "../../e-invoice-details/e-invoice-details/EInvoiceDetailsForm";
import { OtherDetailsForm } from "../../more-details/OtherDetailsForm";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { DATE_FORMAT, ORIGIN, getAuthHeaders } from "@/lib/constants";
import { useVerify } from "@/lib/hooks/useVerify";
import { cn } from "@/lib/utils/cn";

type Params = {
  form: any;
  slug?: string;
  cashSalesData?: any;
  defaultCurrentCompany?: any;
  setIsPaidAmountManuallyUpdated: (updated: boolean) => void;
  tempRowAttachments: any;
  setTempRowAttachments: (v: any) => void;
  isPaid?: boolean;
  preferenceData?: any;
  isExpand?: boolean;
  verifyVoucher: (value: string) => void;
  tempRowCashSalesDetailsList: any[];
  clearVoucherData: () => void;
  cashSalesDetails?: any;
  id?: string | null;
  formResetKey?: number;
  allDropdowns: DropdownData;
};

export function DocumentDetailsForm({
  form,
  slug,
  cashSalesData,
  defaultCurrentCompany,
  setIsPaidAmountManuallyUpdated,
  tempRowAttachments,
  setTempRowAttachments,
  isPaid,
  preferenceData,
  isExpand,
  verifyVoucher,
  tempRowCashSalesDetailsList,
  clearVoucherData,
  cashSalesDetails,
  id,
  formResetKey,
  allDropdowns
}: Params) {
  const { verifyField } = useVerify(
    form,
    "/cash_sales/api/cash-sales/verify",
    "cashSales",
    form.watch("UUID"),
  );

  const headers = getAuthHeaders();

  const dropdownAgentColumns = [
    { accessorKey: "agentCode", header: "Agent Code" },
    { accessorKey: "agentName", header: "Agent Name" },
    { accessorKey: "description", header: "Description" },
  ];

  const [salesAgentDropdownData, setSalesAgentDropdownData] = useState<any[]>([]);
  const [showSalesAgentTable, setShowSalesAgentTable] = useState(false);
  const salesAgentInputRef = useRef(null);
  const salesAgentDropdownRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [servicingAgentDropdownData, setServicingAgentDropdownData] = useState<any[]>([]);
  const [showServicingAgentTable, setShowServicingAgentTable] = useState(false);
  const servicingAgentInputRef = useRef(null);
  const servicingAgentDropdownRef = useRef(null);

  const [collectionAgentDropdownData, setCollectionAgentDropdownData] = useState<any[]>([]);
  const [showCollectionAgentTable, setShowCollectionAgentTable] = useState(false);
  const collectionAgentInputRef = useRef(null);
  const collectionAgentDropdownRef = useRef(null);

  //  Dealer Dropdown ──
  const [dealerDropdownTableData, setDealerDropdownTableData] = useState<any[]>([]);
  const [showTableDealer, setShowTableDealer] = useState(false);
  const [dealerFilter, setDealerFilter] = useState("");
  const dealerInputRef = useRef(null);
  const dealerDropdownRef = useRef(null);

  const dropdownDealerColumns = [
    { accessorKey: "customerCode", header: "Customer Code" },
    { accessorKey: "customerName", header: "Customer Name" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => <DescriptionCellTooltip row={row} /> },
  ];

  //  Credit Term Dropdown 
  const [termsDropdownTableData, setTermsDropdownTableData] = useState<any[]>([]);
  const [showTableTerms, setShowTableTerms] = useState(false);
  const [termsFilter, setTermsFilter] = useState("");
  const termsInputRef = useRef(null);
  const termsDropdownRef = useRef(null);

  const dropdownTermsColumns = [
    { accessorKey: "creditTermCode", header: "Credit Term Code" },
    { accessorKey: "creditTermType", header: "Credit Term Type" },
    { accessorKey: "description", header: "Description", cell: ({ row }) => <DescriptionCellTooltip row={row} /> },
  ];

  useEffect(() => {
    setSalesAgentDropdownData(allDropdowns.agent ?? []);
    setServicingAgentDropdownData(allDropdowns.agent ?? []);
    setCollectionAgentDropdownData(allDropdowns.agent ?? []);
    setDealerDropdownTableData(allDropdowns.customer ?? []);
    setTermsDropdownTableData(allDropdowns.creditTerm ?? []);
  }, [allDropdowns]);

  const handleAgentDropdownRefreshed = (freshRows: any[]) => {
    setSalesAgentDropdownData(freshRows);
    setServicingAgentDropdownData(freshRows);
    setCollectionAgentDropdownData(freshRows);
  };

  const handleDealerDropdownRefreshed = (freshRows: any[]) => {
    setDealerDropdownTableData(freshRows);
  };

  const handleTermsDropdownRefreshed = (freshRows: any[]) => {
    setTermsDropdownTableData(freshRows);
  };

  const fetchAgentDropdownData = (type: "sales" | "servicing" | "collection") => {
    if (type === "sales") setShowSalesAgentTable(true);
    else if (type === "servicing") setShowServicingAgentTable(true);
    else if (type === "collection") setShowCollectionAgentTable(true);
  };

  const toggleTableDealer = () => setShowTableDealer((prev) => !prev);
  const toggleTableTerms = () => setShowTableTerms((prev) => !prev);

  const onClickRowSalesAgent = (row: any) => {
    form.setValue("salesAgentName", row.agentName);
    form.setValue("salesAgent", row.UUID);
    setShowSalesAgentTable(false);
  };

  const onClickRowServicingAgent = (row: any) => {
    form.setValue("servicingAgentName", row.agentName);
    form.setValue("servicingAgent", row.UUID);
    setShowServicingAgentTable(false);
  };

  const onClickRowCollectionAgent = (row: any) => {
    form.setValue("collectionAgentName", row.agentName);
    form.setValue("collectionAgent", row.UUID);
    setShowCollectionAgentTable(false);
  };

  const onClickRowDealer = (row: any) => {
    form.setValue("dealer", row.UUID);
    form.setValue("dealerCode", row.customerCode);
    form.setValue("dealerName", row.customerName);
    setDealerFilter("");
    setShowTableDealer(false);
  };

  const onClickRowTerms = (row: any) => {
    form.setValue("creditTerm", row.UUID);
    form.setValue("creditTermCode", row.creditTermCode);
    form.setValue("paymentTerm", row.creditTermCode);
    form.setValue("creditTermType", row.creditTermType);
    setTermsFilter("");
    setShowTableTerms(false);
  };

  useEffect(() => {
    const subscription = form.watch((value: any, { name }: any) => {
      if (name === "additionalDiscount") {
        form.trigger();
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  //  E-Invoice type guard 
  const invoiceType = useWatch({ control: form.control, name: "invoiceType" });
  const totalPayableAmount = useWatch({ control: form.control, name: "totalPayableAmount" });
  const currencyRate = useWatch({ control: form.control, name: "currencyRate" });
  const totalPayableAmountCurrency = Number(totalPayableAmount) * Number(currencyRate);

  const toastShown = useRef(false);

  useEffect(() => {
    if (invoiceType === "Consolidate" && totalPayableAmountCurrency >= 10000) {
      if (!toastShown.current) {
        toast({
          title: "Error",
          description:
            "Total invoice amount cannot exceed RM10,000 for Consolidate Invoice. Please change the E-Invoice Type.",
          variant: "destructive",
          duration: 4000,
        });
        toastShown.current = true;
      }
    } else {
      toastShown.current = false;
    }
  }, [invoiceType, totalPayableAmountCurrency]);

  let userHasRuleData = { userHasRule: [] };
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("userRule");
    if (stored) userHasRuleData = JSON.parse(stored);
  }

  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const fileList = Array.from(event.target.files);
    const mergeArray: any = [...tempRowAttachments, ...fileList];
    setTempRowAttachments(mergeArray);
  };

  function handleDeleteFile(index) {
    var newCustomInfoFiles = [...tempRowAttachments];
    newCustomInfoFiles.splice(index, 1);
    setTempRowAttachments(newCustomInfoFiles);
  }

  const checkValidVoucher = async (value: string) => {
    const voucherValue = form.getValues("voucher");
    const voucherCode = form.getValues("voucherCode");
    if (!voucherValue) return;

    const verifyVoucherForm = new FormData();
    verifyVoucherForm.append("voucherNumber", voucherCode);
    verifyVoucherForm.append("docDate", value);

    const itemUUIDs = tempRowCashSalesDetailsList.map((row) => row.item);
    if (itemUUIDs.length === 0) return;

    itemUUIDs.forEach((uuid, index) => {
      verifyVoucherForm.append(`itemUUIDs[${index}]`, uuid);
    });

    try {
      const response = await fetch(
        `${ORIGIN}/promotion_voucher/api/promotion-voucher/verify-voucher`,
        { method: "POST", headers, body: verifyVoucherForm },
      );
      if (!response.ok) throw new Error("Failed to verify voucher");
      const data = await response.json();

      if (data && data.data.length === 0) {
        form.setValue("voucher", "");
        form.setValue("voucherCode", "");
        clearVoucherData();
        toast({
          title: "Invalid Voucher",
          description: "Voucher not available.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (err) {
      console.error("Error verifying voucher:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const pairs = [
        [salesAgentDropdownRef, salesAgentInputRef, () => setShowSalesAgentTable(false)],
        [servicingAgentDropdownRef, servicingAgentInputRef, () => setShowServicingAgentTable(false)],
        [collectionAgentDropdownRef, collectionAgentInputRef, () => setShowCollectionAgentTable(false)],
        [dealerDropdownRef, dealerInputRef, () => setShowTableDealer(false)],
        [termsDropdownRef, termsInputRef, () => setShowTableTerms(false)],
        [dropdownRef, inputRef, () => setShowTableDealer(false)],
      ];

      pairs.forEach(([dropRef, inputRef, close]) => {
        if (
          dropRef.current &&
          !dropRef.current.contains(event.target as Node) &&
          inputRef.current !== event.target
        ) {
          (close as () => void)();
        }
      });
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <Card className={isExpand ? "hidden" : "w-full h-[280px] shadow-sm"}>
        <CardContent className="px-1.5 py-1">
          <Form {...form}>
            <form>
              {/* Tab Section*/}
              <Tabs className="flex w-full flex-col">
                <TabList className="flex">
                  {["Document", "Other", "Remarks", "Attachment", "E-Invoice"].map((label) => (
                    <Tab
                      key={label}
                      className="cursor-pointer rounded-tl-md rounded-tr-md border-[1px] border-gray-200 bg-transparent px-2 py-1 text-[12px] text-black outline-none transition-all duration-300 ease-in-out"
                      selectedClassName="!bg-blue-300 border-blue-300 text-white"
                    >
                      {label}
                    </Tab>
                  ))}
                </TabList>

                {/* Tab Document Details */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  <div className="flex items-start justify-center gap-x-2.5 pt-1.5">

                    <div className="flex flex-col flex-1 gap-y-2">
                      {/* Document Number Field */}
                      <FormField
                        control={form.control}
                        name="docNo"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl>
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className={cn(
                                          "h-7 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out",
                                          slug === "edit" && "bg-erp-gray-1 border-gray-200 text-black focus-visible:ring-0 focus-visible:outline-none",
                                          form.formState.errors.docNo &&
                                          "border-red-500 text-red-500 focus-visible:ring-red-500",
                                        )}
                                        {...field}
                                        moduleName="cashSales"
                                        fieldName="docNo"
                                        columnName="Doc. No."
                                        onBlur={() => {
                                          if (field.value && field.value.trim()) {
                                            verifyField("docNo", field.value);
                                          }
                                        }}
                                        readOnly={true}
                                        placeholder="Doc No"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Doc No
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl>
                              <Textarea
                                className="px-2 h-[195px] resize-none text-[11px] outline-none transition-all duration-300 ease-in-out"
                                {...field}
                                moduleName="cashSales"
                                fieldName="description"
                                columnName="Description"
                                placeholder="Description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex flex-1 flex-col gap-y-1.5">

                      {/* Doc Date */}
                      <FormField
                        control={form.control}
                        name="docDate"
                        defaultValue={Math.floor(Date.now() / 1000)}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <Popover>
                              <TooltipProvider delayDuration={1000}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <PopoverTrigger asChild>
                                      <FormControl>
                                        <Button
                                          className={cn(
                                            "h-7 w-full rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out hover:bg-background/50",
                                            !field.value && "text-muted-foreground",
                                          )}
                                          variant="outline"
                                          size="sm"
                                        >
                                          {field.value
                                            ? moment.unix(Number(field.value)).format(DATE_FORMAT)
                                            : "Document Date"}
                                          <CalendarIcon className="ml-auto size-3.5 text-gray-400" />
                                        </Button>
                                      </FormControl>
                                    </PopoverTrigger>
                                  </TooltipTrigger>

                                  <TooltipContent side="top" align="start">
                                    Document Date
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={
                                    field.value
                                      ? moment.unix(Number(field.value)).toDate()
                                      : undefined
                                  }
                                  onSelect={(date) => {
                                    if (!date) {
                                      field.onChange(null);
                                      return;
                                    }

                                    const unixTimestamp = Math.floor(date.getTime() / 1000);
                                    checkValidVoucher(unixTimestamp.toString());
                                    field.onChange(unixTimestamp);
                                  }}
                                  initialFocus
                                  defaultMonth={
                                    field.value
                                      ? moment.unix(Number(field.value)).toDate()
                                      : new Date()
                                  }
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Credit Term UUID (hidden) */}
                      <FormField
                        control={form.control}
                        name="creditTerm"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>Credit Term UUID:</FormLabel>
                            <FormControl>
                              <Input className="h-7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Credit Term No. of Days (hidden) */}
                      <FormField
                        control={form.control}
                        name="noOfDays"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>No. of Days:</FormLabel>
                            <FormControl>
                              <Input className="h-7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Terms Field */}
                      <FormField
                        control={form.control}
                        name="creditTermCode"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl className="relative">
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className="h-7 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                        {...field}
                                        onClick={toggleTableTerms}
                                        ref={termsInputRef}
                                        autoComplete="off"
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setTermsFilter(e.target.value);
                                        }}
                                        placeholder="Terms"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Terms
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                  <FaMagnifyingGlass className="size-3 text-gray-400" />
                                </div>
                                {showTableTerms && (
                                  <div ref={termsDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                                    <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownTermsColumns}
                                        data={termsDropdownTableData}
                                        onClickRow={onClickRowTerms}
                                        filterValue={termsFilter}
                                        filterColumn="creditTermCode"
                                        tableName="creditTerm"
                                        onRefreshed={handleTermsDropdownRefreshed}
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

                      {/* Dealer */}
                      <FormField
                        control={form.control}
                        name="dealerName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl className="relative">
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className="h-7 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                        {...field}
                                        onClick={toggleTableDealer}
                                        onChange={(e) => {
                                          field.onChange(e);
                                          setDealerFilter(e.target.value);
                                        }}
                                        ref={inputRef}
                                        autoComplete="off"
                                        placeholder="Dealer"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Dealer
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                  <FaMagnifyingGlass className="size-3 text-gray-400" />
                                </div>
                                {showTableDealer && (
                                  <div ref={dropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                                    <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownDealerColumns}
                                        data={dealerDropdownTableData}
                                        onClickRow={onClickRowDealer}
                                        filterValue={dealerFilter}
                                        filterColumn="customerName"
                                        tableName="customer"
                                        onRefreshed={handleDealerDropdownRefreshed}
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

                      {/* Sales Agent UUID (hidden) */}
                      <FormField
                        control={form.control}
                        name="salesAgent"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>Sales Agent UUID:</FormLabel>
                            <FormControl>
                              <Input className="h-7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Sales Agent Name */}
                      <FormField
                        control={form.control}
                        name="salesAgentName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl className="relative">
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className="h-7 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                        {...field}
                                        readOnly
                                        onClick={() => { fetchAgentDropdownData("sales"); }}
                                        ref={salesAgentInputRef}
                                        autoComplete="off"
                                        placeholder="Sales Agent"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Sales Agent
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                  <FaMagnifyingGlass className="size-3 text-gray-400" />
                                </div>
                                {showSalesAgentTable && (
                                  <div ref={salesAgentDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                                    <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownAgentColumns}
                                        data={salesAgentDropdownData}
                                        onClickRow={onClickRowSalesAgent}
                                        tableName="agent"
                                        onRefreshed={handleAgentDropdownRefreshed}
                                      />
                                      <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Servicing Agent UUID (hidden) */}
                      <FormField
                        control={form.control}
                        name="servicingAgent"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>Servicing Agent UUID:</FormLabel>
                            <FormControl>
                              <Input className="h-7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Servicing Agent Name */}
                      <FormField
                        control={form.control}
                        name="servicingAgentName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl className="relative">
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className="h-7 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                        {...field}
                                        readOnly
                                        onClick={() => { fetchAgentDropdownData("servicing"); }}
                                        ref={servicingAgentInputRef}
                                        autoComplete="off"
                                        placeholder="Servicing Agent"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Servicing Agent
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                  <FaMagnifyingGlass className="size-3 text-gray-400" />
                                </div>
                                {showServicingAgentTable && (
                                  <div ref={servicingAgentDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                                    <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownAgentColumns}
                                        data={servicingAgentDropdownData}
                                        onClickRow={onClickRowServicingAgent}
                                        tableName="agent"
                                        onRefreshed={handleAgentDropdownRefreshed}
                                      />
                                      <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collection Agent UUID (hidden) */}
                      <FormField
                        control={form.control}
                        name="collectionAgent"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormLabel>Collection Agent UUID:</FormLabel>
                            <FormControl>
                              <Input className="h-7.5" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Collection Agent Name */}
                      <FormField
                        control={form.control}
                        name="collectionAgentName"
                        render={({ field }) => (
                          <FormItem className="flex flex-col space-y-1">
                            <FormControl className="relative">
                              <div className="relative">
                                <TooltipProvider delayDuration={1000}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Input
                                        className="h-7 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                                        {...field}
                                        readOnly
                                        onClick={() => { fetchAgentDropdownData("collection"); }}
                                        ref={collectionAgentInputRef}
                                        autoComplete="off"
                                        placeholder="Collection Agent"
                                      />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" align="start">
                                      Collection Agent
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
                                  <FaMagnifyingGlass className="size-3 text-gray-400" />
                                </div>
                                {showCollectionAgentTable && (
                                  <div ref={collectionAgentDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                                    <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownAgentColumns}
                                        data={collectionAgentDropdownData}
                                        onClickRow={onClickRowCollectionAgent}
                                        tableName="agent"
                                        onRefreshed={handleAgentDropdownRefreshed}
                                      />
                                      <ScrollBar orientation="vertical" />
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* E-Invoice Type */}
                      <FormField
                        control={form.control}
                        name="invoiceType"
                        defaultValue={"E-Invoice"}
                        render={({ field }) => (
                          <FormItem className="flex min-w-0 flex-col space-y-1">
                            <FormControl>
                              <Select
                                value={field.value || "None"}
                                onValueChange={field.onChange}
                                disabled={
                                  form.getValues("consolidateTo") &&
                                    form.getValues("consolidateTo") !== null
                                    ? true
                                    : false
                                }
                              >
                                <SelectTrigger className="box-border h-7 w-full rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="None">None</SelectItem>
                                  <SelectItem
                                    value="Consolidate"
                                    disabled={totalPayableAmountCurrency >= 10000}
                                  >
                                    Consolidate
                                  </SelectItem>
                                  <SelectItem value="E-Invoice">E-Invoice</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </TabPanel>

                {/* Tab More Details */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  <OtherDetailsForm
                    key={formResetKey}
                    tempRowAttachments={tempRowAttachments}
                    setTempRowAttachments={setTempRowAttachments}
                    form={form}
                    slug={slug}
                    isPaid={isPaid}
                    preferenceData={preferenceData}
                    verifyVoucher={verifyVoucher}
                    setIsPaidAmountManuallyUpdated={setIsPaidAmountManuallyUpdated}
                    allDropdowns={allDropdowns}
                  />
                </TabPanel>

                {/* Tab Remarks */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  <Tabs className="h-[240px] pt-1.5 flex">
                    {/* Left - Editor */}
                    <div className="min-w-0 flex-1">
                      {/* Remark 1 */}
                      <TabPanel
                        forceRender
                        className="hidden"
                        selectedClassName="react-tabs__tab-panel--selected"
                      >
                        <FormField
                          control={form.control}
                          name="remark1"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TextEditorInline
                                  value={field.value || ""}
                                  onChange={(val) => field.onChange(val)}
                                  className="h-[190px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabPanel>

                      {/* Remark 2 */}
                      <TabPanel
                        forceRender
                        className="hidden"
                        selectedClassName="react-tabs__tab-panel--selected"
                      >
                        <FormField
                          control={form.control}
                          name="remark2"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TextEditorInline
                                  value={field.value || ""}
                                  onChange={(val) => field.onChange(val)}
                                  className="h-[190px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabPanel>

                      {/* Remark 3 */}
                      <TabPanel
                        forceRender
                        className="hidden"
                        selectedClassName="react-tabs__tab-panel--selected"
                      >
                        <FormField
                          control={form.control}
                          name="remark3"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TextEditorInline
                                  value={field.value || ""}
                                  onChange={(val) => field.onChange(val)}
                                  className="h-[190px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabPanel>

                      {/* Remark 4 */}
                      <TabPanel
                        forceRender
                        className="hidden"
                        selectedClassName="react-tabs__tab-panel--selected"
                      >
                        <FormField
                          control={form.control}
                          name="remark4"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <TextEditorInline
                                  value={field.value || ""}
                                  onChange={(val) => field.onChange(val)}
                                  className="h-[190px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabPanel>
                    </div>

                    {/* Right - Vertical TabList*/}
                    <TabList className="ml-1 flex flex-col gap-y-1">
                      {[
                        { label: "Remark 1", icon: <FiAlignLeft className="size-3.5" /> },
                        { label: "Remark 2", icon: <FiAlignLeft className="size-3.5" /> },
                        { label: "Remark 3", icon: <FiAlignLeft className="size-3.5" /> },
                        { label: "Remark 4", icon: <FiAlignLeft className="size-3.5" /> },
                      ].map((item, index) => (
                        <Tab
                          key={index}
                          className="flex h-11 w-12 cursor-pointer flex-col items-center justify-center gap-y-0.5 rounded-md border border-gray-200 bg-white text-[9px] text-gray-600 outline-none transition-all duration-200 ease-in-out"
                          selectedClassName="!bg-blue-300 border-blue-300 text-white"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Tab>
                      ))}
                    </TabList>
                  </Tabs>
                </TabPanel>

                {/* Tab Attachment */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  <Card className="h-[245px] w-full border-none !shadow-none">
                    <CardContent className="h-full px-1">
                      <div className="flex h-full flex-col gap-y-2 pt-1.5">
                        {/* Upload Area */}
                        <label
                          htmlFor="attachments"
                          className="w-full flex flex-1 cursor-pointer flex-col items-center justify-center gap-y-3 rounded-md border-2 border-dashed border-gray-300 bg-white px-6 shadow-sm transition-colors duration-200 hover:border-blue-400"
                        >
                          <BsFileEarmarkPdf className="size-8 text-gray-500" />
                          <span className="text-[14px] font-normal text-gray-500">
                            Click to upload file
                          </span>
                          <Input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className="hidden"
                          />
                        </label>

                        {/* File List */}
                        {tempRowAttachments?.length > 0 && (
                          <ScrollArea className="h-full flex-1 px-2">
                            {tempRowAttachments.map((file, index) => (
                              <div className="flex min-w-0 items-center gap-x-1 py-0.5" key={index}>
                                <a
                                  href={file.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 truncate text-[13px] text-blue-600 hover:text-blue-800 hover:underline"
                                  title={file.name}
                                >
                                  {file.name}
                                </a>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteFile(index)}
                                  className="mr-1.5 flex-shrink-0 text-red-500 transition-all duration-300 ease-in-out hover:text-red-700"
                                >
                                  <MdDelete className="size-4.5" title="Remove" />
                                </button>
                              </div>
                            ))}
                          </ScrollArea>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabPanel>

                {/* Tab E Invoice */}
                <TabPanel
                  forceRender
                  className="hidden"
                  selectedClassName="react-tabs__tab-panel--selected"
                >
                  <Tabs>
                    <div className="flex">
                      {/* Left Container*/}
                      <div className="min-w-0 flex-1">
                        {/* Document Details */}
                        <TabPanel
                          forceRender
                          className="hidden"
                          selectedClassName="react-tabs__tab-panel--selected"
                        >
                          <EInvoiceDetailsForm
                            form={form}
                            cashSalesDetails={
                              id
                                ? cashSalesDetails
                                  ? cashSalesDetails.rows
                                  : []
                                : tempRowCashSalesDetailsList
                            }
                            tempRowCashSalesDetailsList={tempRowCashSalesDetailsList}
                            preferenceData={preferenceData}
                            cashSalesData={cashSalesData}
                          />
                        </TabPanel>

                        {/* Me */}
                        <TabPanel
                          forceRender
                          className="hidden"
                          selectedClassName="react-tabs__tab-panel--selected"
                        >
                          <SupplierDetailsForm
                            form={form}
                            supplierCode={form.getValues("supplierCode")}
                            defaultCurrentCompany={slug == "new" ? defaultCurrentCompany : ""}
                          />
                        </TabPanel>

                        {/* Buyer Information */}
                        <TabPanel
                          forceRender
                          className="hidden"
                          selectedClassName="react-tabs__tab-panel--selected"
                        >
                          <BuyerDetailsForm form={form} />
                        </TabPanel>
                      </div>

                      {/* Right - Vertical TabList */}
                      <TabList className="ml-1 flex flex-col gap-y-1">
                        {[
                          { icon: <GoFileDirectory className="size-4.5" />, label: "Document Details" },
                          { icon: <FaHotel className="size-4.5" />, label: "Me" },
                          { icon: <FiUser className="size-4.5" />, label: "Buyer Details" },
                        ].map((item, index) => (
                          <Tab
                            key={index}
                            className="flex h-9 w-9 cursor-pointer flex-col items-center justify-center gap-y-0.5 rounded-md border border-gray-200 bg-white text-[9px] text-gray-600 outline-none transition-all duration-200 ease-in-out"
                            selectedClassName="!bg-blue-300 border-blue-300 text-white"
                          >
                            <TooltipProvider delayDuration={1000}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="flex h-full w-full items-center justify-center">
                                    {item.icon}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="start">
                                  {item.label}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </Tab>
                        ))}
                      </TabList>
                    </div>
                  </Tabs>
                </TabPanel>
              </Tabs>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}