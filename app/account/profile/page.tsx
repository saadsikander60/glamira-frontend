"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate } from "@/lib/adminFormat";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  accountCardClass,
  accountInputClass,
  accountLabelClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

export default function AccountProfilePage() {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    createdAt: "",
  });
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users/me");
        const user = response.data.user;
        setProfile({
          name: user.name || "",
          email: user.email || "",
          role: user.role || "",
          createdAt: user.createdAt || "",
        });
        setForm({
          name: user.name || "",
          email: user.email || "",
          password: "",
        });
        updateUser(user);
      } catch (error) {
        showToast(getApiError(error), "error");
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const payload: { name?: string; email?: string; password?: string } = {};

      if (form.name.trim() && form.name.trim() !== profile.name) {
        payload.name = form.name.trim();
      }
      if (form.email.trim() && form.email.trim() !== profile.email) {
        payload.email = form.email.trim();
      }
      if (form.password.trim()) {
        payload.password = form.password.trim();
      }

      if (!payload.name && !payload.email && !payload.password) {
        showToast("No changes to save", "warning");
        return;
      }

      const response = await api.put("/users/me", payload);
      const user = response.data.user;
      updateUser(user);
      setProfile({
        name: user.name || "",
        email: user.email || "",
        role: user.role || profile.role,
        createdAt: user.createdAt || profile.createdAt,
      });
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "",
      });
      showToast(response.data.message || "Profile updated", "success");
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSaving(false);
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div className={accountCardClass}>
        <h2 className="font-serif text-2xl font-bold text-white">My Profile</h2>
        <p className="mt-2 text-sm text-pink-100">
          Update your account details. Role cannot be changed here.
        </p>

        <div className="mt-5 grid gap-3 text-sm text-pink-100 sm:grid-cols-2">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-pink-200">Role</p>
            <p className="mt-1 font-semibold text-white">{profile.role}</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-pink-200">Joined</p>
            <p className="mt-1 font-semibold text-white">
              {formatDate(profile.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={`${accountCardClass} space-y-4`}>
        <div>
          <label className={accountLabelClass}>Name</label>
          <input
            className={accountInputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            minLength={2}
          />
        </div>
        <div>
          <label className={accountLabelClass}>Email</label>
          <input
            type="email"
            className={accountInputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div>
          <label className={accountLabelClass}>
            New password (optional)
          </label>
          <input
            type="password"
            className={accountInputClass}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            minLength={6}
            placeholder="Leave blank to keep current password"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving} className={accountPrimaryBtnClass}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            className={accountSecondaryBtnClass}
            onClick={() =>
              setForm({
                name: profile.name,
                email: profile.email,
                password: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
