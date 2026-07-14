import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
  },
  container: {
    width: "100%",
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "extrabold",
  },
  headerContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    // position: "relative",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  logoImage: {
    maxHeight: 100,
    objectFit: "contain",
  },
  companyContact: {
    fontSize: 10,
    flexDirection: "row",
    gap: 4,
  },
  // Generic table styles
  tableRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "#000",
  },
  tableColumn: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    rowGap: 8,
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
  },
});

interface CargoManifestProps {
  previewData: any;
  itemsData: any;
  currentCompanyData: any;
  currentUser: any;
}

const CargoManifest: React.FC<CargoManifestProps> = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
}) => {
  if (!currentCompanyData) {
    return (
      <Document>
        <Page size={[226.8, Math.max(230, "auto")]} style={styles.page} orientation="portrait">
          <View style={styles.container}>
            <Text>Loading data...</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const image64 = currentCompanyData.logoLink && currentCompanyData.logoLink[0]?.base64;
  const itemArray = Array.isArray(itemsData) ? itemsData : [];

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer}>
          {image64 && (
            <View style={styles.logoContainer}>
              <Image
                src={{
                  uri: image64,
                  method: "GET",
                  headers: { "Cache-Control": "no-cache" },
                  body: "",
                }}
                style={styles.logoImage}
                alt=""
              />
            </View>
          )}
          <Text style={styles.headerText}>{currentCompanyData.address ?? " "}</Text>
          <View style={styles.companyContact}>
            <Text>{`TEL: ${currentCompanyData.phoneNo ?? " "}`}</Text>
            <Text>{`FAX: ${" "}`}</Text>
            <Text>{`EMAIL: ${currentCompanyData.email ?? " "}`}</Text>
          </View>
        </View>

        <Text
          style={{ textAlign: "right", fontSize: 14, fontWeight: "extrabold", marginBottom: 4 }}
        >
          ARRIVAL NOTICE / INVOICE
        </Text>

        {/* Table with generic styles that you can adjust */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColumn, { flexBasis: "50%" }]}>
            <Text style={[styles.text, { fontWeight: "extrabold" }]}>
              * For Telex Release, please bring along company stamp
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                padding: 4,
                borderWidth: 1,
                borderColor: "#000",
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "extrabold" }}>NO TELEX RELEASE</Text>
            </View>
          </View>

          <View style={[styles.tableColumn, { flexBasis: "50%" }]}>
            <Text
              style={[styles.text, { fontSize: 14, fontWeight: "extrabold", textAlign: "center" }]}
            >
              D/O Ready for Collection
            </Text>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>DATE:</Text>
              <Text style={styles.text}>{previewData.docDateFormat ?? " "}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableColumn, { flexBasis: "50%", flexDirection: "column" }]}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>SHIPPER</Text>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
            </View>
            <Text style={styles.text}>{previewData.shipperName ?? " "}</Text>
          </View>

          <View style={[styles.tableColumn, { flexBasis: "50%", flexDirection: "row" }]}>
            <View style={{ flexBasis: "50%", flexDirection: "column" }}>
              <Text style={styles.text}>JOB NO.:</Text>
              <Text style={styles.text}>{previewData.jobNo ?? " "}</Text>
            </View>
            <View style={{ flexBasis: "50%", flexDirection: "column" }}>
              <Text style={styles.text}>FROM:</Text>
              <Text style={styles.text}>{` `}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableColumn, { flexBasis: "50%", flexDirection: "column" }]}>
            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>CONSIGNEE</Text>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
            </View>
            <Text style={styles.text}>{previewData.consigneeName ?? " "}</Text>
            <Text style={styles.text}>{previewData.consigneeAddress ?? " "}</Text>
            <Text style={styles.text}>{previewData.consigneePostcode ?? " "}</Text>
            <Text style={styles.text}>{previewData.consigneeCity ?? " "}</Text>
            <Text style={styles.text}>{previewData.consigneeCountry ?? " "}</Text>
          </View>

          <View
            style={[styles.tableColumn, { flexBasis: "50%", flexDirection: "column", rowGap: 8 }]}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>HBL NO.</Text>
                <Text style={styles.text}>{previewData.docNo ?? " "}</Text>
              </View>

              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>OBL NO.</Text>
                <Text style={styles.text}>{previewData.oceanBL ?? " "}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>POL</Text>
                <Text style={styles.text}>{previewData.POLPortName ?? " "}</Text>
              </View>

              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>ETA</Text>
                <Text style={styles.text}>{previewData.POLETA ?? " "}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>MOTHER VSL</Text>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
              <Text style={styles.text}>{"  /  "}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>FEEDER VSL</Text>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
              <Text style={styles.text}>{`${previewData.vesselName ?? " "} / ${
                previewData.voyageNo ?? " "
              }`}</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>WAREHOUSE</Text>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
              <Text style={styles.text}>{` `}</Text>
            </View>

            <View style={{ flexDirection: "row" }}>
              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>EXCHANGE RATE</Text>
                <Text style={styles.text}>{previewData.currencyRate ?? " "}</Text>
              </View>

              <View style={{ flexBasis: "50%", flexDirection: "column" }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>CARRIER</Text>
                <Text style={styles.text}>{previewData.shipperName ?? " "}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={[styles.tableRow, { borderBottomWidth: 1, marginBottom: 10 }]}>
          <View style={{ borderWidth: 0, flexBasis: "50%", flexDirection: "column" }}>
            <View
              style={[
                styles.tableColumn,
                { flexDirection: "column", borderBottomWidth: 1, borderColor: "#000" },
              ]}
            >
              <View style={{ flexDirection: "row", gap: 16 }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>NOTIFY PARTY</Text>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
              </View>
              <Text style={styles.text}>{previewData.notifyName ?? " "}</Text>
              <Text style={styles.text}>{previewData.notifyAddress ?? " "}</Text>
              <Text style={styles.text}>{previewData.notifyPostcode ?? " "}</Text>
              <Text style={styles.text}>{previewData.notifyCity ?? " "}</Text>
              <Text style={styles.text}>{previewData.notifyCountry ?? " "}</Text>
            </View>

            <View style={[styles.tableColumn, { flexDirection: "column" }]}>
              <View style={{ flexDirection: "row", gap: 16 }}>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>COMMODITY</Text>
                <Text style={[styles.text, { fontWeight: "extrabold" }]}>:</Text>
              </View>
              <Text style={styles.text}>{previewData.commodity ?? " "}</Text>
            </View>
          </View>

          <View style={[styles.tableColumn, { flexBasis: "50%", flexDirection: "column" }]}>
            <Text style={styles.text}>
              {
                "PLEASE PRESENT THE ORIGINAL BILL OF LADING, IF REQUIRED AND ANY IMPORT PERMIT(S) IN EXCHANGE FOR OUR DELIVERY ORDER PRIOR TO VESSEL ARRIVAL."
              }
            </Text>
            <Text style={styles.text}>
              {
                "COLLECTION/ EXCHANGE OF DELIVERY ORDER FROM OUR OFFICE DURING THE HOURS AS FOLLOWS: -"
              }
            </Text>
            <View style={{ textAlign: "center" }}>
              <Text style={styles.text}>{"MON TO FRI: 8:45 AM TO 5:45 PM"}</Text>
              <Text style={styles.text}>{"SAT: NON-WORKING DAY"}</Text>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", columnGap: 8 }}>
          <View style={{ flexBasis: "80%", flexDirection: "column" }}>
            {/* Items Header */}
            <View style={{ flexDirection: "row", columnGap: 8 }}>
              <Text style={[styles.text, { flexBasis: "25%" }]}>NO. OF PACKAGES</Text>
              <Text style={[styles.text, { flexBasis: "25%" }]}>MEASUREMENT</Text>
              <Text style={[styles.text, { flexBasis: "25%" }]}>WEIGHT</Text>
              <Text style={[styles.text, { flexBasis: "25%" }]}>CONTAINER NO/Type/Seal No</Text>
            </View>

            {/* Items */}
            {itemArray.map((item, index) => (
              <View key={index} style={{ flexDirection: "row", columnGap: 8 }}>
                <Text style={[styles.text, { flexBasis: "25%" }]}>{`${item.noOfPackage ?? " "} ${
                  item.packageType ?? " "
                }`}</Text>
                <View style={{ flexBasis: "25%" }}>
                  <Text style={styles.text}>{item.m3 ?? " "}</Text>
                  <Text style={styles.text}>
                    {`${item.quantity ?? " "} * ${item.containerType ?? " "}`}
                  </Text>
                </View>
                <Text style={[styles.text, { flexBasis: "25%" }]}>{item.netWeight ?? " "}</Text>
                <Text style={[styles.text, { flexBasis: "25%" }]}>
                  {`${item.container ?? " "}/${item.containerType ?? " "}/${item.seal ?? " "}`}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ flexBasis: "20%", flexDirection: "column" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>SCN:</Text>
              <Text style={styles.text}>{previewData.PODSCNCode ?? " "}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>CA:</Text>
              <Text style={styles.text}>{` `}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>KA:</Text>
              <Text style={styles.text}>{` `}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>PORT ID:</Text>
              <Text style={styles.text}>{previewData.PODPortName ?? " "}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={[styles.text, { fontWeight: "extrabold" }]}>VSL ID:</Text>
              <Text style={styles.text}>{previewData.vesselName ?? " "}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CargoManifest;
