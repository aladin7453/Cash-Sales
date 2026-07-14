import { Document, Image, Page, StyleSheet, Text, View, Font } from "@react-pdf/renderer";
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
    fontFamily: 'NotoSansSC',
  },
  header: {
    fontSize: 9,
    marginTop: 5,
    marginBottom: 5,
    textAlign: "center",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
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
    width: "50%",
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
    marginTop: 50,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
    marginTop: 50,
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

  },
  qtyTableCellNumber: {
    padding: 2,
    fontSize: 8,
    textAlign: "right",
    flexShrink: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
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
    marginTop: 5,
    marginBottom: 10,
  },
  secondSeparator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: "auto",
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
    padding: 0,
  },
  logoImage: {
    width: 100,
    height: 100,
    objectFit: "contain",
  },
  pageNumber: {
    fontSize: 9,
    textAlign: "right",
    color: "grey",
  },
  childItem: {
    marginLeft: 13,
  },
  remark: {
    fontSize: 8,
  },
  currency: {
    fontSize: 8,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  boxText: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: 'black',
    padding: 5,
    borderRadius: 2,
  },
  boxText2: {
    fontSize: 8,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 5,
    borderRadius: 2,
  },
  sectionNote: {
    width: "100%",
    fontSize: 8,
    marginBottom: 10,
  
  },
  tableNumber: {
    flexDirection: "row",
    fontSize: 8,
    gap: 40,
    
  },
  qtyTableNoBorder: {
    borderTopWidth: 0,
    borderColor: "transparent",
  },
  
  tableRowNoBorder: {
    flexDirection: "row",
    borderBottomWidth: 0,
    borderColor: "transparent",
  },
  
  qtyTableCellNoBorder: {
    padding: 2,
    fontSize: 8,
    textAlign: "left",
    flexShrink: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderColor: "transparent",
  },
  headerRow2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  boxText3: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    borderWidth: 1,
    borderColor: "black",
    marginLeft: 40,
    paddingHorizontal: 5,
    borderRadius: 1,
  },
  pageNumber2: {
    fontSize: 9,
    textAlign: "right",
    color: "grey",
  },
});

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  // Convert Unix timestamp (in seconds) to milliseconds and create a Date object
  const date = new Date(parseInt(timestamp) * 1000);

  // Format the date as YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

