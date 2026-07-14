"use client";

import React, { useEffect, useState, useRef } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";

import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import { FaMagnifyingGlass } from "react-icons/fa6";
import type { Row } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import DropdownTable from "@/components/data-table/DropdownTable";
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

import { getAuthHeaders, ORIGIN } from "@/lib/constants";

type Params = {
  form: any;
};

export function BuyerDetailsFormOld({ form }: Params) {
  const headers = getAuthHeaders();

  const [currentCompanyUUID, setCurrentCompanyUUID] = useState<string | null>(null);

  // Watch customer fields for real-time updates
  const watchedCustomerName = form.watch("customerName");
  const watchedTIN = form.watch("TIN");
  const watchedBRN = form.watch("BRN");
  const watchedSSTNo = form.watch("SSTNo");
  const watchedEmail = form.watch("email");
  const watchedPhoneNo = form.watch("phoneNo");
  const watchedAddress = form.watch("address");
  const watchedTaxExNo = form.watch("taxExNo");
  const currentCustomerChecked = form.watch("currentCustomer");

  useEffect(() => {
    const currentCompany = JSON.parse(localStorage.getItem("currentCompany") || "null");

    if (currentCompany && currentCompany.UUID) {
      setCurrentCompanyUUID(currentCompany.UUID);
    } else {
      setCurrentCompanyUUID(null);
    }
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target instanceof Node)) return;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current !== event.target
    ) {
      setShowTableMSICCode(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  type MSICCode = {
    code: string;
    description: string;
    UUID: string;
  };

  // MSIC Code Dropdown
  const [showTableMSICCode, setShowTableMSICCode] = useState(false);
  const [MSICCodeDropdownTableData, setMSICCodeDropdownTableData] = useState<MSICCode[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMSICCodeData = MSICCodeDropdownTableData.filter(
    (row) =>
      row.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dropdownMSICCodeColumns = [
    { accessorKey: "code", header: "MSIC" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: Row<MSICCode> }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const toggleTableMSICCode = async () => {
    const formData = new FormData();
    const MSICCode = "MISCCode";

    formData.append("table[]", MSICCode);

    if (!showTableMSICCode) {
      try {
        const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agent drop-down data");
        }

        const MSICCodeData = await response.json();

        setMSICCodeDropdownTableData(MSICCodeData.rows);
        setShowTableMSICCode(true);
      } catch (error) {
        console.error("Error fetching MSICCode drop-down data:", error);
      }
    } else {
      setShowTableMSICCode(false);
    }
  };

  const onClickRowMSICCode = (row: any) => {
    form.setValue("buyerMSICCode", row.UUID);
    form.setValue("MISCCodeCode", row.code);
    form.setValue("buyerBusinessNature", row.description);
    setSearchTerm(row.code);
    setShowTableMSICCode(false);
  };

  useEffect(() => {
    const savedState = localStorage.getItem("cash-sales.currentCustomerChecked");

    if (savedState === "true") {
      form.setValue("currentCustomer", "1");
    } else {
      form.setValue("currentCustomer", "0");
    }
  }, [form]);

  // Real-time sync when customer details change and checkbox is checked
  useEffect(() => {
    if (currentCustomerChecked === "1") {
      form.setValue("buyerName", watchedCustomerName || "");
      form.setValue("buyerTIN", watchedTIN || "");
      form.setValue("buyerBRN", watchedBRN || "");
      form.setValue("buyerSSTNo", watchedSSTNo || "");
      form.setValue("buyerEmail", watchedEmail || "");
      form.setValue("buyerPhoneNo", watchedPhoneNo || "");
      form.setValue("buyerAddress", watchedAddress || "");
      form.setValue("buyerTTXNo", watchedTaxExNo || "");
      form.setValue("recipient", watchedCustomerName || "");
      form.setValue("recipientTIN", watchedTIN || "");
      form.setValue("recipientBRN", watchedBRN || "");
      form.setValue("recipientSSTNo", watchedSSTNo || "");
      form.setValue("recipientAddress", watchedAddress || "");
      form.setValue("recipientTTXNo", watchedTaxExNo || "");
    }
  }, [
    currentCustomerChecked,
    watchedCustomerName,
    watchedTIN,
    watchedBRN,
    watchedSSTNo,
    watchedEmail,
    watchedPhoneNo,
    watchedAddress,
    watchedTaxExNo,
    form
  ]);

  const handleCurrentCustomerChange = (event: { target: { checked: CheckedState } }) => {
    const isChecked = event.target.checked;

    localStorage.setItem("cash-sales.currentCustomerChecked", isChecked.toString());

    if (isChecked) {
      form.setValue("buyerName", form.getValues("customerName"));
      form.setValue("buyerTIN", form.getValues("TIN"));
      form.setValue("buyerBRN", form.getValues("BRN"));
      form.setValue("buyerSSTNo", form.getValues("SSTNo"));
      form.setValue("buyerEmail", form.getValues("email"));
      form.setValue("buyerPhoneNo", form.getValues("phoneNo"));
      form.setValue("buyerAddress", form.getValues("address"));
      form.setValue("buyerTTXNo", form.getValues("taxExNo"));
      form.setValue("recipient", form.getValues("customerName"));
      form.setValue("recipientTIN", form.getValues("TIN"));
      form.setValue("recipientBRN", form.getValues("BRN"));
      form.setValue("recipientSSTNo", form.getValues("SSTNo"));
      form.setValue("recipientAddress", form.getValues("address"));
      form.setValue("recipientTTXNo", form.getValues("taxExNo"));
    } else {
      form.setValue("buyerName", "");
      form.setValue("buyerTIN", "");
      form.setValue("buyerBRN", "");
      form.setValue("buyerSSTNo", "");
      form.setValue("buyerEmail", "");
      form.setValue("buyerPhoneNo", "");
      form.setValue("buyerAddress", "");
      form.setValue("buyerTTXNo", "");
      form.setValue("recipient", "");
      form.setValue("recipientTIN", "");
      form.setValue("recipientBRN", "");
      form.setValue("recipientSSTNo", "");
      form.setValue("recipientAddress", "");
      form.setValue("recipientTTXNo", "");
    }
  };

  return (
    <Card collapsible defaultCollapsed={false} className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Customer Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns)*/}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6">
              <FormField
                control={form.control}
                name="buyerName"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Buyer Name:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="buyerName"
                        columnName="Buyer Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentCustomer"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-1 grid h-full grid-rows-[auto_1fr] space-y-1 flex items-center">
                    <div className="flex items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "1"}
                          onCheckedChange={(state) => {
                            field.onChange(state ? "1" : "0");
                            handleCurrentCustomerChange({ target: { checked: state } });
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Current Customer</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormField
                  control={form.control}
                  name="buyerTIN"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Buyer TIN:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="buyerBRN"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Buyer BRN/NRIC/Passport:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="buyerSSTNo"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Buyer SST No.:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="buyerTTXNo"
                  render={({ field }) => (
                    <FormItem className="col-span-1 row-span-2 grid h-full grid-rows-[auto_1fr] space-y-1">
                      <FormLabel>Buyer TTx No.:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* <div>
                <FormField
                  control={form.control}
                  name="buyerEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Buyer Email:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div> */}
            </div>

            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns)*/}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6 mt-4">
              <FormField
                control={form.control}
                name="buyerMSICCode"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>UUID:</FormLabel>
                    <FormControl>
                      <Input className="h-7" {...field} readOnly={true} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="MISCCodeCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>MSIC:</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input
                          className="h-7.5 pr-8"
                          {...field}
                          onClick={toggleTableMSICCode}
                          // readOnly={true}
                          ref={inputRef}
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowTableMSICCode(true);
                          }}
                          autoComplete="off"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <FaMagnifyingGlass className="text-gray-400" />{" "}
                          {/* Using the search icon */}
                        </div>
                        {showTableMSICCode && (
                          <div
                            ref={dropdownRef}
                            className="absolute top-full z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md"
                          >
                            <ScrollArea className="h-[30cqh] bg-erp-gray-3">
                              <DropdownTable
                                columns={dropdownMSICCodeColumns}
                                data={filteredMSICCodeData}
                                onClickRow={onClickRowMSICCode}
                                customerId={form.getValues("customerCode") ?? ""}
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
                name="buyerBusinessNature"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Business Nature:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Buyer Email:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buyerPhoneNo"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-2 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Buyer Phone No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="buyerTTXNo"
                render={({ field }) => (
                  <FormItem className="col-span-1 row-span-2 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Buyer TTx No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns)*/}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6 mt-4">
              <FormField
                control={form.control}
                name="buyerAddress"
                render={({ field }) => (
                  <FormItem className="col-span-6 row-span-3 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Buyer Address:</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-7.5 resize-none"
                        {...field}
                        moduleName="cashSales"
                        fieldName="buyerAddress"
                        columnName="Buyer Address"
                      />
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