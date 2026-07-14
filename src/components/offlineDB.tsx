"use client";

import { openDB } from "idb";

const getDB = async () => {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB not available on server");
  }

  const { openDB } = await import("idb");

  return openDB("CashSalesDB", 9, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("cash-sales-offline")) {
        db.createObjectStore("cash-sales-offline", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cash-sales-dropdowns")) {
        db.createObjectStore("cash-sales-dropdowns", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("cash-sales-items")) {
        db.createObjectStore("cash-sales-items", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("cash-sales-packages")) {
        db.createObjectStore("cash-sales-packages", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("cash-sales-records")) {
        db.createObjectStore("cash-sales-records", { keyPath: "key" });
      }
      if (!db.objectStoreNames.contains("cash-sales-details")) {
        db.createObjectStore("cash-sales-details", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cash-sales-preferences")) {
        db.createObjectStore("cash-sales-preferences", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cash-sales-current-company")) {
        db.createObjectStore("cash-sales-current-company", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cash-sales-auth")) {
        db.createObjectStore("cash-sales-auth", { keyPath: "id" });
      }
    },
  });
};

// Global sync lock
let _isSyncing = false;

export function acquireSyncLock(): boolean {
  if (_isSyncing) return false;
  _isSyncing = true;
  return true;
}

export function releaseSyncLock(): void {
  _isSyncing = false;
}

let _dbPromise: ReturnType<typeof openDB> | null = null;
export const dbPromise = () => {
  if (!_dbPromise) _dbPromise = getDB();
  return _dbPromise;
};

//  Offline Pending Records (drafts) 
export async function saveOffline(data: any) {
  const db = await dbPromise();
  const existing = await db.get("cash-sales-offline", data.id).catch(() => null);
  await db.put("cash-sales-offline", {
    ...data,
    synced: false,
    createdAt: existing?.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  });
}

export async function updateOffline(id: string, updates: any) {
  const db = await dbPromise();
  const item = await db.get("cash-sales-offline", id);
  if (!item) return;
  await db.put("cash-sales-offline", { ...item, ...updates });
}

export async function getOffline() {
  const db = await dbPromise();
  return await db.getAll("cash-sales-offline");
}

export async function deleteOffline(id: string) {
  const db = await dbPromise();
  await db.delete("cash-sales-offline", id);
}

export async function markAsSynced(id: string) {
  const db = await dbPromise();
  const item = await db.get("cash-sales-offline", id);
  if (item) {
    item.synced = true;
    await db.put("cash-sales-offline", item);
  }
}

export async function markAsSyncing(id: string): Promise<void> {
  await updateOffline(id, { syncing: true });
}

export async function unmarkAsSyncing(id: string): Promise<void> {
  await updateOffline(id, { syncing: false });
}

//  Online Records Cache (for offline viewing) 
export async function cacheOnlineRecords(rows: any[]) {
  const db = await dbPromise();
  await db.put("cash-sales-records", {
    key: "index",
    rows,
    cachedAt: Date.now(),
  });
}

// Clear all cached online records (call on logout).
export async function clearOnlineCache() {
  const db = await dbPromise();
  await db.clear("cash-sales-details");
}

export async function getCachedOnlineRecords(): Promise<any[] | null> {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-records", "index");
    if (!record) return null;
    return record.rows;
  } catch {
    return null;
  }
}

// Doc No Cache
export async function cacheLastDocNo(docNo: string) {
  const db = await dbPromise();
  await db.put("cash-sales-records", {
    key: "lastDocNo",
    docNo,
    cachedAt: Date.now(),
  });
}

export async function getCachedLastDocNo(): Promise<string | null> {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-records", "lastDocNo");
    if (!record) return null;
    return record.docNo;
  } catch {
    return null;
  }
}

// Cache a single cash sales document with its details for offline editing.
export async function cacheDetails(id: string, data: {
  cashSales: any;
  cashSalesHasDetails: any[];
  attachments?: any[];
  cachedAt?: number;
}) {
  const db = await dbPromise();
  await db.put("cash-sales-details", {
    id,
    ...data,
    cachedAt: Date.now(),
  });
}

// Get a cached cash sales document by UUID.
export async function getCachedDetails(id: string): Promise<any | null> {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-details", id);
    if (!record) return null;
    return record;
  } catch {
    return null;
  }
}

