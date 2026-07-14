import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { formatNumberWithCommas } from "@/components/ui/number-formatter";
import { Table } from "@/components/ui/table";

const isDev = process.env.NODE_ENV === "development";

Font.register({
  family: "NotoSansSC",
  src: isDev ? "/fonts/NotoSansSC-Regular.ttf" : "/view/fonts/NotoSansSC-Regular.ttf",
});

Font.register({
  family: "NotoSansSC-Bold",
  src: isDev ? "/fonts/NotoSansSC-Bold.ttf" : "/view/fonts/NotoSansSC-Bold.ttf",
});

const formatDecimal = (value: any) => {
  return formatNumberWithCommas(value, 2);
};

const styles2 = StyleSheet.create({
  page: { padding: 30 },
  table: { flexDirection: "row", width: "100%", borderWidth: 1, borderColor: "#000" },
  leftColumn: {
    width: "66.2%",
    borderRightWidth: 0,
    borderColor: "#000",
    justifyContent: "center",
  },
  rightColumn: { width: "33.8%", flexDirection: "column" },
  row: {
    flexDirection: "row",
    minHeight: 16,
  },
  cell: {
    flex: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderColor: "#000",
    padding: 2,
    textAlign: "center",
    justifyContent: "center",
    fontSize: 7,
  },
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "NotoSansSC", // Set the default font for the entire document
  },
  topRight: {
    wdith: 120,
    position: "absolute",
    top: 145,
    fontSize: 14,
    right: 30,
    textAlign: "right",
  },
  header: {
    fontSize: 9,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "left",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start", // keep top aligned (use 'center' if you want vertical center)
    width: "100%",
  },
  headerText: {
    fontSize: 8,
    marginRight: 10,
    marginTop: 5,
  },
  headerTextRight: {
    fontSize: 8,
    marginRight: 10,
    marginTop: 50,
  },
  mainContainer: {
    border: "1pt solid black",
    fontSize: 8,
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    borderCollapse: "collapse",
  },
  leftColumn: {
    width: "50%",
    paddingRight: 10,
  },
  rightColumn: {
    width: "50%",
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
    display: "flex",
    // borderWidth: 1,
    // borderColor: '#000',
    flexDirection: "column",
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
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderColor: "#000000",
    borderCollapse: "collapse",
  },

  tableRowHeader: {
    flexDirection: "row",
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    borderColor: "#000000",
    borderCollapse: "collapse",
  },

  tableRowHeaderPayment: {
    flexDirection: "row",
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    borderColor: "#000000",
    borderCollapse: "collapse",
  },

  tableCell: {
    padding: 1,
    fontSize: 7,
    textAlign: "center",
    flexShrink: 1,
    minWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000000",
  },
  tableCellHeader: {
    padding: 1,
    fontSize: 7,
    textAlign: "center",
    flexShrink: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    // borderLeftWidth: 1,
    borderColor: "#000000",
    borderCollapse: "collapse",
  },
  tableCellHeaderPayment: {
    padding: 1,
    fontSize: 7,
    textAlign: "center",
    flexShrink: 1,
    // borderTopWidth: 1,
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderColor: "#000000",
    borderCollapse: "collapse",
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
  tableHeaderPayment: {
    backgroundColor: "#ffffff",
    fontFamily: "NotoSansSC-Bold",
  },
  firstSeparator: {
    width: "100%",
    height: 1,
    marginTop: 5,
    marginBottom: 10,
  },
  secondSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 5,
    borderCollapse: "collapse",
  },
  signatureLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 40,
    marginBottom: 10,
  },
  headerLeft: {
    flexGrow: 1,
    flexShrink: 1,
    textAlign: "center",
    alignItems: "center",
    flex: 0.6,
  },
  headerRight: {
    flexGrow: 0,
    flexShrink: 0,
    alignItems: "flex-end",
    textAlign: "right",
    flex: 0.4,
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
    marginLeft: 13, // Indentation for child items
  },
  remark: {
    marginTop: 5,
    fontSize: 7,
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
    position: "absolute",
    paddingLeft: 30,
    paddingRight: 30,
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
  },
  verticalLine: {
    width: 1,
    backgroundColor: "black",
    marginHorizontal: 5,
  },
  verticalLine2: {
    position: "absolute",
    height: 442.6,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#000",
  },
  verticalLine2Payment: {
    position: "absolute",
    height: 12.6,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#000",
    borderCollapse: "collapse",
  },
  rowLine: {
    borderBottomWidth: 1,
    borderColor: "#000000",
    borderCollapse: "collapse",
  },
  qrCodeImage: {
    width: 75,
    height: 75,
    textAlign: "right",
  },
  tableRowS4: {
    flexDirection: "row",
    marginBottom: 1,
  },
  tableCellLabel: {
    width: "30%",
    padding: 2,
    fontSize: 7,
    textAlign: "left",
    fontFamily: "NotoSansSC-Bold",
    color: "#000000",
  },
  tableCellValue: {
    width: "70%",
    padding: 2,
    fontSize: 7,
    textAlign: "left",
    color: "#000",
  },
});

