"use client";

import React, { useEffect, useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { FaMagnifyingGlass } from "react-icons/fa6";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DropdownTable from "@/components/data-table/DropdownTable";
import TextEditorModal from "@/components/custom/TextEditorModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
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

import { useRouter } from "next/navigation";

import {
  ORIGIN,
  getAuthHeaders,
  getCurrentAcc,
  getCurrentAccount,
  getCurrentCompanyUUID,
  getCurrentCompany,
} from "@/lib/constants";

import TopActionBar from "./TopActionBar";

interface SalesPreferencesFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onSaveAndOpenDialog?: () => void;
  tempSalesPreferences: any;
  setTempSalesPreferences: (data: any) => void;
  handleChange: (field: string, value: any) => void;
}

type DropdownConfig = {
  tableName?: string;
  endpoint?: string;
  columns: { accessorKey: string; header: string; cell?: any }[];
  valueField: string;
  displayField: string;
  formValueField: string;
  formDisplayField: string;
  additionalMappings?: { sourceField: string; targetFormField: string }[];
};

export default function SalesPreferencesForm({
  form,
  onSubmit,
  onSaveAndOpenDialog,
  tempSalesPreferences,
  setTempSalesPreferences,
  handleChange,
}: SalesPreferencesFormProps) {
  const headers = getAuthHeaders();
  const currentAcc = getCurrentAcc();
  const currentAccount = getCurrentAccount();

  const router = useRouter();

  // Unified dropdown state
  const [dropdownState, setDropdownState] = useState({
    currentDropdown: null as string | null,
    data: [] as any[],
    showTable: false,
  });

  // Single ref for the dropdown container and input
  const dropdownInputRef = useRef(null);
  const dropdownTableRef = useRef(null);

  // Dropdown configurations
  const dropdownConfigs: Record<string, DropdownConfig> = {
    company: {
      tableName: "company",
      columns: [
        { accessorKey: "companyID", header: "Company Code" },
        { accessorKey: "company", header: "Company" },
        {
          accessorKey: "description",
          header: "Description",
          cell: ({ row }) => <DescriptionCellTooltip row={row} />,
        },
      ],
      valueField: "UUID",
      displayField: "company",
      formValueField: "company",
      formDisplayField: "companyName",
    },
    state: {
      tableName: "state",
      columns: [
        { accessorKey: "code", header: "State" },
        {
          accessorKey: "description",
          header: "Description",
          cell: ({ row }) => <DescriptionCellTooltip row={row} />,
        },
      ],
      valueField: "UUID",
      displayField: "code",
      formValueField: "customerState",
      formDisplayField: "formattedCustomerStateCode",
      additionalMappings: [
        { sourceField: "code", targetFormField: "customerStateCode" },
      ],
    },
    country: {
      tableName: "countryOfOrigin",
      columns: [
        { accessorKey: "code", header: "Country" },
        {
          accessorKey: "description",
          header: "Description",
          cell: ({ row }) => <DescriptionCellTooltip row={row} />,
        },
      ],
      valueField: "UUID",
      displayField: "code",
      formValueField: "customerCountry",
      formDisplayField: "formattedCustomerCountryCode",
      additionalMappings: [
        { sourceField: "code", targetFormField: "customerCountryCode" },
      ],
    },
    creditTerm: {
      tableName: "creditTerm",
      columns: [
        { accessorKey: "creditTermCode", header: "Credit Term Code" },
        { accessorKey: "creditTermType", header: "Credit Term Type" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "creditTermCode",
      formValueField: "creditTerm",
      formDisplayField: "creditTermCode",
    },
    currency: {
      tableName: "currency",
      columns: [
        { accessorKey: "currencyCode", header: "Currency Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "currencyCode",
      formValueField: "currency",
      formDisplayField: "currencyCode",
      additionalMappings: [
        { sourceField: "exchangeRateSales", targetFormField: "currencyRate" },
      ],
    },
    paymentMethod: {
      tableName: "paymentMethod",
      columns: [
        { accessorKey: "paymentMethodCode", header: "Payment Method Code" },
        { accessorKey: "eInvoicePaymentMethodCode", header: "E-Invoice Payment Method Code" },
        { accessorKey: "description", header: "Description" },
      ],
      valueField: "UUID",
      displayField: "description",
      formValueField: "customerPaymentMethod",
      formDisplayField: "customerPaymentMethodCode",
    },
  };

  // Text Editor
  const [editorData, setEditorData] = useState({
    field: "",
    value: "",
    title: "",
  });

  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const openTextEditor = (field: string, value: string, title: string) => {
    setEditorData({ field, value, title });
    setIsEditorOpen(true);
  };

  const handleEditorSave = (value: string) => {
    form.setValue(editorData.field, value);

    setTempSalesPreferences({
      ...tempSalesPreferences,
      [editorData.field]: value,
    });

    setIsEditorOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      dropdownTableRef.current &&
      !dropdownTableRef.current.contains(event.target) &&
      dropdownInputRef.current !== event.target
    ) {
      setDropdownState((prev) => ({ ...prev, showTable: false }));
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Unified function to fetch dropdown data
  const fetchDropdownData = async (dropdownKey: string) => {
    try {
      const config = dropdownConfigs[dropdownKey];

      if (!config) return;

      const formData = new FormData();

      formData.append("table[]", config.tableName);

      const response = await fetch(
        `${ORIGIN}/universal/get-all-drop-down-table-data`,
        {
          method: "POST",
          headers,
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch ${dropdownKey} data`);
      }

      const data = await response.json();
      setDropdownState({
        currentDropdown: dropdownKey,
        data: data.rows,
        showTable: true,
      });
    } catch (error) {
      console.error(`Error fetching ${dropdownKey} data:`, error);
    }
  };

  // Unified function to handle row click
  const onClickRow = (row: any) => {
    const config = dropdownConfigs[dropdownState.currentDropdown!];

    if (config) {
      // Handle special formatting for state and country
      if (dropdownState.currentDropdown === "state") {
        const formattedValue = `${row.code}`;

        handleChange(config.formDisplayField, formattedValue);
      } else if (dropdownState.currentDropdown === "country") {
        const formattedValue = `${row.description}(${row.code})`;

        handleChange(config.formDisplayField, formattedValue);
      } else {
        handleChange(config.formDisplayField, row[config.displayField]);
      }

      handleChange(config.formValueField, row[config.valueField]);

      // Apply any additional field mappings defined in the config
      if (config.additionalMappings) {
        config.additionalMappings.forEach((mapping) => {
          if (row[mapping.sourceField]) {
            handleChange(mapping.targetFormField, row[mapping.sourceField]);
          }
        });
      }
    }

    setDropdownState((prev) => ({ ...prev, showTable: false }));
  };

  useEffect(() => {
    const currentCompanyID = getCurrentCompanyUUID();
    const currentCompanyName = getCurrentCompany();

    if (!form.getValues("company")) {
      form.setValue("company", currentCompanyID);
    }

    if (!form.getValues("companyName")) {
      form.setValue("companyName", currentCompanyName);
    }
  }, [form]);

  const renderHtml = (html: string) => {
    return { __html: html };
  };

  return (
    <>
      <div className="flex h-full flex-col bg-white @container-[size] overflow-hidden">
        <TopActionBar onSave={form.handleSubmit(onSubmit)} />
        <ScrollArea className="h-[90cqh] p-1.5">
          <div className="max-w-7xl p-4 mx-40">
            <Form {...form}>
              <form className="space-y-4" id="preferencesForm">
                <h2 className="text-md font-bold mb-6">
                  Sales Module Preferences - Customize settings for each section.
                </h2>

                <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 mb-4 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        General Preference
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="currencyCode"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Currency
                                </FormLabel>
                                <FormControl className="w-full">
                                  <div className="relative">
                                    <Input
                                      className="h-7 pr-8 border rounded"
                                      {...field}
                                      onClick={() =>
                                        fetchDropdownData("currency")
                                      }
                                      ref={
                                        dropdownState.currentDropdown ===
                                          "currency"
                                          ? dropdownInputRef
                                          : null
                                      }
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleChange(
                                          "currencyCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                      <FaMagnifyingGlass className="text-gray-400" />
                                    </div>
                                    {dropdownState.showTable &&
                                      dropdownState.currentDropdown ===
                                      "currency" && (
                                        <div
                                          ref={dropdownTableRef}
                                          className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                        >
                                          <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                            <DropdownTable
                                              columns={
                                                dropdownConfigs.currency.columns
                                              }
                                              data={dropdownState.data}
                                              onClickRow={onClickRow}
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

                          <FormField
                            control={form.control}
                            name="currency"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default Currency:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange("currency", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="creditTermCode"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Terms
                                </FormLabel>
                                <FormControl className="w-full">
                                  <div className="relative">
                                    <Input
                                      className="h-7 pr-8 border rounded"
                                      {...field}
                                      onClick={() =>
                                        fetchDropdownData("creditTerm")
                                      }
                                      ref={
                                        dropdownState.currentDropdown ===
                                          "creditTerm"
                                          ? dropdownInputRef
                                          : null
                                      }
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleChange(
                                          "creditTermCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                      <FaMagnifyingGlass className="text-gray-400" />
                                    </div>
                                    {dropdownState.showTable &&
                                      dropdownState.currentDropdown ===
                                      "creditTerm" && (
                                        <div
                                          ref={dropdownTableRef}
                                          className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                        >
                                          <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                            <DropdownTable
                                              columns={
                                                dropdownConfigs.creditTerm
                                                  .columns
                                              }
                                              data={dropdownState.data}
                                              onClickRow={onClickRow}
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

                          <FormField
                            control={form.control}
                            name="creditTerm"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default Terms:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange("creditTerm", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="decimal"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Decimal Precision
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    {...field}
                                    onChange={(e) =>
                                      handleChange("decimal", e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerPaymentMethodCode"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Payment Method
                                </FormLabel>
                                <FormControl className="w-full">
                                  <div className="relative">
                                    <Input
                                      className="h-7 pr-8 border rounded"
                                      {...field}
                                      onClick={() =>
                                        fetchDropdownData("paymentMethod")
                                      }
                                      ref={
                                        dropdownState.currentDropdown ===
                                          "paymentMethod"
                                          ? dropdownInputRef
                                          : null
                                      }
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleChange(
                                          "customerPaymentMethodCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                      <FaMagnifyingGlass className="text-gray-400" />
                                    </div>
                                    {dropdownState.showTable &&
                                      dropdownState.currentDropdown ===
                                      "paymentMethod" && (
                                        <div
                                          ref={dropdownTableRef}
                                          className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                        >
                                          <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                            <DropdownTable
                                              columns={
                                                dropdownConfigs.paymentMethod
                                                  .columns
                                              }
                                              data={dropdownState.data}
                                              onClickRow={onClickRow}
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

                          <FormField
                            control={form.control}
                            name="customerPaymentMethod"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default Payment Method:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerPaymentMethod",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="rounding"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "rounding",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Rounding Precision
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Quotation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: QT202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="quotationAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "quotationAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="quotationFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "quotationFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="quotationNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "quotationNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="quotationValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <div className="flex flex-col w-3/4">
                                  <FormControl>
                                    <input
                                      type="text"
                                      className="border rounded px-2 py-1 w-full text-sm"
                                      maxLength={5}
                                      {...field}
                                      onChange={(e) =>
                                        handleChange(
                                          "quotationValidity",
                                          e.target.value.replace(/[^0-9]/g, '')
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <p className="text-[11px] text-muted-foreground mt-1">
                                    days from the above date of quotation
                                  </p>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="quotationNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "quotationNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "quotationNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                        </div>
                        <FormField
                          control={form.control}
                          name="quotationDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "quotationDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Sales Order</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SO202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesOrderAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesOrderAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesOrderFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesOrderFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesOrderNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesOrderNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="salesOrderValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesOrderValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesOrderRemark"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Remark
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesOrderRemark",
                                        field.value,
                                        "Default Remark"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesOrderRemark",
                                          field.value,
                                          "Default Remark"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesOrderNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesOrderNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesOrderNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />


                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="salesOrderDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesOrderDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        Sales Delivery Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SDO202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesDeliveryOrderAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesDeliveryOrderAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesDeliveryOrderFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDeliveryOrderFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesDeliveryOrderNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDeliveryOrderNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="salesDeliveryOrderValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDeliveryOrderValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesDeliveryOrderNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesDeliveryOrderNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesDeliveryOrderNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        </div>
                        <FormField
                          control={form.control}
                          name="deliveryOrderDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "deliveryOrderDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Sales Invoice</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SI202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesInvoiceAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesInvoiceAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesInvoiceFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesInvoiceFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesInvoiceNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesInvoiceNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="salesInvoiceValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesInvoiceValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesInvoiceNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesInvoiceNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesInvoiceNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />


                        </div>
                        <FormField
                          control={form.control}
                          name="salesInvoiceDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesInvoiceDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        Sales Credit Note
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SCN202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesCreditNoteAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesCreditNoteAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesCreditNoteFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesCreditNoteFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesCreditNoteNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesCreditNoteNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="salesCreditNoteValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesCreditNoteValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesCreditNoteNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesCreditNoteNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesCreditNoteNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        </div>
                        <FormField
                          control={form.control}
                          name="salesCreditNoteDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesCreditNoteDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        Sales Debit Note
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SDN202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesDebitNoteAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesDebitNoteAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesDebitNoteFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDebitNoteFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesDebitNoteNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDebitNoteNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="salesDebitNoteValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesDebitNoteValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesDebitNoteNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "salesDebitNoteNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "salesDebitNoteNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        </div>
                        <FormField
                          control={form.control}
                          name="salesDebitNoteDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesDebitNoteDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        Customer Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CP202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="customerPaymentAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "customerPaymentAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="customerPaymentFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerPaymentFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerPaymentNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerPaymentNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="customerPaymentNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "customerPaymentNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "customerPaymentNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Customer Contra</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: SCC202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="salesPurchaseContraAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "salesPurchaseContraAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="salesPurchaseContraFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesPurchaseContraFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="salesPurchaseContraNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "salesPurchaseContraNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                <div className="grid grid-cols-2 gap-4 items-start">
                  {/* <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">
                        Consolidated e-Invoice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CEI202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="consolidateInvoiceAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "consolidateInvoiceAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="consolidateInvoiceFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "consolidateInvoiceFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="consolidateInvoiceNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "consolidateInvoiceNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="consolidateInvoiceValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "consolidateInvoiceValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="consolidateInvoiceNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "consolidateInvoiceNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "consolidateInvoiceNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Cash Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CS202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="cashSalesAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "cashSalesAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="cashSalesFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "cashSalesFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cashSalesNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "cashSalesNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="cashSalesValidity"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Doc Validity Days
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={5}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "cashSalesValidity",
                                        e.target.value.replace(/[^0-9]/g, '')
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cashSalesNote"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Note
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <div
                                    className="border rounded px-3 py-2 w-full text-sm min-h-[100px] cursor-text overflow-auto focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors font-normal leading-relaxed resize-y"
                                    onClick={() =>
                                      openTextEditor(
                                        "cashSalesNote",
                                        field.value,
                                        "Default Note"
                                      )
                                    }
                                    dangerouslySetInnerHTML={renderHtml(
                                      field.value
                                    )}
                                    tabIndex={0}
                                    role="textbox"
                                    aria-multiline="true"
                                    style={{
                                      whiteSpace: "pre-wrap",
                                      fontFamily: "inherit",
                                      lineHeight: "1.5",
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        openTextEditor(
                                          "cashSalesNote",
                                          field.value,
                                          "Default Note"
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                        </div>
                        <FormField
                          control={form.control}
                          name="cashSalesDefaultDate"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "cashSalesDefaultDate",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Default Start & End Date
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cashSalesHeader"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "cashSalesHeader",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Cash Sales Header
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CUST202504001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="customerAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "customerAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6 mb-4">
                          <FormField
                            control={form.control}
                            name="customerFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <hr className="border-black mb-2" />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="formattedCustomerCountryCode"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default Country
                                </FormLabel>
                                <FormControl className="w-full">
                                  <div className="relative">
                                    <Input
                                      className="h-7 pr-8 border rounded"
                                      {...field}
                                      onClick={() =>
                                        fetchDropdownData("country")
                                      }
                                      ref={
                                        dropdownState.currentDropdown ===
                                          "country"
                                          ? dropdownInputRef
                                          : null
                                      }
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleChange(
                                          "formattedCustomerCountryCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                      <FaMagnifyingGlass className="text-gray-400" />
                                    </div>
                                    {dropdownState.showTable &&
                                      dropdownState.currentDropdown ===
                                      "country" && (
                                        <div
                                          ref={dropdownTableRef}
                                          className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                        >
                                          <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                            <DropdownTable
                                              columns={
                                                dropdownConfigs.country.columns
                                              }
                                              data={dropdownState.data}
                                              onClickRow={onClickRow}
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

                          <FormField
                            control={form.control}
                            name="customerCountry"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default Country:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerCountry",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerCountryCode"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default Country:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerCountryCode",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="formattedCustomerStateCode"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Default State
                                </FormLabel>
                                <FormControl className="w-full">
                                  <div className="relative">
                                    <Input
                                      className="h-7 pr-8 border rounded"
                                      {...field}
                                      onClick={() => fetchDropdownData("state")}
                                      ref={
                                        dropdownState.currentDropdown ===
                                          "state"
                                          ? dropdownInputRef
                                          : null
                                      }
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleChange(
                                          "formattedCustomerStateCode",
                                          e.target.value
                                        )
                                      }
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                      <FaMagnifyingGlass className="text-gray-400" />
                                    </div>
                                    {dropdownState.showTable &&
                                      dropdownState.currentDropdown ===
                                      "state" && (
                                        <div
                                          ref={dropdownTableRef}
                                          className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                        >
                                          <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                            <DropdownTable
                                              columns={
                                                dropdownConfigs.state.columns
                                              }
                                              data={dropdownState.data}
                                              onClickRow={onClickRow}
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

                          <FormField
                            control={form.control}
                            name="customerState"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default State:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerState",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerStateCode"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormLabel>Default State:</FormLabel>
                                <FormControl>
                                  <Input
                                    className="h-7"
                                    {...field}
                                    readOnly={true}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerStateCode",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Customer Category</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CUSTCAT00000001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="customerCategoryAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "customerCategoryAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="customerCategoryFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerCategoryFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerCategoryNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerCategoryNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                {/* <div className="grid grid-cols-2 gap-4 items-start">
                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Customer Group</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CG00000001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="customerGroupAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "customerGroupAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="customerGroupFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerGroupFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerGroupNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerGroupNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Customer Tag</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: CT00000001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="customerTagAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "customerTagAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="customerTagFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerTagFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="customerTagNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "customerTagNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>


                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Agent Type</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: AT00000001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="agentTypeAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "agentTypeAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="agentTypeFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "agentTypeFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="agentTypeNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "agentTypeNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    collapsible
                    defaultCollapsed={true}
                    className="bg-erp-blue-2 h-fit"
                  >
                    <CardHeader className="px-3 py-2">
                      <CardTitle className="text-md">Agent</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="bg-white p-4 rounded shadow">
                        <p className="text-sm">
                          <span className="font-bold">Running No Format</span>
                          <span className="text-gray-500 text-xs ml-1">
                            (Sample: A00000001)
                          </span>
                        </p>

                        <FormField
                          control={form.control}
                          name="agentAutoGenEn"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 mt-1">
                              <FormControl>
                                <Checkbox
                                  checked={field.value === "1"}
                                  onCheckedChange={(checked) =>
                                    handleChange(
                                      "agentAutoGenEn",
                                      checked ? "1" : "0"
                                    )
                                  }
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-medium pb-2">
                                Enable Auto Number Generation
                              </FormLabel>
                            </FormItem>
                          )}
                        />

                        <div className="space-y-1 ml-6">
                          <FormField
                            control={form.control}
                            name="agentFormat"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Format
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    maxLength={20}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "agentFormat",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="agentNextNum"
                            render={({ field }) => (
                              <FormItem className="flex items-center">
                                <FormLabel className="text-sm font-medium w-1/4">
                                  Next Number
                                </FormLabel>
                                <FormControl className="w-3/4">
                                  <input
                                    type="text"
                                    className="border rounded px-2 py-1 w-full text-sm"
                                    placeholder="No. only"
                                    maxLength={10}
                                    {...field}
                                    onChange={(e) =>
                                      handleChange(
                                        "agentNextNum",
                                        e.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div> */}

                <div className="grid grid-flow-col-dense items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-5">
                  <FormField
                    control={form.control}
                    name="accountName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1">
                        <FormLabel>Sys Account:</FormLabel>
                        <FormControl>
                          <Input
                            className="h-7.5 bg-erp-gray-1 text-gray-500"
                            {...field}
                            value={currentAcc}
                            readOnly
                            ref={dropdownInputRef}
                            autoComplete="off"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-y-1">
                        <FormLabel>Ownership:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="h-7.5 pr-8 bg-erp-gray-1 text-gray-500"
                              {...field}
                              // onClick={() => fetchDropdownData("company")}
                              ref={
                                dropdownState.currentDropdown === "company"
                                  ? dropdownInputRef
                                  : null
                              }
                              readOnly
                              autoComplete="off"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              <FaMagnifyingGlass className="text-gray-400" />
                            </div>
                            {dropdownState.showTable &&
                              dropdownState.currentDropdown === "company" && (
                                <div
                                  ref={dropdownTableRef}
                                  className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                                >
                                  <ScrollArea className="h-[30cqh] bg-erp-gray-3">
                                    <DropdownTable
                                      columns={dropdownConfigs.company.columns}
                                      data={dropdownState.data}
                                    // onClickRow={onClickRow}
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

                {/* Hidden Fields */}
                <FormField
                  control={form.control}
                  name="account"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>UUID:</FormLabel>
                      <FormControl>
                        <Input
                          className="h-7"
                          {...field}
                          value={currentAccount}
                          readOnly
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="hidden">
                      <FormLabel>UUID:</FormLabel>
                      <FormControl>
                        <Input className="h-7" {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>

          {isEditorOpen && (
            <TextEditorModal
              title={editorData.title}
              initialValue={editorData.value}
              onSave={handleEditorSave}
              onClose={() => setIsEditorOpen(false)}
            />
          )}
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
}