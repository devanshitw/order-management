export interface User {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  address?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: string;
  category?: Category;
  is_available: boolean;
  preparation_time_minutes?: number;
}

export interface CartItem {
  id: string;
  menu_item_id: string;
  menu_item: MenuItem;
  quantity: number;
  unit_price: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total_amount: number;
  item_count: number;
}

export enum OrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  discount_amount?: number;
  coupon_code?: string;
  delivery_address?: string;
  notes?: string;
  estimated_delivery_at?: string;
  delivered_at?: string;
  created_at: string;
  items?: OrderItem[];
}

export enum DiscountType {
  PERCENTAGE = 'percentage',
  FLAT = 'flat',
}

export interface Offer {
  id: string;
  title: string;
  description?: string;
  discount_type: DiscountType;
  discount_value: number;
  min_order_amount: number;
  coupon_code?: string;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
}

export interface ApiResponse<T> {
  success: boolean;
  status_code: number;
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}
