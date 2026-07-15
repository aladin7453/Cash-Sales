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

async function fetchAndCacheTables(tables: readonly string[]): Promise<DropdownData> {
  const headers = getAuthHeaders();
  const fd = new FormData();
  tables.forEach((table) => fd.append("table[]", table));

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
    tables.forEach((table) => {
      data[table] = result[table]?.rows ?? result[table] ?? [];
    });
  }

  await Promise.all(
    tables.map((table) =>
      cacheDropdowns(table, data[table] ?? []).catch(() => {
        // IndexedDB write failed for this table — ignore
      })
    )
  );

  return data;
}

export async function prefetchAllDropdowns(force = false): Promise<DropdownData> {
  if (!navigator.onLine) {
    const data: DropdownData = {};
    await Promise.all(
      TABLE_NAMES.map(async (table) => {
        try {
          const cached = await getCachedDropdowns(table);
          data[table] = cached ?? [];
        } catch {
          data[table] = [];
        }
      })
    );
    return data;
  }

  // Work out which tables are missing from cache (or refetch all if forced)
  const data: DropdownData = {};
  const tablesToFetch: string[] = [];

  if (force) {
    tablesToFetch.push(...TABLE_NAMES);
  } else {
    await Promise.all(
      TABLE_NAMES.map(async (table) => {
        try {
          const cached = await getCachedDropdowns(table);
          if (cached) {
            data[table] = cached;
          } else {
            tablesToFetch.push(table);
          }
        } catch {
          tablesToFetch.push(table);
        }
      })
    );
  }

  if (tablesToFetch.length === 0) {
    return data; // everything was already cached
  }

  try {
    const fetched = await fetchAndCacheTables(tablesToFetch);
    Object.assign(data, fetched);
    return data;
  } catch (error) {
    console.error("Error prefetching dropdowns:", error);
    // Fall back to whatever cache exists for the tables we failed to fetch
    await Promise.all(
      tablesToFetch.map(async (table) => {
        if (data[table]) return;
        try {
          const cached = await getCachedDropdowns(table);
          data[table] = cached ?? [];
        } catch {
          data[table] = [];
        }
      })
    );
    return data;
  }
}

// Force-refresh a single table.
export async function refreshDropdownTable(table: (typeof TABLE_NAMES)[number]): Promise<any[]> {
  const data = await fetchAndCacheTables([table]);
  return data[table] ?? [];
}