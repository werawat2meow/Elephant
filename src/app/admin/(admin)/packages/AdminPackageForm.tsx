"use client";
import React, { useState } from "react";

type PackageForm = {
  title: string;
  slug: string;
  description: string;
  priceAdult: string;
  priceChild: string;
  duration: string;
  activities: string;
  imageUrl: string;
  availableTimes: string;
  badge: string;
  badgeColor: string;
  category: string;
  popular: boolean;
  childNote: string;
  id?: string;
};

type Props = {
  initialData?: Partial<PackageForm> | null;
  onSaved?: () => void;
};

export default function AdminPackageForm({
  initialData = null,
  onSaved,
}: Props) {
  const [form, setForm] = useState<PackageForm>({
    title: "",
    slug: "",
    description: "",
    priceAdult: "",
    priceChild: "",
    duration: "",
    activities: "",
    imageUrl: "",
    availableTimes: "",
    badge: "",
    badgeColor: "bg-yellow-500",
    category: "",
    popular: false,
    childNote: "Children under 4 years free",
    id: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value, type } = target;
    const checked =
      type === "checkbox" && "checked" in target
        ? (target as HTMLInputElement).checked
        : undefined;
    setForm((s) => ({
      ...s,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed");
      setMessage("Package saved successfully");
      setForm({
        title: "",
        slug: "",
        description: "",
        priceAdult: "",
        priceChild: "",
        duration: "",
        activities: "",
        imageUrl: "",
        availableTimes: "",
        badge: "",
        badgeColor: "bg-yellow-500",
        category: "",
        popular: false,
        childNote: "Children under 4 years free",
        id: undefined,
      });
      onSaved?.();
    } catch (err: any) {
      setMessage(err.message || "Error saving package");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    if (initialData) {
      setForm((s) => ({ ...s, ...initialData } as PackageForm));
    }
  }, [initialData]);

  return (
    <form onSubmit={onSubmit} className="max-w-3xl">
      <h2 className="text-xl font-semibold mb-4">Create / Edit Package</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug</label>
          <input
            name="slug"
            value={form.slug}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="mt-1 block w-full rounded border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (Adult)</label>
          <input
            name="priceAdult"
            value={form.priceAdult}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            required
            type="number"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Price (Child)</label>
          <input
            name="priceChild"
            value={form.priceChild}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            required
            type="number"
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Duration</label>
          <input
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            required
            placeholder="e.g. 3 hours"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const formData = new FormData();
              formData.append("file", file);
              // Upload to API route
              const res = await fetch("/api/admin/packages/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (data?.url) {
                setForm((s) => ({ ...s, imageUrl: data.url }));
              } else {
                console.error("Failed to upload image", res.statusText);
                alert("Image upload failed: " + res.statusText);
                return;
              }
            }}
            className="mt-1 block w-full rounded border p-2"
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 h-24 rounded border object-contain"
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Badge Text</label>
          <input
            name="badge"
            value={form.badge}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            placeholder="e.g. Suitable for Family"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Badge Color</label>
          <select
            name="badgeColor"
            value={form.badgeColor}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
          >
            <option value="bg-yellow-500">Yellow</option>
            <option value="bg-green-500">Green</option>
            <option value="bg-blue-500">Blue</option>
            <option value="bg-orange-500">Orange</option>
            <option value="bg-orange-600">Orange Dark</option>
            <option value="bg-gray-500">Gray</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Category</label>
          <input
            name="category"
            value={form.category}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            placeholder="e.g. premium, standard, budget, cooking"
          />
        </div>
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            name="popular"
            checked={form.popular}
            onChange={onChange}
            id="popular"
            className="mr-2"
          />
          <label htmlFor="popular" className="text-sm">
            Popular
          </label>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">
            Activities (one per line)
          </label>
          <textarea
            name="activities"
            value={form.activities}
            onChange={onChange}
            rows={3}
            className="mt-1 block w-full rounded border p-2"
            placeholder={
              "Feeding elephants\nTaking photos with elephants\nLearning elephant behaviors"
            }
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">
            Available Times (comma separated)
          </label>
          <input
            name="availableTimes"
            value={form.availableTimes}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            placeholder="9:00 AM, 2:00 PM"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Child Note</label>
          <input
            name="childNote"
            value={form.childNote}
            onChange={onChange}
            className="mt-1 block w-full rounded border p-2"
            placeholder="Children under 4 years free"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Package"}
        </button>
        {message && <p className="text-sm text-gray-700">{message}</p>}
      </div>
    </form>
  );
}
