import client from './client';
import { Order } from '../types';

export const orderApi = {
  placeOrder: (data: {
    delivery_address?: string;
    notes?: string;
    coupon_code?: string;
  }) =>
    client.post('/orders', data) as Promise<{
      message: string;
      order: Order;
    }>,

  getOrders: (params?: { page?: number; limit?: number }) =>
    client.get('/orders', { params }) as Promise<{
      orders: Order[];
      meta: { total: number; page: number; limit: number; total_pages: number };
    }>,

  getOrder: (id: string) =>
    client.get(`/orders/${id}`) as Promise<Order>,

  updateStatus: (id: string, status: string) =>
    client.patch(`/orders/${id}/status`, { status }) as Promise<any>,

  simulate: (id: string) =>
    client.post(`/orders/${id}/simulate`) as Promise<any>,
};
