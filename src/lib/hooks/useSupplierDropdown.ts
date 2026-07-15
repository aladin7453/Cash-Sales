// useSupplierDropdown.ts
import { UseFormReturn } from "react-hook-form";

//Parameter Type
interface SupplierDropdownData {
  UUID: string;
  supplierCode: string;
  supplierGroupCode: string;
  supplierName: string;
  MISC: string;
  MSIC: string;
  MSICCode: string;
  businessNature: string;
  TIN: string;
  BRN: string;
  BRNOld: string;
  SSTNo: string;
  address: string;
  TTXNo: string;
  currency: string;
  currencyCode: string;
  currencyRateSales: number;
  creditTerm: string;
  creditTermCode: string;
  creditTermNoOfDay: string;
  supplierHasBillingContacts?: { UUID: string; contact: string; phoneNo: string; email: string; default: string }[];
}

export function useSupplierDropdown(form: UseFormReturn<any>) {
  const onClickRow = (row: SupplierDropdownData) => {
    form.setValue("supplierCode", row.UUID);
    form.setValue("supplierCodeCode", row.supplierCode, { shouldValidate: true });
    form.setValue("supplierName", row.supplierName);
    form.setValue("TIN", row.TIN);
    form.setValue("BRN", row.BRN);
    form.setValue("supplierBRNOld", row.BRNOld);
    form.setValue("SSTNo", row.SSTNo);
    form.setValue("address", row.address);
    form.setValue("TTXNo", row.TTXNo);
    form.setValue("MISC", row.MISC);
    form.setValue("MSICCode", row.MSICCode);
    form.setValue("businessNature", row.businessNature);

    //Supplier
    form.setValue("supplierTIN", row.TIN);
    form.setValue("supplierBRN", row.BRN);
    form.setValue("supplierSSTNo", row.SSTNo);
    form.setValue("supplierAddress", row.address);
    form.setValue("supplierTTXNo", row.TTXNo);
    form.setValue("supplierMSICCode", row.MSIC);
    form.setValue("MISCCodeCode", row.MSICCode);
    form.setValue("supplierBusinessNature", row.businessNature);

    //Recipient
    form.setValue("recipient", row.supplierName);
    form.setValue("recipientTIN", row.TIN);
    form.setValue("recipientBRN", row.BRN);
    form.setValue("recipientSSTNo", row.SSTNo);
    form.setValue("recipientAddress", row.address);
    form.setValue("recipientTTXNo", row.TTXNo);

    //Shipper
    form.setValue("shipperName", row.supplierName);
    form.setValue("shipperTIN", row.TIN);
    form.setValue("shipperBRN", row.BRN);
    form.setValue("shipperSSTNo", row.SSTNo);
    form.setValue("shipperAddress", row.address);
    form.setValue("shipperTTXNo", row.TTXNo);

    // Default Billing Contact
    const defaultContact = row.supplierHasBillingContacts?.find((c) => c.default === "1");
    form.setValue("attention", defaultContact?.UUID ?? "");
    form.setValue("attentionName", defaultContact?.contact ?? "");
    form.setValue("phoneNo", defaultContact?.phoneNo ?? "");
    form.setValue("email", defaultContact?.email ?? "");
  };

  return { onClickRow };
}