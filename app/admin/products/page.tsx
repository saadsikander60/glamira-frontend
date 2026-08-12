"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatCurrency, formatDate } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import AdminTable from "@/components/admin/AdminTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EmptyState from "@/components/admin/EmptyState";
import FormModal from "@/components/admin/FormModal";
import LoadingState from "@/components/admin/LoadingState";
import {
  adminDangerButtonClass,
  adminGhostButtonClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/adminStyles";
import type { Category, Product } from "@/types/admin";

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
  imageFile: File | null;
}

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  category: "",
  imageFile: null,
};

export default function AdminProductsPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products", { params: { limit: 100, search: search || undefined } }),
        api.get("/categories"),
      ]);
      setProducts(productsRes.data.products || []);
      setCategories(categoriesRes.data.categories || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [search, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadData]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      ...emptyForm,
      category: categories[0]?._id || "",
    });
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock ?? 0),
      category:
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "",
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.description.trim() || !form.category) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    if (!editing && !form.imageFile) {
      showToast("Product image is required", "error");
      return;
    }

    try {
      setSaving(true);
      const body = new FormData();
      body.append("name", form.name.trim());
      body.append("description", form.description.trim());
      body.append("price", form.price);
      body.append("stock", form.stock || "0");
      body.append("category", form.category);

      if (form.imageFile) {
        body.append("image", form.imageFile);
      }

      if (editing) {
        await api.put(`/products/${editing._id}`, body);
        showToast("Product updated successfully", "success");
      } else {
        await api.post("/products", body);
        showToast("Product created successfully", "success");
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);
      await loadData();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await api.delete(`/products/${deleteTarget._id}`);
      showToast("Product deleted successfully", "success");
      setDeleteTarget(null);
      await loadData();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setDeleting(false);
    }
  };

  const categoryOptions = useMemo(() => categories, [categories]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Products
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Create, update, and manage your beauty catalog.
          </p>
        </div>
        <button type="button" onClick={openCreate} className={adminPrimaryButtonClass}>
          <Plus size={16} />
          Add Product
        </button>
      </div>

      <div className="relative max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#9f6b82]"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className={`${adminInputClass} pl-10`}
        />
      </div>

      {loading ? (
        <LoadingState label="Loading products..." />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Add your first product or adjust your search."
          action={
            <button type="button" onClick={openCreate} className={adminPrimaryButtonClass}>
              <Plus size={16} />
              Add Product
            </button>
          }
        />
      ) : (
        <AdminTable
          headers={["Product", "Category", "Price", "Stock", "Created", "Actions"]}
        >
          {products.map((product) => {
            const categoryName =
              typeof product.category === "string"
                ? "—"
                : product.category?.name || "—";

            return (
              <tr key={product._id} className="hover:bg-[#fdf2f7]/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div>
                      <p className="font-medium text-[#3b1026]">{product.name}</p>
                      <p className="line-clamp-1 max-w-[220px] text-xs text-[#9f6b82]">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#5c2a40]">{categoryName}</td>
                <td className="px-4 py-3 text-[#3b1026]">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      product.stock <= 5
                        ? "bg-rose-50 text-rose-700"
                        : "bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-4 py-3 text-[#7a4a5e]">
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      className={adminGhostButtonClass}
                    >
                      <Pencil size={14} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(product)}
                      className={adminDangerButtonClass}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "Edit Product" : "Create Product"}
        subtitle="Images upload to Cloudinary via the existing backend."
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={adminLabelClass}>Name</label>
            <input
              className={adminInputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className={adminLabelClass}>Description</label>
            <textarea
              className={`${adminInputClass} min-h-[110px] resize-y`}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={adminLabelClass}>Price (AED)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className={adminInputClass}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                required
              />
            </div>
            <div>
              <label className={adminLabelClass}>Stock</label>
              <input
                type="number"
                min="0"
                step="1"
                className={adminInputClass}
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className={adminLabelClass}>Category</label>
            <select
              className={adminInputClass}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={adminLabelClass}>
              {editing ? "Replace Image (optional)" : "Image"}
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className={adminInputClass}
              onChange={(e) =>
                setForm({
                  ...form,
                  imageFile: e.target.files?.[0] || null,
                })
              }
            />
            {editing?.image ? (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={editing.image}
                  alt={editing.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <p className="text-xs text-[#9f6b82]">
                  Current image kept unless you upload a new one.
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className={adminSecondaryButtonClass}
              disabled={saving}
              onClick={() => {
                setModalOpen(false);
                setEditing(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className={adminPrimaryButtonClass} disabled={saving}>
              {saving ? "Saving..." : editing ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete product"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
