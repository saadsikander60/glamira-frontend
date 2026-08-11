"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image: string;
  isActive: boolean;
};

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load categories");
        }

        const activeCategories = data.categories.filter(
          (category: Category) => category.isActive,
        );

        setCategories(activeCategories);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section
      id="categories"
      className="relative py-20 overflow-hidden bg-gradient-to-br from-[#2b0a1a] via-[#5c1638] to-[#be185d]"
    >
      {/* Glow */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full blur-3xl opacity-20"></div>

      <div className="absolute bottom-0 left-10 w-64 h-64 bg-rose-200 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-pink-200 uppercase tracking-[0.3em] text-sm font-medium">
            Explore Categories
          </p>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-4">
            Find Your Beauty Essentials
          </h2>

          <p className="text-pink-100 mt-4 max-w-xl mx-auto">
            Discover our premium collection designed to enhance your beauty
            routine.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-pink-100">Loading categories...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center text-red-200">{error}</div>
        )}

        {/* Categories */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="group overflow-hidden rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 hover:-translate-y-2 transition duration-300"
              >
                {/* Category Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={
                      category.image ||
                      "/images/categories/default-category.jpg"
                    }
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Category Details */}
                <div className="p-6 text-center">
                  <h3 className="text-xl font-serif font-semibold text-white">
                    {category.name}
                  </h3>

                  <p className="text-pink-100 text-sm mt-3">
                    Explore our premium {category.name.toLowerCase()}{" "}
                    collection.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* No Categories */}
        {!loading && !error && categories.length === 0 && (
          <div className="text-center text-pink-100">
            No categories available.
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
