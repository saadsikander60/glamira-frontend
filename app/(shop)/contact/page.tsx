"use client";

import { FormEvent, useEffect, useState } from "react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import ShopPageShell from "@/components/shop/ShopPageShell";
import {
  shopCardClass,
  shopInputClass,
  shopPrimaryBtnClass,
  shopTextAreaClass,
} from "@/components/shop/shopStyles";

export default function ContactPage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      name: prev.name || user.name || "",
      email: prev.email || user.email || "",
    }));
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await api.post("/contact", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      showToast(response.data.message || "Message sent successfully", "success");
      setForm({
        name: isAuthenticated ? user?.name || "" : "",
        email: isAuthenticated ? user?.email || "" : "",
        phone: "",
        message: "",
      });
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopPageShell
      eyebrow="Support"
      title="Contact Glamira Essence"
      description="Questions about products, orders, or delivery? Send us a message — guests and members are both welcome."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className={`${shopCardClass} p-6 sm:p-8`}>
          <h2 className="font-serif text-2xl font-bold text-white">
            Send a message
          </h2>
          <p className="mt-2 text-sm text-pink-100">
            {isAuthenticated
              ? "We already filled your account details. Update them if needed."
              : "No account needed — reach out anytime as a guest."}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              className={shopInputClass}
              placeholder="Your name"
              required
              minLength={2}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className={shopInputClass}
              type="email"
              placeholder="Email address"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className={shopInputClass}
              placeholder="Phone (optional)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              className={`${shopTextAreaClass} min-h-[140px]`}
              placeholder="How can we help?"
              required
              minLength={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button type="submit" disabled={loading} className={shopPrimaryBtnClass}>
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        <div className={`${shopCardClass} p-6 sm:p-8`}>
          <h2 className="font-serif text-2xl font-bold text-white">
            Guest-friendly shopping
          </h2>
          <ul className="mt-5 space-y-4 text-sm leading-relaxed text-pink-100">
            <li>Browse products and categories without logging in.</li>
            <li>Create an account when you are ready to add items to cart.</li>
            <li>Save addresses for faster checkout next time.</li>
            <li>Track orders anytime from your profile.</li>
          </ul>
          <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-pink-100">
            Delivery tip: orders to Ajman use local delivery rates. Other cities
            use outside delivery charges calculated at checkout.
          </div>
        </div>
      </div>
    </ShopPageShell>
  );
}
