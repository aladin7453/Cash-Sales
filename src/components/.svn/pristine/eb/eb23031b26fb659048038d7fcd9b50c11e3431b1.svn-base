import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
  box: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 5,
    marginBottom: 5,
  },
});

const BillOfLadingPreviewTemplate = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Ocean Bill of Lading</Text>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Shipper</Text>
          <Text>{previewData.shipperName ?? " "}</Text>
        </View>
        <View style={styles.row}>
          <Text>{previewData.shipperAddress ?? " "}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Consignee</Text>
          <Text>{previewData.consigneeName ?? " "}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Notify Party</Text>
          <Text>{previewData.notifyName ?? " "}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Vessel Code / Voyage No:</Text>
          <Text>
            {previewData.vesselCode} / {previewData.voyageNo}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>POL:</Text>
          <Text>{previewData.pol}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>BL Doc Date:</Text>
          <Text>{previewData.blDocDate}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Agent Company:</Text>
          <Text>{previewData.agentCompany}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.box}>
          <Text>{previewData.description}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default BillOfLadingPreviewTemplate;
