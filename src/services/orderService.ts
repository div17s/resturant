import { CartItem, OrderType, OrderState } from '../context/OrderContext';
import { analytics } from './analyticsService';

export interface OrderRecord {
  id: string;
  orderNumber: string;
  type: OrderType;
  customerName: string;
  customerPhone: string;
  address?: string;
  specialInstructions?: string;
  items: CartItem[];
  subtotal: number;
  gst: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'CashOnDelivery';
  orderStatus: OrderState;
  createdAt: string;
}

const STORAGE_KEY = 'ember_orders_data';

const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'ord_101',
    orderNumber: 'EO-ORD-9281',
    type: 'delivery',
    customerName: 'Rohit Agrawal',
    customerPhone: '+91 00000 00000',
    address: 'Flat 402, Shalimar Palms, Vijay Nagar, Indore',
    specialInstructions: 'Please include extra mint chutney',
    items: [],
    subtotal: 980,
    gst: 49,
    deliveryFee: 50,
    discount: 0,
    grandTotal: 1079,
    paymentMethod: 'UPI (Google Pay / PhonePe)',
    paymentStatus: 'Paid',
    orderStatus: 'preparing',
    createdAt: new Date(Date.now() - 1200000).toISOString(),
  },
  {
    id: 'ord_102',
    orderNumber: 'EO-ORD-9282',
    type: 'pickup',
    customerName: 'Neha Sen',
    customerPhone: '+91 00000 00000',
    specialInstructions: 'Ready by 20:15',
    items: [],
    subtotal: 840,
    gst: 42,
    deliveryFee: 0,
    discount: 84,
    grandTotal: 798,
    paymentMethod: 'Credit Card',
    paymentStatus: 'Paid',
    orderStatus: 'ready',
    createdAt: new Date(Date.now() - 2400000).toISOString(),
  },
];

class OrderService {
  private orders: OrderRecord[] = [];

  constructor() {
    this.loadOrders();
  }

  private loadOrders() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        this.orders = JSON.parse(data);
      } else {
        this.orders = INITIAL_ORDERS;
        this.saveOrders();
      }
    } catch {
      this.orders = INITIAL_ORDERS;
    }
  }

  private saveOrders() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.orders));
    } catch {
      // ignore
    }
  }

  public async createOrder(
    data: Omit<OrderRecord, 'id' | 'orderNumber' | 'createdAt' | 'orderStatus' | 'paymentStatus'> & {
      paymentStatus?: 'Pending' | 'Paid' | 'CashOnDelivery';
    }
  ): Promise<OrderRecord> {
    await new Promise((res) => setTimeout(res, 800));

    const orderNumber = 'EO-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder: OrderRecord = {
      ...data,
      id: 'ord_' + Date.now(),
      orderNumber,
      orderStatus: 'placed',
      paymentStatus: data.paymentStatus || 'Pending',
      createdAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    this.saveOrders();

    analytics.track('order_completed', {
      orderNumber,
      type: newOrder.type,
      grandTotal: newOrder.grandTotal,
    });

    return newOrder;
  }

  public getOrders(): OrderRecord[] {
    return [...this.orders];
  }

  public getOrder(orderNumber: string): OrderRecord | undefined {
    return this.orders.find((o) => o.orderNumber === orderNumber || o.id === orderNumber);
  }

  public updateOrderStatus(orderId: string, status: OrderState): boolean {
    const order = this.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return false;

    order.orderStatus = status;
    this.saveOrders();
    return true;
  }
}

export const orderService = new OrderService();
