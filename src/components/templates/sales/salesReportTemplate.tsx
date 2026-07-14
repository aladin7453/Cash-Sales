import React from 'react';
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  Image,
  Font
} from "@react-pdf/renderer";
import moment from 'moment';
import { versionPath } from "@/lib/constants";
import { formatNumberWithCommas } from "@/components/ui/number-formatter";

// Avoid double registration in dev
let fontsRegistered = false;
if (!fontsRegistered) {
  const isDev = process.env.NODE_ENV === 'development';
  Font.register({
    family: 'NotoSansSC',
    src: isDev
      ? '/fonts/NotoSansSC-Regular.ttf'
      : `/${versionPath}/fonts/NotoSansSC-Regular.ttf`,
  });
  Font.register({
    family: 'NotoSansSC-Black',
    src: isDev
      ? '/fonts/NotoSansSC-Black.ttf'
      : `/${versionPath}/fonts/NotoSansSC-Black.ttf`,
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: 'NotoSansSC'
  },
  logoContainer: {
    position: "absolute",
    top: 0,
    left: 20,
    width: 100,
    height: 100,
    marginBottom: 60,
    overflow: "hidden",
  },
  logoImage: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  header: {
    fontSize: 9,
    minHeight: 90,
    marginLeft: 150,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  firstSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 30,
    marginBottom: 2,
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderStyle: "solid",
    borderColor: "#000000",
    // borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    borderColor: "#000000",
    borderBottomWidth: 1,
  },
  tableHeader: {
    backgroundColor: "#deebf7",
    fontWeight: "bold",
    borderTopWidth: 1,
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
    borderColor: "#000000",
  },
  tableCellMerged: {
    padding: 5,
    fontSize: 7,
    flex: 16, 
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#000000",
  },
  groupTitle: {
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 1,
    marginBottom: 1,
    fontFamily: 'NotoSansSC-Black',
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
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#CCCCCC",
    width: 70,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryField2: {
    backgroundColor: "#FFFFFF",
    padding: 2,
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#CCCCCC",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 18,
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

  boldText: {
    fontFamily: 'NotoSansSC-Black',
    fontWeight: 'bold',
  },
  subtotalRow: {
    backgroundColor: "#deebf7",
    borderBottomWidth: 1,
    borderColor: "#000",
  },

  bankTable: {
    border: "1pt solid black",
    width: "100%",
  },
  bankTableRow: {
    flexDirection: "row",
    borderBottom: "1pt solid black",
  },
  bankTableCell: {
    borderRight: "1pt solid black",
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 8,
    justifyContent: "center",
    minHeight: 20,
  },
  noBorderLeft: {
    borderRight: 0,
  },
  bankHeaderRow: {
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
    borderBottom: "1pt solid black",
  },
  bankHeaderText: {
    textAlign: "center",
    fontSize: 9,
    fontWeight: "bold",
    padding: 4,
  },
});

const SalesReport = ({
  type,
  data,
  dataSummary,
  summary,
  salesReportData,
  generatedReport,
  salesReportColumns,
  orientation = 'portrait',
}: {
  type: string;
  data?: any;
  dataSummary?: any;
  summary?: any;
  salesReportData?: any;
  generatedReport?: any;
  salesReportColumns?: any[];
  orientation?: 'portrait' | 'landscape';
}) => {
  let image64 = data?.currentCompany?.logoLink[0]?.base64;

  // Format the date range
  const formatDateRange = () => {
    if (!salesReportData?.startDate || !salesReportData?.endDate) return "";
    const startDate = moment.unix(Number(salesReportData.startDate)).format('YYYY-MM-DD');
    const endDate = moment.unix(Number(salesReportData.endDate)).format('YYYY-MM-DD');

    return `${startDate} to ${endDate}`;
  };

  //Level 2
  let finalRows = data?.rows || generatedReport || [];
  
  const isLevel2 = type === "Sales P&L By Document - Level 2" || type === "Sales Profit/Loss Report - Level 2" || type === "Sales Multi - Debit Note Listing - Level 2" 
                || type ==="Sales Multi - Cash Sales Listing - Level 2" || type ==="Sales Local - Cash Sales Collection Report - Level 1" || type ==="Sales Multi - Credit Note Listing - Level 2"
                || type ==="Sales Multi - Invoice Listing - Level 2" || type ==="Sales Multi - Sales Order Listing - Level 2" || type === "Sales Outstanding Quotation Listing - Level 2 (with PO Info)"
                || type ==="Sales Outstanding Cash Sales Listing - Level 2 (with PO info)" || type ==="Sales Outstanding Sales Order Listing - Level 2 (with PO info)"
                || type ==="Sales Outstanding Invoice Listing - Level 2 (with PO Info)" || type ==="Sales Outstanding Delivery Order Listing - Level 2 (with PO Info)"
                || type === "Sales Customer Price History - Level 2";

  if (isLevel2 && finalRows.length > 0) {
    const transformedRows: any[] = [];
  
    const groups: Record<string, any> = {};
    
    finalRows.forEach((item: any) => {

      const key = item.docNo || "Unknown";
      
      if (!groups[key]) {
        groups[key] = {
          docNo: item.docNo,
          docDateFormat: item.docDateFormat,
          customerName: item.customerName,
          items: [],
          totals: {
            sales: 0,
            cost: 0,
            profit: 0,
            discount: 0,
            amountAfterDiscount: 0,
            totalAmount: 0,
            totalTax: 0,
            totalSubtotalTax: 0,
            paidAmount: 0,
            totalSubtotalTaxTax: 0,
            quantity: 0,
          }
        };
      }
      
      const sales = parseFloat(item.price || 0);
      const cost = parseFloat(item.itemCost || 0);
      const profit = parseFloat(item.itemProfitLoss || 0);
      const discount = parseFloat(item.totalDiscount || 0);
      const amountAfterDiscount = parseFloat(item.amountAfterDiscount || 0);
      const totalAmount = parseFloat(item.totalAmount || 0);
      const totalTax = parseFloat(item.totalTax || 0);
      const totalSubtotalTax = parseFloat(item.totalSubtotalTax || 0);
      const paidAmount = parseFloat(item.paidAmout || 0);
      const totalSubtotalTaxTax = parseFloat(item.subtotalTax || 0);
      const quantity = parseFloat(item.quantity || 0);


      groups[key].items.push(item);
      groups[key].totals.sales += sales;
      groups[key].totals.cost += cost;
      groups[key].totals.profit += profit;
      groups[key].totals.discount += discount;
      groups[key].totals.amountAfterDiscount += amountAfterDiscount;
      groups[key].totals.totalAmount += totalAmount;
      groups[key].totals.totalTax += totalTax;
      groups[key].totals.totalSubtotalTax += totalSubtotalTax;
      groups[key].totals.paidAmount += paidAmount;
      groups[key].totals.totalSubtotalTaxTax += totalSubtotalTaxTax;
      groups[key].totals.quantity += quantity;
    });


    let globalIndex = 1;
    Object.values(groups).forEach((group: any) => {

      transformedRows.push({
        _rowType: 'header',
        _index: globalIndex++,
        docNo: group.docNo,
        docDateFormat: group.docDateFormat,
        customerName: group.customerName
      });


      group.items.forEach((item: any) => {
        transformedRows.push({
          _rowType: 'item',
          ...item
        });
      });

      const margin = group.totals.sales !== 0 
        ? ((group.totals.profit / group.totals.sales) * 100).toFixed(2) 
        : "0.00";

      transformedRows.push({
        _rowType: 'subtotal',
        docNo: group.docNo,
        caustomerName: group.customerName,
        subtotalSales: group.totals.sales,
        subtotalCost: group.totals.cost,
        subtotalProfit: group.totals.profit,
        subtotalMargin: margin + "%",
        subtotalDiscount: group.totals.discount,
        subtotalAmountAfterDiscount: group.totals.amountAfterDiscount,
        subtotalTotalAmount: group.totals.totalAmount,
        subtotalTotalTax: group.totals.totalTax,
        subtotalTotalSubtotalTax: group.totals.totalSubtotalTax,
        subtotalPaidAmount: group.totals.paidAmount,
        subtotalTotalSubtotalTaxTax: group.totals.totalSubtotalTaxTax,
        subtotalQuantity: group.totals.quantity,
      });
    });

    finalRows = transformedRows;
  }
  
  //Level 2 End

  if (salesReportData?.reportTypeName === "cashSalesListingLv1" && Array.isArray(finalRows)) {
    const grouped: any = {};
    finalRows.forEach((row: any) => {
      const key = row.docDateFormat || "Unknown Date"; 
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(row);
    });
    finalRows = grouped;
  }

  const rows = finalRows;




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
    marginLeft: orientation === 'landscape' ? 120 : 150,
  });
  const getLogoStyles = () => ({
    ...styles.logoContainer,
    width: orientation === 'landscape' ? 80 : 100,
    height: orientation === 'landscape' ? 80 : 100,
  });
  const getLogoImageStyles = () => ({
    ...styles.logoImage,
    width: orientation === 'landscape' ? 80 : 100,
    height: orientation === 'landscape' ? 80 : 100,
  });
  const getSummaryStyles = () => ({
    ...styles.summaryBox,
    padding: orientation === 'landscape' ? 3 : 5,
  });

  // Common header content with dynamic styles
  const renderHeader = () => (
    <>
      <View style={getLogoStyles()}>
        {image64 ? (
          <Image
            src={{ uri: image64, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }}
            style={getLogoImageStyles()}
          />
        ) : null}
      </View>
      <View style={getHeaderStyles()}>
        <Text>
          {data?.currentCompany?.company ?? ""}
          {data?.currentCompany?.BRN ? ` (${data?.currentCompany?.BRN})` : ""}
        </Text>
        <Text style={styles.headerText}>{data?.currentCompany?.address ?? ""}</Text>
        <View style={styles.headerRow}>
          {data?.currentCompany?.phoneNo && (
            <Text style={styles.headerText}>Phone No.: {data?.currentCompany?.phoneNo}</Text>
          )}
          {data?.currentCompany?.email && (
            <Text style={styles.headerText}>Email: {data?.currentCompany?.email}</Text>
          )}
        </View>
      </View>
      <View>
        <View fixed style={styles.firstSeparator} />
        {salesReportData?.reportTypeName === "bankDetailsRequestForm1" ? (
          <View>
            <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
              BANK DETAILS REQUEST FORM (for e-Payment)
            </Text>
          </View>
        ) : (
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            {type.toUpperCase()}
          </Text>
        )}
        {(type === "Customer Post Dated Cheque Listing" || type === "Customer Document Listing") && (
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            AS AT {data?.pdfTitle ?? ""} 
          </Text>
        )}
        {(type === "Customer Bills And Collection Analysis" || type === "Yearly Sales Analysis") && (
          <Text style={[styles.sectionTitle, { textAlign: "center" }]}>
            AS AT {data?.toDate ?? ""} 
          </Text>
        )}
      </View>
      <View style={{ marginTop: orientation === 'landscape' ? 20 : 30 }}>
        {salesReportData?.reportTypeName !== "bankDetailsRequestForm1" && (
          <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
            Generated By: {data?.currentCompany?.currentUser ?? data?.currentUser ?? ""}
          </Text>
        )}
        {type === "Active Customer Report" && (
          <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
            Customer: {data?.currentCustomer ?? ""}
          </Text>
        )}
        <Text style={{ fontSize: orientation === 'landscape' ? 6 : 7, textAlign: "left" }}>
          {type === "Active Customer Report" 
            ? "Active Date: " 
            : type === "Customer Due Document Listing" || type === "Customer Statement Report" || type === "Customer Post Dated Cheque Listing" || type === "Customer Bills And Collection Analysis" || salesReportData?.reportTypeName === "bankDetailsRequestForm1" || type === "Customer Aging Report"
            ? "" 
            : "Date Range: "} 
          {type !== "Customer Due Document Listing" && type !== "Customer Statement Report" && type !== "Customer Post Dated Cheque Listing" && type !== "Customer Bills And Collection Analysis" && salesReportData?.reportTypeName !== "bankDetailsRequestForm1" && type !== "Customer Aging Report" && formatDateRange()}
        </Text>
      </View>
    </>
  );

  // Common table header with dynamic styles
  // const renderTableHeader = () => (
  //   <View style={[styles.tableRow, styles.tableHeader]}>
  //     {salesReportColumns?.map((column, index) => (
  //       <Text
  //         key={index}
  //         style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
  //       >
  //         {column.header}
  //       </Text>
  //     ))}
  //   </View>
  // );
  const renderTableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeader]}>
      {salesReportColumns?.map((column, index) => {
        let cellStyle = column.header === "No" ? getTableCellNoStyles() : getTableCellStyles();

        const isLevel2 = type === "Sales Local - Cash Sales Collection Report - Level 1"  ;
        
        if (type === "Sales Local - Cash Sales Collection Report - Level 1" && column.header === "Doc No") {
           cellStyle = { ...cellStyle, flex: 8 }; 
        }

        if ( (type === "Sales P&L By Document - Level 2" ) && (column.header === "Doc No" || column.header === "Profit/(Loss)")) {
          cellStyle = { ...cellStyle, flex: 6 };
        }

        if ( (type ==="Sales Outstanding Quotation Listing - Level 2" || type === "Sales Outstanding Invoice Listing - Level 2 (with PO Info)" || 
              type === "Sales Outstanding Cash Sales Listing - Level 2 (with PO info)" || type ==="Sales Outstanding Sales Order Listing - Level 2 (with PO info)" ||
              type === "Sales Outstanding Delivery Order Listing - Level 2 (with PO Info)") 
          && (column.header === "Code" || column.header === "Doc No")) {
          cellStyle = { ...cellStyle, flex: 6 };
        }

        if((type ==="Sales P&L SN By Document - Level 2") && (column.header ==="Doc No")){
          cellStyle = { ...cellStyle, flex: 6 };
        }

        if((type ==="Sales Customer Price History - Level 2")&&(column.header ==="Doc No" || column.header ==="Date")){
          cellStyle = { ...cellStyle, flex: 6 };
        }

        return (
          <Text key={index} style={cellStyle}>
            {column.header}
          </Text>
        );
      })}
    </View>
  );

  const renderDynamicValue = (prefix: string, month: string) => {
    if (!dataSummary) return "";
    const regex = new RegExp(`^${prefix}_[0-9]{4}_${month}$`, "i");
    const key = Object.keys(dataSummary).find((k) => regex.test(k));
    return key ? dataSummary[key] : "";
  };

  const renderDynamicValueYearlyAnalysis = (prefix: string, month: string) => {
    if (!data?.summary) return "";
    const regex = new RegExp(`^${prefix}_[0-9]{4}_${month}$`, "i");
    const key = Object.keys(data.summary).find((k) => regex.test(k));
    return key ? data.summary[key] : "";
  };

  // Summary box content with dynamic styles
  const renderSummaryBox = () => (
    <View style={getSummaryStyles()}>
      <Text style={styles.summaryTitle}>Summary: </Text>
      <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
        {type === "Customer Monthly Sales Report" ? (
          <>
            <View>
              <Text style={styles.summaryText}>Total Invoices Issued:</Text>
              <View style={styles.summaryField}>
                <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.summaryText}>Total Amount Invoiced:</Text>
              <View style={styles.summaryField}>
                <Text style={styles.summaryText}>{data?.summary?.totalNetTotal?? ""}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.summaryText}>Total Paid:</Text>
              <View style={styles.summaryField}>
                <Text style={styles.summaryText}>{data?.summary?.totalPaidAmount ?? ""}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.summaryText}>Total Outstanding:</Text>
              <View style={styles.summaryField}>
                <Text style={styles.summaryText}>{data?.summary?.totalOutstandingAmount ?? ""}</Text>
              </View>
            </View>
          </>
        ) : type === "Sales Collection Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Payments Received:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalPaidAmountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>No. Of Customers Paid:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Average Payment Monthly:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.averageMonthlyPayment ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Sales Document Listing Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 4 : 6 }}>
              <View>
                <Text style={styles.summaryText}>Total No.Of Document:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Amount:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmountReport ?? ""}</Text>
                </View>
              </View>
              {/* <View>
                <Text style={styles.summaryText}>Total Discount:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalDiscountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Subtotal:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmountAfterDiscountReport ?? ""}</Text>
                </View>
              </View>
               <View>
                <Text style={styles.summaryText}>Total Tax:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalTaxReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total SubTotal (Tax):</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalSubtotalTaxReport ?? ""}</Text>
                </View>
              </View> */}
            </View>
          </>
        ) : type === "Sales Multi - Sales Order Listing - Level 2" || type === "Sales Multi - Invoice Listing - Level 2" 
          || type === "Sales Local - Debit Note Listing - Level 2" || type === "Sales Multi - Debit Note Listing - Level 2" 
          || type === "Sales Multi - Credit Note Listing - Level 2"|| type === "Sales Local - Cash Sales Collection Report - Level 1"? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 4 : 6 }}>
              <View>
                <Text style={styles.summaryText}>Total No.Of Document:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Sales Amount:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Discount:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalDiscountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Subtotal:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmountAfterDiscountReport ?? ""}</Text>
                </View>
              </View>
               <View>
                <Text style={styles.summaryText}>Total Tax:</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalTaxReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total SubTotal (Tax):</Text>
                <View style={styles.summaryField2}>
                  <Text style={styles.summaryText}>{data?.summary?.totalSubtotalTaxReport ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Outstanding Sales Document Listing Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 4 : 6 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No.:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Orig Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOriginalQuantity ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total O/S Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOSQuantity ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total O/S Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOSAmount ?? ""}</Text>
                </View>
              </View>

            </View>
          </>

        ) : type === "Outstanding Sales Document Listing Report" || type === "Sales Outstanding Quotation Listing - Level 2 (with PO Info)" 
        || type === "Sales Outstanding Invoice Listing - Level 2 (with PO info)" || type === "Sales Outstanding Cash Sales Listing - Level 2 (with PO info)" 
        || type === "Sales Outstanding Sales Order Listing - Level 2 (with PO info)"|| type === "Sales Outstanding Delivery Order Listing - Level 2 (with PO Info)" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 4 : 6 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No.:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Orig Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOriginalQuantity ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total O/S Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOSQuantity ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total O/S Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOSAmount ?? ""}</Text>
                </View>
              </View>

            </View>
          </>
        ) : type === "Active Customer Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Active Customer:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Customer with Zero Sales:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalZeroSalesCustomer ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Outstanding Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Average Days Since Last Invoice:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.averageDaysSinceLastInvoice ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Sales Price History Report" ||  type === "Sales Customer Price History - Level 1" ||  type === "Sales Customer Price History - Level 2"? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of Item:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </> 
        ) : type === "Sales Profit/Loss Report" || type === "Sales S/N Profit/Loss Report" || type === "Sales P&L SN By Document - Level 2"? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 4 : 6 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No.:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Item Cost:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalCostReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Item Price:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalPriceReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Profit:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalProfitItemCountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Loss:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalLossItemCountReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Avg. Profit Percentage:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.averageProfitPercentageReport ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Avg. Loss Percentage:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.averageLossPercentageReport ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Sales Picking List Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalQuantity ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Aging Report" ? (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Count of Item:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              {/* <View>
                <Text style={styles.summaryText}>Total Outstanding:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOutstandingAmount ?? ""}</Text>
                </View>
              </View> */}
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Pay MTD:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalPayMTD ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Current Month:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalCurrentMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total 1 Mth:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOneMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total 2 Mths:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalTwoMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total 3 Mths:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalThreeMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total 4 Mths:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalFourMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total 5 Mths & Above:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalFiveMonthOutstandingAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Balance Report" ? (
          <>
            {salesReportData.reportTypeName === "customerBalanceReportMultiBalance" ? (
              <>
                <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
                  <View>
                    <Text style={styles.summaryText}>Count of Customer:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.summaryText}>Total C/F Balance:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.summary?.totalCurrentBalanceCarryForward ?? ""}</Text>
                    </View>
                  </View>
                </View>
              </>
            ) : salesReportData.reportTypeName === "customerBalanceReportMultiBalanceSummary" ? (
              <>
                <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
                  <View>
                    <Text style={styles.summaryText}>Count of Customer:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.summaryText}>Total Doc Amount:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.summary?.totalDocAmount ?? ""}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.summaryText}>Total Local Doc Amount:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.summary?.totalLocalDocAmount ?? ""}</Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
                  <View>
                    <Text style={styles.summaryText}>Count of Customer:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.summaryText}>Total Current Balance:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.summary?.totalCurrentBalance ?? ""}</Text>
                    </View>
                  </View>
                  <View>
                    <Text style={styles.summaryText}>Total C/F Balance:</Text>
                    <View style={styles.summaryField}>
                      <Text style={styles.summaryText}>{data?.summary?.totalCurrentBalanceCarryForward ?? ""}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        ) : type === "Customer Due Document Listing" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalNetTotal ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Payment:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalPaidAmount ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Outstanding:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOutstandingAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Statement Report" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Outstanding:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalOutstandingAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Post Dated Cheque Listing" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total PD Cheque:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Amount PD Cheque:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalAmount ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Unapplied:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalUnappliedAmount ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Knock Off:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalKnockOffAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Bills And Collection Analysis" ? (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Customer:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Currency:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalCurrencyCount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 1:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "01")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 1 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "01")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 1:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "01")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 1 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "01")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 2:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "02")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 2 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "02")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 2:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "02")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 2 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "02")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 3:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "03")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 3 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "03")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 3:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "03")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 3 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "03")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 4:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "04")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 4 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "04")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 4:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "04")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 4 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "04")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 5:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "05")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 5 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "05")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 5:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "05")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 5 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "05")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 6:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "06")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 6 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "06")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 6:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "06")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 6 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "06")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 7:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "07")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 7 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "07")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 7:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "07")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 7 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "07")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 8:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "08")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 8 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "08")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 8:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "08")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 8 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "08")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 9:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "09")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 9 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "09")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 9:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "09")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 9 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "09")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 10:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "10")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 10 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "10")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 10:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "10")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 10 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "10")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 11:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "11")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 11 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "11")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 11:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "11")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 11 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "11")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 12:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalSales", "12")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 12 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalSales", "12")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 12:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalCollection", "12")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Month 12 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValue("totalLocalCollection", "12")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalSalesAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Amount (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalLocalSalesAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalCollectionAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Col Amount (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalLocalCollectionAmount ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Yearly Sales Analysis" ? (
          <>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Count of No.:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 1 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "01")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 2 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "02")}</Text>
                </View>
              </View>
              
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 3 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "03")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 4 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "04")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 5 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "05")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 6 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "06")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 7 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "07")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 8 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "08")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 9 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "09")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 10 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "10")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 11 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "11")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Month 12 (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{renderDynamicValueYearlyAnalysis("totalLocalSales", "12")}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total SL Amount (Local):</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalLocalSalesAmount ?? ""}</Text>
                </View>
              </View>
              <View style={{ width: "18%" }}>
                <Text style={styles.summaryText}>Total Quantity:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalQuantity ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Sales Analysis By Document" || type === "Sales Analysis By Document - Level 2" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalRecords?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Invoice:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllIVValue ?? ""}</Text>
                </View>
              </View>
              {/* <View>
                <Text style={styles.summaryText}>Total IV Qty:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllIVQty ?? ""}</Text>
                </View>
              </View> */}
              <View>
                <Text style={styles.summaryText}>Total Cash Sales:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllCSValue ?? ""}</Text>
                </View>
              </View>
              {/* <View>
                <Text style={styles.summaryText}>Total CS Qty:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllCSQty ?? ""}</Text>
                </View>
              </View> */}
              <View>
                <Text style={styles.summaryText}>Total Value:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllTotalValue ?? ""}</Text>
                </View>
              </View>
              {/* <View>
                <Text style={styles.summaryText}>Total Qty:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.sumAllTotalQty ?? ""}</Text>
                </View>
              </View> */}
            </View>
          </>
        ) : type === "Customer Analysis By Document" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalRecords ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total B/F Local Amt:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalBFAmt ?? ""}</Text>
                </View>
              </View>
              <View>
                <Text style={styles.summaryText}>Total Invoice Local:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalBFLocalAmt ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : type === "Customer Document Listing" || salesReportData?.reportTypeName === "customerPaymentListingLv2CustomerCode" || salesReportData?.reportTypeName === "customerContraListingLv2CustomerCode" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total Count of No:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
              {(salesReportData.reportTypeName === "customerPaymentListing" || salesReportData?.reportTypeName === "customerPaymentListingLv2CustomerCode") && (
                <View>
                  <Text style={styles.summaryText}>Total Amount:</Text>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryText}>{data?.summary?.totalAmount ?? ""}</Text>
                  </View>
                </View>
              )}
              {(salesReportData.reportTypeName === "customerContraListing" || salesReportData?.reportTypeName === "customerContraListingLv2CustomerCode") && (
                <View>
                  <Text style={styles.summaryText}>Total Amount:</Text>
                  <View style={styles.summaryField}>
                    <Text style={styles.summaryText}>{data?.summary?.totalKnockoffAmount ?? ""}</Text>
                  </View>
                </View>
              )}
              {/* <View>
                <Text style={styles.summaryText}>Total Knockoff Amount:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.summary?.totalKnockoffAmount ?? ""}</Text>
                </View>
              </View> */}
            </View>
          </>
        ) : type === "Customer Listing" ? (
          <>
            <View style={{ flexDirection: "row", gap: orientation === 'landscape' ? 6 : 10 }}>
              <View>
                <Text style={styles.summaryText}>Total:</Text>
                <View style={styles.summaryField}>
                  <Text style={styles.summaryText}>{data?.total ?? ""}</Text>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.summaryText}>Other Information:</Text>
            <View style={styles.summaryField2}>
              <Text style={styles.summaryText}>{salesReportData?.otherInfo ?? ""}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );

  // Format decimal values to 2 decimal places with thousand separators
  const formatDecimal = (value: any) => {
    return formatNumberWithCommas(value, 2);
  };

  const isSalesOrCollectionColumn = (
    column: { accessorKey?: string; header?: string },
    value: unknown
  ): boolean => {
    if (!column?.accessorKey) return false;
    const key = column.accessorKey.toLowerCase();
    const numericPrefixes = ["sales_", "localsales_", "collection_", "localcollection_"];

    const matchesKeyword = numericPrefixes.some(prefix => key.startsWith(prefix));
    const isNumber =
      typeof value === "number" ||
      (!isNaN(parseFloat(String(value))) && value !== "");
    return matchesKeyword && isNumber;
  };

  // Helper for Level 2 columns
  const renderLevel2Row = (item: any) => {
    const commonStyle = getTableCellStyles();
    const noStyle = getTableCellNoStyles();
    const mergedStyle = { ...getTableCellStyles(), flex: 16, textAlign: 'right' };

    //Header Row
    if (item._rowType === 'header') {
      if(type === "Sales P&L By Document - Level 2" || type === "Sales Outstanding Quotation Listing - Level 2 (with PO Info)" || type === "Sales Outstanding Cash Sales Listing - Level 2 (with PO info)" 
        || type ==="Sales Outstanding Sales Order Listing - Level 2 (with PO info)" || type ==="Sales Outstanding Invoice Listing - Level 2 (with PO Info)"
        || type === "Sales Outstanding Delivery Order Listing - Level 2 (with PO Info)" || type ==="Sales Customer Price History - Level 2"){
        return (
          <View style={styles.tableRow} wrap={false}>
            <Text style={noStyle}>{item._index}</Text>
            <Text style={[commonStyle, styles.boldText, {flex: 6,borderRightColor: "#ffffff"}]}>{item.docNo}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docDateFormat}</Text>

            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle, {flex: 6,borderRightColor: "#ffffff"}]}></Text>
            <Text style={commonStyle}></Text>
          </View>   
        );
    } else if(type === "Sales Multi - Debit Note Listing - Level 2" || type ==="Sales Multi - Credit Note Listing - Level 2" || type ==="Sales Multi - Invoice Listing - Level 2" || 
              type ==="Sales Multi - Sales Order Listing - Level 2"){
        return (
          <View style={styles.tableRow} wrap={false}>
            <Text style={noStyle}>{item._index}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docNo}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docDateFormat}</Text>

            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={commonStyle}></Text>
          </View>
        );
    } else if(type === "Sales Multi - Cash Sales Listing - Level 2"){
        return (
          <View style={styles.tableRow} wrap={false}>
            <Text style={noStyle}>{item._index}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docNo}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docDateFormat}</Text>

            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={commonStyle}></Text>
          </View>
        );      
    } else if(type ==="Sales Local - Cash Sales Collection Report - Level 1"){
        return (
          <View style={styles.tableRow} wrap={false}>
            <Text style={noStyle}>{item._index}</Text>
            <Text style={[commonStyle, styles.boldText, {flex: 8,borderRightColor: "#ffffff"}]}>{item.docNo}</Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={commonStyle}></Text>
          </View>
        );
    } else if(type ==="Sales P&L SN By Document - Level 2"){
        return (
          <View style={styles.tableRow} wrap={false}>
            <Text style={noStyle}>{item._index}</Text>
            <Text style={[commonStyle, styles.boldText, {flex: 6,borderRightColor: "#ffffff"}]}>{item.docNo}</Text>
            <Text style={[commonStyle, styles.boldText,{borderRightColor: "#ffffff" }]}>{item.docDateFormat}</Text>

            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={[commonStyle,{borderRightColor: "#ffffff" }]}></Text>
            <Text style={commonStyle}></Text>
          </View>   
        );
    }

    //Subtotal Row
    } else if (item._rowType === 'subtotal') {
      if(type === "Sales P&L By Document - Level 2"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" ,flex: 6}]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text> {/* Code - empty */}
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text> {/* Description - empty */}
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalSales)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalCost)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" , flex: 6}]}>{formatDecimal(item.subtotalProfit)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalMargin)}</Text>
          </View>
        );
      } else if (type === "Sales Multi - Debit Note Listing - Level 2" || type ==="Sales Multi - Credit Note Listing - Level 2" || type ==="Sales Multi - Invoice Listing - Level 2" || type ==="Sales Multi - Sales Order Listing - Level 2"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1, borderColor: "#000000", textAlign: "left" }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>

            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalDiscount)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalAmountAfterDiscount)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalAmount)}</Text>
          </View>
        );
      } else if (type === "Sales Multi - Cash Sales Listing - Level 2"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1, borderColor: "#000000", textAlign: "left" }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>
            
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalAmount)}</Text>
          </View>
        );
      } else if (type === "Sales Local - Cash Sales Collection Report - Level 1"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { flex: 8, borderRightWidth: 1, borderColor: "#000000", textAlign: "left" }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>
            
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalDiscount)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalAmount)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalTax)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalSubtotalTax)} </Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalPaidAmount)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalAmountAfterDiscount)}</Text>          
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}></Text>
          </View>
        );        
      } else if (type === "Sales P&L SN By Document - Level 2"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" ,flex: 6}]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text> {/* Item Code - empty */}
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalSales)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalCost)}</Text>
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalProfit)}</Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text> {/* Profit - empty */}
            <Text style={[commonStyle, styles.boldText, { borderColor: "#000000" }]}>{item.subtotalMargin}</Text>
          </View>
        );
      } else if (type === "Sales Customer Price History - Level 2"){
        return (
          <View style={[styles.tableRow, styles.subtotalRow]} wrap={false}>
            <Text style={[noStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderLeftWidth: 1, borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" ,flex: 6}]}></Text>
            <Text style={[commonStyle, { borderRightWidth: 1,borderRightColor: "#deebf7", borderColor: "#000000" ,flex: 6 }]}>
              <Text style={[commonStyle , styles.boldText]}>Subtotal of {item.docNo}</Text>
            </Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}>{item.subtotalQuantity}</Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}></Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalSales)}</Text>
            <Text style={[commonStyle, { borderColor: "#000000" }]}>{formatDecimal(item.subtotalTotalSubtotalTaxTax)}</Text>
          </View>
        );
      }

    //Normal row
    } else if (type === "Sales P&L By Document - Level 2") {
      return (
        <View style={styles.tableRow} wrap={false}>
           <Text style={noStyle}></Text> {/* No */}
           <Text style={[commonStyle,{flex: 6}]}>{item.docNo}</Text> {/* DocNo */}
           <Text style={commonStyle}>{item.docDateFormat}</Text> {/* Date */}
           
           <Text style={commonStyle}>
             {typeof item.itemCode === "string" ? insertZeroWidthSpace(item.itemCode, orientation) : item.itemCode}
           </Text>
           <Text style={[commonStyle, {textAlign: 'left'}]}>
             {typeof item.description === "string" ? insertZeroWidthSpace(item.description, orientation) : item.description}
           </Text>
           <Text style={commonStyle}>{formatDecimal(item.price)}</Text>
           <Text style={commonStyle}>{formatDecimal(item.itemCost)}</Text>
           <Text style={[commonStyle,{flex: 6}]}>{formatDecimal(item.itemProfitLoss)}</Text>
           <Text style={commonStyle}>{item.profitLossPercentage}</Text>
        </View>
      );
    } else if(type === "Sales Multi - Debit Note Listing - Level 2" || type ==="Sales Multi - Credit Note Listing - Level 2" || type ==="Sales Multi - Invoice Listing - Level 2" || type ==="Sales Multi - Sales Order Listing - Level 2"){
      return (
        <View style={styles.tableRow} wrap={false}>
           <Text style={noStyle}></Text> {/* No */}
           <Text style={commonStyle}>{item.docNo}</Text> {/* DocNo */}
           <Text style={commonStyle}>{item.docDateFormat}</Text> {/* Date */}
           <Text style={commonStyle}>{item.customerName}</Text>
           <Text style={commonStyle}>{formatDecimal(item.totalDiscount)}</Text>
           <Text style={commonStyle}>{formatDecimal(item.amountAfterDiscount)}</Text>
           <Text style={commonStyle}>{formatDecimal(item.totalAmount)}</Text>
        </View>
      );  
    } else if (type ==="Sales Multi - Cash Sales Listing - Level 2"){
      return (
        <View style={styles.tableRow} wrap={false}>
           <Text style={noStyle}></Text> {/* No */}
           <Text style={commonStyle}>{item.docNo}</Text> {/* DocNo */}
           <Text style={commonStyle}>{item.docDateFormat}</Text> {/* Date */}
           <Text style={commonStyle}>{item.customerCodeCode}</Text>
           <Text style={commonStyle}>{item.customerName}</Text>
           <Text style={commonStyle}>{formatDecimal(item.totalAmount)}</Text>
        </View>
      );
    }else if (type ==="Sales Local - Cash Sales Collection Report - Level 1"){
      return (
        <View style={styles.tableRow} wrap={false}>
           <Text style={noStyle}></Text> {/* Number */}
           
           <Text style={[commonStyle, { flex: 8}]}>{item.docNo}</Text> {/* DocNo */}
           <Text style={commonStyle}>{item.docDateFormat}</Text> 
           <Text style={commonStyle}>{item.customerCodeCode}</Text>
           <Text style={commonStyle}>{item.customerName}</Text>
           <Text style={commonStyle}>{item.totalDiscount}</Text>
           <Text style={commonStyle}>{item.totalAmount}</Text>
           <Text style={commonStyle}>{item.totalTax}</Text>
           <Text style={commonStyle}>{item.totalSubtotalTax}</Text>
           <Text style={commonStyle}>{item.paidAmount}</Text>
           <Text style={commonStyle}>{item.amountAfterDiscount}</Text>
           <Text style={commonStyle}>{item.paymentMethodCode}</Text>
        </View>
      );
    } else if (type ==="Sales Outstanding Quotation Listing - Level 2 (with PO Info)" || type === "Sales Outstanding Cash Sales Listing - Level 2 (with PO info)" 
            || type ==="Sales Outstanding Sales Order Listing - Level 2 (with PO info)" || type ==="Sales Outstanding Invoice Listing - Level 2 (with PO Info)"
            || type === "Sales Outstanding Delivery Order Listing - Level 2 (with PO Info)"){
      return(
        <View style={styles.tableRow} wrap={false}>
          <Text style={noStyle}></Text> {/* No */}
          <Text style={[commonStyle,{flex: 6}]}>{item.itemCode}</Text>
          <Text style={commonStyle}>{item.description}</Text>
          <Text style={commonStyle}>{formatDecimal(item.price)}</Text>
          <Text style={commonStyle}>{item.deliveryDateFormat}</Text>
          <Text style={commonStyle}>{formatDecimal(item.originalQuantity)}</Text>
          <Text style={commonStyle}>{item.docDateFormat}</Text>
          <Text style={[commonStyle,{flex: 6}]}>{item.docNo}</Text>
          <Text style={commonStyle}>{formatDecimal(item.transferQuantity)}</Text>
        </View>
      );
    } else if (type ==="Sales P&L SN By Document - Level 2"){
      return(
        <View style={styles.tableRow} wrap={false}>
          <Text style={noStyle}></Text> {/* No */}
          <Text style={commonStyle}>{item.docDateFormat}</Text>
          <Text style={commonStyle}>{item.itemCode}</Text>{item.itemCode}
          <Text style={commonStyle}>{formatDecimal(item.price)}</Text>
          <Text style={commonStyle}>{formatDecimal(item.itemCost)}</Text>
          <Text style={commonStyle}>{formatDecimal(item.itemProfitLoss)}</Text>
          <Text style={commonStyle}>{item.status}</Text>
          <Text style={commonStyle}>{item.profitLossPercentage}</Text>
        </View>
      );
    } else if (type==="Sales Customer Price History - Level 2"){
      return(
        <View style={styles.tableRow} wrap={false}>
          <Text style={noStyle}></Text> {/* No */}
          <Text style={[commonStyle, {flex:6}]}>{item.docDateFormat}</Text>
          <Text style={commonStyle}>{item.customerName}</Text>
          <Text style={[commonStyle, {flex:6}]}>{item.docNo}</Text>
          <Text style={commonStyle}>{item.itemCode}</Text>
          <Text style={commonStyle}>{item.quantity}</Text>
          <Text style={commonStyle}>{item.itemUOM}</Text>
          <Text style={commonStyle}>{formatDecimal(item.price)}</Text>
          <Text style={commonStyle}>{formatDecimal(item.subtotalTax)}</Text>
        </View>
      );
    }
  };

  if (type.includes("Sales Analysis By Document")) {
      const groupedData = (data?.rows || []).reduce((acc: any, row: any) => {
        const key = row.customerCode || row.docDate || "Unknown";
        
        if (!acc[key]) {
          acc[key] = {
            name: `Customer Code:${row.customerCode} , Date:${row.docDate}`,
            rows: [],
            totals: {}
          };
        }
        
        acc[key].rows.push(row);
  
        // Accumulate totals for dynamic month columns and main totals
        Object.keys(row).forEach(k => {
           const match = k.match(/^([A-Za-z]{3})[-_](\d{2})$/);
           if (match || k === 'totallocalPurchaseAmount' || k === 'totalQuantity') {
              const val = parseFloat(row[k] || 0);
              acc[key].totals[k] = (acc[key].totals[k] || 0) + (isNaN(val) ? 0 : val);
           }
        });
  
        return acc;
      }, {});
  
      return (
        <Document title={type}>
           <Page size="A4" orientation={orientation} style={getPageStyles()}>
              <View fixed>{renderHeader()}</View>
  
              {Object.values(groupedData).map((group: any, groupIndex) => (
                <View key={groupIndex} style={{ marginBottom: 10 }} wrap={false}>
                   {/* Group Title */}
                   <Text style={styles.groupTitle}>
                     {group.name}
                   </Text>
  
                   {/* Table */}
                   <View style={styles.table}>
                      {/* Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {salesReportColumns?.map((column, index) => (
                          <Text
                            key={index}
                            style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {column.header}
                          </Text>
                        ))}
                      </View>
  
                      {/* Rows */}
                      {group.rows.map((row: any, rowIndex: number) => (
                         <View key={rowIndex} style={styles.tableRow}>
                            {salesReportColumns?.map((column, colIndex) => {
                               if (column.header === "No") {
                                  return (
                                     <Text key={colIndex} style={getTableCellNoStyles()}>
                                        {rowIndex + 1}
                                     </Text>
                                  );
                               }
                               const val = row[column.accessorKey];
                               const isNumeric = 
                                  typeof val === 'number' || 
                                  (!isNaN(parseFloat(String(val))) && val !== "" && (column.header !== "Item Code" && column.header !== "Item Type"));
  
                               return (
                                  <Text key={colIndex} style={getTableCellStyles()}>
                                     {isNumeric ? formatDecimal(val) : (val || "")}
                                  </Text>
                               );
                            })}
                         </View>
                      ))}
  
                   </View>
                </View>
              ))}
  
              <View
                render={({ pageNumber, totalPages }) =>
                  pageNumber === totalPages ? renderSummaryBox() : null
                }
                style={{ width: "100%" }}
              />
  
              <View fixed style={styles.footerContainer}>
                <View style={styles.footerLine} />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 5,
                  }}
                >
                  <Text style={styles.footerText}>
                    Date Generated: {moment().format("YYYY-MM-DD")}
                  </Text>
                  <Text
                    style={styles.footerText}
                    render={({ pageNumber, totalPages }) =>
                      `Page ${pageNumber} of ${totalPages}`
                    }
                  />
                </View>
              </View>
           </Page>
        </Document>
      );
    } else if ([
          "outstandingCashSalesListingMultiLv2DocNo", "outstandingDeliveryOrderListingPoInfoLv2", 
          "outstandingSalesInvoiceListingPoInfoLv2", "outstandingSalesQuotationListingPoInfoLv2",
          "outstandingSalesOrderListingPoInfoLv2", "salesSNProfitLossReportListingLv2"
        ].includes(salesReportData?.reportTypeName)) {
        const groupedData = (data?.rows || []).reduce((acc: any, row: any) => {
            const key = row.docNo || row.docDateFormat || "Unknown";

            if (!acc[key]) {
                acc[key] = {
                    name: `Date:${row.docDateFormat}\nDoc No:${row.docNo}`,
                    rows: [],
                    totals: {}
                };
            }

            acc[key].rows.push(row);
            Object.keys(row).forEach(k => {
                const match = k.match(/^([A-Za-z]{3})[-_](\d{2})$/);
                if (match || k === 'totallocalPurchaseAmount' || k === 'totalQuantity') {
                    const val = parseFloat(row[k] || 0);
                    acc[key].totals[k] = (acc[key].totals[k] || 0) + (isNaN(val) ? 0 : val);
                }
            });

            return acc;
        }, {});

        return (
            <Document title={type}>
                <Page size="A4" orientation={orientation} style={getPageStyles()}>
                    <View fixed>{renderHeader()}</View>

                    {Object.values(groupedData).map((group: any, groupIndex) => (
                        <View key={groupIndex} style={{ marginBottom: 10 }}> 
                            
                            {/* Group Title */}
                            <Text style={styles.groupTitle}>
                                {group.name}
                            </Text>

                            {/* Table */}
                            <View style={styles.table}>
                                <View style={[styles.tableRow, styles.tableHeader]}>
                                    {salesReportColumns?.map((column, index) => (
                                        <Text
                                            key={index}
                                            style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                        >
                                            {column.header}
                                        </Text>
                                    ))}
                                </View>

                                {/* Rows */}
                                {group.rows.map((row: any, rowIndex: number) => (
                                    <View key={rowIndex} style={styles.tableRow} wrap={false}> 
                                        {salesReportColumns?.map((column, colIndex) => {
                                            if (column.header === "No") {
                                                return (
                                                    <Text key={colIndex} style={getTableCellNoStyles()}>
                                                        {rowIndex + 1}
                                                    </Text>
                                                );
                                            }
                                            const val = row[column.accessorKey];
                                            const isNumeric =
                                                typeof val === 'number' ||
                                                (!isNaN(parseFloat(String(val))) &&
                                                 val !== "" &&
                                                 column.header !== "Item Code" &&
                                                 column.header !== "Item Type" &&
                                                 !column.header.toLowerCase().includes("date"));

                                            return (
                                                <Text key={colIndex} style={getTableCellStyles()}>
                                                    {isNumeric ? formatDecimal(val) : (val || "")}
                                                </Text>
                                            );
                                        })}
                                    </View>
                                ))}

                            </View>
                        </View>
                    ))}

                    <View
                        render={({ pageNumber, totalPages }) =>
                            pageNumber === totalPages ? renderSummaryBox() : null
                        }
                        style={{ width: "100%" }}
                    />

                    <View fixed style={styles.footerContainer}>
                        <View style={styles.footerLine} />
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingTop: 5,
                            }}
                        >
                            <Text style={styles.footerText}>
                                Date Generated: {moment().format("YYYY-MM-DD")}
                            </Text>
                            <Text
                                style={styles.footerText}
                                render={({ pageNumber, totalPages }) =>
                                    `Page ${pageNumber} of ${totalPages}`
                                }
                            />
                        </View>
                    </View>
                </Page>
            </Document>
        );
    }



  return (
    <Document title={type}>
      <Page size="A4" orientation={orientation} style={{...getPageStyles(), paddingBottom: 70,}}>
        <View fixed>{renderHeader()}</View>

        {salesReportData?.reportTypeName === "yearlySalesAnalysisLv2Customer" ? (
          <View style={styles.table}>
            {Object.values(data?.rows || {}).map((firstGroup: any) => {
              // --- Accumulate totals for the whole firstGroup (Date)
              const groupRows = Object.values(firstGroup.rows || {}).flatMap(
                (secondGroup: any) => secondGroup.invoices || secondGroup.items || secondGroup.rows || []
              );

              // Define static columns to sum
              const staticColumns = ["totalLocalSalesAmount", "totalQuantity"];

              // Detect dynamic columns (e.g. localSales_2026_02, localSales_2025_05)
              const firstRow = groupRows[0] || {};
              const dynamicColumns = Object.keys(firstRow).filter((key) =>
                key.startsWith("localSales_")
              );

              // Combine static + dynamic columns (remove duplicates just in case)
              const columnsToSum = Array.from(new Set([...staticColumns, ...dynamicColumns]));

              // Compute totals for all relevant columns
              const groupSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                groupSums[key] = groupRows.reduce(
                  (sum, row) => sum + (parseFloat(row[key]) || 0),
                  0
                );
              });

              return (
                <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                    {`Item Code: ${firstGroup.group}`}
                  </Text>

                  {/* Second-Level Groups */}
                  {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                    <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                        {`Customer: ${secondGroup.group}`}
                      </Text>

                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {(salesReportColumns ?? []).map((col, idx) => (
                          <Text
                            key={idx}
                            style={col.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {col.header}
                          </Text>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map(
                        (row: any, rowIdx: number) => (
                          <View
                            key={rowIdx}
                            style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}
                          >
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const value = row[column.accessorKey];

                              // List of numeric/amount columns
                              const amountColumns = [
                                "Total Sales Amount (Local)", "Total Quantity"
                              ];

                              // Dynamic check: columns starting with "SL"
                              const isDynamicAmount = /^(SL)\s/i.test(column.header);

                              // Unified condition
                              const isAmountColumn =
                                amountColumns.includes(column.header) || isDynamicAmount;

                              const displayValue =
                                column.header === "No"
                                  ? rowIdx + 1
                                  : isAmountColumn
                                  ? formatDecimal(value)
                                  : typeof value === "string"
                                  ? insertZeroWidthSpace(value, orientation)
                                  : value || "";

                              return (
                                <Text
                                  key={colIdx}
                                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                >
                                  {displayValue}
                                </Text>
                              );
                            })}
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Group-Level Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      { borderTopWidth: 1, borderColor: "#000" },
                    ]}
                  >
                    {(salesReportColumns ?? []).map((column, colIdx) => {
                      const accessor = column.accessorKey;
                      const sumValue = groupSums[accessor];

                      return (
                        <Text
                          key={colIdx}
                          style={[
                            column.header === "No" ? getTableCellNoStyles() : getTableCellStyles(),
                            { fontFamily: "Helvetica-Bold" },
                          ]}
                        >
                          {sumValue !== undefined
                            ? formatDecimal(sumValue)
                            : colIdx === 1
                            ? "Total"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : salesReportData?.reportTypeName === "customerAnalysisByDocumentLv2CustomerName" ? (
          <View style={styles.table}>
            {Object.values(data?.rows || {}).map((firstGroup: any) => {
              // --- Accumulate totals for the whole firstGroup (Date)
              const groupRows = Object.values(firstGroup.rows || {}).flatMap(
                (secondGroup: any) => secondGroup.invoices || secondGroup.items || secondGroup.rows || []
              );

              // Define columns to sum
              const columnsToSum = [
                "bFLocalAmt", "invoiceLocal", "cNLocal", "dNLocal", "paymentLocal", "contra", "refundLocal",
                "cFLocalAmt"              
              ]; // adjust to your columns

              // // Compute totals
              // const groupSums: Record<string, number> = {};
              // columnsToSum.forEach((key) => {
              //   groupSums[key] = groupRows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
              // });

              // Compute totals
              const groupSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                groupSums[key] = groupRows.reduce((sum, row) => {
                  const numericValue = parseFloat(String(row[key]).replace(/,/g, "").trim());
                  return sum + (isNaN(numericValue) ? 0 : numericValue);
                }, 0);
              });

              return (
                <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                    {`Customer Code: ${firstGroup.group}`}
                  </Text>

                  {/* Second-Level Groups */}
                  {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                    <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                        {`Customer Name: ${secondGroup.group}`}
                      </Text>

                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {(salesReportColumns ?? []).map((col, idx) => (
                          <Text
                            key={idx}
                            style={col.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {col.header}
                          </Text>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map(
                        (row: any, rowIdx: number) => (
                          <View
                            key={rowIdx}
                            style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}
                          >
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const value = row[column.accessorKey];

                              // List of numeric/amount columns
                              const amountColumns = [
                                "B/F Local", "Invoice Local", "Credit Note Local", "Debit Note Local", "Payment Local",
                                "Contra", "Refund Local", "C/F Local"
                              ];

                              const displayValue =
                                column.header === "No"
                                  ? rowIdx + 1
                                  : amountColumns.includes(column.header)
                                  ? formatDecimal(value)
                                  : typeof value === "string"
                                  ? insertZeroWidthSpace(value, orientation)
                                  : value || "";

                              return (
                                <Text
                                  key={colIdx}
                                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                >
                                  {displayValue}
                                </Text>
                              );
                            })}
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Group-Level Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      { borderTopWidth: 1, borderColor: "#000" },
                    ]}
                  >
                    {(salesReportColumns ?? []).map((column, colIdx) => {
                      const accessor = column.accessorKey;
                      const sumValue = groupSums[accessor];

                      return (
                        <Text
                          key={colIdx}
                          style={[
                            column.header === "No" ? getTableCellNoStyles() : getTableCellStyles(),
                            { fontFamily: "Helvetica-Bold" },
                          ]}
                        >
                          {sumValue !== undefined
                            ? formatDecimal(sumValue)
                            : colIdx === 1
                            ? "Total"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : salesReportData?.reportTypeName === "customerDueSalesInvoiceListingLv2DocNo" ||
            salesReportData?.reportTypeName === "customerDueSalesDebitNoteListingLv2DocNo" ? (
          <View style={styles.table}>
            {Object.values(data?.rows || {}).map((firstGroup: any) => {
              // --- Accumulate totals for the whole firstGroup (Date)
              const groupRows = Object.values(firstGroup.rows || {}).flatMap(
                (secondGroup: any) => secondGroup.invoices || secondGroup.items || secondGroup.rows || []
              );

              // Define columns to sum
              const columnsToSum = ["netTotal", "outstandingAmount"]; // adjust to your columns

              // Compute totals
              const groupSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                groupSums[key] = groupRows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
              });

              return (
                <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                    {`Date: ${firstGroup.group}`}
                  </Text>

                  {/* Second-Level Groups */}
                  {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                    <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                        {`Doc No: ${secondGroup.group}`}
                      </Text>

                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {(salesReportColumns ?? []).map((col, idx) => (
                          <Text
                            key={idx}
                            style={col.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {col.header}
                          </Text>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map(
                        (row: any, rowIdx: number) => (
                          <View
                            key={rowIdx}
                            style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}
                          >
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const value = row[column.accessorKey];

                              // List of numeric/amount columns
                              const amountColumns = [
                                "Local Amount", "Local Outstanding Amount"
                              ];

                              const displayValue =
                                column.header === "No"
                                  ? rowIdx + 1
                                  : amountColumns.includes(column.header)
                                  ? formatDecimal(value)
                                  : typeof value === "string"
                                  ? insertZeroWidthSpace(value, orientation)
                                  : value || "";

                              return (
                                <Text
                                  key={colIdx}
                                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                >
                                  {displayValue}
                                </Text>
                              );
                            })}
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Group-Level Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      { borderTopWidth: 1, borderColor: "#000" },
                    ]}
                  >
                    {(salesReportColumns ?? []).map((column, colIdx) => {
                      const accessor = column.accessorKey;
                      const sumValue = groupSums[accessor];

                      return (
                        <Text
                          key={colIdx}
                          style={[
                            column.header === "No" ? getTableCellNoStyles() : getTableCellStyles(),
                            { fontFamily: "Helvetica-Bold" },
                          ]}
                        >
                          {sumValue !== undefined
                            ? formatDecimal(sumValue)
                            : colIdx === 1
                            ? "Total"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : salesReportData?.reportTypeName === "customerPaymentListingLv2CustomerCode" ||
            salesReportData?.reportTypeName === "customerContraListingLv2CustomerCode" ? (
          <View style={styles.table}>
            {Object.values(data?.rows || {}).map((firstGroup: any) => {
              // --- Accumulate totals for the whole firstGroup (Date)
              const groupRows = Object.values(firstGroup.rows || {}).flatMap(
                (secondGroup: any) => secondGroup.invoices || secondGroup.items || secondGroup.rows || []
              );

              // Define columns to sum
              const columnsToSum = ["knockoffAmount", "paidAmount"]; // adjust to your columns

              // Compute totals
              const groupSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                groupSums[key] = groupRows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
              });

              return (
                <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                    {`Date: ${firstGroup.group}`}
                  </Text>

                  {/* Second-Level Groups */}
                  {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                    <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                        {`Customer Code: ${secondGroup.group}`}
                      </Text>

                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {(salesReportColumns ?? []).map((col, idx) => (
                          <Text
                            key={idx}
                            style={col.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {col.header}
                          </Text>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map(
                        (row: any, rowIdx: number) => (
                          <View
                            key={rowIdx}
                            style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}
                          >
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const value = row[column.accessorKey];

                              // List of numeric/amount columns
                              const amountColumns = [
                                "Amount", "Amount Paid"
                              ];

                              const displayValue =
                                column.header === "No"
                                  ? rowIdx + 1
                                  : amountColumns.includes(column.header)
                                  ? formatDecimal(value)
                                  : typeof value === "string"
                                  ? insertZeroWidthSpace(value, orientation)
                                  : value || "";

                              return (
                                <Text
                                  key={colIdx}
                                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                >
                                  {displayValue}
                                </Text>
                              );
                            })}
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Group-Level Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      { borderTopWidth: 1, borderColor: "#000" },
                    ]}
                  >
                    {(salesReportColumns ?? []).map((column, colIdx) => {
                      const accessor = column.accessorKey;
                      const sumValue = groupSums[accessor];

                      return (
                        <Text
                          key={colIdx}
                          style={[
                            column.header === "No" ? getTableCellNoStyles() : getTableCellStyles(),
                            { fontFamily: "Helvetica-Bold" },
                          ]}
                        >
                          {sumValue !== undefined
                            ? formatDecimal(sumValue)
                            : colIdx === 1
                            ? "Total"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : salesReportData?.reportTypeName === "customerBillsAndCollectionAnalysisLv2CustomerName" ? (
          <View style={styles.table}>
            {/* Loop first-level group */}
            {Object.values(data?.rows || {}).map((firstGroup: any) => (
              <View key={firstGroup.group}  style={{ marginBottom: 6 }} wrap={false}>
                <Text style={styles.groupTitle}>
                  {`Customer Code: ${firstGroup.group}`}
                </Text>

                {/* Loop second-level group*/}
                {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                  <View key={secondGroup.group}>
                    <Text style={styles.groupTitle}>
                      {`Customer Name: ${secondGroup.group}`}
                      {/* {salesReportData?.reportTypeName === "yearlySalesAnalysisLv2ItemCode" 
                        ? `Item Code: ${secondGroup.group}`
                        : `Doc No: ${secondGroup.group}`} */}
                    </Text>

                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      {(salesReportColumns ?? []).map((col, idx) => (
                        <Text
                          key={idx}
                          style={col.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                        >
                          {col.header}
                        </Text>
                      ))}
                    </View>

                    {/* Table Rows */}
                    {/* {secondGroup.rows.map((row: any, rowIdx: number) => (
                      <View key={rowIdx} style={styles.tableRow}>
                        {(salesReportColumns ?? []).map((column, colIdx) => {
                          const value = row[column.accessorKey];
                          return (
                            <Text
                              key={colIdx}
                              style={column.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                            >
                              {column.header === "No"
                                ? rowIdx + 1
                                : typeof value === "number" || column.header.toLowerCase().includes("price")
                                ? formatDecimal(value)
                                : value || ""}
                            </Text>
                          );
                        })}
                      </View>
                    ))} */}

                    {/* Table Rows */}
                    {(() => {
                      const rows = secondGroup.invoices || secondGroup.items || secondGroup.rows || [];

                      // // Define which columns to sum
                      // const columnsToSum = ["quantity", "amount", "totalPrice"]; // <-- change as needed

                      // // Compute sums
                      // const columnSums: Record<string, number> = {};
                      // columnsToSum.forEach((key) => {
                      //   columnSums[key] = rows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
                      // });

                      // Static keys to always sum
                      const staticSumKeys = ["totalSalesAmount", "totalLocalSalesAmount", "totalCollectionAmount", "totalLocalCollectionAmount",];

                      // Dynamic prefix patterns
                      const sumPrefixes = [
                        "sales_",
                        "localSales_",
                        "collection_",
                        "localCollection_",
                      ];

                      // Compute sums
                      const columnSums: Record<string, number> = {};

                      (salesReportColumns ?? []).forEach((column) => {
                        const accessor = column.accessorKey;

                        // Check if the column is in the static list or matches a dynamic prefix
                        const shouldSum =
                          staticSumKeys.includes(accessor) ||
                          sumPrefixes.some((prefix) => accessor?.startsWith(prefix));

                        if (shouldSum) {
                          columnSums[accessor] = rows.reduce(
                            (sum, row) => sum + (parseFloat(row[accessor]) || 0),
                            0
                          );
                        }
                      });

                      return (
                        <>
                          {rows.map((row: any, rowIdx: number) => (
                            <View
                              key={rowIdx}
                              style={[styles.tableRow, { borderColor: "#000" }]}
                            >
                              {(salesReportColumns ?? []).map((column, colIdx) => {
                                const value = row[column.accessorKey];
                                // return (
                                //   <Text
                                //     key={colIdx}
                                //     style={
                                //       column.header === "No"
                                //         ? getTableCellNoStyles()
                                //         : getTableCellStyles()
                                //     }
                                //   >
                                //     {column.header === "No"
                                //       ? rowIdx + 1
                                //       : typeof value === "number" ||
                                //         column.header.toLowerCase().includes("price")
                                //         ? formatDecimal(value)
                                //         : value || ""}
                                //   </Text>
                                // );

                                // Static columns you always want formatted as amount
                                const amountColumns = ["Total Sales Amount", "Total Sales Amount (Local)", "Total Collection Amount", "Total Collection Amount (Local)",];

                                // Dynamic check: columns starting with "SL" or "Col"
                                const isDynamicAmount = /^(SL|Col)\s/i.test(column.header);

                                // Unified condition
                                const isAmountColumn =
                                  amountColumns.includes(column.header) || isDynamicAmount;

                                const displayValue =
                                  column.header === "No"
                                    ? rowIdx + 1
                                    : isAmountColumn
                                    ? formatDecimal(value)
                                    : typeof value === "string"
                                    ? insertZeroWidthSpace(value, orientation)
                                    : value || "";

                                return (
                                  <Text
                                    key={colIdx}
                                    style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                  >
                                    {displayValue}
                                  </Text>
                                );
                              })}
                            </View>
                          ))}

                          {/* Total Row */}
                          <View style={[styles.tableRow, { borderColor: "#000" }]}>
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const accessor = column.accessorKey;
                              const sumValue = columnSums[accessor];

                              return (
                                <Text
                                  key={colIdx}
                                  style={[
                                    column.header === "No"
                                      ? getTableCellNoStyles()
                                      : getTableCellStyles(),
                                    { fontFamily: "Helvetica-Bold" },
                                  ]}
                                >
                                  {sumValue !== undefined
                                    ? formatDecimal(sumValue)
                                    : colIdx === 2
                                    ? "Total"
                                    : ""}
                                </Text>
                              );
                            })}
                          </View>
                        </>
                      );
                    })()}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : salesReportData?.reportTypeName === "customerPostDatedChequeListingLv2CustomerName" ? (
          <View style={styles.table}>
            {/* Loop first-level group */}
            {Object.values(data?.rows || {}).map((firstGroup: any) => (
              <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                  {`Date: ${firstGroup.group}`}
                </Text>

                {/* Loop second-level group*/}
                {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                  <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                      {`Doc No: ${secondGroup.group}`}
                      {/* {salesReportData?.reportTypeName === "yearlySalesAnalysisLv2ItemCode" 
                        ? `Item Code: ${secondGroup.group}`
                        : `Doc No: ${secondGroup.group}`} */}
                    </Text>

                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      {(salesReportColumns ?? []).map((col, idx) => (
                        <Text
                          key={idx}
                          style={col.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                        >
                          {col.header}
                        </Text>
                      ))}
                    </View>

                    {/* Table Rows */}
                    {secondGroup.items.map((row: any, rowIdx: number) => (
                      <View key={rowIdx} style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}>
                        {(salesReportColumns ?? []).map((column, colIdx) => {
                          const value = row[column.accessorKey];
                          return (
                            <Text
                              key={colIdx}
                              style={column.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                            >
                              {column.header === "No"
                                ? rowIdx + 1
                                : typeof value === "number" || column.header.toLowerCase().includes("price")
                                ? formatDecimal(value)
                                : value || ""}
                            </Text>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : salesReportData?.reportTypeName === "customerDueSalesInvoiceListingLv1TaxDate" ||
            salesReportData?.reportTypeName === "customerDueSalesDebitNoteListingLv1TaxDate" ||
            salesReportData?.reportTypeName === "cashSalesListingLv1"? (
          <View style={styles.table}>
            {/* Loop through date groups */}
            {Object.entries(rows || {}).map(([dateKey, items], dateIndex) => {
              // --- Normalize `items` so it's always an array
              const normalizedItems = Array.isArray(items)
                ? items
                : Object.values(items || {}).flatMap((v: any) =>
                    v && typeof v === "object"
                      ? v.rows || v.invoices || v.items || []
                      : []
                  );

              // --- Define which columns to sum
              const columnsToSum = [
                "netTotal",
                "totalTax",
                "outstandingAmount",
              ]; // adjust to your accessorKeys

              // --- Compute sums for this date group
              const columnSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                columnSums[key] = normalizedItems.reduce(
                  (sum, row) => sum + (parseFloat(row[key]) || 0),
                  0
                );
              });

              return (
                <View wrap={false} style={{ marginBottom: 6 }} key={dateKey}>
                  {/* Date Group Header */}
                  <Text style={styles.groupTitle}>{`Date: ${dateKey}`}</Text>

                  {/* Render Table Header */}
                  <View>{renderTableHeader()}</View>

                  {/* Table Rows */}
                  {Array.isArray(normalizedItems) && normalizedItems.length > 0 ? (
                    <>
                      {normalizedItems.map((item, rowIndex) => (
                        <View
                          style={styles.tableRow}
                          wrap={false}
                          key={item.UUID || `${dateKey}-${rowIndex}`}
                        >
                          {salesReportColumns?.map((column, colIndex) => (
                            <Text
                              key={colIndex}
                              style={
                                column.header === "No"
                                  ? getTableCellNoStyles()
                                  : getTableCellStyles()
                              }
                            >
                              {column.header === "No"
                                ? rowIndex + 1
                                : isSalesOrCollectionColumn(
                                    column,
                                    item[column.accessorKey]
                                  )
                                ? formatDecimal(item[column.accessorKey])
                                : [
                                    "Local Amount",
                                    "Tax Amount",
                                    "Local Outstanding Amount",
                                  ].includes(column.header)
                                ? formatDecimal(item[column.accessorKey])
                                : typeof item[column.accessorKey] === "string"
                                ? insertZeroWidthSpace(
                                    item[column.accessorKey],
                                    orientation
                                  )
                                : item[column.accessorKey]}
                            </Text>
                          ))}
                        </View>
                      ))}

                      {/* Total Row */}
                      <View
                        style={[
                          styles.tableRow,
                          {
                            borderColor: "#000",
                          },
                        ]}
                      >
                        {salesReportColumns?.map((column, colIndex) => {
                          const accessor = column.accessorKey;
                          const sumValue = columnSums[accessor];

                          return (
                            <Text
                              key={colIndex}
                              style={[
                                column.header === "No"
                                  ? getTableCellNoStyles()
                                  : getTableCellStyles(),
                                { fontFamily: "Helvetica-Bold" },
                              ]}
                            >
                              {sumValue !== undefined
                                ? formatDecimal(sumValue)
                                : colIndex === 1
                                ? "Total"
                                : ""}
                            </Text>
                          );
                        })}
                      </View>
                    </>
                  ) : (
                    <View style={styles.tableRow} wrap={false}>
                      <Text
                        style={{
                          fontSize: orientation === "landscape" ? 7 : 8,
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        No Result
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
            {/* No data fallback */}
            {(!rows || Object.keys(rows).length === 0) && (
              <View style={styles.tableRow} wrap={false}>
                <Text
                  style={{
                    fontSize: orientation === "landscape" ? 7 : 8,
                    textAlign: "center",
                    width: "100%",
                  }}
                >
                  No Result
                </Text>
              </View>
            )}
          </View>
        ) : salesReportData?.reportTypeName === "salesDeliveryOrderListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "salesQuotationListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "cashSalesListingMultiLv2" ||
            salesReportData?.reportTypeName === "salesCreditNoteListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "salesDebitNoteListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "salesInvoiceListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "salesOrderListingMultiLv2DocNo" ||
            salesReportData?.reportTypeName === "salesPriceHistoryReportListingLv2" ?(
          <View style={styles.table}>
            {Object.values(data?.rows || {}).map((firstGroup: any) => {
              // --- Accumulate totals for the whole firstGroup (Date)
              const groupRows = Object.values(firstGroup.rows || {}).flatMap(
                (secondGroup: any) => secondGroup.invoices || secondGroup.items || secondGroup.rows || []
              );

              // Define columns to sum
              const columnsToSum = ["totalAmount", "amount", "totalPrice"]; // adjust to your columns

              // Compute totals
              const groupSums: Record<string, number> = {};
              columnsToSum.forEach((key) => {
                groupSums[key] = groupRows.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
              });

              return (
                <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                    {`Date: ${firstGroup.group}`}
                  </Text>

                  {/* Second-Level Groups */}
                  {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                    <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                      <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                        {`Doc No: ${secondGroup.group}`}
                      </Text>

                      {/* Table Header */}
                      <View style={[styles.tableRow, styles.tableHeader]}>
                        {(salesReportColumns ?? []).map((col, idx) => (
                          <Text
                            key={idx}
                            style={col.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                          >
                            {col.header}
                          </Text>
                        ))}
                      </View>

                      {/* Table Rows */}
                      {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map(
                        (row: any, rowIdx: number) => (
                          <View
                            key={rowIdx}
                            style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}
                          >
                            {(salesReportColumns ?? []).map((column, colIdx) => {
                              const value = row[column.accessorKey];

                              // List of numeric/amount columns
                              const amountColumns = [
                                "Amount", "Amount Paid"
                              ];

                              const displayValue =
                                column.header === "No"
                                  ? rowIdx + 1
                                  : amountColumns.includes(column.header)
                                  ? formatDecimal(value)
                                  : typeof value === "string"
                                  ? insertZeroWidthSpace(value, orientation)
                                  : value || "";

                              return (
                                <Text
                                  key={colIdx}
                                  style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                                >
                                  {displayValue}
                                </Text>
                              );
                            })}
                          </View>
                        )
                      )}
                    </View>
                  ))}

                  {/* Group-Level Total Row */}
                  <View
                    style={[
                      styles.tableRow,
                      { borderTopWidth: 1, borderColor: "#000" },
                    ]}
                  >
                    {(salesReportColumns ?? []).map((column, colIdx) => {
                      const accessor = column.accessorKey;
                      const sumValue = groupSums[accessor];

                      return (
                        <Text
                          key={colIdx}
                          style={[
                            column.header === "No" ? getTableCellNoStyles() : getTableCellStyles(),
                            { fontFamily: "Helvetica-Bold" },
                          ]}
                        >
                          {sumValue !== undefined
                            ? formatDecimal(sumValue)
                            : colIdx === 1
                            ? "Total"
                            : ""}
                        </Text>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        ) : salesReportData?.reportTypeName === "salesProfitLossReportListingLv2"  ?(
          <View style={styles.table}>
            {/* Loop first-level group */}
            {Object.values(data?.rows || {}).map((firstGroup: any) => (
              <View key={firstGroup.group} style={{ marginBottom: 10 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 2 }}>
                  {`Date: ${firstGroup.group}`}
                </Text>

                {/* Loop second-level group*/}
                {Object.values(firstGroup.rows || {}).map((secondGroup: any) => (
                  <View key={secondGroup.group} style={{ marginBottom: 6 }}>
                    <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 8, marginBottom: 2 }}>
                      {`Doc No: ${secondGroup.group}`}
                      {/* {salesReportData?.reportTypeName === "yearlySalesAnalysisLv2ItemCode" 
                        ? `Item Code: ${secondGroup.group}`
                        : `Doc No: ${secondGroup.group}`} */}
                    </Text>

                    {/* Table Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                      {(salesReportColumns ?? []).map((col, idx) => (
                        <Text
                          key={idx}
                          style={col.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                        >
                          {col.header}
                        </Text>
                      ))}
                    </View>

                    {/* Table Rows */}
                    {(secondGroup.invoices || secondGroup.items || secondGroup.rows || []).map((row: any, rowIdx: number) => (
                      <View key={rowIdx} style={[styles.tableRow, { borderBottomWidth: 1, borderColor: "#000" }]}>
                        {(salesReportColumns ?? []).map((column, colIdx) => {
                          const value = row[column.accessorKey];
                          return (
                            <Text
                              key={colIdx}
                              style={column.header === "No"? getTableCellNoStyles(): getTableCellStyles()}
                            >
                              {column.header === "No"
                                ? rowIdx + 1
                                : typeof value === "number" || column.header.toLowerCase().includes("price")
                                ? formatDecimal(value)
                                : value || ""}
                            </Text>
                          );
                        })}
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : salesReportData?.reportTypeName === "bankDetailsRequestForm1" ? (
          data?.rows?.map((customer, index) => (
            <View
              key={index}
              style={{ marginTop: index > 0 ? 12 : 0 }}
              break={index > 0} // start new page for next customer
            >
              {/* BANKING INFORMATION */}
              <View style={styles.bankTable}>
                <View style={[styles.bankTableRow, styles.bankHeaderRow]}>
                  <Text style={styles.bankHeaderText}>BANKING INFORMATION</Text>
                </View>

                {[
                  "COMPANY / PAYEE NAME",
                  "ROC REGISTERED WITH BANK / IC NO. / PASSPORT NO.",
                  "BANK NAME",
                  "ACCOUNT NUMBER",
                  "BANK BENEFICIARY NAME",
                  "SWIFT CODE",
                  "BANK BRANCH ADDRESS",
                ].map((label, i) => {
                  const field = customer?.customerHasCustomInfos?.find(
                    (info) => info.fieldName?.toLowerCase() === label.toLowerCase()
                  );

                  let value = "";
                  if (label === "COMPANY / PAYEE NAME") value = customer?.customerName ?? "";
                  else value = field?.fieldValue ?? "";

                  return (
                    <View key={i} style={styles.bankTableRow}>
                      <View style={[styles.bankTableCell, { flex: 2, backgroundColor: "#e6e6e6" }]}>
                        <Text>{label}</Text>
                      </View>
                      <View
                        style={[styles.bankTableCell, styles.noBorderLeft, { flex: 3 }]}
                      >
                        <Text>{value || ""}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              {/* PAYMENT NOTIFICATION */}
              <View style={[styles.bankTable, { marginTop: 15 }]}>
                <View style={[styles.bankTableRow, styles.bankHeaderRow]}>
                  <Text style={styles.bankHeaderText}>PAYMENT NOTIFICATION</Text>
                </View>

                {/* Row: Name / Designation */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>NAME</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>DESIGNATION</Text>
                  </View>
                </View>

                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>

                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>

                {/* Row: Email / Telephone */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>EMAIL ADDRESS</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>TELEPHONE</Text>
                  </View>
                </View>

                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>

                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>
              </View>

              {/* ACKNOWLEDGEMENT & DECLARATION */}
              <View style={[styles.bankTable, { marginTop: 15 }]}>
                <View style={[styles.bankTableRow, styles.bankHeaderRow]}>
                  <Text style={styles.bankHeaderText}>ACKNOWLEDGEMENT & DECLARATION*</Text>
                </View>

                {/* Row 1: Name */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>NAME</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>

                {/* Row 2: Designation */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>DESIGNATION</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>                
                </View>

                {/* Row 3: Signature / Company Stamp */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, height: 60, backgroundColor: "#e6e6e6" }]}>
                    <Text>SIGNATURE</Text>
                  </View>
                  <View style={[styles.bankTableCell, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>COMPANY STAMP</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>                
                </View>

                {/* Row 4: Date */}
                <View style={styles.bankTableRow}>
                  <View style={[styles.bankTableCell, { flex: 1, backgroundColor: "#e6e6e6" }]}>
                    <Text>DATE</Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.bankTableCell, styles.noBorderLeft, { flex: 1 }]}>
                    <Text></Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : salesReportData?.reportTypeName === "custLocalPaymentListingCollection" ? (
          <View style={styles.table}>
            {/* Loop through each agent group */}
            {Array.isArray(rows) && rows.length > 0 ? (
              rows.map((agentGroup, agentIndex) => (
                <View wrap={false} style={{ marginBottom: 6 }} key={agentGroup.agent?.salesAgent || agentIndex}>
                  {/* Agent Group Header */}
                  <Text style={styles.groupTitle}>
                    {`Agent: ${agentGroup.agent?.salesAgentName || "Unknown Agent"}`}
                  </Text>

                  {/* Render Table Header */}
                  <View>{renderTableHeader()}</View>

                  {/* Loop through each row under this agent */}
                  {Array.isArray(agentGroup.rows) && agentGroup.rows.length > 0 ? (
                    agentGroup.rows.map((item, rowIndex) => (
                      <View
                        style={styles.tableRow}
                        wrap={false}
                        key={item.UUID || `${agentGroup.agent?.salesAgent}-${rowIndex}`}
                      >
                        {salesReportColumns?.map((column, colIndex) => (
                          <Text
                            key={colIndex}
                            style={
                              column.header === "No"
                                ? getTableCellNoStyles()
                                : getTableCellStyles()
                            }
                          >
                            {column.header === "No"
                              ? rowIndex + 1
                              : isSalesOrCollectionColumn(column, item[column.accessorKey])
                              ? formatDecimal(item[column.accessorKey])
                              : [
                                  "Invoice Amount",
                                  "Amount Paid",
                                  "Balance",
                                  "Tax",
                                  "Total",
                                  "Subtotal (Tax)",
                                  "Discount",
                                  "Subtotal (After Discount)",
                                  "Amount Received",
                                  "Paid Amount",
                                  "Amount",
                                  "Unapplied",
                                  "Knock Off Amount",
                                  "Total Sales Amount",
                                  "Total Sales Amount (Local)",
                                  "Total Collection Amount",
                                  "Total Collection Amount (Local)",
                                  "Invoice",
                                  "Item Price",
                                  "Item Cost",
                                  "Item P/L",
                                  "Profit/(Loss)",
                                  "Cost",
                                ].includes(column.header)
                              ? formatDecimal(item[column.accessorKey])
                              : typeof item[column.accessorKey] === "string"
                              ? insertZeroWidthSpace(item[column.accessorKey], orientation)
                              : item[column.accessorKey]}
                          </Text>
                        ))}
                      </View>
                    ))
                  ) : (
                    // No result under this agent
                    <View style={styles.tableRow} wrap={false}>
                      <Text
                        style={{
                          fontSize: orientation === "landscape" ? 7 : 8,
                          textAlign: "center",
                          width: "100%",
                        }}
                      >
                        No Result
                      </Text>
                    </View>
                  )}
                </View>
              ))
            ) : (
              <>
                {/* No data fallback */}
                {/* Render Table Header */}
                <View>{renderTableHeader()}</View>

                <View style={styles.tableRow} wrap={false}>
                  <Text
                    style={{
                      fontSize: orientation === "landscape" ? 7 : 8,
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    No Result
                  </Text>
                </View>
              </>
            )}
          </View>
        ) : (  
          // Default Table
          <View style={styles.table}>
            <View fixed>{renderTableHeader()}</View>
            
            {/* Table Rows */}
            {rows.length > 0 ? (
              rows.map((item, rowIndex) => {
                if (isLevel2) {
                  return <React.Fragment key={rowIndex}>{renderLevel2Row(item)}</React.Fragment>;
                }

                return (
                  <View style={styles.tableRow} key={item.UUID || rowIndex} wrap={false}>
                    {salesReportColumns?.map((column, colIndex) => (
                      <Text
                        key={colIndex}
                        style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                      >
                        {column.header === "No"
                          ? rowIndex + 1
                          : isSalesOrCollectionColumn(column, item[column.accessorKey])
                            ? formatDecimal(item[column.accessorKey])
                            : [
                                "Invoice Amount",
                                "Amount Paid",
                                "Balance",
                                "Tax",
                                "Total",
                                "Subtotal (Tax)",
                                "Discount",
                                "Subtotal (After Discount)",
                                "Amount Received",
                                "Paid Amount",
                                "Amount",
                                "Unapplied",
                                "Knock Off Amount",
                                "Total Sales Amount",
                                "Total Sales Amount (Local)",
                                "Total Collection Amount",
                                "Total Collection Amount (Local)",
                                "Invoice",
                                "Item Price",
                                "Item Cost",
                                "Item P/L",
                                "Profit/(Loss)",
                                "Cost",
                                "B/F Balance",
                                "Local B/F Bal.",
                                "Current Balance",
                                "C/F Balance",
                                "Local C/F Bal.",
                                "Doc Amount",
                                "Local Amount",
                                "Pay MTD",
                                "Current Month",
                                "1 Month",
                                "2 Months",
                                "3 Months",
                                "4 Months",
                                "5 Months & Above",
                              ].includes(column.header)
                              ? formatDecimal(item[column.accessorKey])
                              : typeof item[column.accessorKey] === "string"
                                ? insertZeroWidthSpace(item[column.accessorKey], orientation)
                                : item[column.accessorKey]}
                      </Text>
                    ))}
                  </View>
                );
              })
            ) : (
              <View style={styles.tableRow} wrap={false}>
                <Text style={{ fontSize: orientation === 'landscape' ? 7 : 8, textAlign: "center", width: "100%" }}>
                  No Result
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Summary Box: Only render on last page with full design */}
        {(type !== "Customer Bills And Collection Analysis" && salesReportData?.reportTypeName !== "bankDetailsRequestForm1") && (
          <View
            render={({ pageNumber, totalPages }) =>
              pageNumber === totalPages ? renderSummaryBox() : null
            }
            style={{ width: "100%" }}
          />
        )}

        {/* Footer (fixed on every page) */}
        <View fixed style={styles.footerContainer}>
          <View style={styles.footerLine} />
          <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5 }}>
            <Text style={styles.footerText}>
              Generated: {moment().format("DD-MM-YYYY hh:mm:ss A")}
            </Text>
            <Text
              style={styles.footerText}
              render={({ pageNumber, totalPages }) =>
                `Page ${pageNumber} of ${totalPages}`
              }
            />
          </View>
        </View>
      </Page>

      {/* Special case for Customer Bills And Collection Analysis */}
      {(type === "Customer Bills And Collection Analysis" || salesReportData?.reportTypeName === "customerBillsAndCollectionAnalysisLv2CustomerName") && (
        <Page size="A4" orientation={orientation} style={{...getPageStyles(), paddingBottom: 55,}}>
          <View fixed>{renderHeader()}</View>

          <View style={{ marginTop: 5 }}>{renderSummaryBox()}</View>

          <View fixed style={styles.footerContainer}>
            <View style={styles.footerLine} />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 5,
              }}
            >
              <Text style={styles.footerText}>
                Generated: {moment().format("DD-MM-YYYY hh:mm:ss A")}
              </Text>
              <Text
                style={styles.footerText}
                render={({ pageNumber, totalPages }) =>
                  `Page ${pageNumber} of ${totalPages}`
                }
              />
            </View>
          </View>
        </Page>
      )}
    </Document>
  );


};

export default SalesReport;

function insertZeroWidthSpace(str: string, orientation: 'portrait' | 'landscape') {
  const charLimit = orientation === 'landscape' ? 18 : 12; // Allow more characters in landscape

  if (!str) return "";

  // For long numbers only
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