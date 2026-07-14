"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCheck, FaChevronLeft } from "react-icons/fa6";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ORIGIN } from "@/lib/constants";

import _1ofisLogo from "/public/1ofis_Logo_415x167.svg";

export const dynamic = 'force-dynamic';

type RequestPasswordResetData = {
  status: "Success" | "Failed";
  model: {
    account: string;
    username: string;
    email: string;
  };
} & ({ name: string; message?: string } | { message: string; name?: string });

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const forgotPasswordSchema = z.object({
  account: z.string().min(1, { message: "System Account is required" }),
  username: z.string().min(2, { message: "Username is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
});


export default function ForgotPasswordPage() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [sentToEmail, setSentToEmail] = useState("");

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      account: "",
      username: "",
      email: "",
    },
  });

  const onSubmit = async ({ account, username, email }: ForgotPasswordSchema) => {
    setIsLoading(true);

    const bodyContent = new FormData();
    bodyContent.append("account", account.trim());
    bodyContent.append("username", username.trim());
    bodyContent.append("email", email.trim());

    try {
      const response = await fetch(`${ORIGIN}/site/api/site/request-password-reset`, {
        method: "POST",
        body: bodyContent,
      });

      const data: RequestPasswordResetData = await response.json();

      if (!response.ok || data.status === "Failed") {
        form.setError("root.serverError", {
          type: data.status,
          message: data.message,
        });
        form.setError("account", { type: "validate", message: "" });
        form.setError("username", { type: "validate", message: "" });
        form.setError("email", { type: "validate", message: "" });

        toast({
          variant: "destructive",
          title: data.name ?? data.status ?? "Error",
          description: data.message ?? "An error occurred. Please try again.",
        });

        return;
      }

      if (data.status === "Success") {
        setIsSuccess(true);
        setSentToEmail(data.model.email);
      }
    } catch (error) {
      setIsLoading(false);

      console.error("Form submission error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="max-w-lg shadow-md">
        <CardHeader className="items-center space-y-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-full border-4 border-lime-300 text-lime-600">
            <FaCheck size={30} />
          </div>
          <CardTitle className="text-xl">Success!</CardTitle>
          <CardDescription>
            {"The request to reset your password was sent successfully. Please check your email ("}
            <span className="font-medium text-blue-600">{sentToEmail}</span>
            {") to reset your password."}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-lg shadow-md">
      <CardHeader className="gap-y-4 space-y-0 text-left">
        <Link
          href="/login"
          className="flex items-center gap-x-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          <FaChevronLeft />
          Back to Login
        </Link>
        <div className="flex justify-center">
          <Image
            src={_1ofisLogo}
            alt="1OFIS Logo"
            priority
            unoptimized
            className="w-3/5 max-w-xs"
          />
        </div>
        <CardTitle className="text-xl">Forgotten Password</CardTitle>
        <CardDescription>
          {
            "Please enter the details below to request a password reset and we'll send you an email with a link to reset your password."
          }
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-right">System Account</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-right">Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-right">Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.formState.errors.root?.serverError && (
              <p className="text-sm text-destructive">
                {form.formState.errors.root?.serverError.message}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isLoading ? "Submiting..." : "Continue"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
