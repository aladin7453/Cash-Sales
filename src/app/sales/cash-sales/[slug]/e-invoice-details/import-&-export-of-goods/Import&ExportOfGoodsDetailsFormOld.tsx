"use client";

import React from "react";
import { useEffect, useState, useRef } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DropdownTable from "@/components/data-table/DropdownTable";
import { FaMagnifyingGlass } from "react-icons/fa6";
import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import { ORIGIN, getAuthHeaders } from "@/lib/constants";
import type { Row } from "@tanstack/react-table";

type Params = {
  form: any;
};

export function ImportExportOfGoodsFormOld({ form }: Params) {
  const headers = getAuthHeaders();
  const [showTableCountry, setShowTableCountry] = useState(false);

  const [countryDropdownTableData, setCountryDropdownTableData] = useState<CountryCode[]>([]);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");

  const dropdownCountryColumns = [
    { accessorKey: "code", header: "Country" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: Row<CountryCode> }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  type CountryCode = {
    code: string;
    description: string;
    UUID: string;
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (!(event.target instanceof Node)) return;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      inputRef.current !== event.target
    ) {
      setShowTableCountry(false);
    }
  };

  useEffect(() => {
    document.body.addEventListener("click", handleClickOutside);

    return () => {
      document.body.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const toggleTableCountry = async () => {
    const formData = new FormData();
    const country = "countryOfOrigin";
    formData.append("table[]", country);

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
        if (!response.ok) {
          throw new Error("Failed to fetch agent drop-down data");
        }

        const CountryData = await response.json();

        setCountryDropdownTableData(CountryData.rows);
        setShowTableCountry(true);
      } catch (error) {
        console.error("Error fetching country drop-down data:", error);
      }
    } else {
      setShowTableCountry(false);
    }
  };

  const onClickRowCountry = (row: any) => {
    form.setValue("country", row.UUID);
    form.setValue("countryOfOriginCode", `${row.description}(${row.code})`);

    setCountrySearchTerm("");
    setShowTableCountry(false);
  };

  const filteredCountryData = countryDropdownTableData.filter((item) => {
    const term = countrySearchTerm.toLowerCase();
    return (
      item.code.toLowerCase().includes(term) ||
      item.description.toLowerCase().includes(term)
    );
  });

  return (
    <Card collapsible defaultCollapsed={false} className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Import & Export Goods</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns) */}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6">
              <FormField
                control={form.control}
                name="customFormRefNo1"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-2">
                    <FormLabel>Custom Form No. 1, 9, etc. Ref. No.:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="customFormRefNo1"
                        columnName="Custom Form Ref No. 1"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interTradeRule"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Incoterms:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tariffCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Tariff Code:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exporterNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-2">
                    <FormLabel>Exporter No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            { /* Mobile View CSS Class: items-start gap-x-8 gap-y-1 */}
            <div className="items-start gap-x-8 gap-y-1 mt-4">
              <FormField
                control={form.control}
                name="FTA"
                render={({ field }) => (
                  <FormItem className="col-span-5 row-span-1 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>FTA:</FormLabel>
                    <FormControl>
                      <Textarea
                        className="h-7.5 resize-none"
                        {...field}
                        moduleName="cashSales"
                        fieldName="FTA"
                        columnName="FTA"
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
                name="customFormRefNo2"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-2">
                    <FormLabel>Custom Form No. 2. Ref. No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
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
                name="countryOfOriginCode"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Country:</FormLabel>
                    <FormControl className="relative">
                      <div className="relative">
                        <Input
                          className="h-7.5 pr-8"
                          {...field}
                          onClick={toggleTableCountry}
                          onChange={(e) => {
                            field.onChange(e);
                            setCountrySearchTerm(e.target.value);
                            setShowTableCountry(true);
                          }}
                          // readOnly={true}
                          ref={inputRef}
                          autoComplete="off"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <FaMagnifyingGlass className="text-gray-400" />{" "}
                          {/* Using the search icon */}
                        </div>
                        {showTableCountry && (
                          <div
                            ref={dropdownRef}
                            className="absolute top-full bg-white border border-gray-200 rounded shadow-md z-50 h-[200px]"
                          >
                            <ScrollArea className="h-[30cqh] bg-erp-gray-3">
                              <DropdownTable
                                columns={dropdownCountryColumns}
                                data={filteredCountryData}
                                onClickRow={onClickRowCountry}
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
            </div>

            { /* Mobile View CSS Class: items-start gap-x-8 gap-y-1*/}
            <div className="items-start gap-x-8 gap-y-1 mt-4">
              <FormField
                control={form.control}
                name="otherCharges"
                render={({ field }) => (
                  <FormItem className="col-span-5 row-span-1 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Details of other Charges:</FormLabel>
                    <FormControl>
                      <Textarea className="h-7.5 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* <div className="grid grid-flow-col-dense items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6">
                <FormField
                  control={form.control}
                  name="chargeIndicator"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Charge Indicator:</FormLabel>
                        <FormControl>
                          <Select defaultValue={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-7.5 w-full">
                              <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">True</SelectItem>
                              <SelectItem value="0">False</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="chargeAmount"
                  render={({ field }) => (
                    <FormItem className="flex flex-col space-y-1">
                      <FormLabel>Charge Amount:</FormLabel>
                      <FormControl>
                        <Input className="h-7.5" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="items-start gap-x-8 gap-y-1">
              <FormField
                control={form.control}
                name="chargeReason"
                render={({ field }) => (
                  <FormItem className="col-span-5 row-span-1 grid h-full grid-rows-[auto_1fr] space-y-1">
                    <FormLabel>Charge Reason:</FormLabel>
                    <FormControl>
                      <Textarea className="h-7.5 resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div> */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
