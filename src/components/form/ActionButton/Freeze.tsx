import { zodResolver } from "@hookform/resolvers/zod";
import { format, fromUnixTime } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSnowflake } from "react-icons/fa6";
import useSWR from "swr";
import { z } from "zod";

import { AccountContext } from "@/app/(main)/system-account/all-account/[slug]/AccountContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getAuthHeaders, ORIGIN } from "@/lib/constants";
import authorizedFetcher from "@/lib/utils/authorizedFetcher";
import { cn } from "@/lib/utils/cn";

import CalendarPicker from "../CalendarPicker";

import type { AccountState } from "@/app/(main)/system-account/all-account/[slug]/AccountContext";

type Props = {
  id: string | null;
  refreshTable: () => void;
  companyId?: string;
  closeFormDialog?: () => void;
  disabled?: boolean;
};

type AccountHasCompanyData = {
  data: AccountHasCompany;
};

type AccountHasCompany = {
  UUID: string;
  account: string;
  company: string;
  companyName: string;
  address: string;
  TIN: string;
  SSTNo: string;
  status: string;
  BRN: string;
  remark: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  valid: string;
  _version: string;
  _actionUUID: string;
  startAt: string;
  endAt: string;
  accountCode: string;
  companyCode: string;
  startAtFormat: string;
  endAtFormat: string;
  createdAtFormat: string;
  updatedAtFormat: string;
  createdByUsername: string;
  updatedByUsername: string;
};

type FreezeCompanyForm = z.infer<typeof freezeCompanyFormSchema>;

const freezeCompanyFormSchema = z.object({
  startAt: z.string().min(1, {
    message: "Start date is required.",
  }),
  endAt: z.string().optional(),
  remark: z.string().optional(),
});

export default function FreezeButton({
  id,
  refreshTable,
  companyId,
  closeFormDialog,
  disabled,
}: Props) {
  const { selectedCompanyId } = useContext(AccountContext) as AccountState;
  const currentAccount = sessionStorage.getItem("selectedAccount");

  // Get freezed company data
  const { data: accountHasCompanyData } = useSWR<AccountHasCompanyData, Error>(
    `${ORIGIN}/account/api/account/get-update-account-has-company?id=${
      companyId ?? selectedCompanyId
    }&account=${currentAccount}`,
    authorizedFetcher,
  );
  const initialData = companyId || selectedCompanyId ? accountHasCompanyData?.data : null;

  const form = useForm<FreezeCompanyForm>({
    resolver: zodResolver(freezeCompanyFormSchema),
    defaultValues: {
      startAt: "",
      endAt: "",
      remark: "",
    },
  });

  // Update form with data from backend
  useEffect(() => {
    if (initialData) {
      form.reset({
        startAt: initialData.startAt ?? "",
        endAt: initialData.endAt ?? "",
        remark: initialData.remark ?? "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isStartDateCalendarOpen, setIsStartDateCalendarOpen] = useState(false);
  const [isEndDateCalendarOpen, setIsEndDateCalendarOpen] = useState(false);

  const { toast } = useToast();
  const headers = getAuthHeaders();

  const updateCompanyFreezeStatus = async (data: any) => {
    const formData = new FormData();

    if (companyId || selectedCompanyId) {
      formData.append(`UUIDs[]`, (companyId ?? selectedCompanyId) as string);
    }

    for (const key in data) {
      formData.append(`${key}`, data[key]);
    }

    try {
      const response = await fetch(
        `${ORIGIN}/account/api/account/update-company-status?id=${id}&action=freeze&account=${currentAccount}`,
        {
          method: "POST",
          headers,
          body: formData,
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message,
          variant: "destructive",
        });
        throw new Error(errorData.message);
      }

      const responseData = await response.json();
      if (responseData) {
        toast({
          title: "Success Freeze",
          description: responseData.message,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFreezeConfirmSubmit = async (values: FreezeCompanyForm) => {
    if (!values) return;

    const newData: any = { ...values };

    await updateCompanyFreezeStatus(newData);

    refreshTable();
    setDialogOpen(false);

    if (closeFormDialog) {
      closeFormDialog();
    }
  };

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <button
          className="group flex flex-col items-center gap-y-1"
          type="button"
          disabled={disabled}
        >
          <FaSnowflake className="size-4.5 text-erp-blue-11 group-disabled:text-erp-gray-5" />
          <span className="text-[11px]/none font-medium group-disabled:text-erp-gray-5">Freeze</span>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm">
        <div className="flex justify-center">
          <p className="text-erp-blue-14">Freeze selected Company?</p>
        </div>
        <Form {...form}>
          <form className="grid grid-cols-2 gap-x-4 gap-y-3">
            <FormField
              control={form.control}
              name="startAt"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Start Date:</FormLabel>
                  <Popover open={isStartDateCalendarOpen} onOpenChange={setIsStartDateCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn("flex w-full", !field.value && "text-muted-foreground")}
                          variant="outline"
                          size="sm"
                        >
                          {field.value
                            ? format(fromUnixTime(+field.value), "yyyy-MM-dd")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto size-4.5" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        field={field}
                        onSelect={() => {
                          setIsStartDateCalendarOpen(false);
                        }}
                        disableFuture={false}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endAt"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>End Date:</FormLabel>
                  <Popover open={isEndDateCalendarOpen} onOpenChange={setIsEndDateCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          className={cn("flex w-full", !field.value && "text-muted-foreground")}
                          variant="outline"
                          size="sm"
                        >
                          {field.value
                            ? format(fromUnixTime(+field.value), "yyyy-MM-dd")
                            : "Pick a date"}
                          <CalendarIcon className="ml-auto size-4.5" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarPicker
                        field={field}
                        onSelect={() => {
                          setIsEndDateCalendarOpen(false);
                        }}
                        disableFuture={false}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem className="col-span-2 space-y-1">
                  <FormLabel>Remark:</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter className="col-span-2 flex !justify-center gap-x-2 pt-3">
              <AlertDialogAction
                className="h-9 w-24"
                onClick={form.handleSubmit(handleFreezeConfirmSubmit)}
              >
                Confirm
              </AlertDialogAction>
              <AlertDialogCancel className="h-9 w-24">Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
