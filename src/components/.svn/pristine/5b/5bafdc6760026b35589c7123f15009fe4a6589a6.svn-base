import { Document, Page, StyleSheet, Text, View, Image, Font } from "@react-pdf/renderer";
import moment from 'moment';
import { versionPath } from "@/lib/constants";
let fontsRegistered = false;

if (!fontsRegistered) {
  const isDev = process.env.NODE_ENV === "development";

  Font.register({
    family: "NotoSansSC",
    fonts: [
      { src: isDev ? "/fonts/NotoSansSC-Regular.ttf" : `/${versionPath}/fonts/NotoSansSC-Regular.ttf` },
      {
        src: isDev ? "/fonts/NotoSansSC-Bold.ttf" : `/${versionPath}/fonts/NotoSansSC-Bold.ttf`,
        fontWeight: "bold",
      },
    ],
  });

  Font.register({
    family: "NotoSansSC-Black",
    src: isDev ? "/fonts/NotoSansSC-Black.ttf" : `/${versionPath}/fonts/NotoSansSC-Black.ttf`,
  });

  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: 'NotoSansSC' // Set the default font for the entire document
  },
  logoContainer: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 100,
    height: 100,
    marginBottom: 10,
    overflow: "hidden",
    padding: 0,
  },
  logoImage: {
    width: 100,
    height: 100,
  },
  header: {
    fontSize: 9,
    marginLeft: 120,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  firstSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 70,
    marginBottom: 5,
  },
  table: {
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
    borderStyle: "solid",
    borderColor: "#000000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tableHeader: {
    backgroundColor: "#deebf7",
    borderTopWidth: 1,
    fontWeight: "bold",
  },
  tableCellNo: {
    padding: 5,
    fontSize: 7,
    flex: 1,
    textAlign: "center",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000000",
  },
  tableCell: {
    padding: 5,
    fontSize: 7,
    flex: 4,
    textAlign: "center",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: "#000000",
  },
  summaryBox: {
    backgroundColor: "#deebf7",
    padding: 5,
    marginTop: 5,
    borderRadius: 2,
  },
  summaryText: {
    fontSize: 7,
  },
  summaryTitle: {
    fontSize: 8,
    fontWeight: "bold",
  },
  summaryField: {
    backgroundColor: "#FFFFFF",
    padding: 1,
    // marginTop: 2,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#CCCCCC",
    width: 100,
    height: 16,
  },
  footerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 5,
  },
  footerContainer: {
    position: "absolute",
    bottom: 10,
    left: 30,
    right: 30,
  },
  footerText: {
    fontSize: 7,
  },
});

