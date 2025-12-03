// Defining custom types for the application
import type { Timestamp } from 'firebase/firestore';

// Type definitions for Korean Copron Smart Distribution Platform
export type CustomerGrade = 'A' | 'B' | 'C';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'user';
  customerGrade?: CustomerGrade;
}


export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  description: string;
  imageUrl?: string;
  createdAt: Timestamp;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  userId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  shippingAddress?: string;
}

export interface InventoryHistory {
  id?: string;
  productId: string;
  changedBy: string; // userId or 'system'
  changeType: 'inbound' | 'outbound' | 'adjustment' | 'initial';
  quantityChange: number;
  previousStock: number;
  newStock: number;
  timestamp: Timestamp;
  reason?: string; // e.g., 'Order #12345', 'Manual correction'
}

export interface PriceRule {
  id?: string;
  name: string;
  type: 'percentage' | 'fixed' | 'set';
  discountValue: number;
  productIds: string[];
  category: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  priority: number;
  exclusive: boolean;
  createdAt: Timestamp;
}

export interface ProductQuestion {
  id?: string;
  productId: string;
  productName: string;
  userId: string;
  userDisplayName: string;
  question: string;
  answer?: string;
  isAnswered: boolean;
  createdAt: Timestamp;
  answeredAt?: Timestamp;
}
