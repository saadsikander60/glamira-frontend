"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { getApiError } from "@/lib/apiError";
import { formatDate, slugify } from "@/lib/adminFormat";
import { useToast } from "@/context/ToastContext";
import AdminTable from "@/components/admin/AdminTable";
import ConfirmModal from "@/components/admin/ConfirmModal";
import EmptyState from "@/components/admin/EmptyState";
import FormModal from "@/components/admin/FormModal";
import LoadingState from "@/components/admin/LoadingState";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  adminDangerButtonClass,
  adminGhostButtonClass,
  adminInputClass,
  adminLabelClass,
  adminPrimaryButtonClass,
  adminSecondaryButtonClass,
} from "@/components/admin/adminStyles";
import type { Category } from "@/types/admin";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

interface CategoryFormState {
  name: string;
  slug: string;
  isActive: boolean;
  imageFile: File | null;
}

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  isActive: true,
  imageFile: null,
};

export default function AdminCategoriesPage() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/categories");
      setCategories(response.data.categories || []);
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const currentPreview = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (editing?.image) return editing.image;
    return null;
  }, [previewUrl, editing]);

  const resetFormState = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setForm(emptyForm);
    setEditing(null);
  };

  const openCreate = () => {
    resetFormState();
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      isActive: category.isActive !== false,
      imageFile: null,
    });
    setModalOpen(true);
  };

  const handleImageChange = (file: File | null) => {
    if (!file) {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setForm((prev) => ({ ...prev, imageFile: null }));
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      showToast("Please select a JPG, PNG, or WEBP image", "error");
      return;
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const name = form.name.trim();
    const slug = slugify(form.slug || name);

    if (!name || name.length < 2) {
      showToast("Category name is required", "error");
      return;
    }

    if (!slug || slug.length < 2) {
      showToast("A valid slug could not be generated", "error");
      return;
    }

    try {
      setSaving(true);

      const body = new FormData();
      body.append("name", name);
      body.append("slug", slug);
      body.append("isActive", String(form.isActive));

      if (form.imageFile) {
        body.append("image", form.imageFile);
      }

      if (editing) {
        await api.put(`/categories/${editing._id}`, body);
        showToast("Category updated successfully", "success");
      } else {
        await api.post("/categories", body);
        showToast("Category created successfully", "success");
      }

      setModalOpen(false);
      resetFormState();
      await loadCategories();
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
      await api.delete(`/categories/${deleteTarget._id}`);
      showToast("Category deleted successfully", "success");
      setDeleteTarget(null);
      await loadCategories();
    } catch (error) {
      showToast(getApiError(error), "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">
            Categories
          </h2>
          <p className="mt-1 text-sm text-pink-100">
            Organize products into browseable beauty categories.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className={adminPrimaryButtonClass}
        >
          <Plus size={16} />
          Add Category
        </button>
      </div>

      {loading ? (
        <LoadingState label="Loading categories..." />
      ) : categories.length === 0 ? (
        <EmptyState
          title="No categories yet"
          description="Create your first category to start organizing products."
          action={
            <button
              type="button"
              onClick={openCreate}
              className={adminPrimaryButtonClass}
            >
              <Plus size={16} />
              Add Category
            </button>
          }
        />
      ) : (
        <AdminTable
          headers={["Image", "Name", "Slug", "Status", "Created", "Actions"]}
        >
          {categories.map((category) => (
            <tr key={category._id} className="hover:bg-[#fdf2f7]/50">
              <td className="px-4 py-3">
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fdf2f7] text-[#9f6b82]">
                    <ImagePlus size={18} />
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-medium text-[#3b1026]">
                {category.name}
              </td>
              <td className="px-4 py-3 text-[#7a4a5e]">{category.slug}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  status={category.isActive === false ? "INACTIVE" : "ACTIVE"}
                />
              </td>
              <td className="px-4 py-3 text-[#7a4a5e]">
                {formatDate(category.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(category)}
                    className={adminGhostButtonClass}
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(category)}
                    className={adminDangerButtonClass}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <FormModal
        open={modalOpen}
        title={editing ? "Edit Category" : "Create Category"}
        subtitle="Upload a category image from your computer. Slug is generated automatically."
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            resetFormState();
          }
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={adminLabelClass}>Name</label>
            <input
              className={adminInputClass}
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((prev) => ({
                  ...prev,
                  name,
                  slug: slugify(name),
                }));
              }}
              required
              minLength={2}
              placeholder="e.g. Skin Care"
            />
          </div>

          <div>
            <label className={adminLabelClass}>Slug (auto-generated)</label>
            <input
              className={`${adminInputClass} bg-[#fdf2f7]`}
              value={form.slug}
              readOnly
              aria-readonly="true"
            />
            <p className="mt-1 text-xs text-[#9f6b82]">
              Generated from the category name (e.g. Men&apos;s Fragrance →
              mens-fragrance).
            </p>
          </div>

          <div>
            <label className={adminLabelClass}>
              {editing ? "Category Image (optional replacement)" : "Category Image"}
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className={adminInputClass}
              onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
            />
            <p className="mt-1 text-xs text-[#9f6b82]">
              Supported formats: JPG, PNG, WEBP. Uploaded via Cloudinary.
            </p>

            {currentPreview ? (
              <div className="mt-3 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentPreview}
                  alt="Category preview"
                  className="h-20 w-20 rounded-xl object-cover border border-[#f3d4e0]"
                />
                <div className="text-xs text-[#9f6b82]">
                  {form.imageFile
                    ? "New image selected — will upload on save."
                    : editing?.image
                      ? "Current image kept unless you choose a new file."
                      : null}
                  {form.imageFile ? (
                    <button
                      type="button"
                      className="mt-2 block font-semibold text-[#be185d]"
                      onClick={() => handleImageChange(null)}
                    >
                      Remove selected file
                    </button>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-[#f3d4e0] bg-[#fdf2f7] text-[#9f6b82]">
                <ImagePlus size={20} />
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[#5c2a40]">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="rounded border-[#f3d4e0] text-[#be185d] focus:ring-[#be185d]"
            />
            Active category
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className={adminSecondaryButtonClass}
              disabled={saving}
              onClick={() => {
                setModalOpen(false);
                resetFormState();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={adminPrimaryButtonClass}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editing
                  ? "Update Category"
                  : "Create Category"}
            </button>
          </div>
        </form>
      </FormModal>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete category"
        message={`Delete "${deleteTarget?.name}"? Products linked to it may be affected.`}
        confirmLabel="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
