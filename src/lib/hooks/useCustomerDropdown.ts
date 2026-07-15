// useCustomerDropdown.ts
import { UseFormReturn } from "react-hook-form";

//Parameter Type
interface CustomerDropdownData {
  UUID: string;
  customerCode: string;
  customerGroupCode: string;
  customerName: string;
  MISC: string;
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
  customerHasBillingContacts?: { UUID: string; contact: string; phoneNo: string; email: string; default: string }[];
}

export function useCustomerDropdown(form: UseFormReturn<any>, setCustomerCode?: (code: string) => void) {
  const onClickRow = (row: CustomerDropdownData) => {
    form.setValue("customerCode", row.UUID);
    form.setValue("customerCodeCode", row.customerCode, { shouldValidate: true });
    form.setValue("customerName", row.customerName);
    form.setValue("TIN", row.TIN);
    form.setValue("BRN", row.BRN);
    form.setValue("customerBRNOld", row.BRNOld);
    form.setValue("SSTNo", row.SSTNo);
    form.setValue("address", row.address);
    form.setValue("customerAddress", row.address);
    form.setValue("TTXNo", row.TTXNo);
    form.setValue("MISC", row.MISC);
    form.setValue("MSICCode", row.MSICCode);
    form.setValue("businessNature", row.businessNature);

    // Buyer
    form.setValue("buyerName", row.customerName);
    form.setValue("buyerTIN", row.TIN);
    form.setValue("buyerBRN", row.BRN);
    form.setValue("buyerSSTNo", row.SSTNo);
    form.setValue("buyerAddress", row.address);
    form.setValue("buyerTTXNo", row.TTXNo);
    form.setValue("buyerMSICCode", row.MISC);
    form.setValue("buyerMISCCodeCode", row.MSICCode);
    form.setValue("buyerMSICCodeCode", row.MSICCode);
    form.setValue("buyerBusinessNature", row.businessNature);

    // Recipient
    form.setValue("recipient", row.customerName);
    form.setValue("recipientTIN", row.TIN);
    form.setValue("recipientSSTNo", row.SSTNo);
    form.setValue("recipientBRN", row.BRN);
    form.setValue("recipientTTXNo", row.TTXNo);
    form.setValue("recipientAddress", row.address);

    // Shipper
    form.setValue("shipperName", row.customerName);
    form.setValue("shipperTIN", row.TIN);
    form.setValue("shipperSSTNo", row.SSTNo);
    form.setValue("shipperBRN", row.BRN);
    form.setValue("shipperTTXNo", row.TTXNo);
    form.setValue("shipperAddress", row.address);

    // Credit Term
    if (row.creditTerm) {
      form.setValue("creditTerm", row.creditTerm);
      form.setValue("creditTermCode", row.creditTermCode);
      form.setValue("noOfDays", row.creditTermNoOfDay);
    }

    // Default Billing Contact
    const defaultContact = row.customerHasBillingContacts?.find((c) => c.default === "1");
    form.setValue("attention", defaultContact?.UUID ?? "");
    form.setValue("attentionName", defaultContact?.contact ?? "");
    form.setValue("phoneNo", defaultContact?.phoneNo ?? "");
    form.setValue("shipperPhoneNo", defaultContact?.phoneNo ?? "");
    form.setValue("recipientPhoneNo", defaultContact?.phoneNo ?? "");
    form.setValue("email", defaultContact?.email ?? "");

    // DONT ASK ME WHY AND DO NOT TOUCH
    form.setValue("customerAttentionNameName", defaultContact?.contact ?? "");
    form.setValue("customerAttentionTel", defaultContact?.phoneNo ?? "");
    form.setValue("customerAttentionEmail", defaultContact?.email ?? "");

    // For Customer Payment
    setCustomerCode?.(row.UUID);
  };

  return { onClickRow };
}