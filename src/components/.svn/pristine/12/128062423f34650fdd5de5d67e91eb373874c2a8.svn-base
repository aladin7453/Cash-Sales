import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import { ErpLogo } from "./icons/erpLogo";

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
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
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontSize: 11,
      marginRight: 10,
    },
    mainContainer: {
      fontSize: 12,
      marginTop: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    leftColumn: {
      width: '50%', 
      paddingRight: 10,
    },
    rightColumn: {
      width: '15%', 
      marginRight: 10,
      textAlign: 'left',
    },
    section: {
      fontSize: 9,
      marginBottom: 10,
    },
    authorisedSignatureSection: {
      width: '30%',
      fontSize: 9,
      marginBottom: 10,
      textAlign:'center',
    },
    recipientSignatureSection: {
      width: '30%',
      fontSize: 9,
      marginBottom: 10,
      textAlign:'center',
    },
    systemUserSection: {
      width: '80%',
      fontSize: 9,
      marginBottom: 10,
      textAlign:'right',
    },
    templateNameSection: {
      position: 'absolute',
      fontSize: 9,
      bottom: 30,
      left: 30,
      textAlign: 'left',
      color: 'grey',
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: 1000,
      textAlign: 'right',
      marginTop: 50,
    },
    ePODTitle: {
      fontSize: 10,
      fontWeight: 1000,
      textAlign: 'left',
      marginTop: 10,
    },
    sectionRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sectionText: {
      fontSize: 9,
      marginRight: 10,
    },
    table: {
      width: '100%',
      marginTop: 10,
      marginBottom: 10,
      borderStyle: 'solid',
      borderColor: '#000000',
      borderTopWidth: 1,
      borderCollapse: 'collapse',
    },
    qtyTableContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 10,
    },
    qtyTable: {
      width: '50%',
      borderStyle: 'solid',
      borderColor: '#000000',
      borderTopWidth: 1,
      borderCollapse: 'collapse',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: '#000000',
    },
    tableCell: {
      padding: 5,
      fontSize: 10,
      textAlign: 'center',
      flexShrink: 1,
      borderTopWidth: 0,
      borderBottomWidth: 0, 
      borderColor: '#000000',
    },
    qtyTableCell: {
      padding: 5,
      fontSize: 10,
      textAlign: 'center',
      flexShrink: 1,
      borderRightWidth: 1,
      borderLeftWidth: 1, 
      borderColor: '#000000',
    },
    tableCellLeftAlign: {
      textAlign: 'left',
    },
    tableCellRightAlign: {
      textAlign: 'right',
    },
    noBorderLeft: {
      borderLeftWidth: 0,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    tableHeader: {
      backgroundColor: '#eeeeee',
      fontWeight: 'bold',
    },
    firstSeparator: {
      width: '100%',
      height: 1,
      backgroundColor: '#000000',
      marginTop: 5,
      marginBottom: 10,
    },
    secondSeparator: {
      width: '100%',
      height: 1,
      backgroundColor: '#000000',
      marginTop: 400,
      marginBottom: 10,
    },    
    ePODSeparator: {
      width: '100%',
      height: 1,
      backgroundColor: '#000000',
      marginTop: 10,
      marginBottom: 10,
    },
    signatureSeparator: {
      width: '100%',
      height: 1,
      backgroundColor: '#000000',
      marginTop: 250,
      marginBottom: 10,
    },  
    deliveryVerifierContainer: {
      fontSize: 10,
      marginTop: 0,
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    deliverySection: {
      width: '70%', 
      height: 100,
      paddingRight: 10,
    },
    verifierSection: {
      width: '50%', 
      height: 100,
      marginRight: 10,
      textAlign: 'left',
    },
    remarkSection: {
      width: '100%', 
      height: 60,
      paddingLeft: 10,
      marginRight: 10,
      textAlign: 'left',
      borderStyle: 'solid',
      borderRadius: 8,
      borderColor: '#e0e0e0',
      borderWidth: 1.5,
    },
    verifierSignatureSection: {
      width: '100%', 
      height: 60,
      paddingLeft: 10,
      marginRight: 10,
      textAlign: 'left',
      borderStyle: 'solid',
      borderRadius: 8,
      borderColor: '#e0e0e0',
      borderWidth: 1.5,
    },
    authorisedSignatureLine: {
      width: '100%',
      height: 1,
      backgroundColor: '#000000',
      marginTop: 60,
      marginBottom: 10,
    },
    recipientSignatureLine: {
      width: '100%',
      height: 1,
      textAlign:'left',
      backgroundColor: '#000000',
      marginTop: 60,
      marginBottom: 10,
      },
    goodConditionSection: {
      fontSize: 8,
      marginBottom: 10,
      textAlign:'right',
    },
    logoContainer: {
      position: 'absolute',
      top: 30,
      left: 30,
      width: 100,
      height: 100,
      marginBottom: 10,
      overflow: 'hidden', 
      padding: 0,
    },
    logoImage: {
      width: 100,
      height: 100,
      objectFit: "contain",
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 9,
      bottom: 30,
      right: 30,
      textAlign: 'right',
      color: 'grey',
    },
    signatureImage: {
      width: 100,
      height: 100,
      resizeMode: 'contain',
    }
  });


