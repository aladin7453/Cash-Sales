import { Document, Font, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import moment from "moment";
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
        fontFamily: "NotoSansSC",
    },
    logoContainer: {
        position: "absolute",
        top: 50,
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
        marginTop: 10,
        marginBottom: 5,
    },
    table: {
        width: "100%",
        marginTop: 5,
        marginBottom: 10,
        // borderStyle: "solid",
        // borderColor: "#000000",
    },
    tableRow: {
        flexDirection: "row",
        // borderBottomWidth: 1,
        borderColor: "#000000",
        padding: 3
    },
    tableRowHeader: {
        flexDirection: "row",
        // borderBottomWidth: 1,
        // borderColor: "#000000",

    },
    tableHeader: {
        // backgroundColor: "#deebf7",
        // borderTopWidth: 1,
        // fontWeight: "bold",
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
    tableCellHeader: {
        padding: 5,
        fontSize: 7,
        flex: 4,
        textAlign: "center",
        // borderRightWidth: 1,
        borderColor: "#000000",
        borderTopWidth:1,
        borderBottomWidth:1
    },
    groupTitle: {
        fontSize: 7,
        fontWeight: "bold",
        marginTop: 5,
    },
    summaryBox: {
        backgroundColor: "#deebf7",
        padding: 10,
        marginTop: 10,
        borderRadius: 2,
    },
    summaryText: {
        fontSize: 7,
    },
    summaryTextValue: {
        fontSize: 7,
        textAlign: "right",
    },
    summaryTitle: {
        fontSize: 8,
        fontWeight: "bold",
    },
    summaryField: {
        backgroundColor: "#FFFFFF",
        padding: 3,
        marginTop: 2,
        borderWidth: 1,
        borderRadius: 3,
        borderColor: "#CCCCCC",
        width: 100,
        height: 19,
    },
    // Add new styles for summary table
    summaryTable: {
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
        borderStyle: "dashed",
        borderColor: "#000000",
    },
    summaryTableRow: {
        flexDirection: "row",
        borderStyle: "dashed",
        borderBottomWidth: 1,
        borderColor: "#000000",
    },
    summaryTableHeader: {
        backgroundColor: "#f0f0f0",
        borderStyle: "dashed",
        borderTopWidth: 1,
        fontWeight: "bold",
    },
    summaryTableCell: {
        padding: 2,
        fontSize: 6,
        flex: 1,
        textAlign: "center",
        borderStyle: "dashed",
        borderLeftWidth: 1,
        borderColor: "#000000",
    },
    summaryTableCellLast: {
        padding: 2,
        fontSize: 6,
        flex: 1,
        textAlign: "center",
        borderStyle: "dashed",
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderColor: "#000000",
    },
    totalItemsText: {
        fontSize: 6,
        textAlign: "right",
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

const styles2 = StyleSheet.create({
    table: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#000",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableHeader: {
        backgroundColor: "#f0f0f0",
        fontWeight: "bold",
    },
    cell: {
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#000",
        padding: 4,
        fontSize: 8,
        flexWrap: "wrap",
    },
    center: {
        textAlign: "center",
    },
    right: {
        textAlign: "right",
    },
});

function renderHeader(
    data,
    type,
    stockReportData,
    styles,
    image64,
    formatDateRange,
    formatEndDateRange,
    orientation,
    getHeaderStyles,
    getFirstSeparatorStyles,
) {


    // Generate dynamic title for Stock Document Listing Report
    const getReportTitle = () => {
        if (type === "Stock Document Listing Report" && stockReportData?.docType) {
            const docTypeMap = {
                stockReceivedDefault: "Stock Received",
                stockReceived: "Stock Received",
                stockReceivedLv1Date: "Stock Received",
                stockReceivedLv1DocNo: "Stock Received",
                stockIssuedDefault: "Stock Issued",
                stockIssued: "Stock Issued",
                stockIssuedLv1Date: "Stock Issued",
                stockIssuedLv1DocNo: "Stock Issued",
                stockTransfer: "Stock Transfer",
                stockTransferActualAmount: "Stock Transfer",
                stockTransferDefault: "Stock Transfer",
                stockTransferLv1Date: "Stock Transfer",
                stockTransferLv1DocNo: "Stock Transfer",
                stockTransferActualAmountLv1Date: "Stock Transfer",
                stockTransferActualAmountLv1DocNo: "Stock Transfer",
                stockAdjustmentDefault: "Stock Adjustment",
                stockAdjustment: "Stock Adjustment",
                stockAdjustmentLv1Date: "Stock Adjustment",
                stockAdjustmentLv1DocNo: "Stock Adjustment",
            };
            const docTypeName = docTypeMap[stockReportData.docType] || stockReportData.docType;
            return `${docTypeName} Listing`.toUpperCase();
        }

        return `${type.toUpperCase()}`;
    };

    // console.log(formatEndDateRange)
    // console.log(formatDateRange)

    return (
        <>
            {/* <View style={getHeaderStyles()}>
        <Text>
          {data?.currentCompany?.company ?? ""}
          {data?.currentCompany?.BRN ? ` (${data?.currentCompany?.BRN})` : " "}
        </Text>
        <Text style={styles.headerText}>{data?.currentCompany?.address ?? " "}</Text>
        <View style={styles.headerRow}>
          {data?.currentCompany?.phoneNo ? (
            <Text style={styles.headerText}>Phone No.: {data?.currentCompany?.phoneNo}</Text>
          ) : (
            <Text style={styles.headerText}> </Text>
          )}
          {data?.currentCompany?.email ? (
            <Text style={styles.headerText}>Email: {data?.currentCompany?.email}</Text>
          ) : (
            <Text style={styles.headerText}> </Text>
          )}
        </View>
      </View>
      <View>
        <View style={getFirstSeparatorStyles()} />
      </View> */}
            <View>
                <Text style={[styles.sectionTitle, { textAlign: "center" }]}>{`${getReportTitle()} \nAs At ${formatEndDateRange()}`}</Text>
            </View>
            <View>
                <Text style={{ fontSize: orientation === "landscape" ? 6 : 7, textAlign: "left" }}>
                    {data?.currentCompany?.company ?? ""}
                    {data?.currentCompany?.BRN ? ` (${data?.currentCompany?.BRN})` : " "}
                </Text>
            </View>


            <View style={{ marginTop: orientation === "landscape" ? 20 : 40 }}>
                <Text style={{ fontSize: orientation === "landscape" ? 6 : 7, textAlign: "left" }}>
                    Generated By: {data?.currentUser ?? data?.currentCompany?.currentUser ?? ""}
                </Text>
                <Text style={{ fontSize: orientation === "landscape" ? 6 : 7, textAlign: "left" }}>
                    Date Range: {formatDateRange()}
                </Text>
            </View>
        </>
    );
}

function renderFooter(styles) {
    return (
        <View fixed style={styles.footerContainer}>
            <View style={styles.footerLine} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingTop: 5 }}>
                <Text style={styles.footerText}>Date Generated: {moment().format("DD-MM-YYYY")}</Text>
                <Text
                    style={styles.footerText}
                    render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
                />
            </View>
        </View>
    );
}

