"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";
import {
  accountCardClass,
  accountDangerBtnClass,
  accountGhostBtnClass,
  accountInputClass,
  accountLabelClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}

const emptyForm = {
  fullName: "",
  phone: "",
  addressLine: "",
  city: "",
  postalCode: "",
  isDefault: false,
};

export default function AccountAddressesPage() {
  const { showToast } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const response = await api.get("/addresses");
      setAddresses(response.data.addresses || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (address: Address) => {
    setEditingId(address._id);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      postalCode: address.postalCode || "",
      isDefault: Boolean(address.isDefault),
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        addressLine: form.addressLine.trim(),
        city: form.city.trim(),
        postalCode: form.postalCode.trim() || undefined,
        isDefault: form.isDefault,
      };

      if (editingId) {
        await api.put(`/addresses/${editingId}`, payload);
        showToast("Address updated", "success");
      } else {
        await api.post("/addresses", payload);
        showToast("Address added", "success");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await load();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await api.delete(`/addresses/${deleteId}`);
      showToast("Address deleted", "success");
      setDeleteId(null);
      await load();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            My Addresses
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Manage delivery addresses for faster checkout.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={accountPrimaryBtnClass}>
          <Plus size={16} />
          Add Address
        </button>
      </div>

      {addresses.length === 0 && !showForm ? (
        <div className={`${accountCardClass} text-center text-pink-100`}>
          No saved addresses yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <div key={address._id} className={accountCardClass}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl font-semibold text-white">
                    {address.fullName}
                  </p>
                  {address.isDefault ? (
                    <span className="mt-2 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-xs text-pink-100">
                      Default
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(address)}
                    className={accountGhostBtnClass}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(address._id)}
                    className={accountDangerBtnClass}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-pink-100">
                {address.phone}
                <br />
                {address.addressLine}
                <br />
                {address.city}
                {address.postalCode ? `, ${address.postalCode}` : ""}
              </p>
            </div>
          ))}
        </div>
      )}

      {showForm ? (
        <form onSubmit={handleSubmit} className={`${accountCardClass} max-w-2xl space-y-4`}>
          <h3 className="font-serif text-xl font-bold text-white">
            {editingId ? "Edit address" : "New address"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>Full name</label>
              <input
                className={accountInputClass}
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Phone</label>
              <input
                className={accountInputClass}
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className={accountLabelClass}>Address line</label>
            <input
              className={accountInputClass}
              required
              value={form.addressLine}
              onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={accountLabelClass}>City</label>
              <input
                className={accountInputClass}
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
            <div>
              <label className={accountLabelClass}>Postal code</label>
              <input
                className={accountInputClass}
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-pink-100">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
            />
            Set as default address
          </label>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={accountPrimaryBtnClass}>
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </button>
            <button
              type="button"
              className={accountSecondaryBtnClass}
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete address"
        message="Remove this saved address from your account?"
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
