import { getAuthHeaders } from "@/lib/constants";

export const fetcher = async <T = any>(url: string): Promise<T> => {
  const headers = getAuthHeaders();
  const res = await fetch(url, { headers,credentials: "omit" });

  if (res.status === 401) {
    throw new Error("Session expired"); // <-- just throw, don't call router here
  }

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
};