const StockReport = ({
    type,
    data,
    stockReportData,
    generatedReport,
    stockReportColumns,
    orientation = "portrait",
    reportDate,
}: {
    type: string;
    data?: any;
    stockReportData?: any;
    generatedReport;
    stockReportColumns?: any[];
    orientation?: "portrait" | "landscape";
    reportDate?: string | number;
}) => {
    let image64 = data?.currentCompany?.logoLink[0]?.base64;

    // Format the date range
    const formatDateRange = () => {
        // Use reportDate if provided, otherwise fall back to existing logic
        if (reportDate) {
            // Handle both unix timestamp (number/string) and date string formats
            const dateValue =
                typeof reportDate === "string" && !isNaN(Number(reportDate))
                    ? Number(reportDate)
                    : reportDate;

            const formattedDate =
                typeof dateValue === "number"
                    ? moment.unix(dateValue).format("DD-MM-YYYY")
                    : moment(dateValue).format("DD-MM-YYYY");

            return `${formattedDate}`;
        }

        // Existing date range logic for backward compatibility
        const startDate = stockReportData?.startDate || stockReportData?.expiryStartDate;
        const endDate = stockReportData?.endDate || stockReportData?.expiryEndDate;

        if (!startDate || !endDate) return "";

        const formattedStartDate = moment.unix(Number(startDate)).format("DD-MM-YYYY");
        const formattedEndDate = moment.unix(Number(endDate)).format("DD-MM-YYYY");

        return `${formattedStartDate} to ${formattedEndDate}`;
    };

    // Format the date range
    const formatEndDateRange = () => {
        // Use reportDate if provided, otherwise fall back to existing logic
        if (reportDate) {
            // Handle both unix timestamp (number/string) and date string formats
            const dateValue =
                typeof reportDate === "string" && !isNaN(Number(reportDate))
                    ? Number(reportDate)
                    : reportDate;

            const formattedDate =
                typeof dateValue === "number"
                    ? moment.unix(dateValue).format("DD-MM-YYYY")
                    : moment(dateValue).format("DD-MM-YYYY");

            return `${formattedDate}`;
        }

        // Existing date range logic for backward compatibility
        const startDate = stockReportData?.startDate || stockReportData?.expiryStartDate;
        const endDate = stockReportData?.endDate || stockReportData?.expiryEndDate;

        if (!startDate || !endDate) return "";

        const formattedStartDate = moment.unix(Number(startDate)).format("DD-MM-YYYY");
        const formattedEndDate = moment.unix(Number(endDate)).format("DD-MM-YYYY");

        return `${formattedEndDate}`;
    };




    const headerColumn = ["Date", "Doc No", "Description", "Price/Cost", "Qty In", "Qty Out", "Bal Qty", "Qty", "Cost", "Total Cost"]


    // Dynamic styles based on orientation
    const getPageStyles = () => ({
        ...styles.page,
        padding: orientation === "landscape" ? 20 : 30,
    });

    const getTableCellStyles = () => ({
        ...styles.tableCell,
        fontSize: orientation === "landscape" ? 6 : 7,
        padding: orientation === "landscape" ? 3 : 5,
    });

    const getTableCellStyles2 = () => ({
        ...styles.tableCellHeader,
        fontSize: orientation === "landscape" ? 6 : 7,
        padding: orientation === "landscape" ? 3 : 5,
    });

    const getTableCellNoStyles = () => ({
        ...styles.tableCellNo,
        fontSize: orientation === "landscape" ? 6 : 7,
        padding: orientation === "landscape" ? 3 : 5,
    });

    const getHeaderStyles = () => ({
        ...styles.header,
        fontSize: orientation === "landscape" ? 8 : 9,
        marginLeft: orientation === "landscape" ? 120 : 120,
    });

    const getLogoStyles = () => ({
        ...styles.logoContainer,
        width: orientation === "landscape" ? 80 : 100,
        height: orientation === "landscape" ? 80 : 100,
        top: orientation === "landscape" ? 20 : 30,
        left: orientation === "landscape" ? 20 : 30,
    });

    const getLogoImageStyles = () => ({
        ...styles.logoImage,
        width: orientation === "landscape" ? 80 : 100,
        height: orientation === "landscape" ? 80 : 100,
    });

    const getSummaryStyles = () => ({
        ...styles.summaryBox,
        padding: orientation === "landscape" ? 5 : 10,
    });

    const getFirstSeparatorStyles = () => ({
        ...styles.firstSeparator,
        marginTop: orientation === "landscape" ? 30 : 60,
    });

    const totalQuantity = Number(data?.summary?.totalQuantity) || 0;
    const totalVarianceQuantity = Number(data?.summary?.totalVarianceQuantity) || 0;
    const totalNoOfDocuments = data?.total;
    const rows = data?.rows;
    const hasTotalSubtotal = Array.isArray(rows) && rows.some((row) => "totalSubtotal" in row);
    const hasActualSubtotal = Array.isArray(rows) && rows.some((row) => "actualSubtotal" in row);
    const grandTotalSubtotal = hasTotalSubtotal
        ? rows.reduce((sum, row) => sum + Number(row.totalSubtotal || 0), 0)
        : 0;
    const formattedGrandTotalSubtotal = grandTotalSubtotal.toLocaleString("en-MY", {
        minimumFractionDigits: 2,
    });
    const grandActualSubtotal = hasActualSubtotal
        ? rows.reduce((sum, row) => sum + Number(row.actualSubtotal || 0), 0)
        : 0;
    const formattedGrandActualSubtotal = grandActualSubtotal.toLocaleString("en-MY", {
        minimumFractionDigits: 2,
    });
    const totalItems = data?.stockDetails?.total;

    const pageOrientation = orientation;

    // Generate dynamic document title for PDF
    const getDocumentTitle = () => {
        if (type === "Stock Document Listing Report" && stockReportData?.docType) {
            const docTypeMap = {
                stockReceivedDefault: "Stock Received",
                stockReceived: "Stock Received",
                stockReceivedLv1Date: "Stock Received",
                stockReceivedLv1DocNo: "Stock Received",
                stockIssuedDefault: "Stock Issued",
                stockIssued: "Stock Issued",
                stockIssuedLv1Date: "Stock Issued",
                stockIssuedLv1DocNo: "Stock Issued",
                stockTransfer: "Stock Transfer",
                stockTransferActualAmount: "Stock Transfer",
                stockTransferDefault: "Stock Transfer",
                stockTransferLv1Date: "Stock Transfer",
                stockTransferLv1DocNo: "Stock Transfer",
                stockTransferActualAmountLv1Date: "Stock Transfer",
                stockTransferActualAmountLv1DocNo: "Stock Transfer",
                stockAdjustmentDefault: "Stock Adjustment",
                stockAdjustment: "Stock Adjustment",
                stockAdjustmentLv1Date: "Stock Adjustment",
                stockAdjustmentLv1DocNo: "Stock Adjustment",
            };
            const docTypeName = docTypeMap[stockReportData.docType] || stockReportData.docType;
            return `${docTypeName} Listing`;
        }
        return type;
    };

    const hiddenColumnsByDocType: Record<string, string[]> = {
        stockReceivedLv1Date: ["postingDateFormat", "docDateFormat"],
        stockReceivedLv1DocNo: ["postingDateFormat", "docNo"],
        stockIssuedLv1Date: ["postingDateFormat", "docDateFormat"],
        stockIssuedLv1DocNo: ["postingDateFormat", "docNo"],
        stockTransfer: ["actualSubtotal"],
        stockTransferActualAmount: ["totalSubtotal"],
        stockTransferLv1Date: ["postingDateFormat", "docDateFormat", "actualSubtotal"],
        stockTransferLv1DocNo: ["postingDateFormat", "docNo", "actualSubtotal"],
        stockTransferActualAmountLv1Date: ["postingDateFormat", "docDateFormat", "totalSubtotal"],
        stockTransferActualAmountLv1DocNo: ["postingDateFormat", "docNo", "totalSubtotal"],
        stockAdjustmentLv1Date: ["postingDateFormat", "docDateFormat"],
        stockAdjustmentLv1DocNo: ["postingDateFormat", "docNo"],
        stockAgingLSLv3: ["locationCode", "stock", "stockBatchCode", "fiveMonthAndAbove"],
        stockAgingLSLv4StockGroup: [
            "locationCode",
            "stock",
            "stockBatchCode",
            "stockGroupCodeCode",
            "fiveMonthAndAbove",
        ],
        stockAgingLSLv4Category: [
            "locationCode",
            "stock",
            "stockBatchCode",
            "stockCategoryCodeCode",
            "fiveMonthAndAbove",
        ],
        stockSerialNumberConflictItemCode: ["stockCode"],
        stockReorderAdviceLv1: ["salesOrderQuantity", "purchaseOrderQuantity", "forecastQuantity"],
        "stockReorderAdviceLv3Location&Category": [
            "stockCode",
            "salesOrderQuantity",
            "purchaseOrderQuantity",
            "forecastQuantity",
        ],
        "stockReorderAdviceLv3POnSOLocation&Category": ["stockCode"],
        stockPhysicalWorksheetLv1: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "purchaseOrderQuantity",
            "salesOrderQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
        ],
        stockPhysicalWorksheetLv1POnSO: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
            "remark",
        ],
        stockPhysicalWorksheetLv1SerialNo: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "purchaseOrderQuantity",
            "salesOrderQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "remark",
        ],
        stockQtyBalanceLv1MultiUOM: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "purchaseOrderQuantity",
            "salesOrderQuantity",
            "physicalQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
            "remark",
        ],
        stockPhysicalWorksheetLv3: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "purchaseOrderQuantity",
            "salesOrderQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
        ],
        stockPhysicalWorksheetLv3Batch: [
            "stockGroupName",
            "systemQuantity",
            "availableQuantity",
            "purchaseOrderQuantity",
            "salesOrderQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
            "remark",
        ],
        stockPhysicalWorksheetLv3POnSO: [
            "stockGroupName",
            "stockBatchCode",
            "systemQuantity",
            "availableQuantity",
            "jobOrderQuantity",
            "forecastQuantity",
            "serialNumbers",
            "remark",
        ],
        stockMonthEndBalanceLv3: [
            "stockGroupName",
            "locationCode",
            "stockBatchCode",
            "stockBalanceQuantity",
        ],
        stockMonthEndBalanceLv4StockGroup: [
            "stockGroupName",
            "locationCode",
            "stockBatchCode",
            "stockBalanceQuantity",
        ],
    };

    const hiddenColumns = hiddenColumnsByDocType[stockReportData?.docType] ?? [];

    const COL = {
        itemCode: "15%",
        desc: "30%",
        qty: "8%",
        uom: "8%",
        loose: "10%",
        xRate: "5%",
        sqty: "12%",
        baseUom: "12%",
    };

    const STATIC_COL = {
        stockGroup: "12%",
        itemCode: "8%",
        desc: "18%",
        uom: "7%",
        grandTotal: "10%",
    };

    const asArray = (v) => (Array.isArray(v) ? v : Object.values(v || {}));

    console.log(stockReportColumns)

    const locations =
        type === "Stock Physical Worksheet" &&
            stockReportData?.docType === "stockPhysicalWorksheetLv2GroupLocationInColumn"
            ? Array.from(
                new Set(
                    Object.values(data?.rows || {}).flatMap((group: any) => Object.keys(group?.rows || {})),
                ),
            )
            : [];

    const LOCATION_TOTAL = 45;
    const locationColWidth = `${LOCATION_TOTAL / locations.length}%`;

    const normalizeGroupItems = (group: any) => {
        const itemMap: Record<string, any> = {};

        Object.entries(group.rows || {}).forEach(([location, locData]: any) => {
            const items = locData?.rows || [];
            items.forEach((item: any) => {
                if (!itemMap[item.stockCode]) {
                    itemMap[item.stockCode] = {
                        ...item,
                        locationQty: {},
                    };
                }

                itemMap[item.stockCode].locationQty[location] = Number(item.balanceQuantityQuantity) || 0;
            });
        });

        return Object.values(itemMap);
    };

    const breakLongText = (text, len = 5) => text.replace(new RegExp(`(.{${len}})`, "g"), "$1 ");

    return (
        <Document title={getDocumentTitle()}>
            <Page size="A4" orientation={pageOrientation} style={getPageStyles()} wrap>
                {/* Logo - absolute position, always at top left, fixed for every page */}

                {/* Header (fixed on every page) */}
                <View fixed>
                    {renderHeader(
                        data,
                        type,
                        stockReportData,
                        styles,
                        image64,
                        formatDateRange,
                        formatEndDateRange,
                        orientation,
                        getHeaderStyles,
                        getFirstSeparatorStyles,
                    )}
                </View>

                {/* Dynamic Table */}

                (
                <View style={styles.table} wrap>
                    {/* Table Header (fixed on every page) */}
                    <View fixed style={[styles.tableRowHeader]}>
                        {headerColumn?.map((column, index) => {
                            // if (hiddenColumns.includes(column.accessorKey)) {
                            //   return null;
                            // }

                            // Default header
                            return (
                                <Text
                                    key={index}
                                    style={getTableCellStyles2()}
                                >
                                    {column}
                                </Text>
                            );
                        })}
                    </View>

                    {data?.rows?.map((item, rowIndex) => (



                        <>
                            <View style={styles.tableRow} wrap={false} key={item.UUID}>
                                <Text style={[{ flex: 3, fontSize: 8 }]} >{item.stockGroupName ? item.stockGroupName : "UNKNOWN"}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>

                                {/* <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>   */}
                                {/* <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>   
                            <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>    */}
                            </View>

                            <View style={styles.tableRow} wrap={false} key={item.UUID}>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{item.stockCode}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 2, fontSize: 8 }]} >{item.stockName}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{item.itemUOM}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                {/* <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>   */}
                                {/* <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>   
                            <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>    */}
                            </View>

                            <View style={styles.tableRow} wrap={false} key={item.UUID}>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{"1/03/2026"}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 2, fontSize: 8 }]} >{"(Balance b/d)"}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{item.stockBalanceQuantity}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{item.quantity}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{item.itemRefCost}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} >{(Number(item.itemRefCost) || 0) * (Number(item.quantity) || 0)}</Text>


                                {/* <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>   */}
                                {/* <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>   
                            <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>    */}
                            </View>

                            <View style={styles.tableRow} wrap={false} key={item.UUID}>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 2, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8, borderTopWidth: 1 }]} >{"0.00"}</Text>
                                <Text style={[{ flex: 1, fontSize: 8, borderTopWidth: 1 }]} >{"0.00"}</Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>
                                <Text style={[{ flex: 1, fontSize: 8 }]} ></Text>


                                {/* <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>  
                            <Text style={[{ flex: 3}]}  ></Text>   */}
                                {/* <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>   
                            <Text style={[{ flex: 3}]} >{item.stockGroupName}</Text>    */}
                            </View>




                        </>




                    ))}

                    {/* Table Rows */}
                    {/* {data?.rows?.map((item, rowIndex) => (
              <View style={styles.tableRow} wrap={false} key={item.UUID}>
                {stockReportColumns?.map((column, colIndex) => {
                  if (hiddenColumns.includes(column.accessorKey)) {
                    return null;
                  }

                  // Default render for other columns
                  return (
                    <Text
                      key={colIndex}
                      style={column.header === "No" ? getTableCellNoStyles() : getTableCellStyles()}
                    >
                      {column.header === "No"
                        ? rowIndex + 1
                        : insertZeroWidthSpace(item[column.accessorKey], orientation)}
                    </Text>
                  );
                })}
              </View>
            ))} */}
                </View>
                )

                {/* Summary Box: only show if type is not 'Stock Aging Report' */}
                {type !== "Stock Aging Report" && ( // REMOVE "&& type !== "Stock Document Listing Report""
                    <View style={getSummaryStyles()}>
                        <Text style={styles.summaryTitle}>Summary: </Text>
                        <View style={{ marginTop: 5 }}>
                            {/* ... (existing Stock Item Report logic) ... */}
                            {/* // New block for Stock Document Listing (Stock Issued) */}
                            {type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockIssued" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>
                                                    {data?.summary?.totalQuantityIssuedReport ??
                                                        data?.summary?.totalQuantity ??
                                                        "0"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Total Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandTotalSubtotal}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Actual Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandActualSubtotal}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : (type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockIssuedDefault") ||
                                stockReportData?.docType === "stockIssuedLv1Date" ||
                                stockReportData?.docType === "stockIssuedLv1DocNo" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockTransfer" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>
                                                    {data?.summary?.totalQuantityIssuedReport ??
                                                        data?.summary?.totalQuantity ??
                                                        "0"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Total Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandTotalSubtotal}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockTransferActualAmount" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>
                                                    {data?.summary?.totalQuantityIssuedReport ??
                                                        data?.summary?.totalQuantity ??
                                                        "0"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Actual Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandActualSubtotal}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : type === "Stock Document Listing Report" &&
                                (stockReportData?.docType === "stockTransferDefault" ||
                                    stockReportData?.docType === "stockTransferLv1Date" ||
                                    stockReportData?.docType === "stockTransferLv1DocNo" ||
                                    stockReportData?.docType === "stockTransferActualAmountLv1Date" ||
                                    stockReportData?.docType === "stockTransferActualAmountLv1DocNo") ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Transferred:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : (type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockReceivedDefault") ||
                                stockReportData?.docType === "stockReceivedLv1Date" ||
                                stockReportData?.docType === "stockReceivedLv1DocNo" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Received:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : (type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockAdjustmentDefault") ||
                                stockReportData?.docType === "stockAdjustmentLv1Date" ||
                                stockReportData?.docType === "stockAdjustmentLv1DocNo" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Received:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockReceived" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>
                                                    {data?.summary?.totalQuantityIssuedReport ??
                                                        data?.summary?.totalQuantity ??
                                                        "0"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Total Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandTotalSubtotal}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Actual Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandActualSubtotal}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : type === "Stock Document Listing Report" &&
                                stockReportData?.docType === "stockAdjustment" ? (
                                <>
                                    <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                        <View>
                                            <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>
                                                    {data?.summary?.totalQuantityIssuedReport ??
                                                        data?.summary?.totalQuantity ??
                                                        "0"}
                                                </Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Total Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandTotalSubtotal}</Text>
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={styles.summaryText}>Grand Actual Subtotal:</Text>
                                            <View style={styles.summaryField}>
                                                <Text style={styles.summaryTextValue}>{formattedGrandActualSubtotal}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </>
                            ) : // Existing Stock Issued Report logic (which should now be an 'else if' or 'else' of the above check)
                                type === "Stock Issued Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Adjustment Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Adjusted:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Issued Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Issued:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Received Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Received:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Requisition Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Requested:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Take Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Counted:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Variance:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalVarianceQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Transfer Report" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity Transferred:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Batch Expiry" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Batches Listed:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{data?.total ?? ""}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalBatchQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Expired Batches:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalExpiredBatch ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Expired Quantity:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalExpiredQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Physical Worksheet" &&
                                    (stockReportData?.docType === "stockPhysicalWorksheetLv1" ||
                                        stockReportData?.docType === "stockPhysicalWorksheetLv1POnSO" ||
                                        stockReportData?.docType === "stockPhysicalWorksheetLv3" ||
                                        stockReportData?.docType === "stockPhysicalWorksheetLv3POnSO") ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Balance Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalBalanceQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Reorder Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalReorderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Min Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSystemQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Max Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalMaxQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total SO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSalesOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: orientation === "landscape" ? 6 : 5,
                                                marginTop: 5,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.summaryText}>Total Avail Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalAvailableQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total PO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalPurchaseOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total JO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalJobOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Forecast Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalForecastQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Physical Worksheet" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Balance Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalBalanceQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Reorder Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalReorderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Min Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSystemQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Max Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalMaxQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total SO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSalesOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: orientation === "landscape" ? 6 : 5,
                                                marginTop: 5,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.summaryText}>Total Avail Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalAvailableQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total PO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalPurchaseOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total JO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalJobOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Forecast Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalForecastQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Reorder Advice" &&
                                    (stockReportData?.docType === "stockReorderAdviceLv1POnSO" ||
                                        stockReportData?.docType === "stockReorderAdviceLv3POnSOLocation&Category") ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Balance Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalBalanceQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Reorder Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalReorderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Min Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSystemQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Max Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalMaxQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total SO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSalesOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: orientation === "landscape" ? 6 : 5,
                                                marginTop: 5,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.summaryText}>Total Avail Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalAvailableQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total PO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalPurchaseOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total JO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalJobOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Forecast Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalForecastQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Reorder Advice" &&
                                    (stockReportData?.docType === "stockReorderAdviceLv1" ||
                                        stockReportData?.docType === "stockReorderAdviceLv3Location&Category") ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total Balance Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalBalanceQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Reorder Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalReorderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Min Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalSystemQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Max Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalMaxQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Avail Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalAvailableQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View
                                            style={{
                                                flexDirection: "row",
                                                gap: orientation === "landscape" ? 6 : 5,
                                                marginTop: 5,
                                            }}
                                        >
                                            <View>
                                                <Text style={styles.summaryText}>Total JO Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalJobOrderQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Forecast Qty:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>
                                                        {data?.summary?.totalForecastQuantity ?? ""}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Serial Number Conflict Listing" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <Text style={styles.summaryText}>Total Quantity:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalQuantity}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : type === "Stock Month End Balance" ? (
                                    <>
                                        <View style={{ flexDirection: "row", gap: orientation === "landscape" ? 6 : 10 }}>
                                            <View>
                                                <Text style={styles.summaryText}>Total No. Of Documents:</Text>
                                                <View style={styles.summaryField}>
                                                    <Text style={styles.summaryTextValue}>{totalNoOfDocuments}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <Text style={styles.summaryText}>No Summary!</Text>
                                    </>
                                )}
                        </View>
                    </View>
                )}

                {/* Summary Table: only show for Stock Document Listing Report */}
                {type === "Stock Document Listing Report" && (
                    <View style={styles.summaryTable} break>
                        {/* Table Header */}
                        <View style={[styles.summaryTableRow, styles.summaryTableHeader]}>
                            <Text style={styles.summaryTableCell}>Item Code</Text>
                            <Text style={styles.summaryTableCell}>Item Name</Text>
                            <Text style={styles.summaryTableCell}>Item Description</Text>
                            <Text style={styles.summaryTableCell}>Location</Text>
                            <Text style={styles.summaryTableCell}>Batch</Text>
                            <Text style={styles.summaryTableCell}>Quantity</Text>
                            <Text style={styles.summaryTableCell}>UOM</Text>
                            <Text style={styles.summaryTableCell}>Unit Cost</Text>
                            <Text style={styles.summaryTableCell}>Price</Text>
                            <Text style={styles.summaryTableCell}>Actual Cost</Text>
                            <Text style={styles.summaryTableCellLast}>Actual Price</Text>
                        </View>
                        {/* Table Rows */}
                        {data?.stockDetails?.rows?.length > 0 ? (
                            data.stockDetails.rows.map((row, index) => (
                                <View key={row.UUID} style={styles.summaryTableRow} wrap={false}>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.stockCode || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.stock || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.description || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.locationName || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.stockBatchCode || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.quantity || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.itemUOM || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.itemCost || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.itemPrice || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCell}>
                                        {insertZeroWidthSpace(row.actualCost || "", orientation)}
                                    </Text>
                                    <Text style={styles.summaryTableCellLast}>
                                        {insertZeroWidthSpace(row.actualPrice || "", orientation)}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <View style={styles.summaryTableRow}>
                                <Text style={[styles.summaryTableCell, { flex: 10, textAlign: "center" }]}>
                                    No Result
                                </Text>
                            </View>
                        )}
                        <View style={styles.totalItemsText}>
                            <Text>Total Item(s): {totalItems}</Text>
                        </View>
                    </View>
                )}

                {/* Footer (fixed on every page) */}
                {renderFooter(styles)}
            </Page>
        </Document>
    );
};

