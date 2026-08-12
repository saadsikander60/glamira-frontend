"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ProductCard, { ShopProduct } from "@/components/shop/ProductCard";
import api from "@/lib/axios";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const response = await api.get("/products", {
          params: { limit: 8, page: 1 },
        });
        setProducts(response.data.products || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d] py-20">
      <div className="absolute top-10 right-10 h-72 w-72 rounded-full bg-pink-300 opacity-20 blur-3xl" />
      <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-rose-200 opacity-20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-[0.3em] text-pink-200 uppercase">
            Featured Collection
          </p>
          <h2 className="mt-4 font-serif text-4xl font-bold text-white md:text-5xl">
            Our Best Beauty Picks
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pink-100">
            Explore our carefully selected beauty essentials designed to elevate
            your daily routine.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-pink-100">Loading featured products...</p>
        ) : products.length === 0 ? (
          <p className="text-center text-pink-100">
            Products will appear here once the catalog is ready.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-full bg-white px-7 py-3 font-semibold text-[#be185d] transition hover:bg-pink-100"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
