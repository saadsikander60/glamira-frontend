"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency } from "@/lib/adminFormat";
import { useAuth } from "@/context/AuthContext";
import { useCart, getProductId } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ShopPageShell from "@/components/shop/ShopPageShell";
import {
  shopCardClass,
  shopInputClass,
  shopPrimaryBtnClass,
  shopSecondaryBtnClass,
} from "@/components/shop/shopStyles";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, cartTotal, refreshCart, clearLocalCart } = useCart();
  const { showToast } = useToast();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    refreshCart();

    const loadAddresses = async () => {
      try {
        const response = await api.get("/addresses");
        const list: Address[] = response.data.addresses || [];
        setAddresses(list);
        const defaultAddress =
          list.find((item) => item.isDefault) || list[0] || null;
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress._id);
          setForm({
            fullName: defaultAddress.fullName,
            phone: defaultAddress.phone,
            address: defaultAddress.addressLine,
            city: defaultAddress.city,
            postalCode: defaultAddress.postalCode || "",
          });
        }
      } catch {
        setAddresses([]);
      }
    };

    loadAddresses();
  }, [authLoading, isAuthenticated, router, refreshCart]);

  const applyAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = addresses.find((item) => item._id === addressId);
    if (!address) return;
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      address: address.addressLine,
      city: address.city,
      postalCode: address.postalCode || "",
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!cart.items.length) {
      showToast("Your cart is empty", "error");
      router.push("/products");
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post("/orders", {
        paymentMethod,
        shippingAddress: {
          fullName: form.fullName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim() || undefined,
        },
      });

      clearLocalCart();
      showToast(response.data.message || "Order placed successfully", "success");
      router.push("/account/orders");
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <ShopPageShell title="Checkout" description="Preparing checkout...">
        <p className="text-pink-100">Please wait...</p>
      </ShopPageShell>
    );
  }

  return (
    <ShopPageShell
      eyebrow="Checkout"
      title="Complete Your Order"
      description="Confirm shipping details and place your beauty order securely."
    >
      {!cart.items.length ? (
        <div className={`${shopCardClass} p-8 text-center`}>
          <p className="text-pink-100">Your cart is empty.</p>
          <Link href="/products" className={`${shopPrimaryBtnClass} mt-6`}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <form onSubmit={handleSubmit} className={`${shopCardClass} space-y-5 p-6`}>
            {addresses.length > 0 ? (
              <div>
                <label className="mb-2 block text-sm text-pink-100">
                  Saved addresses
                </label>
                <select
                  className={shopInputClass}
                  value={selectedAddressId}
                  onChange={(e) => applyAddress(e.target.value)}
                >
                  {addresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.fullName} — {address.city}
                      {address.isDefault ? " (Default)" : ""}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-pink-100">Full name</label>
                <input
                  className={shopInputClass}
                  required
                  minLength={2}
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-pink-100">Phone</label>
                <input
                  className={shopInputClass}
                  required
                  minLength={7}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-pink-100">Address</label>
              <input
                className={shopInputClass}
                required
                minLength={5}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-pink-100">City</label>
                <input
                  className={shopInputClass}
                  required
                  minLength={2}
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Ajman for local delivery rates"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-pink-100">
                  Postal code
                </label>
                <input
                  className={shopInputClass}
                  value={form.postalCode}
                  onChange={(e) =>
                    setForm({ ...form, postalCode: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm text-pink-100">
                Payment method
              </label>
              <select
                className={shopInputClass}
                value={paymentMethod}
                onChange={(e) =>
                  setPaymentMethod(e.target.value as "COD" | "ONLINE")
                }
              >
                <option value="COD">Cash on Delivery</option>
                <option value="ONLINE">Online Payment</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className={shopPrimaryBtnClass}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
              <Link href="/cart" className={shopSecondaryBtnClass}>
                Back to Cart
              </Link>
              <Link href="/addresses" className={shopSecondaryBtnClass}>
                Manage Addresses
              </Link>
            </div>
          </form>

          <aside className={`${shopCardClass} h-fit p-6`}>
            <h2 className="font-serif text-2xl font-bold text-white">
              Order summary
            </h2>
            <div className="mt-4 space-y-3">
              {cart.items.map((item) => {
                const product =
                  typeof item.product === "string" ? null : item.product;
                const id = getProductId(item);
                if (!product || !id) return null;
                return (
                  <div
                    key={id}
                    className="flex items-center justify-between gap-3 text-sm text-pink-100"
                  >
                    <span>
                      {product.name} × {item.quantity}
                    </span>
                    <span className="text-white">
                      {formatCurrency(product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 border-t border-white/20 pt-4 text-pink-100">
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="font-semibold text-white">
                  {formatCurrency(cartTotal)}
                </span>
              </div>
              <p className="mt-3 text-xs text-pink-200">
                Delivery charge is applied by the server: Ajman city uses local
                rate, all other cities use outside rate.
              </p>
            </div>
          </aside>
        </div>
      )}
    </ShopPageShell>
  );
}
