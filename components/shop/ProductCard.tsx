"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { formatCurrency } from "@/lib/adminFormat";

export interface ShopProduct {
  _id: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  stock: number;
  category?: {
    _id?: string;
    name?: string;
    slug?: string;
  };
}

interface ProductCardProps {
  product: ShopProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart, loading } = useCart();
  const { showToast } = useToast();

  const handleAdd = async () => {
    if (!isAuthenticated) {
      showToast("Please login to add items to your cart", "warning");
      router.push("/login");
      return;
    }

    if (product.stock <= 0) {
      showToast("This product is out of stock", "error");
      return;
    }

    const error = await addToCart(product._id, 1);
    if (error) {
      showToast(error, "error");
      return;
    }

    showToast("Added to cart", "success");
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-lg transition duration-300 hover:-translate-y-2">
      <Link href={`/products/${product._id}`} className="block h-64 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
        />
      </Link>

      <div className="p-5">
        {product.category?.name ? (
          <p className="text-xs uppercase tracking-[0.16em] text-pink-200">
            {product.category.name}
          </p>
        ) : null}

        <Link href={`/products/${product._id}`}>
          <h3 className="mt-2 font-serif text-lg font-semibold text-white transition hover:text-pink-100">
            {product.name}
          </h3>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="font-semibold text-pink-200">
            {formatCurrency(product.price)}
          </p>
          <p className="text-xs text-pink-100">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={loading || product.stock <= 0}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white py-2.5 text-sm font-semibold text-[#be185d] transition hover:bg-pink-100 disabled:opacity-50"
        >
          <ShoppingBag size={16} />
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
