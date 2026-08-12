"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Star, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import ConfirmModal from "@/components/admin/ConfirmModal";
import FormModal from "@/components/admin/FormModal";
import {
  accountCardClass,
  accountDangerBtnClass,
  accountGhostBtnClass,
  accountInputClass,
  accountLabelClass,
  accountPrimaryBtnClass,
  accountSecondaryBtnClass,
} from "@/components/account/accountStyles";

const textAreaClass =
  "mt-1.5 w-full min-h-[110px] rounded-xl border border-white/20 bg-white/90 px-3.5 py-2.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-pink-300 focus:ring-2 focus:ring-pink-200";

interface MyReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  product?: {
    _id?: string;
    name?: string;
    image?: string;
  };
}

export default function AccountReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<MyReview | null>(null);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews/my");
      setReviews(response.data.reviews || []);
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

  const openEdit = (review: MyReview) => {
    setEditing(review);
    setForm({ rating: review.rating, comment: review.comment });
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      setSaving(true);
      await api.put(`/reviews/${editing._id}`, {
        rating: Number(form.rating),
        comment: form.comment.trim(),
      });
      showToast("Review updated", "success");
      setEditing(null);
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
      await api.delete(`/reviews/${deleteId}`);
      showToast("Review deleted", "success");
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
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">My Reviews</h2>
        <p className="mt-1 text-sm text-pink-100">
          Manage reviews you have shared on Glamira products.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className={`${accountCardClass} text-center`}>
          <p className="text-pink-100">You have not written any reviews yet.</p>
          <Link href="/products" className={`${accountPrimaryBtnClass} mt-6`}>
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className={accountCardClass}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  {review.product?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.product.image}
                      alt={review.product.name || "Product"}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                  ) : null}
                  <div>
                    {review.product?._id ? (
                      <Link
                        href={`/products/${review.product._id}`}
                        className="font-serif text-xl font-semibold text-white hover:text-pink-100"
                      >
                        {review.product.name || "Product"}
                      </Link>
                    ) : (
                      <p className="font-serif text-xl font-semibold text-white">
                        {review.product?.name || "Product"}
                      </p>
                    )}
                    <p className="mt-1 inline-flex items-center gap-1 text-sm text-yellow-300">
                      <Star size={14} fill="currentColor" />
                      {review.rating}/5
                    </p>
                    <p className="mt-2 text-sm text-pink-100">{review.comment}</p>
                    <p className="mt-2 text-xs text-pink-200">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(review)}
                    className={accountGhostBtnClass}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(review._id)}
                    className={accountDangerBtnClass}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormModal
        open={Boolean(editing)}
        title="Edit review"
        onClose={() => setEditing(null)}
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={accountLabelClass}>Rating</label>
            <select
              className={accountInputClass}
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: Number(e.target.value) })
              }
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} Stars
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={accountLabelClass}>Comment</label>
            <textarea
              className={textAreaClass}
              required
              minLength={2}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className={accountPrimaryBtnClass}>
              {saving ? "Saving..." : "Save Review"}
            </button>
            <button
              type="button"
              className={accountSecondaryBtnClass}
              onClick={() => setEditing(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete review"
        message="Remove this review permanently?"
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
