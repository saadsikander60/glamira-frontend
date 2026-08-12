"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import ProductCard, { ShopProduct } from "@/components/shop/ProductCard";
import ShopPageShell from "@/components/shop/ShopPageShell";
import {
  shopCardClass,
  shopInputClass,
  shopPrimaryBtnClass,
} from "@/components/shop/shopStyles";

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
  isActive?: boolean;
}

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearch(initialSearch);
    setPage(1);
  }, [initialSearch]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(
          (response.data.categories || []).filter(
            (item: CategoryOption) => item.isActive !== false,
          ),
        );
      } catch {
        setCategories([]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products", {
          params: {
            page,
            limit: 12,
            search: search || undefined,
            category: category || undefined,
          },
        });
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch {
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadProducts, 200);
    return () => clearTimeout(timer);
  }, [search, category, page]);

  return (
    <ShopPageShell
      eyebrow="Shop"
      title="Beauty Collection"
      description="Browse premium skincare and beauty essentials. Guests can explore freely — login when you are ready to add items to cart."
    >
      <div
        className={`${shopCardClass} mb-8 grid gap-4 p-5 md:grid-cols-[1fr_220px]`}
      >
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search products..."
          className={shopInputClass}
        />
        <select
          value={category}
          onChange={(e) => {
            setPage(1);
            setCategory(e.target.value);
          }}
          className={shopInputClass}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-pink-100">Loading products...</p>
      ) : products.length === 0 ? (
        <div className={`${shopCardClass} p-10 text-center text-pink-100`}>
          No products found. Try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            className={shopPrimaryBtnClass}
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-pink-100">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className={shopPrimaryBtnClass}
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </button>
        </div>
      ) : null}
    </ShopPageShell>
  );
}
