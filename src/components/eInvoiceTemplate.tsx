import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: '10mm',
    paddingBottom: '10mm',
    paddingLeft: '10mm',
    paddingRight: '10mm',
  },
  // Header — centered company info
  header: {
    fontSize: 10,
    textAlign: 'center',
  },
  header2: {
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'center',
    marginTop: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    marginTop: 4,
    marginBottom: 4,
  },
  // Two-column info section
  infoSection: {
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    marginTop: 10,
  },
  leftColumn: {
    width: '55%',
    lineHeight: 1.5,
  },
  rightColumn: {
    width: '43%',
    textAlign: 'right',
    lineHeight: 1.5,
  },
  infoText: {
    fontSize: 10,
    marginBottom: 1,
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  // Main item table — matches HTML column widths: 10,25,6,10,10,7,10,20 (total ~98%)
  table: {
    width: '100%',
    marginTop: 5,
    marginBottom: 5,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  tableRowLast: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
  },
  // Base cell
  cell: {
    padding: 3,
    fontSize: 8.5,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    textAlign: 'center',
  },
  cellLast: {
    padding: 3,
    fontSize: 8.5,
    textAlign: 'center',
  },
  cellLeft: {
    textAlign: 'left',
  },
  cellRight: {
    textAlign: 'right',
  },
  // Column flex values matching HTML widths: 10,25,6,10,10,7,10,20
  col1: { flex: 10 },
  col2: { flex: 25 },
  col3: { flex: 6 },
  col4: { flex: 10 },
  col5: { flex: 10 },
  col6: { flex: 7 },
  col7: { flex: 10 },
  col8: { flex: 20 },
  // Tax summary table — 60% width matching HTML
  taxTable: {
    width: '60%',
    marginBottom: 5,
    borderStyle: 'solid',
    borderColor: '#000000',
    borderWidth: 1,
  },
  // Tax table columns: equal flex
  taxCol1: { flex: 3 },
  taxCol2: { flex: 2 },
  taxCol3: { flex: 2 },
  taxCol4: { flex: 2 },
  taxCol5: { flex: 2 },
  // Bottom section: signature left, QR right
  bottomSection: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBlock: {
    flex: 1,
    marginRight: 10,
    fontSize: 10,
  },
  qrBlock: {
    width: 95,
  },
  qrImage: {
    width: 95,
    height: 95,
  },
  templateName: {
    position: 'absolute',
    bottom: '8.5mm',
    left: '10mm',
    fontSize: 10,
  },
});

const getInvoiceTypeDescription = (type: string) => {
  switch (type) {
    case '01': return 'Invoice';
    case '02': return 'Credit Note';
    case '03': return 'Debit Note';
    case '11': return 'Self-billed Invoice';
    case '12': return 'Self-billed Credit Note';
    case '13': return 'Self-billed Debit Note';
    default: return '';
  }
};

