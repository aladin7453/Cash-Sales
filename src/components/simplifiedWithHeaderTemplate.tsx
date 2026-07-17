import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font, Svg, Rect, Line } from '@react-pdf/renderer';

Font.register({
    family: 'NotoSansSC',
    src: '/fonts/NotoSansSC-Regular.ttf',
});

Font.register({
    family: 'NotoSansSC-Bold',
    src: '/fonts/NotoSansSC-Bold.ttf',
});

// Helpers 
function formatDate(timestamp: number | string): string {
    const date = new Date(Number(timestamp) * 1000);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
}

function formatNum(value: any, decimals = 2): string {
    const n = parseFloat(value);
    if (isNaN(n)) return (0).toFixed(decimals);
    return n.toFixed(decimals);
}

function getCurrentDateTime(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const day = pad(now.getDate());
    const month = pad(now.getMonth() + 1);
    const year = now.getFullYear();
    const hours = now.getHours();
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h12 = pad(hours % 12 || 12);
    return `${day}/${month}/${year} ${h12}:${minutes}:${seconds} ${ampm}`;
}

/** Group items by taxCode → sum taxAmount */
function buildTaxSummary(items: any[]): Record<string, number> {
    const summary: Record<string, number> = {};
    if (!Array.isArray(items)) return summary;
    items.forEach((item) => {
        const code = item.taxCode;
        if (!code) return;
        const amt = parseFloat(item.taxAmount ?? item.tax ?? 0);
        summary[code] = (summary[code] ?? 0) + amt;
    });
    return summary;
}

function renderLines(text: string | undefined, style: any, keyPrefix: string) {
    if (!text) return null;
    return String(text)
        .replace(/\r/g, '')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .map((line, i) => (
            <Text key={`${keyPrefix}-${i}`} style={style}>{line}</Text>
        ));
}

const RECEIPT_WIDTH = 226.8;
const BOX_PADDING = 30 * 2;
const BOX_WIDTH = RECEIPT_WIDTH - BOX_PADDING;
const DASHED_HEADER_HEIGHT = 17;
const DASHED_ROW_HEIGHT = 17;

const PAGE_VERTICAL_PADDING = 14 + 14;
const TITLE_BLOCK_HEIGHT = 15 + 11 + 4;
const INFO_SECTION_HEIGHT = 4 * 10 + 4;
const ITEMS_HEADER_HEIGHT = 7 + 3 * 2 + 2;
const ITEM_ROW_HEIGHT = 11;
const SECOND_DESC_ROW_HEIGHT = 11;
const DIVIDER_THICK_HEIGHT = 2 + 3 * 2;
const DIVIDER_THIN_HEIGHT = 0.5 + 2 * 2;
const SUMMARY_ROW_HEIGHT = 7 + 3 + 1;
const SUMMARY_ROWS_COUNT = 9;
const DASHED_BOX_MARGIN_TOP = 16;
const FOOTER_HEIGHT = 6 + 10;
const SAFETY_BUFFER = 24;

const paymentBoxHeight = DASHED_HEADER_HEIGHT + DASHED_ROW_HEIGHT;

