import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { OrderInvoicePdfInput } from "./invoice-types";
import { formatMoneyPdf } from "./format-money-pdf";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9, fontFamily: "Helvetica", color: "#1a1a1a" },
  brand: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 2, color: "#0027eb" },
  tag: { fontSize: 8, color: "#555", marginBottom: 16 },
  h2: { fontSize: 11, fontFamily: "Helvetica-Bold", marginTop: 12, marginBottom: 6 },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
    marginTop: 8,
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
  },
  tableRow: { flexDirection: "row", paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#eee" },
  colItem: { width: "42%" },
  colQty: { width: "12%", textAlign: "right" },
  colUnit: { width: "20%", textAlign: "right" },
  colLine: { width: "26%", textAlign: "right" },
  totals: { marginTop: 14, alignItems: "flex-end" },
  totalLine: { flexDirection: "row", justifyContent: "flex-end", marginTop: 4, width: "100%" },
  totalLabel: { width: 100, textAlign: "right", fontFamily: "Helvetica-Bold" },
  totalVal: { width: 90, textAlign: "right", fontFamily: "Helvetica-Bold" },
  foot: { marginTop: 24, fontSize: 7, color: "#666", lineHeight: 1.4 },
});

function addrBlock(shipping: OrderInvoicePdfInput["shipping"]): string {
  const parts = [
    shipping.line1,
    shipping.line2,
    `${shipping.city}, ${shipping.state} ${shipping.pincode}`,
    shipping.landmark ? `Landmark: ${shipping.landmark}` : null,
  ].filter(Boolean);
  return parts.join("\n");
}

/** Swap styles/layout here to match your official invoice artwork. */
export function OrderInvoiceDocument(props: OrderInvoicePdfInput) {
  const subtotal = props.subtotalCents / 100;
  const dateStr = new Date(props.createdAtIso).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>Mathi Enterprises</Text>
        <Text style={styles.tag}>Chennai, Tamil Nadu · GST 33ACPPV8797A2ZX</Text>
        <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 14 }}>Tax invoice / Proforma</Text>
        <Text style={{ fontSize: 8, color: "#555", marginTop: 2 }}>Order ref: {props.orderId}</Text>
        <Text style={{ fontSize: 8, color: "#555" }}>Date: {dateStr}</Text>
        <Text style={{ fontSize: 8, color: "#555", marginBottom: 8 }}>
          Payment: {props.paymentMethod.toUpperCase()} (cash on delivery)
        </Text>

        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1, marginRight: 24 }}>
            <Text style={styles.h2}>Bill to</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{props.customerName}</Text>
            <Text style={{ fontSize: 8, color: "#444", marginTop: 2 }}>{props.customerEmail}</Text>
            <Text style={{ fontSize: 8, color: "#444" }}>+91 {props.customerPhone}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.h2}>Ship to</Text>
            <Text style={{ fontSize: 9, lineHeight: 1.5 }}>{addrBlock(props.shipping)}</Text>
          </View>
        </View>

        <View style={styles.tableHeader}>
          <Text style={styles.colItem}>Item</Text>
          <Text style={styles.colQty}>Qty</Text>
          <Text style={styles.colUnit}>Unit</Text>
          <Text style={styles.colLine}>Line</Text>
        </View>
        {props.lineItems.map((line) => (
          <View key={line.product_id} style={styles.tableRow} wrap={false}>
            <Text style={styles.colItem}>{line.name}</Text>
            <Text style={styles.colQty}>{line.quantity}</Text>
            <Text style={styles.colUnit}>{formatMoneyPdf(line.unit_price, line.currency)}</Text>
            <Text style={styles.colLine}>{formatMoneyPdf(line.line_total_cents / 100, line.currency)}</Text>
          </View>
        ))}

        <View style={styles.totals}>
          <View style={styles.totalLine}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalVal}>{formatMoneyPdf(subtotal, props.currency)}</Text>
          </View>
        </View>

        <Text style={styles.foot}>
          Indicative amounts — MOQ, freight, and taxes may be adjusted on the final invoice after confirmation. This document
          was generated automatically from your web order.
        </Text>
      </Page>
    </Document>
  );
}
