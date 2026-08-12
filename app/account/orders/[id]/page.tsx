"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import {
  accountCardClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

interface OrderDetail {
  _id: string;
  status: string;
  totalAmount: number;
  itemsTotal: number;
  deliveryCharge: number;
  deliveryArea?: string;
  currency?: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt?: string;
  items: Array<{
    name?: string;
    quantity: number;
    price: number;
    product?: { _id?: string; name?: string; image?: string };
  }>;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
  };
}

export default function AccountOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { showToast } = useToast();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/orders/${params.id}`);
        setOrder(response.data.order);
      } catch (err) {
        setError(getApiError(err));
        showToast(getApiError(err), "error");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) load();
  }, [params.id, showToast]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className={`${accountCardClass} text-center`}>
        <p className="text-pink-100">{error || "Order not found"}</p>
        <Link href="/account/orders" className={`${accountPrimaryBtnClass} mt-6`}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-pink-200">Order details</p>
          <h2 className="mt-1 font-serif text-2xl font-bold text-white">
            {order._id}
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-pink-100">
            {order.status}
          </span>
          <Link href="/account/orders" className={accountSecondaryBtnClass}>
            All Orders
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={accountCardClass}>
          <h3 className="text-lg font-semibold text-white">Items</h3>
          <div className="mt-4 space-y-3">
            {order.items.map((item, index) => (
              <div
                key={`${order._id}-${index}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/15 bg-white/5 p-3"
              >
                <div className="flex items-center gap-3">
                  {item.product &&
                  typeof item.product === "object" &&
                  item.product.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.image}
                      alt={item.name || "Product"}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : null}
                  <div>
                    <p className="font-medium text-white">
                      {item.name || item.product?.name || "Product"}
                    </p>
                    <p className="text-xs text-pink-200">
                      Qty {item.quantity} · {formatCurrency(item.price)}
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-pink-100">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className={accountCardClass}>
            <h3 className="text-lg font-semibold text-white">Shipping</h3>
            <p className="mt-3 text-sm leading-relaxed text-pink-100">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.phone}
              <br />
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.postalCode
                ? `, ${order.shippingAddress.postalCode}`
                : ""}
            </p>
          </div>

          <div className={accountCardClass}>
            <h3 className="text-lg font-semibold text-white">Payment & totals</h3>
            <div className="mt-4 space-y-2 text-sm text-pink-100">
              <div className="flex justify-between">
                <span>Payment</span>
                <span className="text-white">
                  {order.paymentMethod} · {order.isPaid ? "Paid" : "Unpaid"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="text-white">
                  {formatCurrency(order.itemsTotal, order.currency || "AED")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({order.deliveryArea || "—"})</span>
                <span className="text-white">
                  {formatCurrency(order.deliveryCharge, order.currency || "AED")}
                </span>
              </div>
              <div className="flex justify-between border-t border-white/15 pt-2 text-base font-semibold">
                <span className="text-white">Total</span>
                <span className="text-pink-200">
                  {formatCurrency(order.totalAmount, order.currency || "AED")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