// Styles 
const s = StyleSheet.create({
    page: {
        width: 226.8,
        paddingTop: 14,
        paddingBottom: 14,
        paddingHorizontal: 30,
        fontSize: 7,
        fontFamily: 'NotoSansSC',
    },

    topSection: {
        position: 'relative',
        alignItems: 'center',
        marginBottom: 8,
        marginTop: 20,
    },
    companyLogo: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
        height: 30,
        objectFit: 'fill',
    },
    companyNameBlock: {
        width: '70%',
        textAlign: 'center',
        paddingLeft: 15,
    },
    companyNameText: {
        fontSize: 7,
        lineHeight: 1.4,
    },
    companyPhone: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 7,
        lineHeight: 1.4,
    },

    // Title
    titleBlock: {
        textAlign: 'center',
        marginBottom: 4,
        marginTop: 15,
    },
    titleText: {
        fontSize: 11,
        fontFamily: 'NotoSansSC-Bold',
    },

    // Info section
    infoSection: {
        textAlign: 'right',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 7,
    },

    // Dividers
    dividerThick: {
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        marginVertical: 3,
    },
    dividerThin: {
        borderBottomWidth: 0.5,
        borderBottomColor: '#555555',
        marginVertical: 2,
    },

    // Items table header
    itemsHeader: {
        flexDirection: 'row',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: '#000',
        paddingVertical: 3,
        marginBottom: 2,
    },
    colItem: { flex: 3, fontSize: 7 },
    colQty: { flex: 2, fontSize: 7, textAlign: 'center' },
    colPrice: { flex: 2, fontSize: 7, textAlign: 'center' },
    colAmount: { flex: 2, fontSize: 7, textAlign: 'right' },

    // Item rows
    secondDescRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    secondDescText: {
        fontSize: 7,
        fontFamily: 'NotoSansSC-Bold',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },

    // Summary table
    summaryTable: {
        marginTop: 4,
        marginBottom: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 1,
        textAlign: 'right',
        marginTop: 3,
    },
    summaryLabel: {
        fontSize: 7,
        flex: 1,
    },
    summaryValue: {
        fontSize: 7,
        textAlign: 'right',
        width: 70,
    },

    // Dashed box
    dashedBox: {
        position: 'relative',
        marginTop: 16,
    },
    dashedBoxHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
    },
    dashedBoxRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
    },
    dashedBoxRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 4,
    },
    dashedBoxLabel: {
        fontSize: 7,
        flex: 1,
    },
    dashedBoxValue: {
        fontSize: 7,
        textAlign: 'right',
        width: 60,
    },

    // Footer
    footer: {
        marginTop: 6,
        textAlign: 'center',
        fontSize: 7,
    },
});

// Component 

type Props = {
    previewData: any;
    itemsData?: any[];
    currentCompanyData: any;
    currentUser?: any;
    preferenceData?: any;
};

