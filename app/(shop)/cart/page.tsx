"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getProductId, useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/adminFormat";
import ShopPageShell from "@/components/shop/ShopPageShell";
import {
  shopCardClass,
  shopPrimaryBtnClass,
  shopSecondaryBtnClass,
} from "@/components/shop/shopStyles";

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const {
    cart,
    cartTotal,
    loading,
    refreshing,
    refreshCart,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      refreshCart();
    }
  }, [authLoading, isAuthenticated, refreshCart]);

  if (authLoading) {
    return (
      <ShopPageShell title="Your Cart" description="Checking your session...">
        <p className="text-pink-100">Please wait...</p>
      </ShopPageShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <ShopPageShell
        eyebrow="Cart"
        title="Sign in to view your cart"
        description="Guests can browse products freely. Login to save items and checkout securely."
      >
        <div className={`${shopCardClass} max-w-xl p-8`}>
          <p className="text-pink-100">
            Create an account or login to add beauty essentials to your cart and
            place orders.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className={shopPrimaryBtnClass}>
              Login
            </Link>
            <Link href="/register" className={shopSecondaryBtnClass}>
              Create Account
            </Link>
            <Link href="/products" className={shopSecondaryBtnClass}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </ShopPageShell>
    );
  }

  const items = cart.items || [];

  return (
    <ShopPageShell
      eyebrow="Cart"
      title="Your Shopping Cart"
      description="Review your beauty picks before checkout."
    >
      {refreshing && items.length === 0 ? (
        <p className="text-pink-100">Loading cart...</p>
      ) : items.length === 0 ? (
        <div className={`${shopCardClass} p-8 text-center`}>
          <p className="text-pink-100">Your cart is empty.</p>
          <Link href="/products" className={`${shopPrimaryBtnClass} mt-6`}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => {
              const product =
                typeof item.product === "string" ? null : item.product;
              const productId = getProductId(item);
              if (!product || !productId) return null;

              return (
                <div
                  key={productId}
                  className={`${shopCardClass} flex flex-col gap-4 p-4 sm:flex-row sm:items-center`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-28 w-28 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      href={`/products/${productId}`}
                      className="font-serif text-xl font-semibold text-white hover:text-pink-100"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 text-pink-200">
                      {formatCurrency(product.price)}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        disabled={loading || item.quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#be185d] disabled:opacity-50"
                        onClick={async () => {
                          const error = await updateQuantity(
                            productId,
                            item.quantity - 1,
                          );
                          if (error) showToast(error, "error");
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-8 text-center text-white">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        disabled={loading}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#be185d] disabled:opacity-50"
                        onClick={async () => {
                          const error = await updateQuantity(
                            productId,
                            item.quantity + 1,
                          );
                          if (error) showToast(error, "error");
                        }}
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        type="button"
                        disabled={loading}
                        className="ml-2 inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-2 text-xs font-semibold text-rose-700"
                        onClick={async () => {
                          const error = await removeFromCart(productId);
                          if (error) showToast(error, "error");
                          else showToast("Removed from cart", "success");
                        }}
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="font-semibold text-white">
                    {formatCurrency(product.price * item.quantity)}
                  </p>
                </div>
              );
            })}
          </div>

          <aside className={`${shopCardClass} h-fit p-6`}>
            <h2 className="font-serif text-2xl font-bold text-white">Summary</h2>
            <div className="mt-4 flex items-center justify-between text-pink-100">
              <span>Subtotal</span>
              <span className="font-semibold text-white">
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <p className="mt-3 text-xs text-pink-200">
              Delivery charges are calculated at checkout based on your city.
            </p>
            <button
              type="button"
              className={`${shopPrimaryBtnClass} mt-6 w-full`}
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>
            <Link
              href="/products"
              className={`${shopSecondaryBtnClass} mt-3 w-full`}
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </ShopPageShell>
  );
}
