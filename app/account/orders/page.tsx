"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate, truncateId } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import {
  accountCardClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

interface OrderListItem {
  _id: string;
  status: string;
  totalAmount: number;
  currency?: string;
  paymentMethod: string;
  isPaid: boolean;
  createdAt?: string;
  items: Array<{ name?: string; quantity: number }>;
}

export default function AccountOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get("/orders/my-orders");
        setOrders(response.data.orders || []);
      } catch (error) {
        showToast(getApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showToast]);

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`${accountCardClass} text-center`}>
        <h2 className="font-serif text-2xl font-bold text-white">No orders yet</h2>
        <p className="mt-2 text-pink-100">
          When you place an order, it will appear here.
        </p>
        <Link href="/products" className={`${accountPrimaryBtnClass} mt-6`}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-2">
        <h2 className="font-serif text-2xl font-bold text-white">My Orders</h2>
        <p className="mt-1 text-sm text-pink-100">
          Track every Glamira Essence purchase in one place.
        </p>
      </div>

      {orders.map((order) => {
        const summary = order.items
          .slice(0, 2)
          .map((item) => `${item.name || "Item"} × ${item.quantity}`)
          .join(", ");

        return (
          <div key={order._id} className={accountCardClass}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-pink-200">
                  Order {truncateId(order._id, 10)}
                </p>
                <p className="mt-1 font-serif text-xl font-semibold text-white">
                  {formatCurrency(order.totalAmount, order.currency || "AED")}
                </p>
                <p className="mt-2 text-sm text-pink-100">
                  {formatDate(order.createdAt)} · {order.paymentMethod} ·{" "}
                  {order.isPaid ? "Paid" : "Unpaid"}
                </p>
                <p className="mt-1 text-xs text-pink-200/90">{summary}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-pink-100">
                  {order.status}
                </span>
                <Link
                  href={`/account/orders/${order._id}`}
                  className={accountPrimaryBtnClass}
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <Link href="/products" className={accountSecondaryBtnClass}>
        Continue Shopping
      </Link>
    </div>
  );
}
