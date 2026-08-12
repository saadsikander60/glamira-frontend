"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { getApiError } from "@/lib/apiError";

export interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
}

export interface CartItem {
  _id?: string;
  product: CartProduct | string;
  quantity: number;
}

export interface Cart {
  _id?: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart;
  cartCount: number;
  cartTotal: number;
  loading: boolean;
  refreshing: boolean;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<string | null>;
  updateQuantity: (productId: string, quantity: number) => Promise<string | null>;
  removeFromCart: (productId: string) => Promise<string | null>;
  clearLocalCart: () => void;
}

const emptyCart: Cart = { items: [] };

const CartContext = createContext<CartContextType | undefined>(undefined);

function getProductId(item: CartItem) {
  return typeof item.product === "string" ? item.product : item.product?._id;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const [cart, setCart] = useState<Cart>(emptyCart);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const clearLocalCart = useCallback(() => {
    setCart(emptyCart);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCart(emptyCart);
      return;
    }

    try {
      setRefreshing(true);
      const response = await api.get("/cart");
      setCart(response.data.cart || emptyCart);
    } catch {
      setCart(emptyCart);
    } finally {
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      clearLocalCart();
      return;
    }

    refreshCart();
  }, [authLoading, isAuthenticated, refreshCart, clearLocalCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      if (!token) {
        return "Please login to add items to your cart";
      }

      try {
        setLoading(true);
        const response = await api.post("/cart", { product: productId, quantity });
        setCart(response.data.cart || emptyCart);
        return null;
      } catch (error) {
        return getApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const updateQuantity = useCallback(
    async (productId: string, quantity: number) => {
      if (!token) return "Please login to update your cart";

      try {
        setLoading(true);
        const response = await api.put(`/cart/${productId}`, { quantity });
        setCart(response.data.cart || emptyCart);
        return null;
      } catch (error) {
        return getApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  const removeFromCart = useCallback(
    async (productId: string) => {
      if (!token) return "Please login to update your cart";

      try {
        setLoading(true);
        const response = await api.delete(`/cart/${productId}`);
        const nextCart = response.data.cart || emptyCart;
        // DELETE response may not populate products — refresh for clean UI
        if (nextCart.items?.some((item: CartItem) => typeof item.product === "string")) {
          await refreshCart();
        } else {
          setCart(nextCart);
        }
        return null;
      } catch (error) {
        return getApiError(error);
      } finally {
        setLoading(false);
      }
    },
    [token, refreshCart],
  );

  const cartCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cart.items],
  );

  const cartTotal = useMemo(
    () =>
      cart.items.reduce((sum, item) => {
        const product = typeof item.product === "string" ? null : item.product;
        return sum + (product?.price || 0) * item.quantity;
      }, 0),
    [cart.items],
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        loading,
        refreshing,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearLocalCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}

export { getProductId };
