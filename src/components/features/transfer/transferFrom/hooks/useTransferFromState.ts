import { useState, useCallback } from "react";

interface UseTransferFromStateReturn {
  dialogOpen: boolean;
  documentPopoverOpen: boolean;
  detailsPopoverOpen: boolean;
  selectedDocType: string;
  selectedDocUUID: string;
  documentsData: any[];
  itemsData: any[];
  transferQuantities: Record<string, string>;
  setDialogOpen: (open: boolean) => void;
  setDocumentPopoverOpen: (open: boolean) => void;
  setDetailsPopoverOpen: (open: boolean) => void;
  setSelectedDocType: (docType: string) => void;
  setSelectedDocUUID: (docUUID: string) => void;
  setDocumentsData: (data: any[]) => void;
  setItemsData: (data: any[]) => void;
  setTransferQuantities: (quantities: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  resetState: () => void;
}

export function useTransferFromState(): UseTransferFromStateReturn {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentPopoverOpen, setDocumentPopoverOpen] = useState(false);
  const [detailsPopoverOpen, setDetailsPopoverOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [selectedDocUUID, setSelectedDocUUID] = useState("");
  const [documentsData, setDocumentsData] = useState<any[]>([]);
  const [itemsData, setItemsData] = useState<any[]>([]);
  const [transferQuantities, setTransferQuantities] = useState<Record<string, string>>({});

  const resetState = useCallback(() => {
    setDialogOpen(false);
    setDocumentPopoverOpen(false);
    setDetailsPopoverOpen(false);
    setSelectedDocType("");
    setSelectedDocUUID("");
    setDocumentsData([]);
    setItemsData([]);
    setTransferQuantities({});
  }, []);

  return {
    dialogOpen,
    documentPopoverOpen,
    detailsPopoverOpen,
    selectedDocType,
    selectedDocUUID,
    documentsData,
    itemsData,
    transferQuantities,
    setDialogOpen,
    setDocumentPopoverOpen,
    setDetailsPopoverOpen,
    setSelectedDocType,
    setSelectedDocUUID,
    setDocumentsData,
    setItemsData,
    setTransferQuantities,
    resetState,
  };
}