const DeliveryOrderTemplate = ({ deliveryOrderData, itemsData, companyData, deliveryOrderHasAssignments, signatureImage }) => {
  if (!deliveryOrderData) {
    return (
      <View style={styles.page}>
        <Text>Loading...</Text>
      </View>
    );
  }
  
  const itemArray = Array.isArray(itemsData) ? itemsData : [];
  const assignmentsArray = Array.isArray(deliveryOrderHasAssignments) ? deliveryOrderHasAssignments : [];

  const signatureUrl = assignmentsArray.length > 0 && assignmentsArray[0].actualDeliverySignature
  ? assignmentsArray[0].actualDeliverySignature[0].file
  : '';

  const attachmentUrl = assignmentsArray.length > 0 && assignmentsArray[0].actualDeliveryAttachment
  ? assignmentsArray[0].actualDeliveryAttachment[0].file
  : '';

  return(
    <Document>
    <Page size="A4" style={styles.page}>
        {/* Logo Image */}
        <View style={styles.logoContainer}>
            <Image style={styles.logoImage} src={ErpLogo} /> 
        </View>

        <View style={styles.header}>
        <Text>
          {companyData.company || ""} ({companyData.BRN || ""})
        </Text>
        <Text>
            100, No. 100,Jalan 1000, 10000
        </Text>
        <View style={styles.headerRow}>
            <Text style={styles.headerText}>Phone No.: {companyData.phoneNo || ""}</Text>
            <Text style={styles.headerText}>Email: {companyData.email || ""}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>DELIVERY ORDER</Text>
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
            <Text>Customer01 Company</Text>
            <Text>Address Customer01 Company</Text>
          </View>
          <View style={styles.section}>
            <Text>Attention: {deliveryOrderData.attentionName || ""}</Text>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionText}>Phone No.: {deliveryOrderData.phoneNo || ""}</Text>
              <Text style={styles.sectionText}>Email: {deliveryOrderData.email || ""}</Text>
        </View>
          </View>
          <View style={styles.section}>
            <Text>DESC: {deliveryOrderData.description || ""}</Text>
          </View>
        </View>

        {/* Delivery Order Details */}
        <View style={styles.rightColumn}>
          <View style={styles.section}>
            <Text>No.: {deliveryOrderData.docNo || ""}</Text>
            <Text>Date: {deliveryOrderData.docDateFormat || ""}</Text>
            <Text>Agent: {deliveryOrderData.agentName || ""}</Text>
            <Text>Terms: {deliveryOrderData.creditTermCode || ""}</Text>
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
                <Text>{deliveryOrderData.totalQuantity || ""}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Template Name */}
        <Text style={styles.templateNameSection}>
            Sales Delivery Order - 002
        </Text>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
        )} fixed />

    </Page>
    <Page size="A4" style={styles.page}>
        {/* Logo Image */}
        <View style={styles.logoContainer}>
            <Image style={styles.logoImage} src={ErpLogo} /> 
        </View>

        <View style={styles.header}>
        <Text>
          {companyData.company || ""} ({companyData.BRN || ""})
        </Text>
        <Text>
            100, No. 100,Jalan 1000, 10000
        </Text>
        <View style={styles.headerRow}>
            <Text style={styles.headerText}>Phone No.: {companyData.phoneNo || ""}</Text>
            <Text style={styles.headerText}>Email: {companyData.email || ""}</Text>
          </View>
          <View>
            <Text style={styles.sectionTitle}>DELIVERY ORDER</Text>
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
            <Text>Customer01 Company</Text>
            <Text>Address Customer01 Company</Text>
          </View>
          <View style={styles.section}>
            <Text>Attention: {deliveryOrderData.attentionName || ""}</Text>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionText}>Phone No.: {deliveryOrderData.phoneNo || ""}</Text>
              <Text style={styles.sectionText}>Email: {deliveryOrderData.email || ""}</Text>
        </View>
          </View>
          <View style={styles.section}>
            <Text>DESC: {deliveryOrderData.description || ""}</Text>
          </View>
        </View>

        {/* Delivery Order Details */}
        <View style={styles.rightColumn}>
          <View style={styles.section}>
            <Text>No.: {deliveryOrderData.docNo || ""}</Text>
            <Text>Date: {deliveryOrderData.docDateFormat || ""}</Text>
            <Text>Agent: {deliveryOrderData.agentName || ""}</Text>
            <Text>Terms: {deliveryOrderData.creditTermCode || ""}</Text>
          </View>
        </View>
      </View>
        
      <View>
            <View style={styles.ePODSeparator} />
        </View>

        {/* ePOD Details */}        
        <View style={styles.section}>
            <View style={styles.ePODTitle}>
                <Text>Electronic Proof of Delivery (ePOD)</Text>
            </View>
        </View>

        {assignmentsArray.map((assignment, index) => {
          return (
          <View  key={index}>
          <View style={styles.deliveryVerifierContainer}>
              <View style={styles.deliverySection}>
                  <View style={styles.section}>
                      <Text>Delivery Date and Time: {assignment.deliveredAtFormat || ""}</Text>
                      <Text>Delivery Location: {assignment.actualDeliveryAddress || ""}</Text>
                      <Text>Driver Remark:</Text>
                  </View>

                  <View style={styles.remarkSection}>
                      <View style={styles.section}>
                          <Text>{assignment.actualDeliveryRemark || ""}</Text>
                      </View>
                  </View>
              </View>


              <View style={styles.verifierSection}>
                  <View style={styles.section}>
                      <Text>Verifier Name: {assignment.actualDeliveryRecipient || ""}</Text>
                      <Text>Verifier NRIC: {assignment.actualDeliveryNIRC || ""}</Text>
                      <Text>Verifier Signature:</Text>
                  </View>
          
                  <View style={styles.verifierSignatureSection}>
                    {signatureUrl ? (
                      <Image
                        style={styles.signatureImage}
                        src={signatureUrl}
                      />
                    ) : (
                      <Text>No signature provided.</Text>
                    )}
                  </View>
              </View>
          </View>

          <View style={styles.section}>
            <Text>Photo:</Text>
              {attachmentUrl ? (
                <Image
                  style={styles.attachmentImage}
                  src={attachmentUrl}
                />
              ) : (
              <Text>No signature provided.</Text>
            )}
          </View>
        </View>
        );
        })}
        <View>
            <View style={styles.signatureSeparator} />
        </View>

        <View style={styles.goodConditionSection}>
            <Text>Goods received in Good Condition and Order</Text>
        </View>

        {/* Authorised Signature */}
        <View style={styles.mainContainer}>
            <View style={styles.authorisedSignatureSection}>
                <View style={styles.authorisedSignatureLine} />
                <Text>Authorised Signature</Text>
            </View>
            
            <View style={styles.recipientSignatureSection}>
                <View style={styles.recipientSignatureLine} />
                <Text>Recipient Signature and Chop</Text>
            </View>
        </View>

        {/* Template Name */}
        <Text style={styles.templateNameSection}>
            Sales Delivery Order - 002
        </Text>

        {/* Page Number */}
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
            `Page ${pageNumber} of ${totalPages}`
        )} fixed />

    </Page>
  </Document>
);
};

export default DeliveryOrderTemplate;
