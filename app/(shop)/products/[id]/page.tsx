"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Star } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate } from "@/lib/adminFormat";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import ShopPageShell from "@/components/shop/ShopPageShell";
import {
  shopCardClass,
  shopInputClass,
  shopPrimaryBtnClass,
  shopSecondaryBtnClass,
  shopTextAreaClass,
} from "@/components/shop/shopStyles";

interface ProductDetail {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category?: { _id: string; name: string; slug: string };
}

interface ReviewItem {
  _id: string;
  rating: number;
  comment: string;
  createdAt?: string;
  user?: { name?: string };
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart, loading: cartLoading } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        api.get(`/products/${params.id}`),
        api.get(`/reviews/product/${params.id}`),
      ]);
      setProduct(productRes.data.product);
      setRating(productRes.data.rating || 0);
      setReviewsCount(productRes.data.reviewsCount || 0);
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      showToast(getApiError(error), "error");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) loadProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      showToast("Please login to add items to your cart", "warning");
      router.push("/login");
      return;
    }

    const error = await addToCart(product._id, quantity);
    if (error) {
      showToast(error, "error");
      return;
    }
    showToast("Added to cart", "success");
  };

  const handleReview = async (e: FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("Please login to leave a review", "warning");
      router.push("/login");
      return;
    }

    try {
      setSubmittingReview(true);
      await api.post("/reviews", {
        product: params.id,
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });
      showToast("Review added successfully", "success");
      setReviewForm({ rating: 5, comment: "" });
      await loadProduct();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <ShopPageShell title="Product" description="Loading product details...">
        <p className="text-pink-100">Please wait...</p>
      </ShopPageShell>
    );
  }

  if (!product) {
    return (
      <ShopPageShell title="Product not found" description="This item may have been removed.">
        <Link href="/products" className={shopPrimaryBtnClass}>
          Back to Shop
        </Link>
      </ShopPageShell>
    );
  }

  return (
    <ShopPageShell
      eyebrow={product.category?.name || "Product"}
      title={product.name}
      description="Premium beauty essentials crafted for your everyday glow."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <div className={`${shopCardClass} overflow-hidden`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.name}
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className={`${shopCardClass} p-6 sm:p-8`}>
          <div className="flex flex-wrap items-center gap-3 text-sm text-pink-100">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
              <Star size={14} className="text-yellow-300" fill="currentColor" />
              {rating.toFixed(1)} ({reviewsCount} reviews)
            </span>
            <span>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <p className="mt-5 text-3xl font-semibold text-pink-200">
            {formatCurrency(product.price)}
          </p>

          <p className="mt-5 leading-relaxed text-pink-100">
            {product.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <input
              type="number"
              min={1}
              max={Math.max(product.stock, 1)}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              className={`${shopInputClass} w-28`}
            />
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={cartLoading || product.stock <= 0}
              className={shopPrimaryBtnClass}
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>
            <Link href="/cart" className={shopSecondaryBtnClass}>
              View Cart
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className={`${shopCardClass} p-6`}>
          <h2 className="font-serif text-2xl font-bold text-white">Reviews</h2>
          <div className="mt-5 space-y-4">
            {reviews.length === 0 ? (
              <p className="text-pink-100">No reviews yet. Be the first.</p>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="rounded-2xl border border-white/15 bg-white/5 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">
                      {review.user?.name || "Customer"}
                    </p>
                    <span className="text-sm text-yellow-300">
                      {"★".repeat(review.rating)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-pink-100">{review.comment}</p>
                  <p className="mt-2 text-xs text-pink-200/80">
                    {formatDate(review.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={`${shopCardClass} p-6`}>
          <h2 className="font-serif text-2xl font-bold text-white">
            Write a Review
          </h2>
          <form onSubmit={handleReview} className="mt-5 space-y-4">
            <div>
              <label className="mb-2 block text-sm text-pink-100">Rating</label>
              <select
                className={shopInputClass}
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
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
              <label className="mb-2 block text-sm text-pink-100">Comment</label>
              <textarea
                className={`${shopTextAreaClass} min-h-[120px]`}
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, comment: e.target.value })
                }
                required
                minLength={2}
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className={shopPrimaryBtnClass}
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      </div>
    </ShopPageShell>
  );
}
