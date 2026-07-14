import { useCallback, useState } from "react";

import { DIRECTORY, getAuthHeaders } from "@/lib/constants";

import type { TransferApiResponse, TransferToConfig } from "../types";

interface UseTransferToAPIReturn {
  loading: boolean;
  error: string | null;
  fetchItems: (id: string) => Promise<any[]>;
  transferItems: (data: TransferData) => Promise<TransferApiResponse>;
}

interface TransferData {
  selectedRows: any[];
  id: string;
  docType: string;
}

export function useTransferToAPI(config: TransferToConfig): UseTransferToAPIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headers = getAuthHeaders();

  const fetchItems = useCallback(
    async (ids: string | string[]): Promise<any[]> => {
      const idArray = Array.isArray(ids) ? ids : [ids];
      if (idArray.length === 0) return [];

      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          idArray.map(async (id) => {
            const response = await fetch(
              `${config.itemsEndpoint}?${config.fetchQueryParam}=${id}&isTransfer=1`,
              { headers }
            );
            if (!response.ok) throw new Error("Failed to fetch item data.");
            const data = await response.json();
            // Tag each item with its source doc UUID
            return (data.rows || []).map((item: any) => ({
              ...item,
              _sourceDocUUID: id,
            }));
          })
        );
        return results.flat();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [config.itemsEndpoint, config.fetchQueryParam, headers],
  );

  const transferItems = useCallback(
    async ({ selectedRows, id, docType }: TransferData): Promise<TransferApiResponse> => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        let indexOffset = 0;


        selectedRows.forEach((row, index) => {
          if (row.original.UUID) {
            formData.append(`UUIDs[${index - indexOffset}]`, `${row.original.UUID}`);
          } else {
            formData.append(`UUIDs[${index - indexOffset}]`, `${row.original.itemCode}`);
          }

          const transferQuantity = row.original.transferQuantity || row.original.varianceQuantity || row.original.quantity;
          formData.append(
            `quantity[${index - indexOffset}]`,
            `${transferQuantity}`,
          );
        });

        const response = await fetch(
          `${config.transferEndpoint}?${config.transferQueryParam}=${id}&docType=${docType}`,
          {
            method: "POST",
            headers,
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error("Transfer request failed");
        }

        const data = await response.json();

        if (data.message === "Failed") {
          throw new Error("Transfer operation failed");
        }

        return data;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Transfer failed";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [config.transferEndpoint, config.transferQueryParam, headers],
  );

  return {
    loading,
    error,
    fetchItems,
    transferItems,
  };
}