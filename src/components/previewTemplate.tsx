import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { versionPath } from "@/lib/constants";
const isDev = process.env.NODE_ENV === 'development';

Font.register({
  family: 'NotoSansSC',
  src: isDev
    ? '/fonts/NotoSansSC-Regular.ttf'
    : `/${versionPath}/fonts/NotoSansSC-Regular.ttf`,
});

Font.register({
  family: 'NotoSansSC-Bold',
  src: isDev
    ? '/fonts/NotoSansSC-Bold.ttf'
    : `/${versionPath}/fonts/NotoSansSC-Bold.ttf`,
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "NotoSansSC",
  },
  header: {
    fontSize: 9,
    marginLeft: 120,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
  },
  headerText: {
    fontSize: 8,
    marginRight: 10,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
    fontFamily: "NotoSansSC-Bold",
  },
  mainContainer: {
    fontSize: 12,
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "50%",
    paddingRight: 10,
  },
  rightColumn: {
    width: "20%",
    textAlign: "left",
  },
  descriptionBox: {
    width: "28%",
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 8,
    marginTop: 5,
    minHeight: 60,
  },
  botContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerTextContainer: {
    marginTop: 20,
    fontSize: 8,
  },
  leftBotColumn: {
    width: "60%",
  },
  rightBotColumn: {
    width: "35%",
    marginLeft: 10,
  },
  section: {
    fontSize: 9,
    marginBottom: 10,
  },
  acceptedByText: {
    fontSize: 9,
    marginTop: 8,
    textAlign: "left",
  },
  signatureLine: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#000000",
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
  },
  signatureLabel: {
    fontSize: 9,
    marginBottom: 25,
    textAlign: "center",
  },
  systemUserSection: {
    width: "100%",
    fontSize: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionText: {
    fontSize: 9,
    marginRight: 10,
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderStyle: "solid",
    borderColor: "#000000",
    borderTopWidth: 1,
    borderCollapse: "collapse",
  },
  qtyTableContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  qtyTable: {
    borderStyle: "solid",
    borderColor: "#000000",
    borderWidth: 1,
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableCell: {
    padding: 1,
    fontSize: 7,
    textAlign: "center",
    flexShrink: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000000",
  },
  qtyTableCell: {
    padding: 4,
    fontSize: 8,
    textAlign: "left",
    flexShrink: 1,
    borderRightWidth: 1,
    borderColor: "#000000",
  },
  qtyTableCellNumber: {
    padding: 4,
    fontSize: 8,
    textAlign: "right",
    flexShrink: 1,
    borderColor: "#000000",
  },
  tableCellLeftAlign: {
    textAlign: "left",
  },
  tableCellRightAlign: {
    textAlign: "right",
  },
  noBorderLeft: {
    borderLeftWidth: 0,
  },
  noBorderRight: {
    borderRightWidth: 0,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  tableHeader: {
    backgroundColor: "#ffffff",
    fontFamily: "NotoSansSC-Bold",
  },
  firstSeparator: {
    width: "100%",
    height: 0.5,
    backgroundColor: "#000000",
    marginTop: 5,
    marginBottom: 5,
  },
  secondSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#cecece",
    marginTop: 5,
    marginBottom: 10,
  },
  logoContainer: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 100,
    height: 100,
    marginBottom: 10,
    overflow: "hidden",
  },
  logoImage: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 8,
    bottom: 30,
    right: 30,
    textAlign: "right",
  },
  childItem: {
    marginLeft: 13,
  },
  remark: {
    marginTop: 20,
    fontSize: 8,
  },
  currency: {
    fontSize: 8,
  },
  boldText: {
    fontFamily: "NotoSansSC-Bold",
  },
  description: {
    fontSize: 8,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  bottomSection: {
    marginTop: "auto",
  },
  qrCodeImage: {
    width: 75,
    height: 75,
    textAlign: "right",
    position: "absolute",
    top: 0,
    right: 0,
  },
  templateName: {
    position: "absolute",
    fontSize: 8,
    bottom: 30,
    left: 30,
    textAlign: "left",
  },
});

