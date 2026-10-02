import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MenuItem } from '../data/menuData';

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedAddons: { id: string; name: string; price: number }[];
  instructions?: string;
}

export type OrderType = 'delivery' | 'pickup';

export type OrderState =
  | 'idle'
  | 'placed'
  | 'confirmed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'collected';

interface OrderContextType {
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  addToCart: (item: MenuItem, quantity?: number, addons?: { id: string; name: string; price: number }[], instructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  orderState: OrderState;
  setOrderState: (state: OrderState) => void;
  activeOrderDetails: any | null;
  setActiveOrderDetails: (details: any) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ember_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orderType, setOrderType] = useState<OrderType>('delivery');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderState, setOrderState] = useState<OrderState>('idle');
  const [activeOrderDetails, setActiveOrderDetails] = useState<any | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('ember_cart', JSON.stringify(cart));
    } catch {
      // storage error handling
    }
  }, [cart]);

  const addToCart = (
    item: MenuItem,
    quantity = 1,
    addons: { id: string; name: string; price: number }[] = [],
    instructions = ''
  ) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => ci.menuItem.id === item.id && JSON.stringify(ci.selectedAddons) === JSON.stringify(addons)
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        if (instructions) copy[existingIndex].instructions = instructions;
        return copy;
      }

      const newItem: CartItem = {
        id: `${item.id}-${Date.now()}`,
        menuItem: item,
        quantity,
        selectedAddons: addons,
        instructions,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => {
    const addonsCost = item.selectedAddons.reduce((acc, a) => acc + a.price, 0);
    return sum + (item.menuItem.numericPrice + addonsCost) * item.quantity;
  }, 0);

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <OrderContext.Provider
      value={{
        cart,
        orderType,
        setOrderType,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
        orderState,
        setOrderState,
        activeOrderDetails,
        setActiveOrderDetails,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
