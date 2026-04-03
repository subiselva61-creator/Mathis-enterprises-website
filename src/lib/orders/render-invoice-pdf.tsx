import { renderToBuffer } from "@react-pdf/renderer";
import { OrderInvoiceDocument } from "./OrderInvoiceDocument";
import type { OrderInvoicePdfInput } from "./invoice-types";

export async function renderOrderInvoicePdf(input: OrderInvoicePdfInput): Promise<Buffer> {
  const buf = await renderToBuffer(<OrderInvoiceDocument {...input} />);
  return Buffer.from(buf);
}
