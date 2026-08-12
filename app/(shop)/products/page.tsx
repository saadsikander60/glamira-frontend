import { Suspense } from "react";
import ProductsClient from "./ProductsClient";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-pink-100">
          Loading products...
        </div>
      }
    >
      <ProductsClient />
    </Suspense>
  );
}