const StockReport = ({
  type,
  data,
  stockMovementReportData,
  generatedReport,
  stockMovementReportColumns,
  orientation = 'portrait',
}: {
  type: string;
  data?: any;
  stockMovementReportData?: any;
  generatedReport,
  stockMovementReportColumns?: any[];
  orientation?: 'portrait' | 'landscape';
}) => {
  let image64 = data?.currentCompany?.logoLink?.[0]?.base64;

  // Format the date range
  const formatDateRange = () => {
    if (!stockMovementReportData?.startDate || !stockMovementReportData?.endDate) return "";

    const startDate = moment.unix(Number(stockMovementReportData.startDate)).format('DD-MM-YYYY');
    const endDate = moment.unix(Number(stockMovementReportData.endDate)).format('DD-MM-YYYY');

    return `${startDate} to ${endDate}`;
  };

  // Dynamic styles based on orientation
  const getPageStyles = () => ({
    ...styles.page,
    padding: orientation === 'landscape' ? 20 : 30,
  });

  const getTableCellStyles = () => ({
    ...styles.tableCell,
    fontSize: orientation === 'landscape' ? 6 : 7,
    padding: orientation === 'landscape' ? 3 : 5,
  });

  const getTableCellNoStyles = () => ({
    ...styles.tableCellNo,
    fontSize: orientation === 'landscape' ? 6 : 7,
    padding: orientation === 'landscape' ? 3 : 5,
  });

  const getHeaderStyles = () => ({
    ...styles.header,
    fontSize: orientation === 'landscape' ? 8 : 9,
    marginLeft: orientation === 'landscape' ? 120 : 120,
  });

  const getLogoStyles = () => ({
    ...styles.logoContainer,
    width: orientation === 'landscape' ? 80 : 100,
    height: orientation === 'landscape' ? 80 : 100,
    top: orientation === 'landscape' ? 20 : 30,
    left: orientation === 'landscape' ? 20 : 30,
  });

  const getLogoImageStyles = () => ({
    ...styles.logoImage,
    width: orientation === 'landscape' ? 80 : 100,
    height: orientation === 'landscape' ? 80 : 100,
  });

  const getFirstSeparatorStyles = () => ({
    ...styles.firstSeparator,
    marginTop: orientation === 'landscape' ? 50 : 70,
  });

  // Use preview API data if available
  const previewItems = Array.isArray(data?.data) ? data.data : [];

  const pageOrientation = orientation;

  const getSummaryStyles = () => ({
    ...styles.summaryBox,
    padding: orientation === 'landscape' ? 3 : 5,
  });


  // Summary box content with dynamic styles
  const renderSummaryBox = () => (
    <View style={getSummaryStyles()}>
      <Text style={styles.summaryTitle}>Summary: </Text>
      <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>

        <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
          <View>
            <Text style={styles.summaryText}>Total Quantity In:</Text>
            <View style={styles.summaryField}>
              <Text style={styles.summaryText}>{data?.summary?.totalQuantityIn ?? ""}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.summaryText}>Total Quantity Out:</Text>
            <View style={styles.summaryField}>
              <Text style={styles.summaryText}>{data?.summary?.totalQuantityOut ?? ""}</Text>
            </View>
          </View>
          <View>
            <Text style={styles.summaryText}>Total Balance Quantity:</Text>
            <View style={styles.summaryField}>
              <Text style={styles.summaryText}>{data?.summary?.totalBalanceQuantity ?? ""}</Text>
            </View>
          </View>
        </View>

      </View>
    </View>
  );

  return (
    <Document title={type}>
      {previewItems.map((stockItem, pageIndex) => (
        <Page key={stockItem.UUID || pageIndex} size="A4" orientation={pageOrientation} style={getPageStyles()} wrap>
          {/* Logo */}
          <View style={getLogoStyles()}>
            {image64 ? (
              <Image
                src={{ uri: image64, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
                style={getLogoImageStyles()}
              />
            ) : null}
          </View>

          {/* Header */}
          <View style={getHeaderStyles()}>
            <Text>{data?.currentCompany?.company ?? ""} ({data?.currentCompany?.BRN ?? ""})</Text>
            <Text style={styles.headerText}>{data?.currentCompany?.address ?? ""}</Text>
            <View style={styles.headerRow}>
              <Text style={styles.headerText}>Phone No.: {data?.currentCompany?.phoneNo ?? ""}</Text>
              <Text style={styles.headerText}>Email: {data?.currentCompany?.email ?? ""}</Text>
            </View>
          </View>

          {/* First Separator */}
          <View>
            <View style={getFirstSeparatorStyles()} />
          </View>

          {/* Section Title */}
          <View>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
              {type.toUpperCase()}
            </Text>
          </View>

          {/* Generated By and Date Range */}
          <View style={{ marginTop: orientation === 'landscape' ? 20 : 40 }}>
            <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
              Generated By: {data?.currentUser ?? ""}
            </Text>
            <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
              Stock item: {stockItem.stock ?? ""}
            </Text>
            <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
              Balance Quantity: {stockItem.balanceQuantity ?? ""}
            </Text>
            <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
              Date Range: {formatDateRange()}
            </Text>
          </View>

          {/* Dynamic Table */}
          <View style={styles.table} wrap>
            {/* Table Header */}
            <View fixed style={[styles.tableRow, styles.tableHeader]}>
              {stockMovementReportColumns?.map((column, index) => (
                <Text
                  key={index}
                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                >
                  {column.header}
                </Text>
              ))}
            </View>
            {/* Table Rows */}
            {(stockItem.stockTransactions && stockItem.stockTransactions.length > 0) ? (
              stockItem.stockTransactions.map((item, rowIndex) => (
                <View style={styles.tableRow} wrap={false} key={item.UUID || rowIndex}>
                  {stockMovementReportColumns?.map((column, colIndex) => (
                    <Text
                      key={colIndex}
                      style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                    >
                      {column.header === "No" ? rowIndex + 1 : typeof item[column.accessorKey] === "string"
                        ? insertZeroWidthSpace(item[column.accessorKey], orientation)
                        : item[column.accessorKey]}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.tableRow} wrap={false}>
                <Text style={getTableCellStyles()}>
                  No result
                </Text>
              </View>
            )}
          </View>

          <View
            render={({ pageNumber, totalPages }) =>
              pageNumber === totalPages ? renderSummaryBox() : null
            }
            style={{ width: "100%" }}
          />

          {/* Footer */}
          <View fixed style={styles.footerContainer}>
            <View style={styles.footerLine} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5 }}>
              <Text style={styles.footerText}>
                Date Generated: {moment().format("DD-MM-YYYY")}
              </Text>
              <Text
                style={styles.footerText}
                render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              />
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default StockReport;

//function to wrap Chinese characters with zero-width space
function insertZeroWidthSpace(str: string, orientation = 'portrait') {
  if (typeof str !== "string") str = String(str ?? "");

  const charLimit = orientation === 'landscape' ? 18 : 5; // Allow more characters in landscape

  // For comma-separated values, break each part if long
  if (str.includes(",")) {
    return str.split(",").map((part, idx, arr) => {
      part = part.trim();
      // Break long numbers or alphanumerics after dynamic chars
      if ((/^\d+$/.test(part) && part.length > charLimit) || (/^[\w\d\-]+$/.test(part) && part.length > charLimit)) {
        part = part.replace(new RegExp(`(.{${charLimit}})`, 'g'), '$1-\n');
      }
      return part + (idx < arr.length - 1 ? ',\n' : '');
    }).join("");
  }

  // For decimal numbers (e.g., "2092.6399999999994")
  if (/^\d+\.\d+$/.test(str) && str.length > charLimit) {
    const [integerPart, decimalPart] = str.split('.');
    // If the decimal part is very long, break it
    if (decimalPart.length > 8) {
      const brokenDecimal = decimalPart.replace(/(.{8})/g, '$1-\n');
      return `${integerPart}.${brokenDecimal}`;
    }
    // If the whole number is long, break at the decimal point
    return `${integerPart}.\n${decimalPart}`;
  }

  // For long numbers only (integers)
  if (/^\d+$/.test(str) && str.length > charLimit) {
    return str.replace(new RegExp(`(.{${charLimit}})`, 'g'), '$1-\n');
  }

  // For long alphanumeric strings without spaces
  if (/^[\w\d\-]+$/.test(str) && str.length > charLimit) {
    return str.replace(new RegExp(`(.{${charLimit}})`, 'g'), '$1-\n');
  }

  // For Chinese characters
  return str.replace(/([\u4e00-\u9fa5])/g, '$1\u200B');
}