const EInvoice = ({ eInvoiceData, itemsData, QrCode, currentCompanyData }) => {
  if (!eInvoiceData) {
    return (
      <Document>
        <Page size="A4">
          <View><Text>Loading...</Text></View>
        </Page>
      </Document>
    );
  }

  const pages = Array.isArray(eInvoiceData) ? eInvoiceData : [eInvoiceData];

  return (
    <Document>
      {pages.map((previewDoc, index) => {
        const itemArray = Array.isArray(eInvoiceData)
          ? (previewDoc.itemsData ?? [])
          : (itemsData ?? []);

        const invoiceTypeDescription = getInvoiceTypeDescription(
          Array.isArray(eInvoiceData) ? previewDoc.eInvoiceType : eInvoiceData.eInvoiceType
        );

        const Qr = Array.isArray(eInvoiceData) ? previewDoc.eInvoiceData?.qrCode : QrCode;
        const digitalSignature = Array.isArray(eInvoiceData)
          ? previewDoc.eInvoiceData?.digitalSignature
          : eInvoiceData?.digitalSignature;

        let totalSubtotal = 0;
        let totalTaxAmount = 0;
        const totalSubtotalTax =
          Number(previewDoc.totalAmount || 0) + Number(previewDoc.totalTax || 0);

        return (
          <Page size="A4" style={styles.page} key={index}>

            {/* ── Header ── */}
            <View style={styles.header}>
              <Text style={{ fontWeight: 'bold', fontSize: 11 }}>
                {currentCompanyData?.company || ""}
              </Text>
              <Text>{currentCompanyData?.address || ""}</Text>
            </View>

            <View style={styles.header2}>
              <Text>{currentCompanyData?.phoneNo || ""}</Text>
              <Text>{currentCompanyData?.email || ""}</Text>
            </View>

            {/* ── Two-column info ── */}
            <View style={styles.infoSection}>
              {/* Left: supplier + buyer */}
              <View style={styles.leftColumn}>
                <Text style={styles.infoText}>Supplier TIN: {previewDoc.supplierTIN || ""}</Text>
                <Text style={styles.infoText}>Supplier Name: {previewDoc.supplierName || ""}</Text>
                <Text style={styles.infoText}>Suppler Registration Number: {previewDoc.supplierBRN || ""}</Text>
                <Text style={styles.infoText}>Supplier SST ID: {previewDoc.supplierSSTNo || ""}</Text>
                <Text style={styles.infoText}>Supplier Business Address: {previewDoc.supplierAddress || ""}</Text>
                <Text style={styles.infoText}>Supplier Contact Number (Office): {previewDoc.supplierPhoneNo || ""}</Text>
                <Text style={styles.infoText}>Supplier Email: {previewDoc.supplierEmail || ""}</Text>
                <Text style={styles.infoText}>Supplier MSIC Code: {previewDoc.supplierMSICCodeCode || ""}</Text>
                <Text style={styles.infoText}>Supplier Business Activity Description: {previewDoc.supplierBusinessNature || ""}</Text>
                <Text style={{ ...styles.infoText, marginTop: 4 }}>Buyer TIN: {previewDoc.buyerTIN || ""}</Text>
                <Text style={styles.infoText}>Buyer Registration Number: {previewDoc.buyerBRN || ""}</Text>
                <Text style={styles.infoText}>Buyer SST ID: {previewDoc.buyerSSTNo || ""}</Text>
              </View>

              {/* Right: e-invoice details */}
              <View style={styles.rightColumn}>
                <Text style={styles.boldText}>E-INVOICE</Text>
                <Text style={styles.infoText}>e-Invoice Type: {previewDoc.eInvoiceType || ""} - {invoiceTypeDescription}</Text>
                <Text style={styles.infoText}>e-Invoice Version: {previewDoc.eInvoiceVersion || ""}</Text>
                <Text style={styles.infoText}>e-Invoice Code: {previewDoc.docNo || ""}</Text>
                <Text style={styles.infoText}>Unique Identifier: {previewDoc.IRBUUID || ""}</Text>
                <Text style={styles.infoText}>Original Invoice Ref. No.: {previewDoc.oriRefNo || ""}</Text>
                <Text style={styles.infoText}>Invoice Date: {previewDoc.docDateFormat || ""}</Text>
              </View>
            </View>

            {/* ── Item table ── */}
            <View style={styles.table}>
              {/* Header row */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.cell, styles.col1]}><Text>Classification</Text></View>
                <View style={[styles.cell, styles.col2]}><Text>Description</Text></View>
                <View style={[styles.cell, styles.col3]}><Text>Qty</Text></View>
                <View style={[styles.cell, styles.col4]}><Text>Unit Price</Text></View>
                <View style={[styles.cell, styles.col5]}><Text>Amount</Text></View>
                <View style={[styles.cell, styles.col6]}><Text>Disc</Text></View>
                <View style={[styles.cell, styles.col7]}><Text>Tax Amount</Text></View>
                <View style={[styles.cellLast, styles.col8]}><Text>Total Product/Service Price (incl. tax)</Text></View>
              </View>

              {/* Item rows */}
              {itemArray.map((item: any, i: number) => {
                const price = Number(item.price) || 0;
                const quantity = Number(item.quantity) || 0;
                const taxAmount = Number(item.taxAmount) || 0;
                const discountAmt = Number(item.discountAmount) || 0;
                const subtotal = Number(item.amount) || 0;
                const subtotalTax = Number(item.subtotalTax ?? subtotal + taxAmount);

                totalSubtotal += subtotal;
                totalTaxAmount += taxAmount;

                return (
                  <View style={styles.tableRow} key={i}>
                    <View style={[styles.cell, styles.col1]}><Text>{item.classificationCode || ""}</Text></View>
                    <View style={[styles.cell, styles.col2, styles.cellLeft]}><Text>{item.description || ""}</Text></View>
                    <View style={[styles.cell, styles.col3]}><Text>{quantity || ""}</Text></View>
                    <View style={[styles.cell, styles.col4, styles.cellRight]}><Text>RM{price.toFixed(2)}</Text></View>
                    <View style={[styles.cell, styles.col5, styles.cellRight]}><Text>RM{subtotal.toFixed(2)}</Text></View>
                    <View style={[styles.cell, styles.col6, styles.cellRight]}>
                      <Text>{discountAmt > 0 ? `RM${discountAmt.toFixed(2)}` : ""}</Text>
                    </View>
                    <View style={[styles.cell, styles.col7, styles.cellRight]}><Text>RM{taxAmount.toFixed(2)}</Text></View>
                    <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{subtotalTax.toFixed(2)}</Text></View>
                  </View>
                );
              })}

              {/* Subtotal */}
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.col1]}><Text></Text></View>
                <View style={[styles.cell, styles.col2]}><Text></Text></View>
                <View style={[styles.cell, { flex: 16, ...styles.cellLeft }]}><Text>Subtotal:</Text></View>
                <View style={[styles.cell, styles.col5, styles.cellRight]}><Text>RM{Number(previewDoc.totalAmount || 0).toFixed(2)}</Text></View>
                <View style={[styles.cell, styles.col6]}><Text>-</Text></View>
                <View style={[styles.cell, styles.col7, styles.cellRight]}><Text>RM{Number(previewDoc.totalTax || 0).toFixed(2)}</Text></View>
                <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{totalSubtotalTax.toFixed(2)}</Text></View>
              </View>

              {/* Total excluding tax */}
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.col1]}><Text></Text></View>
                <View style={[styles.cell, styles.col2]}><Text></Text></View>
                <View style={[styles.cell, { flex: 16, ...styles.cellLeft }]}><Text>Total excluding tax:</Text></View>
                <View style={[styles.cell, styles.col5]}><Text></Text></View>
                <View style={[styles.cell, styles.col6]}><Text>-</Text></View>
                <View style={[styles.cell, styles.col7]}><Text></Text></View>
                <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{totalSubtotal.toFixed(2)}</Text></View>
              </View>

              {/* Tax amount (SST) */}
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.col1]}><Text></Text></View>
                <View style={[styles.cell, styles.col2]}><Text></Text></View>
                <View style={[styles.cell, { flex: 16, ...styles.cellLeft }]}><Text>Tax amount (SST):</Text></View>
                <View style={[styles.cell, styles.col5]}><Text></Text></View>
                <View style={[styles.cell, styles.col6]}><Text>-</Text></View>
                <View style={[styles.cell, styles.col7]}><Text></Text></View>
                <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{Number(previewDoc.totalTax || 0).toFixed(2)}</Text></View>
              </View>

              {/* Total including tax */}
              <View style={styles.tableRow}>
                <View style={[styles.cell, styles.col1]}><Text></Text></View>
                <View style={[styles.cell, styles.col2]}><Text></Text></View>
                <View style={[styles.cell, { flex: 16, ...styles.cellLeft }]}><Text>Total including tax:</Text></View>
                <View style={[styles.cell, styles.col5]}><Text></Text></View>
                <View style={[styles.cell, styles.col6]}><Text>-</Text></View>
                <View style={[styles.cell, styles.col7]}><Text></Text></View>
                <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{totalSubtotalTax.toFixed(2)}</Text></View>
              </View>

              {/* Total payable */}
              <View style={styles.tableRowLast}>
                <View style={[styles.cell, styles.col1]}><Text></Text></View>
                <View style={[styles.cell, styles.col2]}><Text></Text></View>
                <View style={[styles.cell, { flex: 16, ...styles.cellLeft }]}><Text>Total payable amt:</Text></View>
                <View style={[styles.cell, styles.col5]}><Text></Text></View>
                <View style={[styles.cell, styles.col6]}><Text>-</Text></View>
                <View style={[styles.cell, styles.col7]}><Text></Text></View>
                <View style={[styles.cellLast, styles.col8, styles.cellRight]}><Text>RM{previewDoc.totalPayable || "0.00"}</Text></View>
              </View>
            </View>

            {/* ── Tax summary table (60% width) ── */}
            <View style={styles.taxTable} wrap={false}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.cell, styles.taxCol1]}><Text>Total Product/Service</Text></View>
                <View style={[styles.cell, styles.taxCol2]}><Text>Tax Code</Text></View>
                <View style={[styles.cell, styles.taxCol3]}><Text>Tax Type</Text></View>
                <View style={[styles.cell, styles.taxCol4]}><Text>Tax Rate</Text></View>
                <View style={[styles.cellLast, styles.taxCol5]}><Text>Tax Amount</Text></View>
              </View>
              {itemArray.map((item: any, i: number) => (
                <View style={i === itemArray.length - 1 ? styles.tableRowLast : styles.tableRow} key={i}>
                  <View style={[styles.cell, styles.taxCol1, styles.cellRight]}>
                    <Text>RM{(Number(item.amount) || 0).toFixed(2)}</Text>
                  </View>
                  <View style={[styles.cell, styles.taxCol2]}><Text>{item.taxCode || ""}</Text></View>
                  <View style={[styles.cell, styles.taxCol3]}><Text>{item.taxTypeCode || ""}</Text></View>
                  <View style={[styles.cell, styles.taxCol4]}><Text>{item.taxRate || ""}</Text></View>
                  <View style={[styles.cellLast, styles.taxCol5, styles.cellRight]}>
                    <Text>RM{(Number(item.taxAmount) || 0).toFixed(2)}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* ── Bottom: QR right, signature left ── */}
            <View style={styles.bottomSection} wrap={false}>
              <View style={styles.signatureBlock}>
                {digitalSignature && (
                  <>
                    <Text style={{ fontSize: 10 }}>Digital Signature:</Text>
                    <Text style={{ fontSize: 10 }}>{digitalSignature}</Text>
                  </>
                )}
                <Text style={{ fontSize: 10, marginTop: 3 }}>
                  Date and Time of Validation:{" "}
                  {previewDoc.eInvoiceData?.datetime || previewDoc.validatedAt || ""}
                </Text>
              </View>

              {Qr && (
                <View style={styles.qrBlock}>
                  <Image src={Qr} style={styles.qrImage} />
                </View>
              )}
            </View>

            {/* ── Template name ── */}
            <Text style={styles.templateName} fixed>Template Name: E-Invoice</Text>

          </Page>
        );
      })}
    </Document>
  );
};

export default EInvoice;