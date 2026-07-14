"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useEffect, useState as useReactState, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa6";

import NoResultsTableRow from "@/components/data-table/NoResultsTableRow";
import TableHeadColumnTextFilter from "@/components/data-table/TableHeadColumnTextFilter";
import { TableHeadValidityFilter } from "@/components/data-table/TableHeadValidityFilter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { DEFAULT_DATA_TABLE_PAGE_SIZE, getAuthHeaders, ORIGIN } from "@/lib/constants";
import usePreventShiftTextSelect from "@/lib/hooks/usePreventShiftTextSelect";
import { cn } from "@/lib/utils/cn";

import DropdownTableToolbar from "./DropdownTableToolbar";

import type { ColumnDef, SortingState } from "@tanstack/react-table";

type Props = {
  columns: ColumnDef<any, any>[];
  data: any[];
  filterValue?: string;
  filterColumn?: string;
  onClickRow: (row: any, index?: number) => void;
  index?: number;
  customerId: string;
  showAddButton?: boolean;
  enableRowHighlight?: boolean;
  selectedRows?: string[];
  selectedKey?: string;
};

export default function DropdownTable({
  columns,
  data = [],
  filterValue = "",
  filterColumn,
  onClickRow,
  index,
  customerId,
  showAddButton = false,
  enableRowHighlight = false,
  selectedRows = [],
  selectedKey = "UUID",
}: Props) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [showAddAttentionDialog, setShowAddAttentionDialog] = useReactState(false);
  const [isLoading, setIsLoading] = useReactState(false);
  const [billingContactFiles, setBillingContactFiles] = useReactState<File[]>([]);

  // Set initial column filter if provided
  useEffect(() => {
    if (filterColumn && filterValue) {
      setColumnFilters([{ id: filterColumn, value: filterValue }]);
    }
  }, [filterColumn, filterValue]);

  useEffect(() => {
    if (!filterColumn) {
      setGlobalFilter(filterValue || "");
    }
  }, [filterValue, filterColumn]);

  const table = useReactTable({
    columns,
    data: Array.isArray(data) ? data : [],
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    autoResetPageIndex: false,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      return row.getVisibleCells().some((cell) =>
        String(cell.getValue() ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase()),
      );
    },
    defaultColumn: {
      filterFn: "includesString",
    },
    initialState: {
      pagination: {
        pageSize: DEFAULT_DATA_TABLE_PAGE_SIZE,
      },
    },
  });

  // Prevent text selection when performing multiple row selection with "shift" + click
  usePreventShiftTextSelect();

  // Replace with your actual form instance and validation schema
  const contactForm = useForm({
    defaultValues: {
      contact: "",
      phoneNo: "",
      email: "",
      description: "",
    },
  });

  // Replace with your actual parent form if needed
  const form = { getValues: (key: string) => "" }; // Dummy, replace as needed

  // Helper to convert file to base64
  const getFileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleAddContact = async () => {
    setIsLoading(true);

    const isValid = await contactForm.trigger();

    if (!isValid) {
      setIsLoading(false);

      return;
    }

    const data = contactForm.getValues();
    const formData = new FormData();

    formData.append("customerHasBillingContact[contact]", data.contact);
    formData.append("customerHasBillingContact[phoneNo]", data.phoneNo);
    formData.append("customerHasBillingContact[email]", data.email);
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

          toast({
            title: "Error",
            description: "Failed to process file attachment",
            variant: "destructive",
          });

          setIsLoading(false);

          return;
        }
      } else {
        formData.append(`customerHasBillingContact[attachment][${i}][Name]`, file.name);
        formData.append(`customerHasBillingContact[attachment][${i}][File]`, "");
      }
    }

    try {
      const headers = getAuthHeaders();
      const response = await fetch(
        `${ORIGIN}/customer/api/customer/update-customer-has-billing-contact-data?id=${customerId}`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to add new contact");
      }

      if (typeof fetchAttentionDropdownData === "function") {
        await fetchAttentionDropdownData();
      }

      contactForm.reset();

      setBillingContactFiles([]);
      setShowAddAttentionDialog(false);

      toast({
        title: "Success",
        description: "Contact added successfully",
      });
    } catch (error) {
      console.error("Error adding new contact:", error);

      toast({
        title: "Error",
        description: "Failed to add new contact",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch attention dropdown data
  const fetchAttentionDropdownData = async () => {
    const customerId = form.getValues("customerCode");
    if (!customerId) return;

    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch(
        `${ORIGIN}/universal/get-attention-by-customer?id=${customerId}`,
        {
          method: "POST",
          headers,
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attention dropdown data");
      }
    } catch (error) {
      console.error("Error fetching attention dropdown data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch attention dropdown data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setShowAddAttentionDialog(true);
  };

  return (
    <div className="min-w-[450px] max-w-xl bg-erp-blue-3">
      <div className="w-full h-full flex flex-col justify-center items-center">

        {/* Toolbar */}
        <div className="w-full sticky top-0 z-20 bg-erp-blue-3">
          <DropdownTableToolbar table={table} showAddButton={showAddButton} onAdd={handleAdd} />
        </div>

        {/* ScrollArea */}
        <ScrollArea className="min-h-0 flex-1">
          <Table className="table-fixed overflow-visible whitespace-nowrap text-[12px]">

            {/* Table Header */}
            <TableHeader className="sticky top-0 z-10 bg-erp-blue-3">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead className="bg-erp-blue-11 font-normal" key={header.id}>
                      <div className="flex flex-col gap-y-0.5">
                        <div
                          className={cn(
                            "flex items-center gap-x-1 text-white",
                            header.column.getCanSort() ? "cursor-pointer select-none" : "",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <span className="font-semibold">
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </span>
                          {{
                            asc: <FaSortUp />,
                            desc: <FaSortDown />,
                          }[header.column.getIsSorted() as string] ?? <FaSort />}
                        </div>
                        {header.column.id === "validity" ? (
                          <TableHeadValidityFilter table={table} />
                        ) : (
                          <TableHeadColumnTextFilter column={header.column} table={table} />
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            {/* Table Data */}
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={cn(
                      "cursor-pointer transition-all duration-150 ease-in-out hover:bg-erp-blue-9",
                      enableRowHighlight && selectedRows.includes(row.original[selectedKey])
                        ? "bg-erp-blue-17"
                        : "odd:bg-erp-blue-5 even:bg-erp-blue-1",
                    )}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onClickRow(row.original, index)}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="max-w-[200px] border border-gray-200 whitespace-nowrap px-2 py-1.5"
                      >
                        <span title={cell.getValue()} className="line-clamp-1">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <NoResultsTableRow columns={columns} />
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Add Contact Dialog */}
      <Dialog open={showAddAttentionDialog} onOpenChange={setShowAddAttentionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <FormProvider {...contactForm}>
            <form>
              <div className="space-y-4">
                <FormField
                  control={contactForm.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Contact Name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="phoneNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone No.:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Phone No." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description:</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add file input if needed */}
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddAttentionDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddContact} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
}
