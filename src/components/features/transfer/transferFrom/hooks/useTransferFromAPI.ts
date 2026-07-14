import { useState, useCallback } from "react";
import { getAuthHeaders, DIRECTORY } from "@/lib/constants";
import type { TransferFromConfig, TransferFromApiResponse, TransferFromData } from "../types";

interface UseTransferFromAPIReturn {
  loading: boolean;
  error: string | null;
  fetchDocuments: (docType: string) => Promise<any[]>;
  fetchDocumentDetails: (docUUID: string, docType: string) => Promise<any[]>;
  transferItems: (data: TransferFromData) => Promise<TransferFromApiResponse>;
}

export function useTransferFromAPI(config: TransferFromConfig): UseTransferFromAPIReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const headers = getAuthHeaders();

  const fetchDocuments = useCallback(async (docType: string): Promise<any[]> => {
    if (!docType) return [];

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${config.documentsEndpoint}?docType=${docType}`, {
        headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents.');
      }

      const data = await response.json();
      return data.rows || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading documents:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [config.documentsEndpoint, headers]);

  const fetchDocumentDetails = useCallback(async (docUUID: string, docType: string): Promise<any[]> => {
    if (!docUUID || !docType) return [];
    setLoading(true);
    setError(null);

    try {
      if(config.module=="job_order"){
        var response = await fetch(
        `${config.documentDetailsEndpoint}?doc_id=${docUUID}&docType=${docType}&transferTo=jobOrder`,
        { headers }
      );
      }else{
        var response = await fetch(
        `${config.documentDetailsEndpoint}?doc_id=${docUUID}&docType=${docType}`,
        { headers }
      );
      }

      if (!response.ok) {
        throw new Error('Failed to fetch document details.');
      }

      const data = await response.json();
      return data.rows || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error loading document details:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [config.documentDetailsEndpoint, headers]);

  const transferItems = useCallback(async ({
    selectedRows,
    sourceDocUUID,
    targetDocUUID,
    docType
  }: TransferFromData): Promise<TransferFromApiResponse> => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      selectedRows.forEach((row, index) => {

        if (row.original.UUID) {
          formData.append(`UUIDs[${index}]`, row.original.UUID);
        } else {
          formData.append(`UUIDs[${index}]`, row.original.itemCode);
        }

        const transferQuantity = row.original.transferQuantity || row.original.quantity;
        formData.append(`quantity[${index}]`, transferQuantity);
      });

      // Use different parameter names for sales_invoice module
      const isSalesInvoice = config.module === "sales_invoice";
      const isSalesOrder = config.module === "sales_order";
      const isStockIssued = config.module === "stock_issued";
      const isStockReceived = config.module === "stock_received";
      const isStockAdjustment = config.module === "stock_adjustment";
      const isJobOrder = config.module === "job_order";

      let docIdParam: string;
      let docTypeParam: string;
      let url: string;

      if (isSalesOrder) {
        docIdParam = "quotationUUID";
        url = `${config.transferEndpoint}?${docIdParam}=${sourceDocUUID}`;
      } else if (isSalesInvoice) {
        docIdParam = "itemUUID";
        docTypeParam = "item";
        url = `${config.transferEndpoint}?${docIdParam}=${sourceDocUUID}&${docTypeParam}=${docType}`;
      } else if (isStockIssued) {
        docIdParam = "stockIssuedUUID";
        docTypeParam = "id";
        url = `${config.transferEndpoint}?${docTypeParam}=${sourceDocUUID}`;
      } else if (isStockReceived) {
        docIdParam = "stockReceivedUUID";
        docTypeParam = "id";
        url = `${config.transferEndpoint}?${docTypeParam}=${sourceDocUUID}`;
      } else if (isStockAdjustment) {
        docIdParam = "stockTakeUUID";
        docTypeParam = "id";
        url = `${config.transferEndpoint}?${docIdParam}=${sourceDocUUID}`;
      } else if (isJobOrder) {
        docIdParam = "itemUUID";
        docTypeParam = "item";
        url = `${config.transferEndpoint}?${docIdParam}=${sourceDocUUID}&${docTypeParam}=${docType}`;
      } else {
        docIdParam = "doc_id";
        docTypeParam = "docType";
        url = `${config.transferEndpoint}?${docIdParam}=${sourceDocUUID}&${docTypeParam}=${docType}`;
      }

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Transfer request failed');
      }

      const data = await response.json();

      if (data.message === "Failed") {
        throw new Error('Transfer operation failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Transfer failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config.transferEndpoint, config.module, headers]);

  return {
    loading,
    error,
    fetchDocuments,
    fetchDocumentDetails,
    transferItems,
  };
}