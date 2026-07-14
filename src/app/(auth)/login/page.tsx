"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import JSEncrypt from "jsencrypt";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaKey, FaUser } from "react-icons/fa6";
// import QRCode from "react-qr-code";
import { mutate } from "swr";
import { z } from "zod";

import { getCachedAuthData, cacheAuthData } from "@/components/offlineDB";
import NetworkBackup from "@/components/icons/svg-repo/NetworkBackup";
import LoadingUI from "@/components/LoadingUI";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { checkAccessToken, getAuthHeaders, ORIGIN } from "@/lib/constants";

import _1ofisLogo from "/public/1ofis_Logo_415x167.svg";
import _1ofisAPKLink from "/public/1ofis_qrcode_apk.png";
import _1ofisIOSLink from "/public/1ofis_qrcode_ios.png";

export const dynamic = 'force-dynamic';

// Define schema for form validation
const LoginFormSchema = z.object({
  account: z.string(),
  username: z.string().min(2, { message: "Username is required" }),
  password: z.string().min(2, { message: "Password is required" }),
  rememberMe: z.boolean().default(false).optional(),
});

const passwordPatternSchema = z.object({
  password: z
    .string()
    .min(6)
    .refine((password) => /[A-Z]/.test(password))
    .refine((password) => /[a-z]/.test(password))
    .refine((password) => /[0-9]/.test(password))
    .refine((password) => /[^a-zA-Z0-9]/.test(password)),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const headers = getAuthHeaders();
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [showPassword, setShowPassword] = useState(false);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      account: "",
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    form.reset({
      account: localStorage.getItem("auth.system-account") ?? "",
      username: localStorage.getItem("auth.username") ?? "",
      password: "",
      rememberMe: localStorage.getItem("auth.remember-me") === "true",
    });
  }, []);
  const isDev = process.env.NODE_ENV === "development";

  const fetchPublicKey = async () => {
    const response = await fetch(isDev ? "/password_public.pem" : "/password_public.pem");
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

  const handleConcurrentUserLimit = async () => {
    const formData = new FormData();
    formData.append("account", form.watch("account"));
    formData.append("username", form.watch("username"));

    try {
      const response = await fetch(`${ORIGIN}/site/api/site/request-add-concurrent-user`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const errorMessage = await response.json();

        toast({
          variant: "destructive",
          title: "Request Sent",
          description: errorMessage,
        });
      }
    } catch (error) {
      console.error(error);
      return;
    }
  };

  // Handle form submission
  const onSubmit = async ({
    account,
    username,
    password,
    rememberMe,
  }: z.infer<typeof LoginFormSchema>) => {
    setIsLoading(true); // Set loading state to true when login starts

    const encryptedPassword = await encryptPassword(password.trim());

    const bodyContent = new FormData();
    bodyContent.append("account", account.trim());
    bodyContent.append("username", username.trim());
    bodyContent.append("password", encryptedPassword);

    try {
      const response = await fetch(`${ORIGIN}/site/api/site/login`, {
        method: "POST",
        body: bodyContent,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "An error occurred. Please try again.";

        // Handle 401 Unauthorized error specifically
        if (response.status === 401) {
          errorMessage = errorData.message;
          if (errorMessage === "System Account does not exist.") {
            form.setError("account", {
              type: "validate",
              message: errorMessage,
            });
          }
          if (errorMessage === "Username does not exist.") {
            form.setError("username", {
              type: "validate",
              message: errorMessage,
            });
          }
          if (errorMessage.includes("Incorrect password.")) {
            form.setError("password", {
              type: "validate",
              message: errorMessage,
            });
          }
        } else if (errorData.data && errorData.data.message) {
          errorMessage = errorData.data.message;
        }

        if (errorMessage.includes("Your account reach the limit of concurrent login users")) {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
            action: (
              <ToastAction
                onClick={() => handleConcurrentUserLimit()}
                altText="Add Concurrent User"
              >
                Add Concurrent User
              </ToastAction>
            ),
          });
        } else {
          toast({
            variant: "destructive",
            title: "Login Failed",
            description: errorMessage,
            action: (
              <ToastAction onClick={() => form.reset()} altText="Try again">
                Try again
              </ToastAction>
            ),
          });
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const { data } = await response.json();

      // Validate access token
      const isValidToken = await checkAccessToken(data.username, data.accessToken);
      if (isValidToken) {
        // Check if the password has a valid pattern
        const isValidPasswordPattern = passwordPatternSchema.safeParse({
          password: password.trim(),
        });

        if (isValidPasswordPattern.success === false) {
          router.push(`/reset-password?username=${data.username}&authToken=${data.accessToken}`);
          return;
        } else {
          // Save user data in localStorage
          localStorage.setItem("username", JSON.stringify(data.username));
          //HardCode
          localStorage.setItem("Layout", "new");
          localStorage.setItem("userFullName", JSON.stringify(data.fullName));
          localStorage.setItem("userID", JSON.stringify(data.id));
          localStorage.setItem("authToken", JSON.stringify(data.accessToken));
          localStorage.setItem("role", JSON.stringify(data.role));
          localStorage.setItem(
            "currentAccount",
            data.currentAccount ? JSON.stringify(data.currentAccount) : "",
          );
          localStorage.setItem(
            "currentCompany",
            data.currentCompany ? JSON.stringify(data.currentCompany) : "",
          );
          localStorage.setItem(
            "currentLocation",
            data.currentLocation ? JSON.stringify(data.currentLocation) : "",
          );
          localStorage.setItem("system-account", JSON.stringify(data.systemAccount));

          if (rememberMe) {
            localStorage.setItem("auth.system-account", account);
            localStorage.setItem("auth.username", data.username);
            localStorage.setItem("auth.remember-me", "true");
          } else {
            localStorage.removeItem("auth.system-account");
            localStorage.removeItem("auth.username");
            localStorage.removeItem("auth.remember-me");
          }

          mutate(() => true, undefined, { revalidate: false });
          localStorage.removeItem("userAccess");

          try {
            const response = await fetch(
              `${ORIGIN}/user/api/user/get-update-user-has-rule-data?id=${data.id}&company=${data.currentCompany.UUID}`,
              {
                method: "GET",
                headers: {
                  Authorization: "Basic " + btoa(`${data.username}:${data.accessToken}`),
                },
              },
            );

            const userRule = await response.json();
            localStorage.setItem("userRule", JSON.stringify(userRule));
          } catch (error) {
            console.error(error);
          }

          // Cache for offline login 
          await cacheAuthData({
            username: data.username,
            authToken: data.accessToken,
            userFullName: data.fullName,
            userID: data.id,
            role: data.role,
            currentAccount: data.currentAccount,
            currentCompany: data.currentCompany,
            currentLocation: data.currentLocation,
            systemAccount: data.systemAccount,
            userRule: JSON.parse(localStorage.getItem("userRule") ?? "null"),
          });

          toast({
            variant: "success",
            title: "Login Successful",
            description:
              "You've successfully logged into your account. Redirecting to the dashboard...",
          });
          router.push("/sales/cash-sales");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Invalid Access Token",
          description: "The access token is invalid or expired.",
          action: (
            <ToastAction onClick={() => form.reset()} altText="Try again">
              Try again
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      setIsLoading(false); // Reset loading state in case of error

      // toast({
      //   variant: "destructive",
      //   title: "An error occurred",
      //   description: "Please try again later.",
      // });
      return;
    } finally {
      setIsLoading(false); // Reset loading state after login completes
    }
  };

  // // Check if user is already logged in
  // const checkIsLoggedIn = async () => {
  //   const username = JSON.parse(localStorage.getItem("username") ?? '""');
  //   const authToken = JSON.parse(localStorage.getItem("authToken") ?? '""');

  //   if (username && authToken) {
  //     const isValid = await checkAccessToken(username, authToken);
  //     if (isValid) {
  //       toast({
  //         variant: "success",
  //         title: "Already Logged In",
  //         description: "You're already logged in. Redirecting to the dashboard...",
  //       });
  //       router.push("/sales/cash-sales");
  //     }
  //   }
  // };

  useEffect(() => {
    const init = async () => {
      if (!navigator.onLine) {
        // Offline: restore from cache and bypass login
        const cached = await getCachedAuthData();
        if (cached) {
          localStorage.setItem("username", JSON.stringify(cached.username));
          localStorage.setItem("authToken", JSON.stringify(cached.authToken));
          localStorage.setItem("userFullName", JSON.stringify(cached.userFullName));
          localStorage.setItem("userID", JSON.stringify(cached.userID));
          localStorage.setItem("role", JSON.stringify(cached.role));
          localStorage.setItem("currentAccount", JSON.stringify(cached.currentAccount));
          localStorage.setItem("currentCompany", JSON.stringify(cached.currentCompany));
          localStorage.setItem("currentLocation", JSON.stringify(cached.currentLocation));
          localStorage.setItem("system-account", JSON.stringify(cached.systemAccount));
          localStorage.setItem("userRule", JSON.stringify(cached.userRule));
          router.replace("/sales/cash-sales");
        }
        return;
      }

      // Online: check if already logged in
      const username = JSON.parse(localStorage.getItem("username") ?? '""');
      const authToken = JSON.parse(localStorage.getItem("authToken") ?? '""');
      if (username && authToken) {
        const isValid = await checkAccessToken(username, authToken);
        if (isValid) {
          toast({
            variant: "success",
            title: "Already Logged In",
            description: "You're already logged in. Redirecting to the dashboard...",
          });
          router.replace("/sales/cash-sales");
        }
      }
    };

    init();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mx-auto flex w-96 flex-col items-center justify-center gap-y-8">
          <Image
            src={_1ofisLogo}
            alt="1OFIS Logo"
            priority
            unoptimized
            className="w-3/4 max-w-xs"
          />
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-erp-blue-13">Login</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center gap-x-4">
                      <NetworkBackup className="size-6 text-erp-blue-13" />
                      <FormControl enableErrorHighlight>
                        <Input placeholder="System Account" autoFocus {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="pl-10" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <div className="flex items-center gap-x-4">
                      <FaUser className="size-6 text-erp-blue-13" />
                      <FormControl enableErrorHighlight>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage className="pl-10" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormItem className="space-y-1">
                      <div className="relative flex items-center gap-x-4">
                        <FaKey className="size-6 text-erp-blue-13" />
                        <FormControl enableErrorHighlight>
                          <div className="relative w-full">
                            <Input
                              placeholder="Password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              autoComplete="current-password"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((prev) => !prev)}
                              className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
                            >
                              {showPassword ? (
                                <EyeOff className="size-5" />
                              ) : (
                                <Eye className="size-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage className="pl-10" />
                    </FormItem>
                  );
                }}
              />
            </CardContent>
            <CardFooter className="justify-center">
              <Button
                className="bg-erp-blue-6 px-5 font-semibold text-erp-blue-13 hover:bg-erp-blue-7 hover:text-erp-blue-14"
                type="submit"
                variant="ghost"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </CardFooter>
          </Card>
          <div className="flex w-full justify-between text-sm">
            <Link href="/signup" className="text-erp-blue-13 underline hover:no-underline">
              Register New User
            </Link>
            <Link href="/forgot-password" className="text-erp-blue-13 underline hover:no-underline">
              Forgot Password?
            </Link>
          </div>

          {/* Best View Resolution Notice */}
          <div className="rounded-md bg-blue-50 p-3 text-center text-sm text-blue-900 shadow-sm">
            Best View Resolution: 1920 x 1080
          </div>
          <div className="text-center">
            <p className="mb-4 text-lg font-semibold text-erp-blue-13">1job Application</p>

            <div className="flex flex-wrap items-center justify-center gap-10">
              <div className="text-center">
                <Image
                  src={_1ofisIOSLink}
                  alt="1OFIS iOS"
                  priority
                  unoptimized
                  className="mx-auto h-auto w-20"
                />
                <p className="mt-2 text-erp-blue-13">App Store (iOS)</p>
              </div>

              <div className="text-center">
                <Image
                  src={_1ofisAPKLink}
                  alt="1OFIS APK"
                  priority
                  unoptimized
                  className="mx-auto h-auto w-20"
                />
                <p className="mt-2 text-erp-blue-13">Android (APK)</p>
              </div>

              {/* <div className="hidden text-center">
                <QRCode className="mx-auto h-auto w-20" value="https://www.infollective.com" />
                <p className="mt-2 text-erp-blue-13">Android (APK)</p>
              </div> */}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && <LoadingUI />}
      </form>
    </Form>
  );
}