export default StockReport;

// Prevent overflow for long strings
function insertZeroWidthSpace(str, orientation = "portrait") {
    if (typeof str !== "string") str = String(str ?? "");

    const charLimit = orientation === "landscape" ? 18 : 12; // Allow more characters in landscape

    // For comma-separated values, break each part if long
    if (str.includes(",")) {
        return str
            .split(",")
            .map((part, idx, arr) => {
                part = part.trim();
                // Break long numbers or alphanumerics after dynamic chars
                if (
                    (/^\d+$/.test(part) && part.length > charLimit) ||
                    (/^[\w\d\-]+$/.test(part) && part.length > charLimit)
                ) {
                    part = part.replace(new RegExp(`(.{${charLimit}})`, "g"), "$1-\n");
                }
                return part + (idx < arr.length - 1 ? ",\n" : "");
            })
            .join("");
    }

    // For decimal numbers (e.g., "2092.6399999999994")
    if (/^\d+\.\d+$/.test(str) && str.length > charLimit) {
        const [integerPart, decimalPart] = str.split(".");
        // If the decimal part is very long, break it
        if (decimalPart.length > 8) {
            const brokenDecimal = decimalPart.replace(/(.{8})/g, "$1-\n");
            return `${integerPart}.${brokenDecimal}`;
        }
        // If the whole number is long, break at the decimal point
        return `${integerPart}.\n${decimalPart}`;
    }

    // For long numbers only (integers)
    if (/^\d+$/.test(str) && str.length > charLimit) {
        return str.replace(new RegExp(`(.{${charLimit}})`, "g"), "$1-\n");
    }

    // For long alphanumeric strings without spaces
    if (/^[\w\d\-]+$/.test(str) && str.length > charLimit) {
        return str.replace(new RegExp(`(.{${charLimit}})`, "g"), "$1-\n");
    }

    // For Chinese characters
    return str.replace(/([\u4e00-\u9fa5])/g, "$1\u200B");
}
