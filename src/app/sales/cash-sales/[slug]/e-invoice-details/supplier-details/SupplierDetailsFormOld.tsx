"use client";

import React, { useEffect, useRef, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import DropdownTable from "@/components/data-table/DropdownTable";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Row } from "@tanstack/react-table";
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
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { getAuthHeaders, ORIGIN } from "@/lib/constants";

type Params = {
  form: any;
  supplierCode: string;
  defaultCurrentCompany: any;
};

export function SupplierDetailsFormOld({ form, supplierCode, defaultCurrentCompany }: Params) {
  const headers = getAuthHeaders();

  const [currentCompanyUUID, setCurrentCompanyUUID] = useState<string | null>(null);

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
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
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
    form.setValue("supplierMSICCode", row.UUID);
    form.setValue("MISCCodeCode", row.code);
    setSearchTerm(row.code);
    setShowTableMSICCode(false);
  };

  // Supplier Dropdown
  const [showTableSupplier, setShowTableSupplier] = useState(false);
  const [supplierDropdownTableData, setSupplierDropdownTableData] = useState([]);

  const dropdownSupplierColumns = [
    { accessorKey: "supplierName", header: "Supplier" },
    { accessorKey: "supplierCode", header: "Supplier Code" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }: { row: Row<MSICCode> }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const toggleTableSupplier = async () => {
    const formData = new FormData();
    const supplier = "supplier";

    formData.append("table[]", supplier);

    if (!showTableSupplier) {
      try {
        const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch agent drop-down data");
        }

        const supplierData = await response.json();

        setSupplierDropdownTableData(supplierData.rows);
        setShowTableSupplier(true);
      } catch (error) {
        console.error("Error fetching supplier drop-down data:", error);
      }
    } else {
      setShowTableSupplier(false);
    }
  };

  const onClickRowSupplier = (row: any) => {
    form.setValue("supplier", row.UUID);
    form.setValue("supplierName", row.supplierName);
    form.setValue("supplierTIN", row.TIN);
    form.setValue("supplierBRN", row.BRN);
    form.setValue("supplierSSTNo", row.SSTNo);
    form.setValue("supplierTTXNo", row.TTxNo);
    form.setValue("supplierMSICCode", row.MSIC);
    form.setValue("MISCCodeCode", row.MSICCode);
    form.setValue("supplierBusinessNature", row.businessNature);
    form.setValue("supplierEmail", row.email);
    form.setValue("supplierPhoneNo", row.phoneNo);
    form.setValue("supplierAddress", row.address);

    setShowTableSupplier(false);
  };

  const fetcher = async (url: any) => {
    const headers = getAuthHeaders();

    return fetch(url, { headers }).then((res) => {
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }

      return res.json();
    });
  };

  useEffect(() => {
    const savedState = localStorage.getItem("cash-sales.currentSupplierChecked");

    if (savedState === "true") {
      form.setValue("currentSupplier", "1");
    } else {
      form.setValue("currentSupplier", "0");
    }
  }, [form]);

  const handleCurrentCompanyChange = async (event: { target: { checked: any } }) => {
    const isChecked = event.target.checked;

    localStorage.setItem("cash-sales.currentSupplierChecked", isChecked.toString());

    if (isChecked) {
      try {
        const apiUrl = `${ORIGIN}/universal/get-current-company?id=${currentCompanyUUID}`;
        const data = await fetcher(apiUrl);

        const companyData = data.data;

        form.setValue("supplierName", companyData.company);
        form.setValue("supplierTIN", companyData.TIN);
        form.setValue("supplierBRN", companyData.BRN);
        form.setValue("supplierSSTNo", companyData.SSTNo);
        form.setValue("supplierTTXNo", companyData.TTxNo);
        form.setValue("supplierMSICCode", companyData.MSIC);
        form.setValue("MISCCodeCode", companyData.MSICCode);
        setSearchTerm(companyData.MSICCode);
        form.setValue("supplierBusinessNature", companyData.businessNature);
        form.setValue("supplierEmail", companyData.email);
        form.setValue("supplierPhoneNo", companyData.phoneNo);
        form.setValue("supplierAddress", companyData.address);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      form.setValue("supplierName", "");
      form.setValue("supplierTIN", "");
      form.setValue("supplierBRN", "");
      form.setValue("supplierSSTNo", "");
      form.setValue("supplierTTXNo", "");
      form.setValue("supplierMSICCode", "");
      form.setValue("MISCCodeCode", "");
      setSearchTerm("");
      form.setValue("supplierBusinessNature", "");
      form.setValue("supplierEmail", "");
      form.setValue("supplierPhoneNo", "");
      form.setValue("supplierAddress", "");
    }
  };

  useEffect(() => {
    if (defaultCurrentCompany) {
      form.setValue("currentCompany", "1");
      const companyData = defaultCurrentCompany.data;

      form.setValue("supplierName", companyData.company);
      form.setValue("supplierTIN", companyData.TIN);
      form.setValue("supplierBRN", companyData.BRN);
      form.setValue("supplierSSTNo", companyData.SSTNo);
      form.setValue("supplierTTXNo", companyData.TTxNo);
      form.setValue("supplierMSICCode", companyData.MSIC);
      form.setValue("MISCCodeCode", companyData.MSICCode);
      setSearchTerm(companyData.MSICCode);
      form.setValue("supplierBusinessNature", companyData.businessNature);
      form.setValue("supplierEmail", companyData.email);
      form.setValue("supplierPhoneNo", companyData.phoneNo);
      form.setValue("supplierAddress", companyData.address);

    }
    return () => {

    }
  }, [defaultCurrentCompany])


  return (
    <Card collapsible defaultCollapsed={false} className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Own Company Information</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            { /* Mobile View CSS Class: grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-(Number of Maximum Columns) */}
            <div className="grid items-start gap-x-8 gap-y-1 grid-cols-1 md:grid-cols-6">
              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem className="hidden">
                    <FormLabel>Supplier UUID:</FormLabel>
                    <FormControl>
                      <Input className="h-7" {...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierName"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier Name:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="supplierName"
                        columnName="Supplier Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentCompany"
                render={({ field }) => (
                  <FormItem className="flex h-full items-center">
                    <div className="flex h-full items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value === "1"}
                          onCheckedChange={(state) => {
                            field.onChange(state ? "1" : "0");
                            handleCurrentCompanyChange({ target: { checked: state } });
                          }}
                        />
                      </FormControl>
                      <FormLabel className="ml-2">Current Company</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierTIN"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier TIN:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="supplierTIN"
                        columnName="Supplier TIN"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierBRN"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier BRN/NRIC/Passport:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierSSTNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier SST No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierTTXNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>TTx No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
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
                name="supplierMSICCode"
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
                name="supplierBusinessNature"
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
                name="supplierEmail"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier Email:</FormLabel>
                    <FormControl>
                      <Input
                        className="h-7.5"
                        {...field}
                        moduleName="cashSales"
                        fieldName="supplierEmail"
                        columnName="Supplier Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierPhoneNo"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1">
                    <FormLabel>Supplier Phone No.:</FormLabel>
                    <FormControl>
                      <Input className="h-7.5" {...field} />
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
                name="supplierAddress"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-1 md:col-span-6">
                    <FormLabel>Supplier Address:</FormLabel>
                    <FormControl>
                      <Textarea className="h-7.5 resize-none" {...field} />
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