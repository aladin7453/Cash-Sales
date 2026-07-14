"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PasswordInput } from "@/components/form/PasswordInput";
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
import { useToast } from "@/components/ui/use-toast";
import { ORIGIN } from "@/lib/constants";

import _1ofisLogo from "/public/1ofis_Logo_415x167.svg";

import JSEncrypt from "jsencrypt";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

const ChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, {
        message: "Current Password is required",
      })
      .optional(),
    newPassword: z
      .string()
      .min(6, {
        message: "New Password must be at least 6 characters long",
      })
      .refine((newPassword) => /[A-Z]/.test(newPassword), {
        message: "New Password must contain at least one uppercase letter",
      })
      .refine((newPassword) => /[a-z]/.test(newPassword), {
        message: "New Password must contain at least one lowercase letter",
      })
      .refine((newPassword) => /[0-9]/.test(newPassword), {
        message: "New Password must contain at least one number",
      })
      .refine((newPassword) => /[^a-zA-Z0-9]/.test(newPassword), {
        message: "New Password must contain at least one special character",
      }),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password is required",
    }),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function ResetPasswordPage({ searchParams }: Props) {
  const { username, authToken, token, account } = searchParams;

  const router = useRouter();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const form = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: undefined,
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch the newPassword field for real-time validation
  const newPassword = form.watch("newPassword");

  // Define new password requirements
  const newPasswordRequirements = [
    { label: "At least 6 characters", isValid: newPassword.length >= 6 },
    {
      label: "At least 1 uppercase letter",
      isValid: /[A-Z]/.test(newPassword),
    },
    {
      label: "At least 1 lowercase letter",
      isValid: /[a-z]/.test(newPassword),
    },
    { label: "At least 1 number", isValid: /[0-9]/.test(newPassword) },
    {
      label:
        "At least 1 special character (any special characters on keyboard)",
      isValid: /[^a-zA-Z0-9]/.test(newPassword),
    },
  ];
  const isDev = process.env.NODE_ENV === "development";

  const fetchPublicKey = async () => {
    const response = await fetch(isDev ? "/password_public.pem" : "/view/password_public.pem");
    const pem = await response.text();
    return pem;
  };

  async function encryptPassword(password: string): Promise<string> {
    const publicKey = await fetchPublicKey();

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKey);

    const encrypted = encryptor.encrypt(password);
    if (!encrypted) throw new Error("Encryption failed.");

    return encrypted;
  }

  const onSubmit = async ({
    currentPassword,
    newPassword,
    confirmPassword,
  }: z.infer<typeof ChangePasswordSchema>) => {
    setIsLoading(true); // Set loading state to true when login starts

    const headers = new Headers();
    const bodyContent = new FormData();

    const encryptedCurrentPassword = currentPassword
      ? await encryptPassword(currentPassword.trim())
      : undefined;
    const encryptedNewPassword = await encryptPassword(newPassword.trim());
    const encryptedConfirmPassword = await encryptPassword(
      confirmPassword.trim()
    );

    if (currentPassword) {
      headers.set("Authorization", "Basic " + btoa(`${username}:${authToken}`));
      bodyContent.append("current_password", encryptedCurrentPassword!);
      bodyContent.append("new_password", encryptedNewPassword);
    } else {
      bodyContent.append("password", encryptedConfirmPassword);
    }

    bodyContent.append("confirm_password", encryptedConfirmPassword);

    const apiUrl = token
      ? `${ORIGIN}/site/api/site/reset-password?token=${token}&account=${account}`
      : `${ORIGIN}/site/api/site/change-password`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers,
        body: bodyContent,
      });

      if (!response.ok) {
        if (response.status === 400) {
          const data = await response.json();

          if (data.message === "Current Password did not match.") {
            form.setError("currentPassword", {
              message: "The current password you entered is incorrect",
            });
            toast({
              variant: "destructive",
              title: "Invalid Current Password",
              description:
                "The current password you entered is incorrect. Please try again.",
            });
          }
        } else {
          toast({
            variant: "destructive",
            title: "Change Password Failed",
            description:
              "An error occurred while trying to change your password. Please try again.",
          });
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.message === "Password changed successfully.") {
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");
        toast({
          variant: "success",
          title: "Password Changed Successfully",
          description:
            "You've successfully changed your password. Please log in again.",
        });
        router.push("/login");
      } else if (data.message === "Password reset successfully.") {
        localStorage.removeItem("username");
        localStorage.removeItem("authToken");
        toast({
          variant: "success",
          title: "Password Reset Successfully",
          description:
            "You've successfully reset your password. Please log in again.",
        });
        router.push("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Change Password Failed",
          description:
            "An error occurred while trying to change your password. Please try again.",
        });
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state in case of error
      if (typeof error === "string") {
        toast({
          variant: "destructive",
          title: "An error occurred while trying to change your password.",
          description: `Error message: ${error}`,
        });
      } else if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "An error occurred while trying to change your password.",
          description: `Error message: ${error.message}`,
        });
      }
    } finally {
      setIsLoading(false); // Reset loading state after login completes
    }
  };

  if (!token && (!username || !authToken)) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-xl font-medium text-primary">Invalid Link</h1>
        <p>{"You have reached an invalid link. Please go back."}</p>
      </div>
    );
  }

  return (
    <Card className="max-w-lg shadow-md">
      <CardHeader className="gap-y-4 space-y-0 text-left">
        <div className="flex justify-center">
          <Image
            src={_1ofisLogo}
            alt="1OFIS Logo"
            priority
            unoptimized
            className="w-3/5 max-w-xs"
          />
        </div>
        <CardTitle className="text-xl">Change Your Password</CardTitle>
        <CardDescription className="flex flex-col gap-y-2">
          <p>
            {token
              ? "The password you entered must meet the criteria listed below. Click save when you're done."
              : "Please change your password with a valid format. The password you entered must meet the criteria listed below. You must change your password here before you can log in. Click save when you're done."}
          </p>
          <div className="text-secondary-foreground">
            <p>{"The new password must contain:"}</p>
            <ul className="list-inside list-disc marker:text-muted-foreground">
              {newPasswordRequirements.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className={req.isValid ? "text-green-600" : "text-red-500"}
                  >
                    {req.isValid ? "✅" : "❌"}
                  </span>
                  <span>{req.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid gap-4">
            {!token && (
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-right">
                      Current Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="col-span-2 text-right">
                    New Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="col-span-2 text-right">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <PasswordInput autoComplete="new-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
