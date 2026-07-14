import { Document, Image, Page, StyleSheet, Text, View, Font } from "@react-pdf/renderer";
import { versionPath } from "@/lib/constants";
const isDev = process.env.NODE_ENV === 'development';

Font.register({
  family: 'NotoSansSC',
  src: isDev
    ? '/fonts/NotoSansSC-Regular.ttf'
    : `/${versionPath}/fonts/NotoSansSC-Regular.ttf`, // Update this path to match where you store the font
});

// Register the Black weight variant of NotoSansSC
Font.register({
  family: 'NotoSansSC-Bold',
  src: isDev
    ? '/fonts/NotoSansSC-Bold.ttf'
    : `/${versionPath}/fonts/NotoSansSC-Bold.ttf`, // Update this path to match where you store the font
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: 'NotoSansSC', // Set the default font for the entire document
  },
  header: {
    fontSize: 9,
    marginLeft: 120,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
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
    width: "40%",
    paddingLeft: 10,
    marginRight: 10,
    textAlign: "left",
  },
  rightColumn: {
    width: "20%",
    marginRight: 10,
    textAlign: "left",
  },
  botContainer: {
    flexDirection: "row",
    justiyfyContent: "space-between",
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
    fontFamily: 'NotoSansSC-Bold',
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
    fontWeight: "bold",
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
    marginTop: 100,
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
    fontFamily: 'NotoSansSC-Bold',
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
  },
  bottomSection: {
    marginTop: 'auto',
  },
});

