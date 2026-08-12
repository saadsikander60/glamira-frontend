export function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-AE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatCurrency(amount?: number | null, currency = "AED") {
  if (amount === undefined || amount === null || Number.isNaN(Number(amount))) {
    return "—";
  }

  return `${currency} ${Number(amount).toLocaleString("en-AE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function truncateId(id?: string, size = 8) {
  if (!id) return "—";
  return id.length > size ? `${id.slice(0, size)}…` : id;
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
