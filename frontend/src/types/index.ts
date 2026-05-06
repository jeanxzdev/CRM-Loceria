export type Status = 'active' | 'inactive';
export type OrderStatus = 'pending' | 'in_progress' | 'delivered';
export type SaleStatus = 'paid' | 'pending';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface Client {
  id: number;
  name: string;
  phone: string;
  address: string;
  status: Status;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  client_id: number;
  status: OrderStatus;
  total: number;
  date: string;
  client?: Client;
  items?: OrderItem[];
}

export interface Sale {
  id: number;
  client_id: number;
  total: number;
  status: SaleStatus;
  date: string;
  client?: Client;
}

export interface DashboardStats {
  dailySales: number;
  activeClients: number;
  pendingOrders: number;
  recentActivity: any[];
}