const SimplifiedPDF = ({ previewData, itemsData, currentCompanyData, currentUser, preferenceData }: Props) => {
    if (!previewData) {
        return (
            <Document>
                <Page size={[226.8, 400]} style={s.page} wrap={false}>
                    <Text>Loading data...</Text>
                </Page>
            </Document>
        );
    }

    // Support both single-doc and multi-doc (array) usage
    const pages: any[] = Array.isArray(previewData) ? previewData : [previewData];

    return (
        <Document>
            {pages.map((doc, pageIndex) => {
                // Items: multi-doc passes items inside each doc, single-doc passes via itemsData prop
                const items: any[] = Array.isArray(previewData)
                    ? (doc.itemsData ?? [])
                    : (itemsData ?? []);

                const taxSummary = buildTaxSummary(items);
                const taxSummaryEntries = Object.entries(taxSummary);
                const hasTax =
                    taxSummaryEntries.length > 0 ||
                    !!doc.taxCode ||
                    parseFloat(doc.totalTax ?? 0) !== 0;
                // Tax box grows with the number of distinct tax codes (falls back to 1 row)
                const taxRowCount = taxSummaryEntries.length > 0 ? taxSummaryEntries.length : 1;
                const taxBoxHeight = DASHED_HEADER_HEIGHT + DASHED_ROW_HEIGHT * taxRowCount;

                const totalQty = items.reduce((sum, i) => sum + parseFloat(i.quantity ?? 0), 0);
                const paidAmt = parseFloat(doc.paidAmount ?? 0);
                const totalPayable = parseFloat(doc.totalPayable ?? 0);
                const change = paidAmt - totalPayable;
                const customerPaymentMethodCode =
                    preferenceData?.data?.customerPaymentMethodCode ||
                    preferenceData?.preference?.data?.customerPaymentMethodCode ||
                    '';
                const currencyCode =
                    doc.currencyCode || doc.currencySymbol || 'RM';

                const secondDescCount = items.reduce(
                    (count, item) => count + (item['2ndDescription'] ? 1 : 0),
                    0
                );
                const itemsHeight =
                    items.length * ITEM_ROW_HEIGHT + secondDescCount * SECOND_DESC_ROW_HEIGHT;

                const contentHeight =
                    PAGE_VERTICAL_PADDING +
                    TITLE_BLOCK_HEIGHT +
                    INFO_SECTION_HEIGHT +
                    ITEMS_HEADER_HEIGHT +
                    itemsHeight +
                    DIVIDER_THICK_HEIGHT +
                    SUMMARY_ROWS_COUNT * SUMMARY_ROW_HEIGHT +
                    DIVIDER_THIN_HEIGHT +
                    (hasTax ? DASHED_BOX_MARGIN_TOP + taxBoxHeight : 0) +
                    DASHED_BOX_MARGIN_TOP +
                    paymentBoxHeight +
                    FOOTER_HEIGHT +
                    SAFETY_BUFFER;

                const pageHeight = Math.max(450, contentHeight);

                return (
                    <Page key={pageIndex} size={[226.8, pageHeight]} style={s.page} wrap={false}>

                        {/*  Company header (logo + name/address/phone) */}
                        <View style={s.topSection}>
                            {!!currentCompanyData?.logoLink?.[0]?.base64 && (
                                <Image
                                    style={s.companyLogo}
                                    src={currentCompanyData.logoLink[0].base64}
                                />
                            )}
                            <View style={s.companyNameBlock}>
                                {renderLines(currentCompanyData?.company, s.companyNameText, 'company')}
                                {renderLines(currentCompanyData?.address, s.companyNameText, 'address')}
                                {!!currentCompanyData?.phoneNo && (
                                    <Text style={s.companyPhone}>
                                        Tel: {currentCompanyData.phoneNo}
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/*  CASH BILL title */}
                        <View style={s.titleBlock}>
                            <Text style={s.titleText}>CASH BILL</Text>
                        </View>

                        {/*  Info section */}
                        <View style={s.infoSection}>
                            <Text style={s.infoText}>No.: {doc.docNo || ''}</Text>
                            <Text style={s.infoText}>
                                Date: {doc.docDate ? formatDate(doc.docDate) : ''}
                            </Text>
                            <Text style={s.infoText}>
                                Cashier: {currentUser?.loginUser || ''}
                            </Text>
                            <Text style={s.infoText}>
                                Customer: {doc.customerCodeCode || ''}
                            </Text>
                        </View>

                        {/*  Items table */}
                        <View style={s.itemsHeader}>
                            <Text style={s.colItem}>Item</Text>
                            <Text style={s.colQty}>Qty</Text>
                            <Text style={s.colPrice}>Price</Text>
                            <Text style={s.colAmount}>Amount</Text>
                        </View>

                        {items.map((item, i) => (
                            <React.Fragment key={i}>
                                {/* 2ndDescription bold row */}
                                {!!item['2ndDescription'] && (
                                    <View style={s.secondDescRow}>
                                        <Text style={s.secondDescText}>{item['2ndDescription']}</Text>
                                    </View>
                                )}
                                <View style={s.itemRow}>
                                    <Text style={s.colItem}>
                                        {item.itemName || item.itemCode || item.description || ''}
                                    </Text>
                                    <Text style={s.colQty}>
                                        {item.quantity ?? ''} {item.itemUOM || ''}
                                    </Text>
                                    <Text style={s.colPrice}>
                                        {formatNum(item.price)}
                                    </Text>
                                    <Text style={s.colAmount}>
                                        {formatNum(item.amount ?? (parseFloat(item.price ?? 0) * parseFloat(item.quantity ?? 0)))}
                                    </Text>
                                </View>
                            </React.Fragment>
                        ))}

                        {/*  Summary rows */}
                        <View style={s.dividerThick} />
                        <View style={s.summaryTable}>
                            {[
                                ['Total Amount:', formatNum(doc.totalAmount)],
                                ['Total Discount:', formatNum(doc.totalDiscount)],
                                ['Total Tax:', formatNum(doc.totalTax)],
                                ['Total Amt Inc. Tax:', formatNum(doc.totalInclTax)],
                                ['Rounding Adjustment:', formatNum(doc.roundingAmount)],
                                ['Total Payable:', formatNum(doc.totalPayable)],
                                ['Paid Amount:', formatNum(doc.paidAmount)],
                                ['Change:', formatNum(change)],
                                ['Total Qty Tender:', String(doc.totalQuantity ?? totalQty)],
                            ].map(([label, value]) => (
                                <View key={label} style={s.summaryRow}>
                                    <Text style={s.summaryLabel}>{label}</Text>
                                    <Text style={s.summaryValue}>{value}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={s.dividerThin} />

                        {/*  Tax summary dashed box (only if tax exists) */}
                        {hasTax && (
                            <View style={[s.dashedBox, { height: taxBoxHeight }]}>
                                <Svg
                                    style={{ position: 'absolute', top: 0, left: 0 }}
                                    width={BOX_WIDTH}
                                    height={taxBoxHeight}
                                >
                                    <Rect
                                        x={0.5}
                                        y={0.5}
                                        width={BOX_WIDTH - 1}
                                        height={taxBoxHeight - 1}
                                        stroke="#000"
                                        strokeWidth={1}
                                        strokeDasharray="8,6"
                                        fill="none"
                                    />
                                    <Line
                                        x1={0}
                                        y1={DASHED_HEADER_HEIGHT}
                                        x2={BOX_WIDTH}
                                        y2={DASHED_HEADER_HEIGHT}
                                        stroke="#000"
                                        strokeWidth={1}
                                        strokeDasharray="8,6"
                                    />
                                </Svg>
                                <View style={s.dashedBoxHeader}>
                                    <Text style={s.dashedBoxLabel}>Tax Summary</Text>
                                    <Text style={s.dashedBoxValue}>Amount (RM)</Text>
                                </View>
                                {taxSummaryEntries.length > 0
                                    ? taxSummaryEntries.map(([code, amt], i, arr) => (
                                        <View
                                            key={code}
                                            style={i === arr.length - 1 ? s.dashedBoxRowLast : s.dashedBoxRow}
                                        >
                                            <Text style={s.dashedBoxLabel}>{code}</Text>
                                            <Text style={s.dashedBoxValue}>{formatNum(amt)}</Text>
                                        </View>
                                    ))
                                    :
                                    (
                                        <View style={s.dashedBoxRowLast}>
                                            <Text style={s.dashedBoxLabel}>{doc.taxCode || ''}</Text>
                                            <Text style={s.dashedBoxValue}>{formatNum(doc.totalTax)}</Text>
                                        </View>
                                    )
                                }
                            </View>
                        )}

                        {/*  Payment summary dashed box */}
                        <View style={[s.dashedBox, { height: paymentBoxHeight }]}>
                            <Svg
                                style={{ position: 'absolute', top: 0, left: 0 }}
                                width={BOX_WIDTH}
                                height={paymentBoxHeight}
                            >
                                <Rect
                                    x={0.5}
                                    y={0.5}
                                    width={BOX_WIDTH - 1}
                                    height={paymentBoxHeight - 1}
                                    stroke="#000"
                                    strokeWidth={1}
                                    strokeDasharray="8,6"
                                    fill="none"
                                />
                                <Line
                                    x1={0}
                                    y1={DASHED_HEADER_HEIGHT}
                                    x2={BOX_WIDTH}
                                    y2={DASHED_HEADER_HEIGHT}
                                    stroke="#000"
                                    strokeWidth={1}
                                    strokeDasharray="8,6"
                                />
                            </Svg>
                            <View style={s.dashedBoxHeader}>
                                <Text style={s.dashedBoxLabel}>Payment Summary</Text>
                                <Text style={s.dashedBoxValue}>Doc Amount (RM)</Text>
                            </View>
                            <View style={s.dashedBoxRowLast}>
                                <Text style={s.dashedBoxLabel}>
                                    {customerPaymentMethodCode
                                        ? `${customerPaymentMethodCode} (${doc.paymentMethodCode || ''})`
                                        : doc.paymentMethodCode || ''}
                                </Text>
                                <Text style={s.dashedBoxValue}>{formatNum(doc.totalSubtotal)}</Text>
                            </View>
                        </View>

                        {/*  Generated timestamp */}
                        <View style={s.footer}>
                            <Text>Generated at {getCurrentDateTime()}</Text>
                        </View>

                    </Page>
                );
            })}
        </Document>
    );
};

export default React.memo(SimplifiedPDF);