// Get all cached cash sales details.
export async function getAllCachedDetails(): Promise<any[]> {
  const db = await dbPromise();
  try {
    return await db.getAll("cash-sales-details");
  } catch {
    return [];
  }
}

// Dropdowns 
export async function cacheDropdowns(key: string, data: any) {
  const db = await dbPromise();
  await db.put("cash-sales-dropdowns", { key, data, cachedAt: Date.now() });
}

export async function getCachedDropdowns(key: string) {
  const db = await dbPromise();
  const record = await db.get("cash-sales-dropdowns", key);
  if (!record) return null;
  return record.data;
}

// Items 
export async function cacheItems(type: "stock" | "service", data: any[]) {
  const db = await dbPromise();
  await db.put("cash-sales-items", { key: type, data, cachedAt: Date.now() });
}

export async function getCachedItems(type: "stock" | "service") {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-items", type);
    if (!record) return null;
    return record.data;
  } catch {
    return null;
  }
}

// Packages 
export async function cachePackages(data: any[]) {
  const db = await dbPromise();
  await db.put("cash-sales-packages", { key: "packages", data, cachedAt: Date.now() });
}

export async function getCachedPackages() {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-packages", "packages");
    if (!record) return null;
    return record.data;
  } catch {
    return null;
  }
}

// Preference Cache
export async function cachePreferenceData(data: any) {
  const db = await dbPromise();
  await db.put("cash-sales-preferences", {
    id: "preference",
    data,
    cachedAt: Date.now(),
  });
}

export async function getCachedPreferenceData(): Promise<any | null> {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-preferences", "preference");
    if (!record) return null;
    return record.data;
  } catch {
    return null;
  }
}

// Current Company Cache
export async function cacheCurrentCompany(data: any) {
  const db = await dbPromise();
  await db.put("cash-sales-current-company", {
    id: "currentCompany",
    data,
    cachedAt: Date.now(),
  });
}

export async function getCachedCurrentCompany(): Promise<any | null> {
  const db = await dbPromise();
  try {
    const record = await db.get("cash-sales-current-company", "currentCompany");
    if (!record) return null;
    return record.data;
  } catch {
    return null;
  }
}

export async function cacheAuthData(data: { username: string; userFullName: string; userID: any; userRule: any; authToken: string; role: any; currentAccount: any; currentCompany: any; currentLocation: any; systemAccount: any }) {
  const db = await dbPromise();
  await db.put("cash-sales-auth", { id: "auth", ...data });
}

export async function getCachedAuthData() {
  const db = await dbPromise();
  try {
    return await db.get("cash-sales-auth", "auth");
  } catch {
    return null;
  }
}

export async function generateOfflineDocNo(): Promise<string> {
  const cachedPref = await getCachedPreferenceData();
  const format: string = cachedPref?.preference?.data?.cashSalesFormat || "CS????????";

  const placeholderMatch = format.match(/\?+/);
  const digitLength = placeholderMatch ? placeholderMatch[0].length : 8;

  const existingDrafts = await getOffline();
  let maxNum = 0;
  existingDrafts.forEach((d) => {
    const docNo: string = d.cashSales?.docNo || "";
    if (docNo.startsWith("O")) {
      const numMatch = docNo.match(/(\d+)$/);
      if (numMatch) {
        const n = parseInt(numMatch[1], 10);
        if (n > maxNum) maxNum = n;
      }
    }
  });

  const nextNum = maxNum + 1;
  const numPart = String(nextNum).padStart(digitLength, "0");
  const filledFormat = format.replace(/\?+/, numPart);

  return `O${filledFormat}`;
}