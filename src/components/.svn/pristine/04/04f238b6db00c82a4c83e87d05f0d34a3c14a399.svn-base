import { useState, useCallback } from "react";

interface UseTransferToStateReturn {
  dialogOpen: boolean;
  popoverOpen: boolean;
  selectedDocType: string;
  itemData: any[];
  transferQuantities: Record<string, string>;
  setDialogOpen: (open: boolean) => void;
  setPopoverOpen: (open: boolean) => void;
  setSelectedDocType: (docType: string) => void;
  setItemData: (data: any[]) => void;
  setTransferQuantities: (quantities: Record<string, string> | ((prev: Record<string, string>) => Record<string, string>)) => void;
  resetState: () => void;
}

export function useTransferToState(): UseTransferToStateReturn {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState("");
  const [itemData, setItemData] = useState<any[]>([]);
  const [transferQuantities, setTransferQuantities] = useState<Record<string, string>>({});

  const resetState = useCallback(() => {
    setDialogOpen(false);
    setPopoverOpen(false);
    setSelectedDocType("");
    setItemData([]);
    setTransferQuantities({});
  }, []);

  return {
    dialogOpen,
    popoverOpen,
    selectedDocType,
    itemData,
    transferQuantities,
    setDialogOpen,
    setPopoverOpen,
    setSelectedDocType,
    setItemData,
    setTransferQuantities,
    resetState,
  };
}