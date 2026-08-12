"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import AdminTable from "@/components/admin/AdminTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EmptyState from "@/components/admin/EmptyState";
import LoadingState from "@/components/admin/LoadingState";
import { adminDangerButtonClass } from "@/components/admin/adminStyles";
import type { Review } from "@/types/admin";

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/reviews");
      setReviews(response.data.reviews || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await api.delete(`/reviews/${deleteTarget._id}`);
      showToast("Review deleted", "success");
      setDeleteTarget(null);
      await loadReviews();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-2xl font-bold text-white">Reviews</h2>
        <p className="mt-1 text-sm text-pink-100">
          Moderate customer product reviews across the store.
        </p>
      </div>

      {loading ? (
        <LoadingState label="Loading reviews..." />
      ) : reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          description="Product reviews will appear here for moderation."
          icon={Star}
        />
      ) : (
        <AdminTable
          headers={["Product", "Customer", "Rating", "Comment", "Date", "Actions"]}
        >
          {reviews.map((review) => (
            <tr key={review._id} className="hover:bg-[#fdf2f7]/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {review.product?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={review.product.image}
                      alt={review.product.name || "Product"}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : null}
                  <span className="font-medium text-[#3b1026]">
                    {review.product?.name || "—"}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-[#5c2a40]">
                <div>{review.user?.name || "—"}</div>
                <div className="text-xs text-[#9f6b82]">{review.user?.email}</div>
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <Star size={12} fill="currentColor" />
                  {review.rating}/5
                </span>
              </td>
              <td className="max-w-xs px-4 py-3">
                <p className="line-clamp-2 text-[#5c2a40]">{review.comment}</p>
              </td>
              <td className="px-4 py-3 text-[#7a4a5e]">
                {formatDate(review.createdAt)}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  className={adminDangerButtonClass}
                  onClick={() => setDeleteTarget(review)}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete review"
        message="Remove this review from the storefront? This cannot be undone."
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
