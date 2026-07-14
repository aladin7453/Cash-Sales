import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
    padding: 20,
  },
  headerText: {
    fontSize: 10,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "bold",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  // Generic table styles
  tableContainer: {
    borderWidth: 1,
    borderColor: "#000",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  lastTableRow: {
    flexDirection: "row",
    borderBottomWidth: 0,
  },
  tableColumn: {
    borderRightWidth: 1,
    borderRightColor: "#000",
    padding: 5,
    justifyContent: "center",
  },
  tableHeaderText: {
    fontSize: 10,
    textAlign: "left",
    minHeight: 12, // Ensure consistent height for text elements
  },
  text: {
    fontSize: 8,
    textAlign: "left",
    minHeight: 12, // Ensure consistent height for text elements
  }
});

interface InwardManifestProps {
  previewData: any;
  itemsData: any;
  currentCompanyData: any;
  currentUser: any;
}

const InwardManifest: React.FC<InwardManifestProps> = ({
  previewData,
  itemsData,
  currentCompanyData,
  currentUser,
}) => {
  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>KASTAM DIRAJA MALAYSIA / ROYAL MALAYSIA CUSTOMS</Text>
          <Text style={styles.headerText}>DAFTAR MUATAN MASUK / DAFTAR MUATAN KELUAR / DAFTAR MUATAN PEMINDAHAN</Text>
          <Text style={styles.headerText}>INWARD MANIFEST / OUTWARD MANIFEST / TRANSHIPMENT MANIFEST</Text>
          <Text style={styles.headerText}>( SEKSYEN 52, 54, 56, 57, 58, 59 AKTA KASTAM 1967 )</Text>
          <Text style={styles.headerText}>( SECTION 52, 54, 56, 57, 58 AND 59 OF THE CUSTOMS ACT 1967 )</Text>
        </View>
        
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            {/* You can now freely adjust the structure using style overrides */}
            <View style={[styles.tableColumn, { width: 20 }]}>
              <Text style={styles.tableHeaderText}>X</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>INWARD MANIFEST</Text>
            </View>
            <View style={[styles.tableColumn, { width: 20 }]}></View>
            <View style={[styles.tableColumn, { flex: 1 }]}>
              <Text style={styles.tableHeaderText}>OUTWARD MANIFEST</Text>
            </View>
            <View style={[styles.tableColumn, { width: 20 }]}></View>
            <View style={[styles.tableColumn, { flex: 1, borderRightWidth: 0 }]}>
              <Text style={styles.tableHeaderText}>TRANSHIPMENT MANIFEST</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableColumn, { flex: 2, flexDirection: "column" }]}>
              <Text style={styles.text}>1 NAME OF VESSEL/AIR CRAFT/VOYAGE/FLIGHT NO</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}>Harbour Adventure</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 2 STATE OF REGISTRATION</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 3 AGENT</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}>MAC-NELS SHIPPING (K.K) SDN BHD</Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 4 PORT OF OPERATOR</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, height: 40 }]}>
              <Text style={styles.text}> 5 DATE OF ARRIVAL/ DATE OF DEPARTURE</Text>
              <View style={{ flexDirection: "row", marginTop: 5, marginLeft: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}>ETA: </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.text}>ETD: </Text>
                </View>
              </View>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 6 LAST PORT OF CALL</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 7 NEXT PORT OF CALL</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 8 PORT OF LOADING</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 9 PORT OF ARRIVAL</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 10 SHIP CALL NO. (SCN)</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, height: 40 }]}>
              <Text style={styles.text}> 11 PORT OF DEPARTURE</Text>
              <Text style={{ marginTop: 5, marginLeft: 10, ...styles.text }}></Text>
            </View>
          </View>
          
          <View style={styles.tableRow}>
            <View style={[styles.tableColumn, { flex: 2, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 13 SHIPPER / CONSIGNEE</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 14 MARKS & NOS</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 15 DESCRIPTION OF GOODS</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 0.5, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 16 KGS</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 0.5, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 17 M3</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, borderRightWidth: 0 }]}>
              <Text style={styles.text}> 19 REMARKS</Text>
            </View>
          </View>

          <View style={[styles.tableRow, { minHeight: 150, borderBottomWidth: 0 }]}>
            <View style={[styles.tableColumn, { flex: 2, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>SHIPPER:</Text>
              <Text style={{ ...styles.text, marginLeft: 5 }}>PENANSHIN SHIPPING PTE LTD-SINGAPORE</Text>
              
              <Text style={{ ...styles.text, marginTop: 5 }}>CONSIGNEE:</Text>
              <Text style={{ ...styles.text, marginLeft: 5 }}>
                PERMAI KAYA SDN BHD LOT 3, JALAN KUALA LAUT, KAMPUNG LIKAS, 88450 KOTA KINABALU, P.O.BOX 14734, 88670 KOTA KINABALU, SABAH, MALAYSIA
              </Text>
              
              <Text style={{ ...styles.text, marginTop: 5 }}>NOTIFY PARTY:</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>
                PERMAI (IN DIA) C. F.
                KOTA KINABALU MALAYSIA 
                C/NO. 1 MADE IN TAIWAN
                R. O. C
              </Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>
                1.BELT OF CF-480 MEAT SEPARATOR MACHINE.
                2.BLADE OF CF-480 MEAT SEPARATOR MACHINE
                3.COPPER SLEEVE FOR DRUM OF CF-480
                MEAT SEPARATOR MACHINE.
                H.S. CODE: 8438.90
              </Text>
            </View>
            <View style={[styles.tableColumn, { flex: 0.5, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>89.000</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 0.5, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>0.450</Text>
            </View>
            <View style={[styles.tableColumn, { flex: 2, alignItems: "flex-start", justifyContent: "flex-start", borderRightWidth: 0 }]}>
              <Text style={styles.text}>Remark</Text>
            </View>
          </View>

          <View style={styles.lastTableRow}>
            <View style={[styles.tableColumn, { flex: 1, borderRightWidth: 0 }]}>
              <Text style={styles.text}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, borderRightWidth: 0 }]}>
              <Text style={styles.text}></Text>
            </View>
            <View style={[styles.tableColumn, { flex: 1, borderRightWidth: 0 }]}>
              <Text style={styles.text}>12 HB/L NO: </Text>
              <Text style={styles.text}>CTNR NO: </Text>
            </View>
          </View>
        </View>
        
        <View>
          <Text style={styles.text}>
            SAYA MENGAKU BAHAWA DAFTA MUATAN IN ADALAH LENGKAP, BETUL SERTA MEMATUHI SEMUA PERUNTUKAN AKTA KASTAM 1967.
          </Text>
          <Text style={styles.text}>
            I HEREBY DECLARE THAT THIS MANIFEST IS COMPLETE, CORRECT AND COMPLY WITH ALL THE PROVISIONS UNDER THE CUSTOM ACTS 1967
          </Text>
        </View>
        
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between' }}>
          <View style={{ width: '40%', alignItems: 'center' }}>
            <Text style={{ ...styles.text, marginTop: 5, textAlign: 'center' }}>{new Date().toLocaleDateString()}</Text>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginBottom: 5, width: '50%' }} />
            <Text style={{ ...styles.text, textAlign: 'center' }}>TARIKH / DATE</Text>
          </View>
          
          <View style={{ width: '40%', alignItems: 'center' }}>
            <View style={{ borderBottomWidth: 1, borderBottomColor: '#000', marginTop: 15, marginBottom: 5, width: '50%' }} />
            <Text style={{ ...styles.text, textAlign: 'center' }}>SIGNATURE OF MASTER / AGENT</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InwardManifest;