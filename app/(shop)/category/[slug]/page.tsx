"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/lib/axios";
import ProductCard, { ShopProduct } from "@/components/shop/ProductCard";
import ShopPageShell from "@/components/shop/ShopPageShell";
import { shopCardClass } from "@/components/shop/shopStyles";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/products", {
          params: {
            categorySlug: params.slug,
            limit: 24,
          },
        });
        setProducts(response.data.products || []);
      } catch (err) {
        setProducts([]);
        setError("Category not found or unavailable.");
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) load();
  }, [params.slug]);

  const title = params.slug
    ? params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Category";

  return (
    <ShopPageShell
      eyebrow="Category"
      title={title}
      description="Explore products in this beauty category. Guests can browse without an account."
    >
      {loading ? (
        <p className="text-center text-pink-100">Loading products...</p>
      ) : error ? (
        <div className={`${shopCardClass} p-8 text-center text-pink-100`}>
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className={`${shopCardClass} p-8 text-center text-pink-100`}>
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </ShopPageShell>
  );
}
