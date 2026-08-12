export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type ContactStatus = "NEW" | "READ" | "RESOLVED";

export type UserRole = "USER" | "ADMIN";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: Category | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderUser {
  _id?: string;
  name?: string;
  email?: string;
}

export interface OrderItem {
  product?: Product | string;
  name?: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  user?: OrderUser;
  items: OrderItem[];
  itemsTotal: number;
  deliveryCharge: number;
  deliveryArea: "AJMAN" | "OUTSIDE";
  totalAmount: number;
  currency?: string;
  status: OrderStatus;
  paymentMethod: "COD" | "ONLINE";
  isPaid: boolean;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: ContactStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Customer {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  product?: {
    _id?: string;
    name?: string;
    image?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  currentMonthSales: number;
  currentMonthOrders: number;
  yearlySales: number;
  yearlyOrders: number;
  currency: string;
}

export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  monthlySalesChart: Array<{
    _id: { month: number; year: number };
    sales: number;
    orders: number;
  }>;
  recentOrders: Order[];
  lowStockProducts?: Product[];
  ordersByStatus?: Record<OrderStatus, number>;
}