const PreviewPDF = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
  PDFPreviewType,
  QrCode,
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
  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  const cleanAddress =
    currentCompanyData.address
      ?.replace(/&\s*$/, "") // remove trailing &
      .replace(/&\s*\r?\n/g, "\n") // & before newline
      .replace(/\s*&\s*/g, " ") // unexpected &
      .replace(/\r\n/g, "\n") // normalize CRLF
      .replace(/\r/g, "\n") // normalize CR
      .trim() || "";

  const MAX_CHARS_PER_LINE = 50;

  function estimateVisualLines(lines) {
    return lines.reduce((total, line) => {
      return total + Math.ceil(line.length / MAX_CHARS_PER_LINE);
    }, 0);
  }

  function insertLineBreak(text, maxLength = 23) {
    if (!text) return "";
    let result = "";
    for (let i = 0; i < text.length; i += maxLength) {
      result += text.slice(i, i + maxLength) + "\n";
    }
    return result.trim();
  }

  const formatDate = (unix) => {
    if (!unix) return "";
    return new Date(Number(unix) * 1000).toLocaleDateString("en-CA");
  };

  // Retrieve header value
  const header1Field = currentCompanyData?.companyHasCustomInfos?.find(
    (info: { fieldName: string; fieldValue: string }) => info.fieldName === "Header 1",
  );

  // Retrieve footer value
  const footer1Field = currentCompanyData?.companyHasCustomInfos?.find(
    (info: { fieldName: string; fieldValue: string }) => info.fieldName === "Footer 1",
  );

  const breakLongText = (text, len = 6) => text.replace(new RegExp(`(.{${len}})`, "g"), "$1 ");

  const pages = Array.isArray(previewData) ? previewData : [previewData]; //Check for multiple data passed in for preview

  const getTypeDescription = (type) => {
    switch (type) {
      case "salesInvoice":
        return "INVOICE";
      case "salesCreditNote":
        return "CREDIT NOTE";
      case "salesDebitNote":
        return "DEBIT NOTE";
      default:
        return "";
    }
  };

  return (
    <Document title={previewData.docNo || ""}>
      {pages.map((previewDoc, index) => {
        // map it in case there are multiple documents data passed in for preview
        const rawAddress = previewDoc.address || previewDoc.customerAddress || "";
        const itemArray = Array.isArray(previewData)
          ? previewDoc.itemsData
          : itemsData
            ? itemsData
            : []; // get the item array for each document
        const Qr = Array.isArray(previewData) ? previewDoc.eInvoiceData?.qrCode : QrCode; // get the QrCode for each document

        const rawLines = rawAddress
          .replace(/\r\n/g, "\n")
          .replace(/\r/g, "\n")
          .replace(/\s+/g, " ")
          .split("\n")
          .map((l) => l.trim())
          .filter(Boolean);

        const visualLineCount = estimateVisualLines(rawLines);

        const isNotMoreThanFiveLines = visualLineCount < 4;
        return (
          <Page size="A4" key={index} style={[styles.page, { paddingBottom: 160 }]}>
            <>
              <View style={[styles.topRight, styles.boldText]} fixed>
                <Text>
                  {PDFPreviewType == "SALES INVOICE"
                    ? "INVOICE"
                    : previewDoc.consolidateDocType
                      ? getTypeDescription(previewDoc.consolidateDocType)
                      : PDFPreviewType}
                </Text>
              </View>
              <View style={[styles.headerRow, { height: 120 }]} fixed>
                {/* Left side */}
                <View style={[styles.headerLeft]}>
                  {header1Field?.fieldValue ? (
                    <Text>
                      <Text style={[styles.boldText, { fontSize: 12 }]}>
                        {header1Field.fieldValue}
                      </Text>
                    </Text>
                  ) : null}
                  <Text>
                    <Text style={[styles.boldText, { fontSize: 16 }]}>
                      {currentCompanyData.company || ""}
                    </Text>
                  </Text>
                  <Text style={styles.headerText}>{cleanAddress || ""}</Text>

                  <Text style={styles.headerText}>
                    {currentCompanyData.phoneNo ? `Phone No.: ${currentCompanyData.phoneNo}` : ""}
                  </Text>
                  <Text style={[styles.headerText, { marginTop: 0 }]}>
                    {currentCompanyData.email ? `Email: ${currentCompanyData.email}` : ""}
                  </Text>
                </View>

                {/* Right side */}
                <View style={styles.headerRight}>
                  <View>{Qr && <Image src={Qr} style={styles.qrCodeImage} alt="QR Code" />}</View>
                  <View>
                    {Qr && (
                      <Text style={{ textAlign: "right", fontSize: 8 }}>
                        E-Invoice No:{previewDoc.eInvoiceCode}
                      </Text>
                    )}
                    {Qr && (
                      <Text style={{ textAlign: "right", fontSize: 8 }}>
                        UUID:{previewDoc.oriRefNo}
                      </Text>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.firstSeparator} fixed />

              <View
                style={[
                  styles.mainContainer,
                  {
                    minHeight: 70,
                    maxHeight: 95,
                    alignItems: "flex-start",
                    borderBottomWidth: 1,
                    borderColor: "#000000",
                    position: "relative",
                  },
                ]}
                fixed
              >
                {/* Left column: rowspan Name */}
                <View style={styles2.leftColumn}>
                  <View style={styles.section}>
                    <Text style={styles.boldText}>
                      {previewDoc.customerName || previewDoc.supplierName || ""}
                      {previewData?.TIN ? ` (${previewData?.TIN})` : ""}
                    </Text>
                    <Text>{previewDoc.address || previewDoc.customerAddress || ""}</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.sectionText}>
                      {previewDoc.phoneNo || previewDoc.customerAttentionTel || ""}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: "66%",
                    width: 1,
                    backgroundColor: "#000000",
                  }}
                />

                {/* Right column: other rows */}
                <View
                  style={[
                    styles2.rightColumn,
                    {
                      height: 70,
                      alignSelf: "flex-start",
                    },
                  ]}
                >
                  {isNotMoreThanFiveLines ? (
                    <>
                      <View style={[styles.verticalLine2, { right: "50%", height: 71 }]} fixed />
                    </>
                  ) : null}
                  {/* after Date */}
                  <View
                    style={[
                      styles2.row,
                      {
                        borderStyle: "solid",
                        borderColor: "#000000",
                        borderLeftWidth: 0,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles2.cell,
                        styles.boldText,
                        {
                          textAlign: "left",
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          borderRightWidth: isNotMoreThanFiveLines ? 0 : 1,
                        },
                      ]}
                    >
                      <Text>Invoice No:</Text>
                    </View>
                    <View
                      style={[
                        styles2.cell,
                        {
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          textAlign: "left",
                        },
                      ]}
                    >
                      <Text>{previewDoc.docNo}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles2.row,
                      {
                        borderStyle: "solid",
                        borderColor: "#000000",
                        borderLeftWidth: 0,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles2.cell,
                        styles.boldText,
                        {
                          textAlign: "left",
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          borderRightWidth: isNotMoreThanFiveLines ? 0 : 1,
                        },
                      ]}
                    >
                      <Text>Invoice Date:</Text>
                    </View>
                    <View
                      style={[
                        styles2.cell,
                        {
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          textAlign: "left",
                        },
                      ]}
                    >
                      <Text>{previewDoc.docDateFormat}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles2.row,
                      {
                        borderStyle: "solid",
                        borderColor: "#000000",
                        borderLeftWidth: 0,
                        borderBottomWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles2.cell,
                        styles.boldText,
                        {
                          textAlign: "left",
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          borderRightWidth: isNotMoreThanFiveLines ? 0 : 1,
                        },
                      ]}
                    >
                      <Text>For Month of:</Text>
                    </View>
                    <View
                      style={[
                        styles2.cell,
                        {
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          textAlign: "left",
                        },
                      ]}
                    >
                      <Text
                        wrap
                        style={{
                          fontSize: 7,
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        {previewDoc.description}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles2.row,
                      {
                        borderStyle: "solid",
                        borderColor: "#000000",
                        borderLeftWidth: 0,
                        borderBottomWidth: isNotMoreThanFiveLines ? 0 : 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles2.cell,
                        styles.boldText,
                        {
                          textAlign: "left",
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                          borderRightWidth: isNotMoreThanFiveLines ? 0 : 1,
                        },
                      ]}
                    >
                      <Text>Page No:</Text>
                    </View>

                    <View
                      style={[
                        styles2.cell,
                        {
                          flex: 1,
                          textAlign: "left",
                          borderStyle: "solid",
                          borderColor: "#000000",
                          borderLeftWidth: 0,
                        },
                      ]}
                    >
                      <Text
                        render={({ subPageNumber, subPageTotalPages }) =>
                          `Page ${subPageNumber} of ${subPageTotalPages}`
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.contentContainer}>
                {/* Main Content */}
                <View style={styles.firstSeparator} fixed />
                {/* Item Details */}
                <View style={[styles.table]}>
                  {/* Header */}
                  <View style={[styles.tableRowHeader, styles.tableHeader]} fixed>
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "0%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "5%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "15%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "20%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "40%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "60%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "70%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "80%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "90%",
                          height: isNotMoreThanFiveLines ? 435 : 420,
                        },
                      ]}
                      fixed
                    />
                    <View
                      style={[
                        styles.verticalLine2,
                        {
                          left: "100%",
                          height: isNotMoreThanFiveLines ? 426 : 414,
                        },
                      ]}
                      fixed
                    />
                    <View style={[styles.tableCellHeader, { flex: 0.5 }]}>
                      <Text>No.</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 1 }]}>
                      <Text>Bill Date</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 0.5 }]}>
                      <Text>Ref No/ID</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 2 }]}>
                      <Text>Employee&apos;s Name</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 2 }]}>
                      <Text>Dependent&apos;s Name</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 1 }]}>
                      <Text>Amount</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 1 }]}>
                      <Text>No. of MC Days</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 1 }]}>
                      <Text>MC from</Text>
                    </View>
                    <View style={[styles.tableCellHeader, { flex: 1 }]}>
                      <Text>MC to</Text>
                    </View>
                  </View>

                  {/* Body */}
                  {itemArray.map((item, index) => (
                    <>
                      <View style={styles.tableRow} key={index}>
                        <View style={[styles.tableCell, { flex: 0.5, textAlign: "center" }]}>
                          <Text>{index + 1}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                          <Text>{item.dateFormat}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 0.5, textAlign: "left" }]}>
                          <Text>{breakLongText(stripHtml(item.customerID))}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 2, textAlign: "left" }]}>
                          <Text>{stripHtml(item["customerName"] || "")}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 2, textAlign: "center" }]}>
                          <Text>{stripHtml(item["customerDescription"] || "")}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, textAlign: "right" }]}>
                          <Text>{formatDecimal(item.parentPrice)}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                          <Text>{stripHtml(item["remark2"] || "")}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                          <Text>{formatDate(item.startAt)}</Text>
                        </View>
                        <View style={[styles.tableCell, { flex: 1, textAlign: "center" }]}>
                          <Text>{formatDate(item.endAt)}</Text>
                        </View>
                      </View>
                    </>
                  ))}

                  {/* Empty filler to push border to bottom */}
                  {/* <View style={{ flexGrow: 1, borderTopWidth: 1, borderColor: '#000' }} /> */}
                </View>

                <View style={{ flex: 1 }} fixed />
              </View>

              <View style={styles.bottomSection} fixed>
                <View style={styles.secondSeparator} />
                <View style={[styles.tableRowHeaderPayment, styles.tableHeaderPayment]}>
                  <View style={[styles.tableCellHeaderPayment, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCellHeaderPayment, { flex: 0.5, textAlign: "right" }]}>
                    <Text
                      render={({ subPageNumber, subPageTotalPages }) =>
                        subPageNumber === subPageTotalPages
                          ? `PAYMENT AMOUNT ${previewDoc.currencySymbol}:`
                          : " "
                      }
                    />
                  </View>

                  <View
                    render={({ subPageNumber, subPageTotalPages }) =>
                      subPageNumber === subPageTotalPages ? (
                        <View
                          style={[
                            {
                              left: "86%",
                              position: "absolute",
                              height: 13,
                              top: 0,
                              bottom: 0,
                              width: 1,
                              backgroundColor: "#000",
                            },
                          ]}
                        />
                      ) : null
                    }
                  />

                  <View
                    style={[
                      styles.tableCellHeaderPayment,
                      {
                        flex: 1,
                        textAlign: "right",
                        position: "relative", // required for absolute child
                      },
                    ]}
                  >
                    <Text
                      render={({ subPageNumber, subPageTotalPages }) =>
                        subPageNumber === subPageTotalPages ? previewDoc.totalPayable : ""
                      }
                      style={{ textAlign: "right", fontSize: 7, right: 160 }}
                    />

                    {/* Bottom border – only on last page */}
                    <View
                      render={({ subPageNumber, subPageTotalPages }) =>
                        subPageNumber === subPageTotalPages ? (
                          <View
                            style={[
                              {
                                left: 0,
                                position: "absolute",
                                height: 2,
                                top: 0,
                                bottom: 0,
                                width: 52,
                                backgroundColor: "#000",
                              },
                            ]}
                          />
                        ) : null
                      }
                    />
                  </View>

                  <View
                    render={({ subPageNumber, subPageTotalPages }) =>
                      subPageNumber === subPageTotalPages ? (
                        <View
                          style={[
                            {
                              right: 160,
                              position: "absolute",
                              height: 13,
                              top: 0,
                              bottom: 0,
                              width: 1,
                              backgroundColor: "#000",
                            },
                          ]}
                        />
                      ) : null
                    }
                  />
                </View>

                <View style={styles.botContainer}>
                  {/* Qty */}
                  <View style={[styles.leftBotColumn, { fontSize: 8 }]}>
                    <View style={[styles.remark, styles.boldText]}>
                      <Text>{stripHtml(previewDoc.note || "")}</Text>
                    </View>
                  </View>

                  <View style={[styles.rightBotColumn]}>
                    <>
                      {/* Current System User's Full Name */}
                      <View style={styles.systemUserSection}>
                        <Text></Text>
                      </View>

                      {/* Authorised Signature */}
                      <View>
                        <View style={styles.signatureLine} />
                      </View>
                      {/* <View style={[styles.signatureSection, styles.boldText]}>
                    <Text>For Dr. Kho Fui Chung</Text>
                  </View> */}
                      {footer1Field?.fieldValue ? (
                        <View style={[styles.signatureSection, styles.boldText]}>
                          <Text>{footer1Field.fieldValue}</Text>
                        </View>
                      ) : null}
                    </>
                  </View>
                </View>
              </View>
            </>
          </Page>
        );
      })}
    </Document>
  );
};

export default PreviewPDF;

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
