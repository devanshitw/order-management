import client from './client';
import { Cart } from '../types';

export const cartApi = {
  getCart: () => client.get('/cart') as Promise<Cart>,

  addItem: (data: { menu_item_id: string; quantity: number }) =>
    client.post('/cart/items', data) as Promise<Cart>,

  updateItem: (id: string, data: { quantity: number }) =>
    client.patch(`/cart/items/${id}`, data) as Promise<Cart>,

  removeItem: (id: string) =>
    client.delete(`/cart/items/${id}`) as Promise<Cart>,

  clearCart: () => client.delete('/cart') as Promise<Cart>,
};
