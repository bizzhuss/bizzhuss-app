import { Address } from './user';
import { Product } from './product';

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'cod' | 'paypal' | 'stripe' | 'bank_transfer';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product?: Product;
  product_title: string;
  product_image?: string | null;
  price: number;
  quantity: number;
  subtotal: number;
  vendor_id?: number;
}

export interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod | string;
  total_amount: number;
  subtotal: number;
  tax_amount: number;
  shipping_fee: number;
  discount_amount: number;
  items: OrderItem[];
  shipping_address: Address;
  billing_address?: Address | null;
  tracking_number?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}