const PreviewPDF = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
  PDFPreviewType,
  QrCode,
  eInvoiceData,
  showDefault1ItemizedCG,
  eInvoiceStatus,
  isProformaInvoice = false,
  descriptionPreferences = { description: true, secondDescription: true, moreDescription: true },
  agentPreferences = { salesAgent: true, servicingAgent: true, collectionAgent: true },
  template2Mode = false,
}) => {
  if (!previewData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }
  const pages = Array.isArray(previewData) ? previewData : [previewData];
  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  function convertNumberToWords(amount) {
    const val = parseFloat(amount || 0).toFixed(2);
    const [intStr, decStr] = val.split(".");

    const integerPart = parseInt(intStr, 10);
    const decimalPart = parseInt(decStr, 10);

    const units = [
      "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
      "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
      "Seventeen", "Eighteen", "Nineteen",
    ];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const scales = ["", "Thousand", "Million", "Billion"];

    function threeDigitToWords(num, useAnd) {
      if (num === 0) return "";
      let word = "";
      const hundred = Math.floor(num / 100);
      const remainder = num % 100;
      if (hundred > 0) {
        word += units[hundred] + " Hundred";
        if (remainder > 0 && useAnd) word += " and ";
        else if (remainder > 0) word += " ";
      }
      if (remainder > 0) {
        if (remainder < 20) {
          word += units[remainder];
        } else {
          const t = Math.floor(remainder / 10);
          const u = remainder % 10;
          word += tens[t];
          if (u > 0) word += " " + units[u];
        }
      }
      return word.trim();
    }

    function integerToWords(n, useAndForChunks) {
      if (n === 0) return "Zero";
      let words = "";
      let scaleIndex = 0;
      while (n > 0) {
        const chunk = n % 1000;
        if (chunk > 0) {
          const chunkWords = threeDigitToWords(chunk, useAndForChunks);
          const scaleWord = scales[scaleIndex];
          const segment = chunkWords + (scaleWord ? " " + scaleWord : "");
          words = segment + (words ? " " + words : "");
        }
        n = Math.floor(n / 1000);
        scaleIndex++;
      }
      return words;
    }

    const useAnd = decimalPart === 0;
    const intWords = integerToWords(integerPart, useAnd);

    let finalWords = "";
    if (decimalPart > 0) {
      const decimalWords = integerToWords(decimalPart, false);
      finalWords = `${intWords} AND ${decimalWords} CENTS ONLY`;
    } else {
      finalWords = `${intWords} ONLY`;
    }

    return finalWords.toUpperCase();
  }

  const getTypeDescription = (type) => {
    switch (type) {
      case 'salesInvoice': return 'SALES INVOICE';
      case 'salesCreditNote': return 'SALES CREDIT NOTE';
      case 'salesDebitNote': return 'SALES DEBIT NOTE';
      default: return '';
    }
  };

  let image64 = currentCompanyData.logoLink && currentCompanyData.logoLink[0]?.base64;

  return (
    <Document title={previewData.docNo || ""}>
      {pages.map((previewDoc, index) => {
        const itemArray = Array.isArray(previewData) ? previewDoc.itemsData : itemsData ? itemsData : [];
        const eInvoiceStat = Array.isArray(previewData) ? previewDoc.eInvoiceStatus : eInvoiceStatus;
        const eInvoiceDateTime = Array.isArray(previewData) ? previewDoc.eInvoiceData?.datetime : eInvoiceData?.datetime;
        const Qr = Array.isArray(previewData) ? previewDoc.eInvoiceData?.qrCode : QrCode;

        return (
          <Page size="A4" style={styles.page} key={index}>
            {/* Logo Image */}
            <View style={styles.logoContainer}>
              {image64 ? (
                <Image
                  src={{
                    uri: image64,
                    method: "GET",
                    headers: { "Cache-Control": "no-cache" },
                    body: "",
                  }}
                  style={styles.logoImage}
                />
              ) : null}
            </View>

            {/* Company Header */}
            <View style={styles.header}>
              <Text>
                <Text style={styles.boldText}>{currentCompanyData.company || ""} </Text>
                {currentCompanyData.BRN ? ` (${currentCompanyData.BRN})` : ""}
                {currentCompanyData.TIN ? ` (${currentCompanyData.TIN})` : ""}
              </Text>
              <Text style={styles.headerText}>{currentCompanyData.address || ""}</Text>
              <Text style={styles.headerText}>
                {currentCompanyData.phoneNo ? `Phone No.: ${currentCompanyData.phoneNo}` : ""}
                {"   "}
                {currentCompanyData.email ? `Email: ${currentCompanyData.email}` : ""}
              </Text>
              {Qr && <Image src={Qr} style={styles.qrCodeImage} />}
            </View>

            {/* Centered title like HTML <h2> */}
            <View>
              <Text style={styles.sectionTitle}>
                {previewDoc.consolidateDocType ? getTypeDescription(previewDoc.consolidateDocType) : PDFPreviewType}
              </Text>
            </View>

            <View>
              <View style={styles.firstSeparator} />
            </View>

            <View style={styles.contentContainer}>
              {/* Main Info Row: left (customer), right (doc no/date), description box */}
              <View style={styles.mainContainer}>
                {/* Customer Information */}
                <View style={styles.leftColumn}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>
                      {previewDoc.customerName || previewDoc.supplierName || ""}
                    </Text>
                    <Text>{previewDoc.address || previewDoc.customerAddress || ""}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text>Attention: {previewDoc.attentionName || ""}</Text>
                    <Text style={styles.sectionText}>
                      Phone No.: {previewDoc.phoneNo || previewDoc.customerAttentionTel || ""}
                    </Text>
                    <Text style={styles.sectionText}>
                      Email: {previewDoc.email || previewDoc.customerAttentionEmail || ""}
                    </Text>
                  </View>
                </View>

                {/* Right Column: Doc No, Date only (no Terms per HTML) */}
                <View style={styles.rightColumn}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>No. : {previewDoc.docNo || ""}</Text>
                    <Text>Date : {previewDoc.docDateFormat || ""}</Text>
                  </View>
                </View>

                {/* Description box — right-floated border box matching HTML */}
                {previewDoc.description && (
                  <View style={styles.descriptionBox}>
                    <Text style={{ fontSize: 8 }}>{stripHtml(previewDoc.description)}</Text>
                  </View>
                )}
              </View>

              {/* Items Table — HTML column order: No, Item, Item Name, QTY, UOM, Price, Disc., Tax Amt., Subtotal(Tax) */}
              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text>No</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>Item</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: template2Mode ? 3 : 7 }, styles.tableCellLeftAlign]}>
                    <Text>Item Name</Text>
                  </View>
                  {/* QTY before UOM — matches HTML column order */}
                  <View style={[styles.tableCell, { flex: 1 }, styles.tableCellRightAlign]}>
                    <Text>{template2Mode ? "QTY [1]" : "QTY"}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                    <Text>{template2Mode ? "UOM [1]" : "UOM"}</Text>
                  </View>
                  {template2Mode && (
                    <>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>QTY [2]</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>UOM [2]</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>QTY [3]</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>UOM [3]</Text>
                      </View>
                    </>
                  )}
                  <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                    <Text>Price</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                    <Text>Disc.</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                    <Text>Tax Amt.</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                    <Text>Subtotal (Tax)</Text>
                  </View>
                </View>

                {itemArray.map((item, index) => (
                  <>
                    {/* Parent Item Row */}
                    <View style={[styles.tableRow, styles.lastRow]} key={index}>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{index + 1}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        <Text>{item.itemCode || ""}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: template2Mode ? 3 : 7 }, styles.tableCellLeftAlign]}>
                        <Text>{item.itemName || ""}</Text>
                        {descriptionPreferences.description && item.description && (
                          <Text>{stripHtml(item.description)}</Text>
                        )}
                        {descriptionPreferences.secondDescription && item["2ndDescription"] && (
                          <Text>{stripHtml(item["2ndDescription"])}</Text>
                        )}
                        {descriptionPreferences.moreDescription && item.moreDescription && (
                          <Text>{stripHtml(item.moreDescription)}</Text>
                        )}
                      </View>
                      {/* QTY before UOM, QTY formatted to 2 decimal places like HTML number_format */}
                      <View style={[styles.tableCell, { flex: 1 }, styles.tableCellRightAlign]}>
                        {item.itemUOM && item.quantity ? (
                          <Text>{Number(item.quantity).toFixed(2)}</Text>
                        ) : null}
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                        {item.itemUOM && item.quantity ? <Text>{item.itemUOM}</Text> : null}
                      </View>
                      {template2Mode && (
                        <>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            {item.itemUOM2 && item.quantity2 ? (
                              <Text>{Number(item.quantity2).toFixed(2)}</Text>
                            ) : null}
                          </View>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            {item.itemUOM2 && item.quantity2 ? <Text>{item.itemUOM2}</Text> : null}
                          </View>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            {item.itemUOM3 && item.quantity3 ? (
                              <Text>{Number(item.quantity3).toFixed(2)}</Text>
                            ) : null}
                          </View>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            {item.itemUOM3 && item.quantity3 ? <Text>{item.itemUOM3}</Text> : null}
                          </View>
                        </>
                      )}
                      <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                        <Text>{Number(item.price || 0).toFixed(2)}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                        <Text>{Number(item.discountAmount || 0).toFixed(2)}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                        <Text>{Number(item.taxAmount || 0).toFixed(2)}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }, styles.tableCellRightAlign]}>
                        <Text>{Number(item.subtotalTax || 0).toFixed(2)}</Text>
                      </View>
                    </View>

                    {/* Child Item Rows */}
                    {item.child &&
                      item.child.map((child, childIndex) => (
                        <View style={[styles.tableRow, styles.lastRow]} key={childIndex}>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            <Text></Text>
                          </View>
                          <View style={[styles.tableCell, { flex: 2 }, styles.childItem]}>
                            <Text>{child.itemCode || ""}</Text>
                          </View>
                          <View style={[styles.tableCell, { flex: template2Mode ? 3 : 7 }, styles.tableCellLeftAlign]}>
                            <Text>{child.itemName || ""}</Text>
                            {descriptionPreferences.description && child.description && (
                              <Text>{stripHtml(child.description)}</Text>
                            )}
                            {descriptionPreferences.secondDescription && child["2ndDescription"] && (
                              <Text>{stripHtml(child["2ndDescription"])}</Text>
                            )}
                            {descriptionPreferences.moreDescription && child.moreDescription && (
                              <Text>{stripHtml(child.moreDescription)}</Text>
                            )}
                          </View>
                          <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                          <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                          {template2Mode && (
                            <>
                              <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                              <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                              <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                              <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                            </>
                          )}
                          <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                          <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                          <View style={[styles.tableCell, { flex: 1 }]}><Text></Text></View>
                          <View style={[styles.tableCell, { flex: 2 }]}><Text></Text></View>
                        </View>
                      ))}
                  </>
                ))}
              </View>

              <View style={{ flex: 1 }} />

              {/* Bottom Section */}
              <View style={styles.bottomSection} wrap={false}>
                <View>
                  <View style={styles.secondSeparator} />
                </View>

                <View style={styles.botContainer}>
                  {/* Left: currency words, payment term, remarks, e-invoice info */}
                  <View style={[styles.leftBotColumn, { fontSize: 10 }]}>
                    <View style={styles.currency}>
                      <Text>
                        {previewDoc.currencyName}: {convertNumberToWords(previewDoc.totalPayable)}
                      </Text>
                      <Text>Payment Term: {previewDoc.creditTermCode || ""}</Text>
                      <Text>Remarks:</Text>
                      <Text>{stripHtml(previewDoc.note || "")}</Text>
                    </View>

                    {eInvoiceStat === "Valid" ? (
                      <View style={styles.footerTextContainer}>
                        <Text>This invoice has been validated by LHDN Malaysia.</Text>
                        <Text>LHDN Unique Invoice ID: {previewDoc?.oriRefNo}</Text>
                        <Text>Validated Date & Time: {eInvoiceDateTime}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Right column: bordered totals table, then signature outside the border */}
                  <View style={styles.rightBotColumn}>
                    {/* Bordered totals table only */}
                    <View style={styles.qtyTable}>
                      {!isProformaInvoice ? (
                        <>
                          {/* Subtotal / Discount / Tax / Rounding grouped with bottom divider */}
                          <View style={[styles.tableRow, { borderBottomWidth: 1, borderColor: '#000' }]}>
                            <View style={[styles.qtyTableCell, { flex: 5 }]}>
                              <Text>Total Subtotal</Text>
                              <Text>Total Discount</Text>
                              <Text>Total Tax Amount</Text>
                              <Text>Rounding Adjustment</Text>
                            </View>
                            <View style={[styles.qtyTableCellNumber, { flex: 2 }]}>
                              <Text>{Number(previewDoc.totalAmount || 0).toFixed(2)}</Text>
                              <Text>({Number(previewDoc.totalDiscount || 0).toFixed(2)})</Text>
                              <Text>{Number(previewDoc.totalTax || 0).toFixed(2)}</Text>
                              <Text>{Number(previewDoc.roundingAmount || 0).toFixed(2)}</Text>
                            </View>
                          </View>
                        </>
                      ) : null}

                      {/* Total Payable */}
                      <View style={[styles.tableRow]}>
                        <View style={[styles.qtyTableCell, { flex: 5 }]}>
                          <Text>Total Payable</Text>
                        </View>
                        <View style={[styles.qtyTableCellNumber, { flex: 2 }]}>
                          <Text>{Number(previewDoc.totalPayable || 0).toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Signature — outside the border, below the table */}
                    {!isProformaInvoice ? (
                      showDefault1ItemizedCG === true ? (
                        <View>
                          <Text style={{ fontSize: 6, marginTop: 30, marginBottom: 40 }}>
                            This document is computer generated. No signature is required.
                          </Text>
                        </View>
                      ) : (
                        <View>
                          <Text style={styles.acceptedByText}>Accepted by: </Text>
                          <View style={styles.signatureLine} />
                          <Text style={styles.signatureLabel}>Customer Cop & Sign</Text>
                        </View>
                      )
                    ) : null}
                  </View>
                </View>
              </View>
            </View>

            {/* Template name — matches HTML "Template Name: Itemized" */}
            <Text style={styles.templateName} fixed>Template Name: Itemized</Text>

            {/* Page Number */}
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              fixed
            />
          </Page>
        );
      })}
    </Document>
  );
};

export default PreviewPDF;

function stripHtml(html) {
  if (!html) return "";
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n");
  text = text.replace(/<\s*[^>]*\s*>/g, (match) => {
    return /\s/.test(match) ? match : "";
  });
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  text = text.replace(/⦁/g, "•");
  return text;
}