"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CalendarIcon } from "lucide-react";

import moment from 'moment';

import { DATE_FORMAT, getAuthHeaders, ORIGIN } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DropdownTable from "@/components/data-table/DropdownTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input, NumberInputField } from "@/components/ui/input";
import { DropdownData } from "@/components/data-table/GetAllDropdown";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from "@/components/ui/card";

type Params = {
  form: any;
  isPaid?: boolean;
  setIsPaidAmountManuallyUpdated: (updated: boolean) => void;
  userHasRuleData?: { userHasRule: string[] };
  allDropdowns: DropdownData;
};

type DropdownConfig = {
  tableName: string;
  columns: { accessorKey: string; header: string }[];
  valueField: string;
  displayField: string;
  formValueField: string;
  formDisplayField: string;
  additionalMappings?: { sourceField: string; targetFormField: string }[];
};

export function PaymentDetailsForm({ form, isPaid, setIsPaidAmountManuallyUpdated, userHasRuleData, allDropdowns }: Params) {
  const headers = getAuthHeaders();

  // Payment Method Dropdown 
  const [dropdownState, setDropdownState] = useState({
    currentDropdown: null as string | null,
    data: [] as any[],
    originalData: [] as any[],
    showTable: false,
  });

  const dropdownTableRef = useRef<HTMLDivElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const projectInputRef = useRef<HTMLInputElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const prepaymentRefNoInputRef = useRef<HTMLInputElement>(null);
  const prepaymentRefNoDropdownRef = useRef<HTMLDivElement>(null);

  // Project Dropdown 
  const [projectDropdownTableData, setProjectDropdownTableData] = useState<any[]>([]);
  const [showTableProject, setShowTableProject] = useState(false);

  const dropdownProjectColumns = [
    { accessorKey: "projectCode", header: "Project Code" },
    { accessorKey: "description", header: "Description" },
  ];

  const dropdownConfigs: Record<string, DropdownConfig> = {
    paymentMethod: {
      tableName: "paymentMethod",
      columns: [
        { accessorKey: "paymentMethodCode", header: "Payment Method Code" },
        { accessorKey: "eInvoicePaymentMethodCode", header: "E-Invoice Payment Method Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "paymentMethodCode",
      formValueField: "paymentMethod",
      formDisplayField: "paymentMethodCode",
      additionalMappings: [
        { sourceField: "bankACNo", targetFormField: "bankACNo" },
        { sourceField: "bankACName", targetFormField: "bankACName" },
        { sourceField: "eInvoicePaymentMethodCode", targetFormField: "eInvoicePaymentMethodCode" },
        { sourceField: "QRAttachmentLink", targetFormField: "QRAttachmentLink" },
      ],
    },
  };

  useEffect(() => {
    setDropdownState((prev) => ({
      ...prev,
      originalData: allDropdowns.paymentMethod ?? [],
      data: allDropdowns.paymentMethod ?? [],
    }));
    setProjectDropdownTableData(allDropdowns.project ?? []);
  }, [allDropdowns]);

  const handlePaymentMethodDropdownRefreshed = (freshRows: any[]) => {
    setDropdownState((prev) => ({
      ...prev,
      originalData: freshRows,
      data: prev.currentDropdown === "paymentMethod" ? freshRows : prev.data,
    }));
  };

  const handleProjectDropdownRefreshed = (freshRows: any[]) => {
    setProjectDropdownTableData(freshRows);
  };

  const fetchDropdownData1 = (dropdownKey: string) => {
    const config = dropdownConfigs[dropdownKey];
    if (!config) return;

    setDropdownState((prev) => ({
      ...prev,
      currentDropdown: dropdownKey,
      data: prev.originalData, // reset to full list on open
      showTable: !prev.showTable || prev.currentDropdown !== dropdownKey
        ? true
        : false,
    }));
  };

  const toggleTableProject = () => setShowTableProject((prev) => !prev);

  const onClickRow = (row: any) => {
    const config = dropdownConfigs[dropdownState.currentDropdown!];

    if (config) {
      form.setValue(config.formValueField, row[config.valueField]);
      form.setValue(config.formDisplayField, row[config.displayField]);

      if (config.additionalMappings) {
        config.additionalMappings.forEach((mapping) => {
          let value = row[mapping.sourceField];
          if (Array.isArray(value) && value.length > 0) value = value[0];
          if (value) form.setValue(mapping.targetFormField, value);
        });
      }
    }

    setDropdownState((prev) => ({ ...prev, showTable: false }));
  };

  const onClickRowProject = (row: any) => {
    form.setValue("paymentProject", row.UUID);
    form.setValue("paymentProject", row.projectCode);
    setShowTableProject(false);
  };

  const handlePaidAmountChange = (value: string) => {
    if (value === "0.00" || value === "0" || value.startsWith("0.")) {
      setIsPaidAmountManuallyUpdated(false);
    } else {
      setIsPaidAmountManuallyUpdated(true);
    }
    form.setValue("paidAmount", value);
  };

  const handleAdditionalDiscountChange = (value: string) => {
    form.setValue("additionalDiscount", value);
    form.trigger("additionalDiscount");
  };

  useEffect(() => {
    const subscription = form.watch((value: any, { name }: any) => {
      if (name === "additionalDiscount") form.trigger();
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleDropdownSearchChange = (dropdownKey: string, searchTerm: string) => {
    const config = dropdownConfigs[dropdownKey];
    if (!config) return;

    form.setValue(config.formDisplayField, searchTerm);

    const filtered = dropdownState.originalData.filter((row: any) =>
      row[config.displayField]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    setDropdownState((prev) => ({
      ...prev,
      data: filtered,
      showTable: true,
      currentDropdown: dropdownKey,
    }));
  };

  // Prepayment Ref. No. Dropdown 
  const [prepaymentRefNoDropdownData, setPrepaymentRefNoDropdownData] = useState<any[]>([]);
  const [showPrepaymentRefNoTable, setShowPrepaymentRefNoTable] = useState(false);

  const dropdownPrepaymentRefNoColumns = [
    { accessorKey: "docNo", header: "Doc. No." },
    { accessorKey: "docDateFormat", header: "Doc. Date" },
    { accessorKey: "description", header: "Description" },
  ];

  const onClickRowPrepaymentRefNo = (row: any) => {
    form.setValue("prepaymentRefNo", row.docNo);
    form.setValue("prepaymentRefNoCode", row.prepaymentRefNoCode);
    form.setValue("bankACNo", row.bankACNo);
    form.setValue("bankACName", row.bankACName);
    form.setValue("eInvoicePaymentMethodCode", row.eInvoicePaymentMethodCode);

    const qrValue = Array.isArray(row.QRAttachmentLink)
      ? row.QRAttachmentLink[0] ?? null
      : row.QRAttachmentLink ?? null;
    form.setValue("QRAttachmentLink", qrValue);

    setShowPrepaymentRefNoTable(false);
  };

  const fetchDropdownData = async (table: string) => {
    try {
      const form_data = new FormData();
      form_data.append(`table[0]`, table);

      if (table === "customerPayment") {
        const customerCode = form.getValues("customerCode") || "";
        form_data.append("param[customerCode]", customerCode);
        form_data.append("param[valid]", "1");
      }

      const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
        method: "POST",
        headers,
        body: form_data,
      });
      if (!response.ok) throw new Error("Failed to fetch dropdown data");
      const data = await response.json();

      setPrepaymentRefNoDropdownData(data.rows);
      setShowPrepaymentRefNoTable(true);
    } catch (error) {
      throw new Error("Failed to fetch dropdown data");
    }
  };

  const handlePrepaymentAmountChange = (e: any, decimalPoint: 2) => {
    let newValue = e.target.value
      .replace(/(?<=\.\d*)\./g, "")
      .replace(/[^\d.]/g, "")
      .replace(".", "");
    newValue =
      (newValue.substr(0, newValue.length - decimalPoint)
        ? newValue.substr(0, newValue.length - decimalPoint)
        : "0") +
      "." +
      newValue.slice(newValue.length - decimalPoint);
    newValue = Number(newValue).toFixed(decimalPoint);
    form.setValue(e.target.name, newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownTableRef.current &&
        !dropdownTableRef.current.contains(event.target as Node) &&
        dropdownInputRef.current !== event.target
      ) {
        setDropdownState((prev) => ({ ...prev, showTable: false }));
      }
      if (
        prepaymentRefNoDropdownRef.current &&
        !prepaymentRefNoDropdownRef.current.contains(event.target as Node) &&
        prepaymentRefNoInputRef.current !== event.target
      ) {
        setShowPrepaymentRefNoTable(false);
      }
      if (
        projectDropdownRef.current &&
        !projectDropdownRef.current.contains(event.target as Node) &&
        projectInputRef.current !== event.target
      ) {
        setShowTableProject(false);
      }
    };

    document.body.addEventListener("click", handleClickOutside);
    return () => document.body.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-y-2.5 pt-1.5">

          {/* First Row */}
          <div className="grid grid-cols-2 items-center gap-x-2">
            {/* Payment UUID */}
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="hidden">
                  <FormLabel>Payment Method UUID:</FormLabel>
                  <FormControl><Input className="h-7.5" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Mode */}
            <FormField
              control={form.control}
              name="paymentMethodCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="relative">
                    <div className="relative">
                      <TooltipProvider delayDuration={1000}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              className="h-7.5 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                              {...field}
                              onChange={(e) => handleDropdownSearchChange("paymentMethod", e.target.value)}
                              onClick={() => fetchDropdownData1("paymentMethod")}
                              ref={dropdownState.currentDropdown === "paymentMethod" ? dropdownInputRef : null}
                              autoComplete="off"
                              placeholder="Payment Method"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">Payment Method</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <FaMagnifyingGlass className="size-3 text-gray-400" />
                      </div>
                      {dropdownState.showTable && dropdownState.currentDropdown === "paymentMethod" && (
                        <div ref={dropdownTableRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                          <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                            <DropdownTable
                              columns={dropdownConfigs.paymentMethod.columns}
                              data={dropdownState.data}
                              onClickRow={onClickRow}
                              customerId={form.getValues("customerCode") ?? ""}
                              tableName="paymentMethod"
                              onRefreshed={handlePaymentMethodDropdownRefreshed}
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

            {/* Bank Account No */}
            <FormField
              control={form.control}
              name="bankACNo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            className="h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                            {...field}
                            moduleName="salesInvoice"
                            fieldName="bankACNo"
                            columnName="Bank Account No."
                            placeholder="Bank A/C No"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Bank A/C No</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 items-center gap-x-2">
            {/* Bank Account Name */}
            <FormField
              control={form.control}
              name="bankACName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input
                            className="h-7.5 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                            {...field}
                            moduleName="salesInvoice"
                            fieldName="bankACName"
                            placeholder="Bank A/C Name"
                            readOnly
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Bank A/C Name</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Payment Terms (hidden) */}
            <FormField control={form.control} name="paymentTerm" render={({ field }) => (
              <FormItem className="hidden"><FormControl><Input className="h-7.5" {...field} moduleName="salesInvoice" fieldName="paymentTerm" columnName="Payment Terms" placeholder="Payment Terms" /></FormControl><FormMessage /></FormItem>
            )} />

            {/* Prepayment Amount (hidden) */}
            <FormField control={form.control} name="prepaymentAmount" render={({ field }) => (
              <FormItem className="hidden"><FormControl><Input className="h-7.5 rounded-md px-2 pr-8 text-[11px]" {...field} onChange={(e) => handlePrepaymentAmountChange(e, 2)} placeholder="Prepayment Amount" /></FormControl><FormMessage /></FormItem>
            )} />

            {/* QR Attachment */}
            <FormField
              control={form.control}
              name="QRAttachmentLink"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex h-7.5 min-w-[150px] items-center rounded-md border border-input bg-background px-2 text-[11px]">
                            {field.value?.link ? (
                              <a href={field.value.link} target="_blank" rel="noopener noreferrer" className="truncate text-blue-500 underline hover:text-blue-700 duration-300 ease-in-out transition-all" onClick={(e) => e.stopPropagation()}>
                                {field.value.name}
                              </a>
                            ) : (
                              <span className="text-muted-foreground">QR Attachment</span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">QR Attachment</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-2 items-center gap-x-2">
            {/* E-Invoice Payment Method Code */}
            <FormField
              control={form.control}
              name="eInvoicePaymentMethodCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input className="h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out" {...field} placeholder="E Invoice Payment Method Code" readOnly />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">E Invoice Payment Method Code</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prepayment Date (hidden) */}
            <FormField control={form.control} name="prepaymentDate" render={({ field }) => (
              <FormItem className="hidden">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button className={cn("h-7.5 w-full rounded-md px-2 text-[11px]", !field.value && "text-muted-foreground")} variant="outline" size="lg">
                        {field.value ? moment.unix(field.value).format(DATE_FORMAT) : "Prepayment Date"}
                        <CalendarIcon className="ml-auto size-3.5 text-gray-400" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? moment.unix(Number(field.value)).toDate() : undefined}
                      onSelect={(date) => field.onChange(date ? Math.floor(date.getTime() / 1000).toString() : "")}
                      initialFocus defaultMonth={new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )} />

            {/* Prepayment Ref No (hidden) */}
            <FormField control={form.control} name="prepaymentRefNo" render={({ field }) => (
              <FormItem className="hidden">
                <FormControl className="relative">
                  <div className="relative">
                    <Input className="h-7.5 rounded-md px-2 pr-8 text-[11px]" {...field} onClick={() => fetchDropdownData("customerPayment")} ref={prepaymentRefNoInputRef} autoComplete="off" placeholder="Prepayment Ref No" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><FaMagnifyingGlass className="size-3 text-gray-400" /></div>
                    {showPrepaymentRefNoTable && (
                      <div ref={prepaymentRefNoDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                        <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                          <DropdownTable
                            columns={dropdownPrepaymentRefNoColumns}
                            data={prepaymentRefNoDropdownData}
                            onClickRow={onClickRowPrepaymentRefNo}
                            customerId={form.getValues("customerCode") ?? ""}
                            tableName="project"
                            onRefreshed={handleProjectDropdownRefreshed}
                          />
                          <ScrollBar orientation="vertical" />
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            {/* Bill Ref No (hidden) */}
            <FormField control={form.control} name="billRefNo" render={({ field }) => (
              <FormItem className="hidden"><FormControl><Input className="h-7.5 rounded-md px-2 text-[11px]" {...field} placeholder="Bill Ref No" /></FormControl><FormMessage /></FormItem>
            )} />

            {/* Payment Project */}
            <FormField
              control={form.control}
              name="paymentProject"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="relative">
                    <div className="relative">
                      <TooltipProvider delayDuration={1000}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Input
                              className="h-7.5 rounded-md px-2 pr-8 text-[11px] outline-none transition-all duration-300 ease-in-out"
                              {...field}
                              onClick={toggleTableProject}
                              ref={inputRef}
                              autoComplete="off"
                              disabled={isPaid}
                              placeholder="Payment Project"
                            />
                          </TooltipTrigger>
                          <TooltipContent side="top" align="center">Payment Project</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FaMagnifyingGlass className="size-3 text-gray-400" />
                      </div>
                      {showTableProject && (
                        <div ref={projectDropdownRef} className="absolute bottom-[170px] z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md">
                          <ScrollArea className="h-[50cqh] bg-erp-gray-3">
                            <DropdownTable columns={dropdownProjectColumns} data={projectDropdownTableData} onClickRow={onClickRowProject} customerId={form.getValues("customerCode") ?? ""} />
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

          {/* Fourth Row */}
          <div className="grid grid-cols-2 items-center gap-x-2">
            {/* Bank Charge */}
            <FormField
              control={form.control}
              name="bankCharge"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NumberInputField
                            className="text-left h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                            form={form} fieldName="bankCharge" allowDecimal={true} {...field} disabled={isPaid} placeholder="Bank Charge"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Bank Charge</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cheque No */}
            <FormField
              control={form.control}
              name="chequeNo"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Input className="h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out" {...field} disabled={isPaid} placeholder="Cheque No" />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Cheque No</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Fifth Row */}
          <div className="grid grid-cols-2 items-center gap-x-2">
            {/* Paid Amount */}
            <FormField
              control={form.control}
              name="paidAmount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NumberInputField
                            className="text-left h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                            form={form} fieldName="paidAmount" allowDecimal={true} value={field.value || ""}
                            onChange={(e) => handlePaidAmountChange(e.target.value)} disabled={isPaid} placeholder="Paid Amount"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Paid Amount</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Discount */}
            <FormField
              control={form.control}
              name="additionalDiscount"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TooltipProvider delayDuration={1000}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <NumberInputField
                            className="text-left h-7.5 rounded-md px-2 text-[11px] outline-none transition-all duration-300 ease-in-out"
                            form={form} fieldName="additionalDiscount" allowDecimal={true} value={field.value || ""}
                            onChange={(e) => handleAdditionalDiscountChange(e.target.value)}
                            disabled={
                              isPaid ||
                              !userHasRuleData?.userHasRule?.includes(
                                "enable-cash-sales-additional-discount-update"
                              )
                            }
                            placeholder="Additional Discount"
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" align="center">Additional Discount</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}