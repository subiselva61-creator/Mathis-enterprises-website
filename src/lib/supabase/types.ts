export type ProductOverrideRow = {
  product_id: string;
  price: number | null;
  description: string | null;
  images: string[] | null;
  price_on_request: boolean | null;
  skip_indiamart_price: boolean;
  updated_at: string;
};

export type OrderLineItem = {
  product_id: string;
  name: string;
  quantity: number;
  unit_price: number;
  currency: string;
  line_total_cents: number;
};

export type OrderShippingAddress = {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
};

export type OrderRow = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: OrderShippingAddress;
  line_items: OrderLineItem[];
  subtotal_cents: number;
  currency: string;
  payment_method: string;
  status: string;
};

