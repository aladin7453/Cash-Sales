import { ORIGIN, getAuthHeaders } from "@/lib/constants";
import { cacheDropdowns, getCachedDropdowns } from "@/components/offlineDB"; 

const TABLE_NAMES = [
  "customer",
  "agent",
  "creditTerm",
  "paymentMethod",
  "project",
  "currency",
  "deliveryTerm",
  "shipper",
  "classification",
  "stockBatch",
  "location",
  "tax",
  "countryOfOrigin"
] as const;

export type DropdownData = Record<string, any[]>;

export async function prefetchAllDropdowns(): Promise<DropdownData> {
  const headers = getAuthHeaders();

  if (!navigator.onLine) {
    try {
      const cached = await getCachedDropdowns("all");
      if (cached) return cached;
    } catch {
      // Corrupted/missing cache — ignore
    }
    return {};
  }

  try {
    const fd = new FormData();
    TABLE_NAMES.forEach((table) => fd.append("table[]", table));

    const response = await fetch(`${ORIGIN}/universal/get-multiple-drop-down-table-data`, {
      method: "POST",
      headers,
      body: fd,
    });

    if (!response.ok) throw new Error("Failed to fetch dropdown data");

    const result = await response.json();
    const data: DropdownData = {};

    if (Array.isArray(result)) {
      result.forEach((item: { table: string; rows: any[] }) => {
        data[item.table] = item.rows ?? [];
      });
    } else {
      TABLE_NAMES.forEach((table) => {
        data[table] = result[table]?.rows ?? result[table] ?? [];
      });
    }

    try {
      await cacheDropdowns("all", data);
    } catch {
      // IndexedDB write failed — ignore
    }

    return data;
  } catch (error) {
    console.error("Error prefetching all dropdowns:", error);
    try {
      const cached = await getCachedDropdowns("all");
      if (cached) return cached;
    } catch {
      // Corrupted/missing cache — ignore
    }
    return {};
  }
}