const CargoPreviewTemplate2 = ({ 
  previewData, 
  itemsData, 
  currentCompanyData, 
  totalVolume,
  totalWeight,
}) => {
  if (!previewData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  return (
    <Document title={previewData.docNo || ''}>
      <Page size="A4" style={styles.page}>
        {/* Logo Image */}

        <View style={styles.header}>
          <Text>
            {currentCompanyData.company || ""} ({currentCompanyData.BRN || ""})
          </Text>
          <Text style={styles.headerText}>
            {currentCompanyData.address || ""}
          </Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>PHONE NO.: {currentCompanyData.phoneNo || ""}</Text>
            <Text style={styles.headerText}>FAX: {currentCompanyData.fax || ""}</Text>
            <Text style={styles.headerText}>EMAIL: {currentCompanyData.email || ""}</Text>
            
          </View>
          </View>
          <View style={styles.headerRow2}>
          <View style={{ flex: 22 ,alignItems: 'center'  }}>
            <Text style={styles.boxText3}>EXPORT PICKUP INSTRUCTION</Text>
          </View>
          <View style={{ flex: 2, alignItems: 'flex-end' }}>
            <Text
              style={styles.pageNumber2}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
              fixed
            />
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
              <Text style={styles.sectionText}>ATTN: {previewData.attentionName || ""}</Text>
              <Text style={[styles.sectionText, { marginLeft: 23 }]}>{previewData.customerCompanyName || ""}</Text>
              <Text style={[styles.sectionText, { marginLeft: 23 }]}>{previewData.attentionPhoneNo || ""}</Text>
              <Text style={[styles.sectionText, { marginLeft: 23 }]}>{previewData.attentionFaxNo || ""}</Text>
            </View>
            <View style={styles.section}>
            <Text style={styles.sectionText}>SHIPPER      : {previewData.shipperCompanyName || ""}</Text>
            <Text style={styles.sectionText}>COLLECT FROM :{previewData.shipperAddress || ""}</Text>
            </View>
            <View>
             <View style={styles.firstSeparator} />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionText}>PICKUP DATE                 : </Text>
              <Text style={styles.sectionText}>ETD                                    : {previewData.POLETD || ""}</Text>
              <Text style={styles.sectionText}>ETA                                     : {previewData.POLETA || ""}</Text>
              <Text style={styles.sectionText}>PORT OF DISCHARGE : {previewData.PODPortName || ""}</Text>
              <Text style={styles.sectionText}>SHIPING LINE                : {previewData.voyageCompanyName || ""}</Text>
            </View>
          </View>
          
          {/* Job Order Details */}
          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>BOOKING DATE : {formatDate(previewData.docDate || "")}</Text>
              <Text style={styles.sectionText}>JOB NO.               : {previewData.jobNo|| ""}</Text>
              <Text style={styles.sectionText}>BOOKING NO     : {previewData.docNo || ""}</Text>
              <Text style={styles.sectionText}>SHIPLINE REF    : </Text>
            </View>
            <View style={styles.section}>
            <Text style={styles.sectionText}>{'\n'}DELIVERY TO : </Text> 
            </View>
            <View>
            <View style={styles.firstSeparator} />
            </View>
            <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>VESSEL                   : {previewData.vesselName || ""}</Text>
              <Text style={styles.sectionText}>VOYAGE                  : {previewData.voyageName || ""}</Text>
              <Text style={styles.sectionText}>FEEDER                  : </Text>
              <Text style={styles.sectionText}>FEEDER VOYAGE : </Text>
            </View>
          </View>
          </View>
          </View>

        {/* Item Details */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>MARK & NO.</Text>
            </View>
            <View style={[styles.tableCell, { flex: 5 }]}>
              <Text>NO OF PKGS/ PACKAGE TYPE</Text>
            </View>
            <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
              <Text>DESCRIPTION OF GOODS.</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>WT(KGS)</Text>
            </View>
            <View style={[styles.tableCell, { flex: 2 }]}>
              <Text>VOL(M3)</Text>
            </View>
          </View>
          {itemArray.map((item, index) => (
            <>
              {/* Parent Item Row */}
              <View style={[styles.tableRow, styles.lastRow]} key={index}>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>{index + 1}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>{item.Mark || ""}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 1 }]}>
                  <Text>{item.noOfPackage || ""}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 4 }]}>
                  <Text>{item.packageType || ""}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
                  <Text>{item.description || ""}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text>{Number(item.kgs|| 0).toFixed(2)}</Text>
                </View>
                <View style={[styles.tableCell, { flex: 2 }]}>
                  <Text>{Number(item.m3 || 0).toFixed(2)}</Text>
                </View>
              </View>

              {/* Child Item Rows */}
              {item.child && item.child.map((child, childIndex) => (
                <View style={[styles.tableRow, styles.lastRow]} key={childIndex}>
                  <View style={[styles.tableCell, { flex: 1 }]}>  {/* Same flex as parent item */}
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}> 
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}> 
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 4 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 8 }, styles.tableCellLeftAlign]}>
                    <Text>{child.description || ""}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text></Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text></Text>
                  </View>
                </View>
              ))}
            </>
          ))}
        </View>

        {/* Push content to bottom */}
        <View style={{ flex: 1 }} />

        <View>
          <View style={styles.secondSeparator} />
        </View>

        <View style={styles.botContainer}>
          {/* Qty */}
          <View style={[styles.leftBotColumn, {fontSize: 10}]}>             
            <View style={styles.remark}>
              <Text>Remarks:</Text>
              <Text>{previewData.remark || ""}</Text>
            </View>
          </View>
        
          <View style={[styles.qtyTableNoBorder, styles.rightBotColumn]}>
          <View style={[styles.tableRowNoBorder]}>
            <View style={[styles.qtyTableCellNoBorder, { flex: 4 }]}>
              <Text>Total of KGS & M3 :</Text>
            </View>
            <View style={[styles.tableNumber, { flex: 5 }]}>
              <Text>{Number(previewData.totalOfKg || 0).toFixed(2)}</Text>
              <Text>{Number(previewData.totalOfM3 || 0).toFixed(2)}</Text>
            </View>
          </View>
        </View>
        </View>
        <View style={styles.botContainer}>
          <View style={styles.systemUserSection}>
            <Text>PREPARED BY: </Text>
            <Text style={styles.sectionNote}>{previewData.tnc || ""}</Text>
            <Text style={styles.boxText2}>
              DOCUMENT IS COMPUTER GENERATED AND DOES NOT REQUIRE SIGNATURE
            </Text>
            <Text style={styles.boxText2}>
              ALL BUSINESS TRANSACTIONS ARE UNDERTAKEN IN ACCORDANCE TO OUR FMFF STANDARD TRADING 1 OF WHICH A COPY IS AVAILABLE UPON REQUEST.
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CargoPreviewTemplate2;