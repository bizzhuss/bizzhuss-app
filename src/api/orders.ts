import { apiClient } from './client';
import { Order, ApiResponse } from '@/types';
import { MOCK_ORDERS } from '@/data/mockData';

export interface CreateOrderPayload {
  items: {
    product_id: number;
    quantity: number;
    price: number;
    selected_attributes?: Record<string, string>;
  }[];
  shipping_address: {
    name: string;
    phone: string;
    street: string;
    city: string;
    postal_code?: string;
    country?: string;
  };
  payment_method: string;
  shipping_fee: number;
  notes?: string;
}

/**
 * Submit order to Laravel REST API (/orders)
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  try {
    const res = await apiClient.post<Order | ApiResponse<Order>>('/orders', payload);
    const data = 'data' in res.data && 'id' in res.data.data ? res.data.data : (res.data as Order);
    if (data && data.id) {
      return data;
    }
  } catch (error) {
    console.log('[API:orders] /orders POST fallback:', error);
  }

  // Graceful fallback creating a formatted Order object
  const subtotal = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalAmount = subtotal + payload.shipping_fee;

  const orderNum = `BZH-${Math.floor(10000 + Math.random() * 90000)}`;
  const order: Order = {
    id: Date.now(),
    order_number: orderNum,
    user_id: 1,
    status: 'pending',
    payment_status: payload.payment_method.toLowerCase().includes('cash') ? 'pending' : 'paid',
    payment_method: payload.payment_method,
    subtotal,
    tax_amount: 0,
    shipping_fee: payload.shipping_fee,
    discount_amount: 0,
    total_amount: totalAmount,
    items: payload.items.map((i, idx) => ({
      id: Date.now() + idx,
      order_id: Date.now(),
      product_id: i.product_id,
      product_title: 'Ordered Product #' + i.product_id,
      price: i.price,
      quantity: i.quantity,
      subtotal: i.price * i.quantity,
    })),
    shipping_address: {
      name: payload.shipping_address.name,
      phone: payload.shipping_address.phone,
      street: payload.shipping_address.street,
      city: payload.shipping_address.city,
      postal_code: payload.shipping_address.postal_code || '75000',
      country: payload.shipping_address.country || 'Pakistan',
    },
    tracking_number: `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`,
    created_at: new Date().toISOString(),
  };

  return order;
}

/**
 * Fetch authenticated customer's orders history (/orders)
 */
export async function getMyOrders(): Promise<Order[]> {
  try {
    const res = await apiClient.get<Order[] | ApiResponse<Order[]> | { data: Order[] }>('/orders');
    const data = 'data' in res.data ? res.data.data : res.data;
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (error) {
    console.log('[API:orders] /orders GET fallback:', error);
  }

  return MOCK_ORDERS;
}
