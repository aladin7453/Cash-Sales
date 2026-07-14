"use client";

import { useRouter } from "next/navigation";
import { ORIGIN, checkAccessToken, getAuthHeaders } from "@/lib/constants";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export const dynamic = 'force-dynamic';

let tokenValidationPromise: Promise<boolean> | null = null;

const validateToken = async () => {
  if (!tokenValidationPromise) {
    const username = JSON.parse(localStorage.getItem("username") || "null");
    const authToken = JSON.parse(localStorage.getItem("authToken") || "null");

    tokenValidationPromise = checkAccessToken(username, authToken);
  }

  return tokenValidationPromise;
};

const fetcher = async (
  url: string,
  options: { method?: string; body?: FormData } = {}
) => {
  const isValid = await validateToken();

  if (!isValid) {
    console.error("Session expired. Redirecting to login.");
    throw new Error("Session expired");
  }

  const headers = getAuthHeaders();

  return fetch(url, {
    method: options.method || "GET",
    headers,
    ...(options.body ? { body: options.body } : {}),
  }).then(async (res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    try {
      return await res.json();
    } catch (error) {
      throw new Error("Failed to parse response JSON");
    }
  });
};

export default function GoogleDriveCallbackPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code") ?? "";
    setCode(code);
  }, []);

  const { data: callbackData, isLoading } = useSWR(
    code ? [`${ORIGIN}/site/api/site/google-drive-callback`, code] : null,
    ([url, code]) => {
      const params = new FormData();
      params.append("code", code);
      return fetcher(url, {
        method: "POST",
        body: params,
      });
    }
  );

  useEffect(() => {
    if (!isLoading && callbackData) {
      if (callbackData.status === true) {
        sessionStorage.setItem("google-account-email", callbackData.email);
        sessionStorage.setItem("google-password", callbackData.password);
        toast({
          variant: "success",
          title: "Callback Successfully",
          description:
            callbackData.message ??
            "Callback Successfully. Redirecting to Dashboard.",
        });
        router.push("/dashboard");
      } else {
        toast({
          variant: "destructive",
          title: "Error occurred",
          description:
            callbackData.message ??
            "An error occurred. Redirecting to Dashboard.",
        });
        router.push("/dashboard");
      }
    }
  }, [callbackData, isLoading, router]);

  return (
    <div>
      {isLoading ? (
        <div>Processing Google Drive callback...</div>
      ) : (
        <div>Redirecting to Dashboard...</div>
      )}
    </div>
  );
}
