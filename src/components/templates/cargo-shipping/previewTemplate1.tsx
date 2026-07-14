import { Document,Image, Page, StyleSheet, Text, View, Font } from "@react-pdf/renderer";
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
  headerText: {
    fontSize: 8,
    marginTop: 2,
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  titleSection: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 2,
  },
  subtitleSection: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 0,
  },
  mainContainer: {
    fontSize: 8,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  leftColumn: {
    width: "50%",
    paddingRight: 10,
  },
  middleColumn: {
    width: "30%",
    paddingLeft: 10,
  },
  rightColumn: {
    width: "50%",
    paddingLeft: 10,
  },
  section: {
    fontSize: 8,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 8,
    marginBottom: 2,
  },
  sectionText2: {
    fontSize: 8,
    textAlign:"center",
    flex: 200, 
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginTop: 2,
    marginBottom: 2,
  },
  detailsSection: {
    fontSize: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  footerSection: {
    fontSize: 8,
    marginTop: 20,
    marginBottom: 10,
  },
  footerNote: {
    fontSize: 8,
    marginTop: 5,
    textAlign: "center",
  },
  logoImage: {
    width: 140,
    height: 70,
    imageAlign:"center",
    objectFit: "contain",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  boldText: {
    fontFamily: 'NotoSansSC-Bold',
  },
});

const formatDate = (timestamp) => {
  if (!timestamp) return "";

  // Convert Unix timestamp (in seconds) to milliseconds and create a Date object
  const date = new Date(parseInt(timestamp) * 1000);

  // Format the date as YYYY-MM-DD
  return date.toISOString().split("T")[0];
};

const CargoPreviewTemplate1 = ({ 
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

  let image64 = currentCompanyData.logoLink && currentCompanyData.logoLink[0]?.base64;
  
  return (
    <Document title={previewData.docNo || ''}>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            {image64 ? (
              <Image 
                src={{ uri: image64, method: "GET", headers: { "Cache-Control": "no-cache" }, body: "" }} 
                style={styles.logoImage}  
              />
            ) : null}

            <Text style={styles.headerText}>
              ({currentCompanyData.BRN || ""})
            </Text>
          </View>
          
          <Text style={styles.headerText}>
            {currentCompanyData.address || ""}
          </Text>

          <View style={styles.headerRow}>
            <Text style={styles.headerText}>TEL: {currentCompanyData.phoneNo || ""}</Text>
            <Text style={styles.headerText}>FAX: {currentCompanyData.fax || ""}</Text>
            <Text style={styles.headerText}>EMAIL: {currentCompanyData.email || ""}</Text>
          </View>
        </View>

        {/* Title and Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.boldText}>FACSIMILE</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.subtitleSection}>
          <Text style={styles.boldText}>RE: CONFIRMATION OF BOOKING</Text>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Main Content */}
        <View style={styles.mainContainer}>
          {/* Left Column */}
          <View style={styles.leftColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>BOOKING NO. : {previewData.docNo || ""}</Text>
              <Text style={styles.sectionText}>CARRIER REF. : </Text>
              <Text style={styles.sectionText}>TO : {previewData.customerCompanyName || ""}</Text>
              <Text style={styles.sectionText}>ATTN : {previewData.customerAttentionName || ""}</Text>
              <Text style={styles.sectionText2}>FAX NO : {previewData.customerFax || ""}</Text>
              <Text style={styles.sectionText}>TEL NO : {previewData.customerTel || ""}</Text>
              <Text style={styles.sectionText}>CC : </Text>
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>BOOKING DATE : {formatDate(previewData.docDate || "")}</Text>
              <Text style={styles.sectionText}>JOB NO. : {previewData.jobNo || ""}</Text>
              <Text style={styles.sectionText}>MASTER JOB NO : </Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.detailsSection}>
          <Text style={styles.sectionText}>FEEDER VESSEL : </Text>
          <Text style={styles.sectionText}>MOTHER VESSEL : {previewData.vesselCode || ""}/{previewData.voyageNo || ""}</Text>
          <Text style={styles.sectionText}>PORT OF LOADING : {previewData.POLPortName || ""}</Text>
          <Text style={styles.sectionText}>VIA PORT : </Text>
          <Text style={styles.sectionText}>PORT OF DISCHARGE : {previewData.PODPortName || ""}</Text>
          <Text style={styles.sectionText}>PLACE OF DELIVERY :  {previewData.finalDestinationName|| ""}</Text>
          <Text style={styles.sectionText}>VOLUME:  {totalVolume || ""} M3</Text>
          <Text style={styles.sectionText2}>WEIGHT: {totalWeight || ""} KGS</Text>
          <Text style={styles.sectionText}>NO. OF PKGS : {previewData.noOfPackage || ""} {previewData.packageType || ""}</Text>
          <Text style={styles.sectionText}>NO. OF CONTAINER : </Text>
        </View>

        <View style={styles.separator} />

        {/* Moved Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionText}>ETD MYBKI : {previewData.POLReqETA || ""}</Text>
          <Text style={styles.sectionText}>ETA VIA PORT : {previewData.POTPortName || ""}</Text>
          <Text style={styles.sectionText}>ETA : </Text>
          <Text style={styles.sectionText}>ETA DEST : {previewData.PODReqETA || ""}</Text>
          <Text style={styles.sectionText}>CLOSING TIME : {previewData.POLReqETA || ""}</Text>
          <Text style={styles.sectionText}>CARRIER : </Text> 
        </View>

        <View style={styles.separator} />

        {/* Details Section */}
        <View style={styles.mainContainer}>
          <View style={styles.leftColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>COMMODITY : </Text>
              <Text style={styles.sectionText2}>SCN CODE {previewData.POLSCNCode || ""}: </Text>
              <Text style={styles.sectionText}>VESSEL : {previewData.vesselCode || ""}</Text>
              <Text style={styles.sectionText2}>SA CODE : </Text>
              <Text style={styles.sectionText}>TERMINAL : {previewData.POLTerminalName || ""}</Text>
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.section}>
              <Text style={styles.sectionText}>WAREHOUSE LOCATION : </Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        <Text style={styles.sectionText}>REMARK : {previewData.remark || ""}</Text>

        <View style={styles.separator} />

        {/* Footer Section */}
        <View style={styles.footerSection}>
          <Text style={styles.sectionText}>{previewData.tnc || ""}</Text>
          <Text style={styles.footerNote}>
            ALL BUSINESS TRANSACTIONS ARE UNDERTAKEN IN ACCORDANCE TO OUR FMFF STANDARD TRADING TERMS & CONDITION
            OF WHICH A COPY IS AVAILABLE UPON REQUEST.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default CargoPreviewTemplate1;