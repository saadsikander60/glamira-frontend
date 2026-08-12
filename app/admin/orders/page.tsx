"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate, truncateId } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import AdminTable from "@/components/admin/AdminTable";
import EmptyState from "@/components/admin/EmptyState";
import FormModal from "@/components/admin/FormModal";
import LoadingState from "@/components/admin/LoadingState";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminGhostButtonClass,
  adminInputClass,
  adminPrimaryButtonClass,
} from "@/components/admin/adminStyles";
import type { Order, OrderStatus } from "@/types/admin";

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function AdminOrdersPage() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders");
      setOrders(response.data.orders || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await api.put(`/orders/${orderId}/status`, { status });
      const updated = response.data.order as Order;

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? { ...order, ...updated } : order)),
      );

      if (selected?._id === orderId) {
        setSelected((prev) => (prev ? { ...prev, ...updated } : prev));
      }

      showToast("Order status updated", "success");
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    statusFilter === "ALL"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Orders</h2>
          <p className="mt-1 text-sm text-pink-100">
            Track and update customer order fulfillment.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-pink-100">Filter by status</label>
          <select
            className={adminInputClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All statuses</option>
            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading orders..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="Orders will appear here once customers place them."
        />
      ) : (
        <AdminTable
          headers={[
            "Order",
            "Customer",
            "Total",
            "Payment",
            "Status",
            "Date",
            "Actions",
          ]}
        >
          {filtered.map((order) => (
            <tr key={order._id} className="hover:bg-[#fdf2f7]/50">
              <td className="px-4 py-3 font-medium text-[#3b1026]">
                {truncateId(order._id)}
              </td>
              <td className="px-4 py-3 text-[#5c2a40]">
                <div>{order.user?.name || "—"}</div>
                <div className="text-xs text-[#9f6b82]">{order.user?.email}</div>
              </td>
              <td className="px-4 py-3 text-[#3b1026]">
                {formatCurrency(order.totalAmount, order.currency || "AED")}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <StatusBadge status={order.paymentMethod} />
                  <span className="text-xs text-[#9f6b82]">
                    {order.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <select
                  className={`${adminInputClass} mt-0 min-w-[140px]`}
                  value={order.status}
                  disabled={updatingId === order._id}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value as OrderStatus)
                  }
                >
                  {ORDER_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-[#7a4a5e]">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className={adminGhostButtonClass}
                  onClick={() => setSelected(order)}
                >
                  <Eye size={14} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <FormModal
        open={Boolean(selected)}
        title="Order details"
        subtitle={selected ? `ID: ${selected._id}` : undefined}
        onClose={() => setSelected(null)}
        wide
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-[#f3d4e0] bg-[#fdf2f7]/50 p-4">
                <p className="text-xs font-semibold tracking-wide text-[#9f6b82] uppercase">
                  Customer
                </p>
                <p className="mt-2 font-medium text-[#3b1026]">
                  {selected.user?.name || "—"}
                </p>
                <p className="text-sm text-[#7a4a5e]">{selected.user?.email}</p>
              </div>
              <div className="rounded-xl border border-[#f3d4e0] bg-[#fdf2f7]/50 p-4">
                <p className="text-xs font-semibold tracking-wide text-[#9f6b82] uppercase">
                  Shipping
                </p>
                <p className="mt-2 text-sm text-[#5c2a40]">
                  {selected.shippingAddress.fullName}
                  <br />
                  {selected.shippingAddress.phone}
                  <br />
                  {selected.shippingAddress.address}
                  <br />
                  {selected.shippingAddress.city}
                  {selected.shippingAddress.postalCode
                    ? `, ${selected.shippingAddress.postalCode}`
                    : ""}
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#3b1026]">Items</p>
              <div className="space-y-2">
                {selected.items.map((item, index) => (
                  <div
                    key={`${selected._id}-${index}`}
                    className="flex items-center justify-between rounded-xl border border-[#f3d4e0] px-4 py-3 text-sm"
                  >
                    <span className="text-[#5c2a40]">
                      {item.name || "Product"} × {item.quantity}
                    </span>
                    <span className="font-medium text-[#3b1026]">
                      {formatCurrency(
                        item.price * item.quantity,
                        selected.currency || "AED",
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[#9f6b82]">Items total</p>
                <p className="font-semibold text-[#3b1026]">
                  {formatCurrency(selected.itemsTotal, selected.currency || "AED")}
                </p>
              </div>
              <div>
                <p className="text-[#9f6b82]">Delivery</p>
                <p className="font-semibold text-[#3b1026]">
                  {formatCurrency(
                    selected.deliveryCharge,
                    selected.currency || "AED",
                  )}
                </p>
              </div>
              <div>
                <p className="text-[#9f6b82]">Total</p>
                <p className="font-semibold text-[#3b1026]">
                  {formatCurrency(selected.totalAmount, selected.currency || "AED")}
                </p>
              </div>
              <div>
                <p className="text-[#9f6b82]">Area</p>
                <p className="font-semibold text-[#3b1026]">
                  {selected.deliveryArea}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={selected.status} />
              <StatusBadge status={selected.paymentMethod} />
              <button
                type="button"
                className={adminPrimaryButtonClass}
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </FormModal>
    </div>
  );
}