const PreviewPDF = ({ previewData, itemsData, currentCompanyData, currentUser, PDFPreviewType }) => {
  if (!previewData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const pages = Array.isArray(previewData) ? previewData : [previewData];//Check for multiple data passed in for preview
  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  // Filter out items with zero paid amount
  // const filteredItemArray = itemArray.filter(item => {
  //   const paidAmount = parseFloat(item.paidAmount || 0);
  //   return paidAmount > 0;
  // });

  {/* Number to words function */ }
  function convertNumberToWords(amount) {
    // Convert the input to a fixed 2-decimal string
    const val = parseFloat(amount || 0).toFixed(2);
    const [intStr, decStr] = val.split("."); // e.g. "10427", "70"

    const integerPart = parseInt(intStr, 10);
    const decimalPart = parseInt(decStr, 10);

    // Word lists
    const units = [
      "Zero", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
      "Twelve", "Thirteen", "Fourteen", "Fifteen",
      "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];
    const tens = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty",
      "Sixty", "Seventy", "Eighty", "Ninety"
    ];
    const scales = ["", "Thousand", "Million", "Billion"];

    /**
     * Converts a number < 1000 into words.
     *
     * @param {number} num - Up to 3 digits (0–999).
     * @param {boolean} useAnd - Whether to insert "and" before the last part 
     *                           if there's a remainder after hundreds 
     *                           (British style).
     */

    function threeDigitToWords(num, useAnd) {
      if (num === 0) return "";
      let word = "";

      const hundred = Math.floor(num / 100);
      const remainder = num % 100;

      // Handle hundreds
      if (hundred > 0) {
        word += units[hundred] + " Hundred";
        if (remainder > 0 && useAnd) {
          // If there's something left and we're using "and"
          word += " and ";
        } else if (remainder > 0) {
          // If there's something left but no "and"
          word += " ";
        }
      }

      // Handle remainder (0–99)
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

    /**
     * Converts an integer part (e.g., 10427) by splitting into thousands.
     * 
     * @param {number} n - An integer >= 0.
     * @param {boolean} useAndForChunks - Whether to use "and" within each 
     *                                    3-digit chunk.
     */
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
          // Prepend this segment
          words = segment + (words ? " " + words : "");
        }
        n = Math.floor(n / 1000);
        scaleIndex++;
      }

      return words;
    }

    // Decide whether to use “and” in the integer portion
    // Rule: If there's a decimal portion, skip “and” in integer words
    const useAnd = decimalPart === 0;
    const intWords = integerToWords(integerPart, useAnd);

    let finalWords = "";
    if (decimalPart > 0) {
      // Convert the decimal part to words (always skip "and" inside cents)
      const decimalWords = integerToWords(decimalPart, false);
      finalWords = `${intWords} AND ${decimalWords} CENTS ONLY`;
    } else {
      finalWords = `${intWords} ONLY`;
    }

    return finalWords.toUpperCase();
  }

  let image64 = currentCompanyData.logoLink && currentCompanyData.logoLink[0]?.base64;

  return (
    <Document title={previewData.docNo || ''}>

      {pages.map((previewDoc, index) => {// map it in case there are multiple documents data passed in for preview

        const itemArray = Array.isArray(previewData) ? previewDoc.itemsData : itemsData ? itemsData : [];// get the item array for each document

        return (<Page size="A4" style={styles.page} key={index}>

          {/* Logo Image */}
          <View style={styles.logoContainer}>
            {image64 ? (
              <Image
                src={{ uri: image64, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
                style={styles.logoImage}
              />
            ) : null}
          </View>

          <View style={styles.header}>
            <Text>
              <Text style={styles.boldText}>{currentCompanyData.company || ""} </Text>
              {currentCompanyData.BRN ? ` (${currentCompanyData.BRN})` : ""}
            </Text>
            <Text style={styles.headerText}>
              {currentCompanyData.address || ""}
            </Text>
            <Text style={styles.headerText}>
              {currentCompanyData.phoneNo ? `Phone No.: ${currentCompanyData.phoneNo || ""}` : ""} {currentCompanyData.email ? `Email: ${currentCompanyData.email || ""}` : ""}
            </Text>
            {/* <Text style={styles.headerText}>
              {currentCompanyData.email ? `Email: ${currentCompanyData.email || ""}` : ""}
            </Text> */}
            <View>
              <Text style={styles.sectionTitle}>OFFICIAL RECEIPT</Text>
            </View>
          </View>

          <View>
            <View style={styles.firstSeparator} />
          </View>

          <View style={styles.contentContainer}>
            {/* Main Content */}
            <View style={styles.mainContainer}>
              {/* Customer Information */}
              <View style={styles.leftColumn}>
                <View style={styles.section}>
                  <Text style={styles.boldText}>{previewDoc.customerName || previewDoc.supplierName || ""}</Text>
                  <Text>{previewDoc.address || ""}</Text>
                </View>
                <View style={styles.section}>
                  <Text>Attention: {previewDoc.attentionName || ""}</Text>
                  <Text style={styles.sectionText}>Phone No.: {previewDoc.phoneNo || ""}</Text>
                  <Text style={styles.sectionText}>Email: {previewDoc.email || ""}</Text>
                </View>
              </View>

              {/* Delivery Details */}
              <View style={styles.middleColumn}>
                {/* Nothing */}
              </View>

              {/* Job Order Details */}
              <View style={styles.rightColumn}>
                <View style={styles.section}>
                  <Text>No.: {previewDoc.docNo || ""}</Text>
                  <Text>Date: {previewDoc.docDateFormat || ""}</Text>
                  <Text>Agent: {previewDoc.agentName || ""}</Text>
                  <Text>Terms: {previewDoc.creditTermCode || ""}</Text>
                </View>
              </View>
            </View>

            {/* Description Section - Only render if description exists */}
            {previewDoc.description && (
              <View style={styles.section}>
                <Text>DESC: {stripHtml(previewDoc.description || "")}</Text>
              </View>
            )}

            {/* Item Details */}
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>No</Text>
                </View>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text>Doc. Type</Text>
                </View>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>Doc. No</Text>
                </View>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>Doc. Date</Text>
                </View>
                <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
                  <Text>Desc.</Text>
                </View>
                <View style={[styles.tableCell, { flex: 3 }]}>
                  <Text>Paid Amount</Text>
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
                      <Text>{item.docType || ""}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 3 }]}>
                      <Text>{item.docNo || ""}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 3 }]}>
                      <Text>{item.docDateFormat || ""}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
                      <Text>{stripHtml(item.description || "")}</Text>
                    </View>
                    <View style={[styles.tableCell, { flex: 3 }]}>
                      <Text>
                        {item.docType === "CN"
                          ? `(${Number(item.paidAmount || 0).toFixed(2)})`
                          : Number(item.paidAmount || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </>
              ))}

              {/* Unapplied Amount Row - Only show if value exists and > 0 */}
              {previewDoc.unappliedAmount && Number(previewDoc.unappliedAmount) > 0 && (
                <View style={[styles.tableRow, styles.lastRow]}>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Text>Unapplied Amount</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 3 }]}>
                    <Text>{Number(previewDoc.unappliedAmount || 0).toFixed(2)}</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={{ flex: 1 }} />

            <View style={styles.bottomSection} wrap={false}>
              <View>
                <View style={styles.secondSeparator} />
              </View>

              <View style={styles.botContainer}>
                {/* Qty */}
                <View style={[styles.leftBotColumn, { fontSize: 10 }]}>
                  <View style={styles.currency}>
                    {/* Convert the total amount to words */}
                    <Text>{previewDoc.currencyName}: {convertNumberToWords(previewDoc.paidAmount)}</Text>
                  </View>
                </View>

                <View style={[styles.qtyTable, styles.rightBotColumn]}>
                  <View style={[styles.tableRow]}>
                    <View style={[styles.qtyTableCell, { flex: 3 }]}>
                      <Text>Total</Text>
                    </View>
                    <View style={[styles.qtyTableCellNumber, styles.noBorderLeft, { flex: 2 }]}>
                      <Text>{previewDoc.paidAmount || "0"}</Text>
                    </View>
                  </View>

                  {/* Authorised Signature */}
                  <View>
                    <View style={styles.signatureLine} />
                  </View>
                  <View style={styles.signatureSection}>
                    <Text>Authorised Signature</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Page Number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            fixed
          />
        </Page>)



      })}

    </Document>
  );
};
export default PreviewPDF;

function stripHtml(html) {
  if (!html) return "";

  // Replace <br> and <br/> with newlines
  let text = html.replace(/<br\s*\/?>/gi, '\n');

  // Replace <p> with nothing, </p> with newline
  text = text.replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n');

  // Preserve "<" and ">" with spaces inside, replace other HTML tags
  text = text.replace(/<\s*[^>]*\s*>/g, match => {
    return /\s/.test(match) ? match : '';
  });

  // Replace HTML entities
  text = text.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

  // Replace bullet point characters with standard bullet
  text = text.replace(/⦁/g, '•');

  return text;
};