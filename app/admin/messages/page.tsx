"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
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
import type { ContactMessage, ContactStatus } from "@/types/admin";

const CONTACT_STATUSES: ContactStatus[] = ["NEW", "READ", "RESOLVED"];

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/contact");
      setMessages(response.data.contacts || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const updateStatus = async (id: string, status: ContactStatus) => {
    try {
      setUpdatingId(id);
      const response = await api.put(`/contact/${id}/status`, { status });
      const updated = response.data.contact as ContactMessage;

      setMessages((prev) =>
        prev.map((message) => (message._id === id ? updated : message)),
      );

      if (selected?._id === id) {
        setSelected(updated);
      }

      showToast("Message status updated", "success");
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered =
    statusFilter === "ALL"
      ? messages
      : messages.filter((message) => message.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Messages
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Review and manage contact form submissions.
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
            {CONTACT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingState label="Loading messages..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No messages found"
          description="Contact form messages will appear here."
        />
      ) : (
        <AdminTable
          headers={["From", "Message", "Status", "Date", "Actions"]}
        >
          {filtered.map((message) => (
            <tr key={message._id} className="hover:bg-[#fdf2f7]/50">
              <td className="px-4 py-3">
                <p className="font-medium text-[#3b1026]">{message.name}</p>
                <p className="text-xs text-[#9f6b82]">{message.email}</p>
                {message.phone ? (
                  <p className="text-xs text-[#9f6b82]">{message.phone}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 max-w-xs">
                <p className="line-clamp-2 text-[#5c2a40]">{message.message}</p>
              </td>
              <td className="px-4 py-3">
                <select
                  className={`${adminInputClass} mt-0 min-w-[130px]`}
                  value={message.status}
                  disabled={updatingId === message._id}
                  onChange={(e) =>
                    updateStatus(message._id, e.target.value as ContactStatus)
                  }
                >
                  {CONTACT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 text-[#7a4a5e]">
                {formatDate(message.createdAt)}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className={adminGhostButtonClass}
                  onClick={() => {
                    setSelected(message);
                    if (message.status === "NEW") {
                      updateStatus(message._id, "READ");
                    }
                  }}
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
        title="Message details"
        onClose={() => setSelected(null)}
        wide
      >
        {selected ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className={adminLabelClass}>Name</p>
                <p className="mt-1 text-[#3b1026]">{selected.name}</p>
              </div>
              <div>
                <p className={adminLabelClass}>Email</p>
                <p className="mt-1 text-[#3b1026]">{selected.email}</p>
              </div>
              <div>
                <p className={adminLabelClass}>Phone</p>
                <p className="mt-1 text-[#3b1026]">{selected.phone || "—"}</p>
              </div>
              <div>
                <p className={adminLabelClass}>Status</p>
                <div className="mt-2">
                  <StatusBadge status={selected.status} />
                </div>
              </div>
            </div>

            <div>
              <p className={adminLabelClass}>Message</p>
              <p className="mt-2 rounded-xl border border-[#f3d4e0] bg-[#fdf2f7]/50 p-4 text-sm leading-relaxed text-[#5c2a40]">
                {selected.message}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {CONTACT_STATUSES.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={adminGhostButtonClass}
                  disabled={updatingId === selected._id}
                  onClick={() => updateStatus(selected._id, status)}
                >
                  Mark {status}
                </button>
              ))}
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
