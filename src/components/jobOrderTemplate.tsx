import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import { ErpLogo } from "./icons/erpLogo";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
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
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 11,
    marginRight: 10,
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
    borderStyle: "solid",
    borderRadius: 8,
    borderColor: "#e0e0e0",
    borderWidth: 1.5,
  },
  rightColumn: {
    width: "15%",
    marginRight: 10,
    textAlign: "left",
  },
  section: {
    fontSize: 9,
    marginBottom: 10,
  },
  signatureSection: {
    width: "30%",
    fontSize: 9,
    marginBottom: 10,
    textAlign: "center",
  },
  systemUserSection: {
    width: "80%",
    fontSize: 9,
    marginBottom: 10,
    textAlign: "right",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 1000,
    textAlign: "right",
    marginTop: 50,
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
    width: "50%",
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
    fontSize: 10,
    textAlign: "center",
    flexShrink: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000000",
  },
  qtyTableCell: {
    padding: 5,
    fontSize: 10,
    textAlign: "center",
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
    backgroundColor: "#eeeeee",
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
    marginTop: 200,
    marginBottom: 10,
  },
  signatureLine: {
    width: "30%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 60,
    marginBottom: 10,
  },
  logoContainer: {
    position: "absolute",
    top: 30,
    left: 30,
    width: 100,
    height: 100,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#000000",
    borderStyle: "solid",
    overflow: "hidden",
    padding: 0,
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
});

const JobOrderTemplate = ({
  jobOrderData,
  itemsData,
  currentCompanyData,
  currentUserFullNameData,
}) => {
  if (!jobOrderData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo Image */}
        <View style={styles.logoContainer}>
          <Image style={styles.logoImage} src={ErpLogo} />
        </View>

        <View style={styles.header}>
          <Text>
            {currentCompanyData.company || ""}({currentCompanyData.BRN || ""})
          </Text>
          <Text>{jobOrderData.address || ""}</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Phone No.: {currentCompanyData.phoneNo || ""}</Text>
            <Text style={styles.headerText}>Email: {currentCompanyData.email || ""}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>JOB ORDER</Text>
          </View>
        </View>

        <View>
          <View style={styles.firstSeparator} />
        </View>

        {/* Main Content */}
        <View style={styles.mainContainer}>
          {/* Customer Information */}
          <View style={styles.leftColumn}>
            <View style={styles.section}>
              <Text>{jobOrderData.customerName || ""}</Text>
              <Text>Address Customer01 Company</Text>
            </View>
            <View style={styles.section}>
              <Text>Attention: {jobOrderData.attentionName || ""}</Text>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionText}>Phone No.: {jobOrderData.phoneNo || ""}</Text>
                <Text style={styles.sectionText}>Email: {jobOrderData.email || ""}</Text>
              </View>
            </View>
            <View style={styles.section}>
              <Text>DESC: {jobOrderData.description || ""}</Text>
            </View>
          </View>

          {/* Delivery Details */}
          <View style={styles.middleColumn}>
            <View style={styles.section}>
              <Text style={{ textDecoration: "underline" }}>Delivery Address:</Text>
              <Text>101, No. 101,Jalan 1001, 10001</Text>
            </View>
          </View>

          {/* Job Order Details */}
          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text>No.: {jobOrderData.docNo || ""}</Text>
              <Text>Date: {jobOrderData.docDateFormat || ""}</Text>
              <Text>Agent: {jobOrderData.agentName || ""}</Text>
              <Text>Terms: {jobOrderData.creditTermCode || ""}</Text>
            </View>
          </View>
        </View>

        {/* Item Details */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, { flex: 1 }]}>
              <Text>No</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>Item </Text>
            </View>
            <View style={[styles.tableCell, { flex: 4 }, styles.tableCellLeftAlign]}>
              <Text>Desc.</Text>
            </View>
            <View style={[styles.tableCell, { flex: 3 }]}>
              <Text>UOM</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>QTY</Text>
            </View>
          </View>
          {itemArray.map((item, index) => (
            <View style={[styles.tableRow, styles.lastRow]} key={index}>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <Text>{index + 1}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text>{item.itemCode || ""}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 4 }, styles.tableCellLeftAlign]}>
                <Text>{item.description || ""}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 3 }]}>
                <Text>{item.itemUOM || ""}</Text>
              </View>
              <View style={[styles.tableCell, { flex: 2 }]}>
                <Text>{item.quantity || ""}</Text>
              </View>
            </View>
          ))}
        </View>

        <View>
          <View style={styles.secondSeparator} />
        </View>

        {/* Qty */}
        <View style={styles.qtyTableContainer}>
          <View style={styles.qtyTable}>
            <View style={[styles.tableRow]}>
              <View style={[styles.qtyTableCell, { flex: 3 }]}>
                <Text>Total QTY</Text>
              </View>
              <View style={[styles.qtyTableCell, styles.noBorderLeft, { flex: 2 }]}>
                <Text>{jobOrderData.totalQuantity || ""}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Authorised Signature */}
        <View>
          <View style={styles.signatureLine} />
        </View>
        <View style={styles.signatureSection}>
          <Text>Authorised Signature</Text>
        </View>

        {/* Current System User's Full Name */}
        <View style={styles.systemUserSection}>
          <Text>Prepared by: {currentUserFullNameData.currentUserFullName || ""}</Text>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default JobOrderTemplate;