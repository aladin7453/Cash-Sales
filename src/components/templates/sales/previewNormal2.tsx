import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { versionPath } from "@/lib/constants";
const isDev = process.env.NODE_ENV === "development";

Font.register({
  family: "NotoSansSC",
  src: isDev ? "/fonts/NotoSansSC-Regular.ttf" : `/${versionPath}/fonts/NotoSansSC-Regular.ttf`,
});

Font.register({
  family: "NotoSansSC-Bold",
  src: isDev ? "/fonts/NotoSansSC-Bold.ttf" : `/${versionPath}/fonts/NotoSansSC-Bold.ttf`,
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
  middleColumn: {
    width: "30%",
    marginRight: 10,
    textAlign: "left",
  },
  rightColumn: {
    width: "20%",
    textAlign: "left",
  },
  botContainer: {
    flexDirection: "row",
    justiyfyContent: "space-between",
  },
  footerTextContainer: {
    marginTop: 20,
    fontSize: 8,
  },
  leftBotColumn: {
    width: "65%",
  },
  rightBotColumn: {
    width: "35%",
    marginLeft: 20,
  },
  section: {
    fontSize: 8,
    marginBottom: 10,
  },
  signatureSection: {
    width: "50%",
    fontSize: 8,
    marginBottom: 10,
    marginLeft: 45,
    textAlign: "center",
    fontWeight: "bold",
  },
  systemUserSection: {
    width: "100%",
    fontSize: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 50,
    fontFamily: "NotoSansSC-Bold",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sectionText: {
    fontSize: 8,
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
    borderTopWidth: 1,
    borderCollapse: "collapse",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableCell: {
    padding: 5,
    fontSize: 7,
    textAlign: "center",
    flexShrink: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000000",
  },
  qtyTableCell: {
    padding: 2,
    fontSize: 8,
    textAlign: "left",
    flexShrink: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000000",
  },
  qtyTableCellNumber: {
    padding: 2,
    fontSize: 8,
    textAlign: "right",
    flexShrink: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
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
    height: 1,
    backgroundColor: "#000000",
    marginTop: 5,
    marginBottom: 10,
  },
  secondSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 5,
    marginBottom: 10,
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 40,
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
    fontSize: 9,
    bottom: 30,
    right: 30,
    textAlign: "right",
    color: "grey",
  },
  childItem: {
    marginLeft: 13,
  },
  remark: {
    marginTop: 50,
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
    position: 'absolute',
    bottom: '8.5mm',
    left: '10mm',
    fontSize: 10,
  },
});

const PreviewNormal2 = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
  PDFPreviewType,
  QrCode,
  eInvoiceData,
  showDefault1SummaryCG,
  eInvoiceStatus,
  isProformaInvoice = false,
  descriptionPreferences = { description: true, secondDescription: true, moreDescription: true },
  agentPreferences = { salesAgent: true, servicingAgent: true, collectionAgent: true },
  removeDisplayUOM
}) => {
  if (!previewData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const pages = Array.isArray(previewData) ? previewData : [previewData];//Check for multiple data passed in for preview

  const itemArray = Array.isArray(itemsData) ? itemsData : [];


  function convertNumberToWords(amount) {
    const val = parseFloat(amount || 0).toFixed(2);
    const [intStr, decStr] = val.split(".");

    const integerPart = parseInt(intStr, 10);
    const decimalPart = parseInt(decStr, 10);

    const units = [
      "Zero",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const scales = ["", "Thousand", "Million", "Billion"];

    function threeDigitToWords(num, useAnd) {
      if (num === 0) return "";
      let word = "";

      const hundred = Math.floor(num / 100);
      const remainder = num % 100;

      if (hundred > 0) {
        word += units[hundred] + " Hundred";
        if (remainder > 0 && useAnd) {
          word += " and ";
        } else if (remainder > 0) {
          word += " ";
        }
      }

      if (remainder > 0) {
        if (remainder < 20) {
          word += units[remainder];
        } else {
          const t = Math.floor(remainder / 10);
          const u = remainder % 10;
          word += tens[t];
          if (u > 0) {
            word += " " + units[u];
          }
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
      case 'salesInvoice':
        return 'SALES INVOICE';
      case 'salesCreditNote':
        return 'SALES CREDIT NOTE';
      case 'salesDebitNote':
        return 'SALES DEBIT NOTE';
      default:
        return '';
    }
  };


  let image64 = currentCompanyData.logoLink && currentCompanyData.logoLink[0]?.base64;

  return (
    <Document title={previewData.docNo || ""}>

      {pages.map((previewDoc, index) => {// map it in case there are multiple documents data passed in for preview

        const itemArray = Array.isArray(previewData) ? previewDoc.itemsData : itemsData ? itemsData : [];// get the item array for each document
        const eInvoiceStat = Array.isArray(previewData) ? previewDoc.eInvoiceStatus : eInvoiceStatus;// get the eInvoice status for each document
        const eInvoiceDateTime = Array.isArray(previewData) ? previewDoc.eInvoiceData?.datetime : eInvoiceData?.datetime;// get the eInvoice datetime for each document
        const Qr = Array.isArray(previewData) ? previewDoc.eInvoiceData?.qrCode : QrCode;// get the QrCode for each document

        return (
          <Page size="A4" style={styles.page} key={index}>
            {/* ...existing code from previewTemplate.tsx... */}
            {image64 ? (
              <View style={styles.logoContainer}>
                <Image
                  src={{
                    uri: image64,
                    method: "GET",
                    headers: { "Cache-Control": "no-cache" },
                    body: "",
                  }}
                  style={styles.logoImage}
                />
              </View>
            ) : null}

            <View style={styles.header}>
              <Text>
                <Text style={styles.boldText}>{currentCompanyData.company || ""} </Text>
                {currentCompanyData.BRN ? ` (${currentCompanyData.BRN})` : ""}
                {currentCompanyData.TIN ? ` (${currentCompanyData.TIN})` : ""}
              </Text>
              <Text style={styles.headerText}>{currentCompanyData.address || ""}</Text>
              <Text style={styles.headerText}>
                {currentCompanyData.phoneNo ? `Phone No.: ${currentCompanyData.phoneNo || ""}` : ""} {currentCompanyData.email ? `Email: ${currentCompanyData.email || ""}` : ""}
                {currentCompanyData.email ? `Email: ${currentCompanyData.email}` : ""}{"  "}
                {currentCompanyData.website ? `Website: ${currentCompanyData.website}` : ""}
              </Text>
              {/* <Text style={styles.headerText}>
                {currentCompanyData.email ? `Email: ${currentCompanyData.email || ""}` : ""}
              </Text> */}
              <View>
                <Text style={styles.sectionTitle}>{previewDoc.consolidateDocType ? getTypeDescription(previewDoc.consolidateDocType) : PDFPreviewType}</Text>
              </View>
              {Qr && <Image src={Qr} style={styles.qrCodeImage} />}
            </View>

            <View>
              <View style={styles.firstSeparator} />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.mainContainer}>
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

                <View style={styles.middleColumn}>
                  <View style={styles.section}>
                    {agentPreferences.salesAgent && previewDoc.salesAgentName && (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.boldText}>Sales Agent : </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ lineHeight: 1 }}>{previewDoc.salesAgentName || "-"}</Text>
                        </View>
                      </View>
                    )}
                    {agentPreferences.servicingAgent && previewDoc.servicingAgentName && (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.boldText}>Servicing Agent : </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ lineHeight: 1 }}>{previewDoc.servicingAgentName || "-"}</Text>
                        </View>
                      </View>
                    )}
                    {agentPreferences.collectionAgent && previewDoc.collectionAgentName && (
                      <View style={{ flexDirection: "row" }}>
                        <Text style={styles.boldText}>Collection Agent: </Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ lineHeight: 1 }}>
                            {previewDoc.collectionAgentName || "-"}
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>No. : {previewDoc.docNo || ""}</Text>
                    <Text>Date : {previewDoc.docDate || ""}</Text>
                    <Text>Terms: {previewDoc.creditTermCode || ""}</Text>
                  </View>
                </View>

                {previewDoc.description && (
                  <View style={{
                    width: '28%',
                    borderWidth: 1,
                    borderColor: '#d3d3d3',
                    padding: 6,
                    fontSize: 8,
                    alignSelf: 'flex-start',
                    marginTop: 5,
                  }}>
                    <Text>{stripHtml(previewDoc.description)}</Text>
                  </View>
                )}
              </View>

              {/* {previewDoc.description && (
                <View style={styles.description}>
                  <Text>{stripHtml(previewDoc.description)}</Text>
                </View>
              )} */}

              <View style={styles.table}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text>No</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 11 }, styles.tableCellLeftAlign]}>
                    <Text>Item Name</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>UOM</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>QTY</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>Price</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text>Total Price</Text>
                  </View>
                  {/* <View style={[styles.tableCell, { flex: 3 }]}>
                <Text>Total Amount</Text>
              </View> */}
                </View>
                {itemArray.map((item, index) => (
                  <>
                    <View style={[styles.tableRow, styles.lastRow]} key={index}>
                      <View style={[styles.tableCell, { flex: 1 }]}>
                        <Text>{index + 1}</Text>
                      </View>
                      <View style={[styles.tableCell, { flex: 11 }, styles.tableCellLeftAlign]}>
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
                        {item.type === "Service" && !removeDisplayUOM && (
                          <Text>
                            {item.quantity && item.itemUOM ? `${item.quantity} ${item.itemUOM}` : ""}
                            {item.quantity2 && item.itemUOM2
                              ? ` x ${item.quantity2} ${item.itemUOM2}`
                              : ""}
                            {item.quantity3 && item.itemUOM3
                              ? ` x ${item.quantity3} ${item.itemUOM3}`
                              : ""}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        {item.itemUOM && item.quantity ? <Text>{item.itemUOM}</Text> : null}
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        {item.itemUOM && item.quantity ? <Text>{item.quantity}</Text> : null}
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        {item.itemUOM && item.quantity ? (
                          <Text>{Number(item.price || 0).toFixed(2)}</Text>
                        ) : null}
                      </View>
                      <View style={[styles.tableCell, { flex: 2 }]}>
                        {item.itemUOM && item.quantity ? (
                          <Text>{Number(item.amount || 0).toFixed(2)}</Text>
                        ) : null}
                      </View>
                      {/* <View style={[styles.tableCell, { flex: 3 }]}>
                    <Text>{index === 0 ? Number(previewDoc.totalPayable || 0).toFixed(2) : ""}</Text>
                  </View> */}
                    </View>

                    {item.child &&
                      item.child.map((child, childIndex) => (
                        <View style={[styles.tableRow, styles.lastRow]} key={childIndex}>
                          <View style={[styles.tableCell, { flex: 1 }]}>
                            <Text></Text>
                          </View>
                          <View style={[styles.tableCell, { flex: 11 }, styles.tableCellLeftAlign]}>
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
                            {item.type === "Service" && !removeDisplayUOM && (
                              <Text>
                                {item.quantity && item.itemUOM
                                  ? `${item.quantity} ${item.itemUOM}`
                                  : ""}
                                {item.quantity2 && item.itemUOM2
                                  ? ` x ${item.quantity2} ${item.itemUOM2}`
                                  : ""}
                                {item.quantity3 && item.itemUOM3
                                  ? ` x ${item.quantity3} ${item.itemUOM3}`
                                  : ""}
                              </Text>
                            )}
                          </View>
                          <View style={[styles.tableCell, { flex: 2 }]}>
                            <Text></Text>
                          </View>
                          <View style={[styles.tableCell, { flex: 2 }]}>
                            <Text></Text>
                          </View>
                          <View style={[styles.tableCell, { flex: 3 }]}>
                            <Text></Text>
                          </View>
                        </View>
                      ))}
                  </>
                ))}
              </View>

              <View style={{ flex: 1 }} />

              <View style={styles.bottomSection} wrap={false}>
                <View>
                  <View style={styles.secondSeparator} />
                </View>

                <View style={styles.botContainer}>
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
                      <>
                        <View style={styles.footerTextContainer}>
                          <Text>This invoice has been validated by LHDN Malaysia.</Text>
                          <Text>LHDN Unique Invoice ID: {previewDoc?.oriRefNo}</Text>
                          <Text>Validated Date & Time: {eInvoiceDateTime}</Text>
                        </View>
                      </>
                    ) : null}
                  </View>

                  <View style={[styles.qtyTable, styles.rightBotColumn]}>
                    {!isProformaInvoice ? (
                      <>
                        {/* <View style={[styles.tableRow]}>
                          <View style={[styles.qtyTableCell, { flex: 3 }]}>
                            <Text>Total Quantity</Text>
                          </View>
                          <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                            <Text>{previewDoc.totalQuantity || "0"}</Text>
                          </View>
                        </View> */}
                        <View style={[styles.tableRow]}>
                          <View style={[styles.qtyTableCell, { flex: 3 }]}><Text>Total Subtotal</Text></View>
                          <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                            <Text>{Number(previewDoc.totalAmount || 0).toFixed(2)}</Text>
                          </View>
                        </View>
                        <View style={[styles.tableRow]}>
                          <View style={[styles.qtyTableCell, { flex: 3 }]}><Text>Total Discount</Text></View>
                          <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                            <Text>({Number(previewDoc.totalDiscount || 0).toFixed(2)})</Text>
                          </View>
                        </View>
                        <View style={[styles.tableRow]}>
                          <View style={[styles.qtyTableCell, { flex: 3 }]}><Text>Total Tax Amount</Text></View>
                          <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                            <Text>{Number(previewDoc.totalTax || 0).toFixed(2)}</Text>
                          </View>
                        </View>
                        {/* PHP has row-divider (extra bottom border) after Rounding */}
                        <View style={[styles.tableRow, { borderBottomWidth: 2 }]}>   {/* ✅ thicker divider */}
                          <View style={[styles.qtyTableCell, { flex: 3 }]}><Text>Rounding Adjustment</Text></View>
                          <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                            <Text>
                              {Number(previewDoc.roundingAmount || 0) < 0
                                ? `(${Math.abs(Number(previewDoc.roundingAmount || 0)).toFixed(2)})`
                                : Number(previewDoc.roundingAmount || 0).toFixed(2)}
                            </Text>
                          </View>
                        </View>
                      </>
                    ) : null}
                    <View style={[styles.tableRow]}>
                      <View style={[styles.qtyTableCell, { flex: 3 }]}>
                        <Text>Total Payable</Text>
                      </View>
                      <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                        <Text>{Number(previewDoc.totalPayable || 0).toFixed(2)}</Text>
                      </View>
                    </View>

                    {!isProformaInvoice ? (
                      showDefault1SummaryCG === true ? (
                        <>
                          <View>
                            <Text style={[{ fontSize: 6, marginTop: 30, marginBottom: 40 }]}>
                              This document is computer generated. No signature is required.
                            </Text>
                          </View>
                        </>
                      ) : (
                        <>
                          {/* Current System User's Full Name */}
                          <View style={styles.systemUserSection}>
                            <Text>Accepted by: </Text>
                          </View>

                          {/* Authorised Signature */}
                          <View>
                            <View style={styles.signatureLine} />
                          </View>
                          <View style={styles.signatureSection}>
                            <Text>Customer Cop & Sign</Text>
                          </View>
                        </>
                      )
                    ) : null}
                  </View>
                </View>
              </View>
            </View>

            {/* ── Template name ── */}
            <Text style={styles.templateName} fixed>Template Name: E-Invoice</Text>

            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              fixed
            />
          </Page>
        )
      })}


    </Document>
  );
};

export default PreviewNormal2;

function stripHtml(html) {
  if (!html) return "";

  // Replace <br> and <br/> with newlines
  let text = html.replace(/<br\s*\/?>/gi, "\n");

  // Replace <p> with nothing, </p> with newline
  text = text.replace(/<p[^>]*>/gi, "").replace(/<\/p>/gi, "\n");

  // Preserve "<" and ">" with spaces inside, replace other HTML tags
  text = text.replace(/<\s*[^>]*\s*>/g, (match) => {
    return /\s/.test(match) ? match : "";
  });

  // Replace HTML entities
  text = text.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

  // Replace bullet point characters with standard bullet
  text = text.replace(/⦁/g, "•");

  return text;
}
