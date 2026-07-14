import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaMagnifyingGlass, FaRectangleList } from "react-icons/fa6";

import DescriptionCellTooltip from "@/components/data-table/DescriptionCellTooltip";
import DropdownTable from "@/components/data-table/DropdownTable";
import CancelButton from "@/components/form/ActionButton/Cancel";
import ResetButton from "@/components/form/ActionButton/Reset";
import SaveButton from "@/components/form/ActionButton/Save";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import { showLoadingToast } from "@/lib/utils/showLoadingToast";

import type { Row, Table } from "@tanstack/react-table";

type Props<TData> = {
  table: Table<TData>;
  module: string;
  model: string;
  account?: string;
  refreshTable: () => void;
};

type ThrowData = {
  Success: string;
  Failed: string;
  message: string;
};

export default function BatchUpdateButton<TData>({
  table,
  module,
  model,
  account,
  refreshTable,
}: Props<TData>) {
  const { toast } = useToast();
  const headers = getAuthHeaders();

  const [dialogOpen, setDialogOpen] = useState(false);

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const batchUpdateRows = async () => {
    const form_data = new FormData();
    const selectedRows = table.getSelectedRowModel().rows;

    selectedRows.forEach((row: Row<TData>) => {
      if ((row.original as any).UUID !== undefined) {
        form_data.append(`UUIDs[]`, (row.original as { UUID: string }).UUID);
      }
    });

    form_data.append("costPrice", form.getValues("costPrice"));
    form_data.append("adjustment", form.getValues("adjustment"));

    let successMessage = "";
    let failedMessage = "";

    const { id: loadingToastId, dismiss } = showLoadingToast("Updating rows...");

    try {
      const response = await fetch(`${ORIGIN}/${module}/api/${model}/batch-update`, {
        method: "POST",
        headers,
        body: form_data,
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: errorData.message,
          duration: 2000,
        });
        throw new Error("Failed to fetch data");
      } else {
        const data: ThrowData = await response.json();
        table.resetRowSelection();
        refreshTable();
        setDialogOpen(false);
        if (data.message == "Success") {
          successMessage = "All selected records have been updated successfully.";
        } else {
          failedMessage = data.message;
        }
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error as needed, display error message to user
    } finally {
      dismiss();

      setTimeout(() => {
        if (successMessage) {
          showSuccessToast(successMessage);
        }

        if (failedMessage) {
          showFailedToast(failedMessage);
        }
      }, 2000);
    }
  };

  const showSuccessToast = (records: ThrowData["Success"]) => {
    toast({
      title: "Success",
      description: `${records}`,
    });
  };

  const showFailedToast = (records: ThrowData["Failed"]) => {
    toast({
      title: "Failed",
      description: `${records}`,
      variant: "destructive",
    });
  };

  const form = useForm({
    defaultValues: {
      costPrice: "cost",
    },
  });

  const costPriceField = form.watch("costPrice");

  const onSubmit = async (values) => {
    if (!values.adjustment) return;
    batchUpdateRows();
  };

  const handleReset = () => {
    form.setValue("costPrice", "cost");
    form.setValue("adjustment", "");
  };

  useEffect(() => {
    if (dialogOpen) {
      handleReset();
    }
  }, [dialogOpen]);

  const [showTableStockGroupCode, setShowTableStockGroupCode] = useState(false);
  const [stockGroupCodeDropdownTableData, setStockGroupCodeDropdownTableData] = useState([]);
  const [stockGroupCodeFilter, setStockGroupCodeFilter] = useState("");

  const dropdownStockGroupCodeColumns = [
    { accessorKey: "stockGroupCode", header: "Stock Group Code" },
    { accessorKey: "stockGroup", header: "Stock Group Name" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const handleStockGroupCodeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStockGroupCodeFilter(value);
    form.setValue("adjustment", value);

    if (!showTableStockGroupCode) setShowTableStockGroupCode(true);
  };

  const toggleTableStockGroupCode = async () => {
    const formData = new FormData();
    const stockGroupCode = "stockGroup";

    formData.append("table[]", stockGroupCode);

    if (!showTableStockGroupCode) {
      try {
        const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch company drop-down data");
        }

        const stockGroupCodeData = await response.json();

        setStockGroupCodeDropdownTableData(stockGroupCodeData.rows);
        setShowTableStockGroupCode(true);
      } catch (error) {
        console.error("Error fetching company drop-down data:", error);
      }
    } else {
      setShowTableStockGroupCode(false);
    }
  };

  const onClickRowStockGroupCode = (row) => {
    form.setValue("adjustment", row.UUID);
    form.setValue("adjustmentCode", row.stockGroup);

    setShowTableStockGroupCode(false);
  };

  const [showTableStockCategoryCode, setShowTableStockCategoryCode] = useState(false);
  const [stockCategoryCodeDropdownTableData, setStockCategoryCodeDropdownTableData] = useState([]);
  const [stockCategoryCodeFilter, setStockCategoryCodeFilter] = useState("");

  const dropdownStockCategoryColumns = [
    { accessorKey: "stockCategoryCode", header: "Stock Category Code" },
    { accessorKey: "stockCategory", header: "Stock Category Name" },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <DescriptionCellTooltip row={row} />,
    },
  ];

  const handleStockCategoryCodeSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStockCategoryCodeFilter(value);
    form.setValue("adjustment", value);

    if (!showTableStockCategoryCode) setShowTableStockCategoryCode(true);
  };

  const toggleTableStockCategoryCode = async () => {
    const formData = new FormData();
    const stockCategoryCode = "stockCategory";

    formData.append("table[]", stockCategoryCode);

    if (!showTableStockCategoryCode) {
      try {
        const response = await fetch(`${ORIGIN}/universal/get-all-drop-down-table-data`, {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch stock category drop-down data");
        }

        const stockCategoryCodeData = await response.json();

        setStockCategoryCodeDropdownTableData(stockCategoryCodeData.rows);
        setShowTableStockCategoryCode(true);
      } catch (error) {
        console.error("Error fetching stock category drop-down data:", error);
      }
    } else {
      setShowTableStockCategoryCode(false);
    }
  };

  const onClickRowStockCategoryCode = (row) => {
    form.setValue("adjustment", row.UUID);
    form.setValue("adjustmentCode", row.stockCategoryCode);

    setShowTableStockCategoryCode(false);
  };

  return (
    <>
      <button
        className="group flex flex-col items-center gap-y-1 disabled:cursor-not-allowed"
        onClick={() => setDialogOpen(true)}
        disabled={
          table.getSelectedRowModel().rows.length < 0 ||
          table.getSelectedRowModel().rows.every((row) => row.getValue("valid") === "0")
        }
        id="batch-update-btn"
      >
        <FaRectangleList className="size-5.5 text-erp-blue-11 group-disabled:text-erp-gray-5" />
        <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5">
          Batch Update
        </span>
      </button>

      <Form {...form}>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen} className="mx-2">
          <DialogContent className="max-w-3xl bg-erp-blue-3 p-2">
            <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between pr-4">
                <div className="grid auto-cols-fr grid-flow-col gap-x-1.5">
                  <SaveButton />
                  <ResetButton onClick={handleReset} />
                  <DialogClose asChild>
                    <CancelButton />
                  </DialogClose>
                </div>
              </div>

              <div className="space-y-2.5 bg-white p-3 pt-2">
                <div className="grid grid-cols-12 gap-3">
                  <FormField
                    control={form.control}
                    name="costPrice"
                    render={({ field }) => (
                      <FormItem className="col-span-6 grid grid-rows-[auto_1fr] space-y-1">
                        <FormLabel>Cost/Price:</FormLabel>
                        <FormControl>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className="h-7.5 w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cost">Cost</SelectItem>
                              <SelectItem value="price">Price</SelectItem>
                              {model === "stock-group" ? null : (
                                <>
                                  <SelectItem value="stockGroup">Stock Group</SelectItem>
                                  <SelectItem value="stockCategory">Stock Category</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {costPriceField === "cost" || costPriceField === "price" ? (
                    <>
                      <FormField
                        control={form.control}
                        name="adjustment"
                        render={({ field }) => (
                          <FormItem className="col-span-6 grid grid-rows-[auto_1fr] space-y-1">
                            <FormLabel>Adjustment:</FormLabel>
                            <FormControl>
                              <Input
                                className="h-7 text-right"
                                {...field}
                                onChange={(e) => {
                                  let value = e.target.value;

                                  value = value.replace(/[^0-9.\-%]/g, "");
                                  value = value.replace(/(?!^)-/g, "");
                                  value = value.replace(/(\..*)\./g, "$1");

                                  value = value.replace(/%/g, "");
                                  if (e.target.value.includes("%")) {
                                    value = value + "%";
                                  }

                                  field.onChange(value);
                                }}
                                onKeyDown={(e) => {
                                  const allowedKeys = [
                                    "Backspace",
                                    "Delete",
                                    "ArrowLeft",
                                    "ArrowRight",
                                    "Tab",
                                  ];

                                  if (
                                    allowedKeys.includes(e.key) ||
                                    (e.key >= "0" && e.key <= "9") ||
                                    e.key === "." ||
                                    e.key === "-" ||
                                    e.key === "%"
                                  ) {
                                    return;
                                  }

                                  e.preventDefault();
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="adjustment"
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
                        name="adjustmentCode"
                        render={({ field }) => (
                          <FormItem className="col-span-6 grid grid-rows-[auto_1fr] space-y-1">
                            <FormLabel>
                              {costPriceField === "stockGroup" ? "Stock Group:" : "Stock Category:"}
                            </FormLabel>
                            <FormControl className="relative">
                              <div className="relative h-7.5">
                                <Input
                                  className="h-7.5 pr-8"
                                  {...field}
                                  onClick={
                                    costPriceField === "stockGroup"
                                      ? () => toggleTableStockGroupCode()
                                      : () => toggleTableStockCategoryCode()
                                  }
                                  onChange={
                                    costPriceField === "stockGroup"
                                      ? handleStockGroupCodeSearchChange
                                      : handleStockCategoryCodeSearchChange
                                  }
                                  ref={inputRef}
                                  autoComplete="off"
                                />
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                  <FaMagnifyingGlass className="text-gray-400" />
                                </div>
                                {showTableStockGroupCode && costPriceField === "stockGroup" && (
                                  <div
                                    ref={dropdownRef}
                                    className="absolute top-full z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md"
                                  >
                                    <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                      <DropdownTable
                                        columns={dropdownStockGroupCodeColumns}
                                        data={stockGroupCodeDropdownTableData}
                                        onClickRow={onClickRowStockGroupCode}
                                        filterValue={stockGroupCodeFilter}
                                      />
                                    </ScrollArea>
                                  </div>
                                )}
                                {showTableStockCategoryCode &&
                                  costPriceField === "stockCategory" && (
                                    <div
                                      ref={dropdownRef}
                                      className="absolute top-full z-50 h-[200px] rounded border border-gray-200 bg-white shadow-md"
                                    >
                                      <ScrollArea className="h-[100cqh] bg-erp-gray-3">
                                        <DropdownTable
                                          columns={dropdownStockCategoryColumns}
                                          data={stockCategoryCodeDropdownTableData}
                                          onClickRow={onClickRowStockCategoryCode}
                                          filterValue={stockCategoryCodeFilter}
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
                    </>
                  )}
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </Form>
    </>
  );
}
