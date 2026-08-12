"use client";

import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from "@/context/SocketContext";
import { ToastProvider } from "@/context/ToastContext";
import ChatWidget from "@/components/chat/ChatWidget";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <SocketProvider>
            {children}
            <ChatWidget />
          </SocketProvider>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
