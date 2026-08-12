"use client";

import { useEffect, useState } from "react";
import {
  Package,
  ShoppingBag,
  Users,
  Wallet,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate, truncateId } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import StatCard from "@/components/admin/StatCard";
import LoadingState from "@/components/admin/LoadingState";
import EmptyState from "@/components/admin/EmptyState";
import StatusBadge from "@/components/admin/StatusBadge";
import AdminTable from "@/components/admin/AdminTable";
import type {
  DashboardResponse,
  Order,
  OrderStatus,
  Product,
} from "@/types/admin";

const statusOrder: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminDashboardPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await api.get<DashboardResponse>("/dashboard");
        setData(response.data);
      } catch (error) {
        showToast(getApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [showToast]);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (!data?.stats) {
    return (
      <EmptyState
        title="Dashboard unavailable"
        description="Could not load dashboard statistics. Please try again later."
      />
    );
  }

  const { stats, recentOrders = [], lowStockProducts = [], ordersByStatus } =
    data;
  const currency = stats.currency || "AED";

  return (
    <div className="space-y-8">
      <section>
        <p className="text-sm font-medium tracking-[0.16em] text-pink-200 uppercase">
          Overview
        </p>
        <h2 className="mt-1 font-serif text-2xl font-bold text-white sm:text-3xl">
          Store performance
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-pink-100 sm:text-base">
          Live metrics from your Glamira Essence catalog, customers, and orders.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          hint="Active catalog items"
          icon={Package}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          hint={`${stats.currentMonthOrders} this month`}
          icon={ShoppingBag}
          accent="from-[#9d174d] to-[#db2777]"
        />
        <StatCard
          label="Total Customers"
          value={stats.totalUsers}
          hint="Registered accounts"
          icon={Users}
          accent="from-[#831843] to-[#be185d]"
        />
        <StatCard
          label="Total Revenue"
          value={formatCurrency(stats.totalSales, currency)}
          hint={`${formatCurrency(stats.currentMonthSales, currency)} this month`}
          icon={Wallet}
          accent="from-[#6b1239] to-[#9d174d]"
        />
      </section>

      {ordersByStatus ? (
        <section className="rounded-2xl border border-[#f3d4e0] bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-white">
            Order status overview
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {statusOrder.map((status) => (
              <div
                key={status}
                className="rounded-xl border border-[#f3d4e0] bg-[#fdf2f7]/60 px-3 py-3"
              >
                <StatusBadge status={status} />
                <p className="mt-3 text-2xl font-semibold text-[#3b1026]">
                  {ordersByStatus[status] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-3">
          <h3 className="text-base font-semibold text-white">
            Recent orders
          </h3>
          {recentOrders.length === 0 ? (
            <EmptyState
              title="No recent orders"
              description="New customer orders will appear here."
            />
          ) : (
            <AdminTable
              headers={["Order", "Customer", "Total", "Status", "Date"]}
            >
              {recentOrders.map((order: Order) => (
                <tr key={order._id} className="hover:bg-[#fdf2f7]/50">
                  <td className="px-4 py-3 font-medium text-[#3b1026]">
                    {truncateId(order._id)}
                  </td>
                  <td className="px-4 py-3 text-[#5c2a40]">
                    <div>{order.user?.name || "—"}</div>
                    <div className="text-xs text-[#9f6b82]">
                      {order.user?.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#3b1026]">
                    {formatCurrency(
                      order.totalAmount,
                      order.currency || currency,
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3 text-[#7a4a5e]">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-white">
            <AlertTriangle size={18} className="text-pink-200" />
            Low stock products
          </h3>
          {lowStockProducts.length === 0 ? (
            <EmptyState
              title="Stock looks healthy"
              description="No products currently at or below 5 units."
            />
          ) : (
            <AdminTable headers={["Product", "Price", "Stock"]}>
              {lowStockProducts.map((product: Product) => (
                <tr key={product._id} className="hover:bg-[#fdf2f7]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-[#3b1026]">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#5c2a40]">
                    {formatCurrency(product.price, currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                      {product.stock}
                    </span>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </div>
      </section>
    </div>
  );
}
