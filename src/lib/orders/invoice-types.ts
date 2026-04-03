import type { OrderLineItem, OrderShippingAddress } from "@/lib/supabase/types";

/** Data for the PDF — edit `OrderInvoiceDocument.tsx` to match your branded template. */
export type OrderInvoicePdfInput = {
  orderId: string;
  createdAtIso: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shipping: OrderShippingAddress;
  lineItems: OrderLineItem[];
  subtotalCents: number;
  currency: string;
  paymentMethod: string;
};
