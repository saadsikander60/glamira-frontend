"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  MapPin,
  Star,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate, truncateId } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import {
  accountCardClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

interface DashboardData {
  user: {
    name?: string;
    email?: string;
    role?: string;
    createdAt?: string;
  };
  stats: {
    totalOrders: number;
    totalAddresses: number;
    totalReviews: number;
  };
  recentOrders: Array<{
    _id: string;
    status: string;
    totalAmount: number;
    currency?: string;
    createdAt?: string;
  }>;
  latestOrder: {
    _id: string;
    status: string;
    totalAmount: number;
    currency?: string;
    createdAt?: string;
  } | null;
}

export default function AccountDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/me/dashboard");
        setData(response.data.dashboard);
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

  if (!data) {
    return (
      <div className={`${accountCardClass} text-center text-pink-100`}>
        Could not load your dashboard. Please try again.
      </div>
    );
  }

  const stats = [
    {
      label: "Total Orders",
      value: data.stats.totalOrders,
      icon: Package,
      href: "/account/orders",
    },
    {
      label: "Saved Addresses",
      value: data.stats.totalAddresses,
      icon: MapPin,
      href: "/account/addresses",
    },
    {
      label: "My Reviews",
      value: data.stats.totalReviews,
      icon: Star,
      href: "/account/reviews",
    },
  ];

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium tracking-[0.16em] text-pink-200 uppercase">
          Welcome back
        </p>
        <h2 className="mt-1 font-serif text-3xl font-bold text-white">
          {data.user.name || "Beauty Lover"}
        </h2>
        <p className="mt-2 text-pink-100">
          {data.user.email} · Member since {formatDate(data.user.createdAt)}
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className={`${accountCardClass} transition hover:-translate-y-1 hover:bg-white/15`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-pink-200">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#be185d]">
                <Icon size={20} />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {data.latestOrder ? (
        <section className={accountCardClass}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-pink-200">Latest order status</p>
              <p className="mt-2 font-serif text-2xl font-bold text-white">
                {data.latestOrder.status}
              </p>
              <p className="mt-1 text-sm text-pink-100">
                {truncateId(data.latestOrder._id, 10)} ·{" "}
                {formatCurrency(
                  data.latestOrder.totalAmount,
                  data.latestOrder.currency || "AED",
                )}{" "}
                · {formatDate(data.latestOrder.createdAt)}
              </p>
            </div>
            <Link
              href={`/account/orders/${data.latestOrder._id}`}
              className={accountPrimaryBtnClass}
            >
              View Order
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Recent orders</h3>
          {data.recentOrders.length === 0 ? (
            <div className={`${accountCardClass} text-pink-100`}>
              No orders yet. Start shopping to see them here.
              <div className="mt-4">
                <Link href="/products" className={accountPrimaryBtnClass}>
                  <ShoppingBag size={16} />
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentOrders.map((order) => (
                <Link
                  key={order._id}
                  href={`/account/orders/${order._id}`}
                  className={`${accountCardClass} flex items-center justify-between gap-3 transition hover:bg-white/15`}
                >
                  <div>
                    <p className="font-medium text-white">
                      {truncateId(order._id, 10)}
                    </p>
                    <p className="text-sm text-pink-100">
                      {formatDate(order.createdAt)} · {order.status}
                    </p>
                  </div>
                  <p className="font-semibold text-pink-200">
                    {formatCurrency(order.totalAmount, order.currency || "AED")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className={`${accountCardClass} space-y-4`}>
          <h3 className="text-lg font-semibold text-white">Quick actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/account/profile" className={accountPrimaryBtnClass}>
              Edit Profile
            </Link>
            <Link href="/account/addresses" className={accountSecondaryBtnClass}>
              Manage Addresses
            </Link>
            <Link href="/cart" className={accountSecondaryBtnClass}>
              View Cart
            </Link>
            <Link href="/products" className={accountSecondaryBtnClass}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
