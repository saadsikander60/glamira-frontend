"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import { useAuth } from "@/context/AuthContext";
import AdminTable from "@/components/admin/AdminTable";
import EmptyState from "@/components/admin/EmptyState";
import FormModal from "@/components/admin/FormModal";
import LoadingState from "@/components/admin/LoadingState";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminGhostButtonClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
} from "@/components/admin/adminStyles";
import type { Customer, UserRole } from "@/types/admin";

export default function AdminCustomersPage() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      setCustomers(response.data.users || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  const updateRole = async (customerId: string, role: UserRole) => {
    try {
      setUpdatingId(customerId);
      const response = await api.put(`/users/${customerId}/role`, { role });
      const updated = response.data.user as Customer;

      setCustomers((prev) =>
        prev.map((customer) =>
          customer._id === customerId ? updated : customer,
        ),
      );

      if (selected?._id === customerId) {
        setSelected(updated);
      }

      showToast("User role updated", "success");
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const currentUserId = currentUser?.id || currentUser?._id;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">
          Customers
        </h2>
        <p className="mt-1 text-sm text-pink-100">
          View registered users and manage roles safely.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading customers..." />
      ) : customers.length === 0 ? (
        <EmptyState
          title="No customers yet"
          description="Registered shoppers and admins will appear here."
        />
      ) : (
        <AdminTable headers={["Name", "Email", "Role", "Joined", "Actions"]}>
          {customers.map((customer) => {
            const isSelf = currentUserId === customer._id;

            return (
              <tr key={customer._id} className="hover:bg-[#fdf2f7]/50">
                <td className="px-4 py-3 font-medium text-[#3b1026]">
                  {customer.name}
                  {isSelf ? (
                    <span className="ml-2 text-xs text-[#be185d]">(you)</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 text-[#5c2a40]">{customer.email}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-2">
                    <StatusBadge status={customer.role} />
                    <select
                      className={`${adminInputClass} mt-0 min-w-[120px]`}
                      value={customer.role}
                      disabled={updatingId === customer._id || isSelf}
                      onChange={(e) =>
                        updateRole(customer._id, e.target.value as UserRole)
                      }
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#7a4a5e]">
                  {formatDate(customer.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className={adminGhostButtonClass}
                    onClick={() => setSelected(customer)}
                  >
                    <Eye size={14} />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      <FormModal
        open={Boolean(selected)}
        title="Customer details"
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <div>
              <p className={adminLabelClass}>Name</p>
              <p className="mt-1 text-[#3b1026]">{selected.name}</p>
            </div>
            <div>
              <p className={adminLabelClass}>Email</p>
              <p className="mt-1 text-[#3b1026]">{selected.email}</p>
            </div>
            <div>
              <p className={adminLabelClass}>Role</p>
              <div className="mt-2">
                <StatusBadge status={selected.role} />
              </div>
            </div>
            <div>
              <p className={adminLabelClass}>Joined</p>
              <p className="mt-1 text-[#3b1026]">
                {formatDate(selected.createdAt)}
              </p>
            </div>
            <button
              type="button"
              className={adminPrimaryButtonClass}
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        ) : null}
      </FormModal>
    </div>
  );
}
