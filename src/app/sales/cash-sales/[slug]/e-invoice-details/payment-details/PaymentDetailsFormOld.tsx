"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { CalendarIcon } from "lucide-react";

import moment from 'moment';

import { DATE_FORMAT, getAuthHeaders, ORIGIN } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DropdownTable from "@/components/data-table/DropdownTable";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
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

export function PaymentDetailsFormOld({ form }: Params) {
  const headers = getAuthHeaders();

  const [dropdownState, setDropdownState] = useState({
    currentDropdown: null as string | null,
    data: [] as any[],
    originalData: [] as any[],
    showTable: false,
  });

  const dropdownTableRef = useRef<HTMLDivElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);

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
    },
  };

  const fetchDropdownData1 = async (dropdownKey: string) => {
    try {
      const config = dropdownConfigs[dropdownKey];

      if (!config) return;

      var form_data = new FormData();

      form_data.append(`table[0]`, config.tableName);

      const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
        method: "POST",
        headers,
        body: form_data,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${dropdownKey} data`);
      }

      const data = await response.json();

      setDropdownState({
        currentDropdown: dropdownKey,
        data: data.rows,
        originalData: data.rows,
        showTable: true,
      });
    } catch (error) {
      console.error(`Error fetching ${dropdownKey} data:`, error);

      throw new Error(`Failed to fetch ${dropdownKey} data`);
    }
  };

  const onClickRow = (row: any) => {
    const config = dropdownConfigs[dropdownState.currentDropdown!];

    if (config) {
      form.setValue(config.formValueField, row[config.valueField]);
      form.setValue(config.formDisplayField, row[config.displayField]);

      if (config.additionalMappings) {
        config.additionalMappings.forEach((mapping) => {
          if (row[mapping.sourceField]) {
            form.setValue(mapping.targetFormField, row[mapping.sourceField]);
          }
        });
      }
    }

    setDropdownState((prev) => ({ ...prev, showTable: false }));
  };

  // Click Outside Handler for Dropdown Tables
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownTableRef.current &&
      !dropdownTableRef.current.contains(event.target as Node) &&
      dropdownInputRef.current !== event.target
    ) {
      setDropdownState((prev) => ({ ...prev, showTable: false }));
    }

    if (prepaymentRefNoDropdownRef.current && !prepaymentRefNoDropdownRef.current.contains(event.target as Node) && prepaymentRefNoInputRef.current !== event.target) {
      setShowPrepaymentRefNoTable(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside);
    
    return () => {
      document.body.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Prepayment Ref. No. Dropdown
  const [prepaymentRefNoDropdownData, setPrepaymentRefNoDropdownData] = useState<[]>([]);
  const [showPrepaymentRefNoTable, setShowPrepaymentRefNoTable] = useState(false);
  const prepaymentRefNoInputRef = useRef<HTMLInputElement>(null);
  const prepaymentRefNoDropdownRef = useRef<HTMLDivElement>(null);
  
  const dropdownPrepaymentRefNoColumns = [ 
    { accessorKey: "docNo", header: "Doc. No." }, 
    { accessorKey: "docDateFormat", header: "Doc. Date" }, 
    { accessorKey: "description", header: "Description" }, 
  ];

  const onClickRowPrepaymentRefNo = (row: any) => {
    form.setValue("prepaymentRefNo", row.docNo);
    form.setValue("prepaymentRefNoCode", row.prepaymentRefNoCode);

    setShowPrepaymentRefNoTable(false);
  };
  
  const fetchDropdownData = async (table:string) => {
    try {
      var form_data = new FormData();

      form_data.append(`table[0]`, table);

      // Include customerCode in the request if the table is "customerPayment"
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

      if (!response.ok) {
        throw new Error('Failed to fetch dropdown data');
      }

      const data = await response.json();

      if (table == "paymentMethod"){
        // setPaymentMethodDropdownData(data.rows);
        // setShowPaymentMethodTable(true);
      } else {
        setPrepaymentRefNoDropdownData(data.rows);
        setShowPrepaymentRefNoTable(true);
      }
    } catch (error) {
      throw new Error('Failed to fetch dropdown data');
    }
  };

  const handlePrepaymentAmountChange = (e: any, decimalPoint:2) => {
    let newValue = e.target.value.replace(/(?<=\.\d*)\./g, '').replace(/[^\d.]/g, '').replace(".", "");
    
    newValue = (newValue.substr(0, newValue.length-decimalPoint) ? newValue.substr(0, newValue.length-decimalPoint) : "0") + "." + newValue.slice(newValue.length - decimalPoint);
    newValue = Number(newValue).toFixed(decimalPoint);

    form.setValue(e.target.name, newValue);
  };

  const handleDropdownSearchChange = (dropdownKey: string, searchTerm: string) => {
    const config = dropdownConfigs[dropdownKey];
    if (!config) return;

    form.setValue(config.formDisplayField, searchTerm);

    if (!dropdownState.originalData || dropdownState.currentDropdown !== dropdownKey) {
      fetchDropdownData(dropdownKey);
      return;
    }

    const filtered = dropdownState.originalData.filter((row: any) =>
      row[config.displayField]
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setDropdownState((prev) => ({
      ...prev,
      data: filtered,
      showTable: true,
      currentDropdown: dropdownKey,
    }));
  };

  return (
    <Card collapsible defaultCollapsed={false} className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns) */}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6">
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Payment Method UUID:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMethodCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Payment Method:</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input
                          className="h-7.5 pr-8"
                          {...field}
                          // readOnly
                          onChange={(e) => handleDropdownSearchChange("paymentMethod", e.target.value)}
                          onClick={() => fetchDropdownData1("paymentMethod")}
                          ref={dropdownState.currentDropdown === "paymentMethod" ? dropdownInputRef : null}
                          autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FaMagnifyingGlass className="text-gray-400" />
                        </div>
                        {dropdownState.showTable && dropdownState.currentDropdown === "paymentMethod" && (
                          <div
                            ref={dropdownTableRef}
                            className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                          >
                            <ScrollArea className="h-[30cqh] bg-erp-gray-3">
                              <DropdownTable
                                columns={dropdownConfigs.paymentMethod.columns}
                                data={dropdownState.data}
                                onClickRow={onClickRow}
                                customerId={form.getValues("customerCode") ?? ""} 
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

              <FormField
                control={form.control}
                name="bankACNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Bank A/C No.:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="bankACNo"
                        columnName="Bank Account No."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentTerm"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-4">
                    <FormLabel>Payment Terms:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="paymentTerm"
                        columnName="Payment Terms"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns) */}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6 mt-4">
              <FormField
                control={form.control}
                name="prepaymentAmount"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Prepayment Amount:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5 text-right" {...field} onChange={(e) => handlePrepaymentAmountChange(e, 2)}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prepaymentDate"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Prepayment Date:</FormLabel>
                    <Popover > {/* Pass isOpen and onClose props */}
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            className={cn(
                              "flex h-7.5 w-full",
                              !field.value && "text-muted-foreground",
                            )}
                            variant="outline"
                            size="sm"
                          >
                            {field.value
                              ?  moment.unix(field.value).format(DATE_FORMAT)
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 text-gray-400" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ? moment.unix(Number(field.value)).toDate() : undefined}
                          onSelect={(date) => {
                            const unixTimestamp = date ? Math.floor(date.getTime() / 1000) : "";
                            field.onChange(unixTimestamp.toString());
                          }}
                          initialFocus
                          defaultMonth={new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prepaymentRefNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-3">
                    <FormLabel>Prepayment Ref. No.:</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input 
                          className="h-7.5 pr-8" 
                          {...field}
                          onClick={() => {fetchDropdownData("customerPayment")}} 
                          ref={prepaymentRefNoInputRef} 
                          autoComplete="off" 
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FaMagnifyingGlass className="text-gray-400" /> {/* Using the search icon */}
                        </div>
                        {showPrepaymentRefNoTable && (
                          <div ref={prepaymentRefNoDropdownRef} className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]">
                            <ScrollArea className="h-[30cqh] bg-erp-gray-3">
                              <DropdownTable
                                columns={dropdownPrepaymentRefNoColumns}
                                data={prepaymentRefNoDropdownData}
                                onClickRow={onClickRowPrepaymentRefNo}
                                customerId={form.getValues("customerCode") ?? ""} 
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

              <FormField
                control={form.control}
                name="billRefNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Bill Ref. No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}