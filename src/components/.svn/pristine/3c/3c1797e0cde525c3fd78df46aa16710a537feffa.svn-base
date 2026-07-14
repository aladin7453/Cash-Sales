import { useMemo } from "react";
import { ORIGIN } from "@/lib/constants";
import type { TransferFromConfig } from "../types";

interface ProcessedConfig extends TransferFromConfig {
  documentsEndpoint: string;
  documentDetailsEndpoint: string;
  transferEndpoint: string;
  transferEndpointSuffix: string;
}

export function useTransferFromConfig(config: TransferFromConfig): ProcessedConfig {
  return useMemo(() => {
    // Validate required fields
    if (!config.module || !config.model || !config.apiNamespace) {
      throw new Error("TransferFrom: module, model, and apiNamespace are required");
    }

    if (!config.sources || config.sources.length === 0) {
      throw new Error("TransferFrom: sources array is required");
    }

    if (!config.documentColumns || config.documentColumns.length === 0) {
      throw new Error("TransferFrom: documentColumns array is required");
    }

    if (!config.itemColumns || config.itemColumns.length === 0) {
      throw new Error("TransferFrom: itemColumns array is required");
    }

    // Generate default endpoints
    const defaultDocumentsEndpoint = `${ORIGIN}/universal/get-all-documents`;
    const defaultDocumentDetailsEndpoint = `${ORIGIN}/universal/get-document-details`;
    const defaultTransferEndpointSuffix = config.transferEndpointSuffix || "transfer-from";
    const defaultTransferEndpoint = config.transferEndpoint || 
      `${ORIGIN}/${config.module}/api/${config.model}/${defaultTransferEndpointSuffix}`;

    return {
      ...config,
      documentsEndpoint: config.documentsEndpoint || defaultDocumentsEndpoint,
      documentDetailsEndpoint: config.documentDetailsEndpoint || defaultDocumentDetailsEndpoint,
      transferEndpoint: defaultTransferEndpoint,
      transferEndpointSuffix: defaultTransferEndpointSuffix,
      buttonText: config.buttonText || "T-From",
      dialogTitle: config.dialogTitle || "Transfer from",
      documentPopoverTitle: config.documentPopoverTitle || "Select Document",
      detailsPopoverTitle: config.detailsPopoverTitle || "Transfer Details",
    };
  }, [config]);
}
