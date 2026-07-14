// /lib/hooks/useAPI.ts
"use client";

import useSWR, { SWRConfiguration } from "swr";
import { fetcher } from "@/lib/fetcher";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function useApi<Data = any>(
  url: string | null,
  options?: SWRConfiguration
) {
  const router = useRouter();
   const { toast } = useToast();
  const enhancedFetcher = async (url: string) => {
    try {
      return await fetcher<Data>(url);
    } catch (err: any) {
      if (err.message === "Session expired") {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Redirecting to login page.",
          duration: 4000,
        });
        router.push("/login");
        
      }
      throw err;
    }
  };
  return useSWR<Data>(url, enhancedFetcher, options);
}