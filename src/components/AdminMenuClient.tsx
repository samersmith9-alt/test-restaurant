"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";

type Category = { id: number; name: string; nameAr: string };
type MenuItem = {
  id: number; name: string; nameAr: string; description: string | null;
  descriptionAr: string | null; price: number; priceSyp: number; image: string | null;
  available: boolean; featured: boolean; categoryId: number;
  category: { name: string; nameAr: string };
};

const defaultForm = {
  name: "", nameAr: "", description: "", descriptionAr: "",
  price: "", priceSyp: "", image: "", categoryId: 0, available: true, featured: false,
};

export default function AdminMenuClient({
  items: initial,
  categories,
}: {
  items: MenuItem[];
  categories: Category[];
}) {
  const [items, setItems] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const resetForm = () => {
    setForm(defaultForm);
    setEditing(null);
    setShowForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setForm((prev) => ({ ...prev, image: data.url }));
    setUploading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = {
        name: form.name, nameAr: form.nameAr,
        description: form.description || null,
        descriptionAr: form.descriptionAr || null,
        price: parseFloat(form.price),
        priceSyp: parseFloat(form.priceSyp) || 0,
        image: form.image || null,
        categoryId: form.categoryId ? Number(form.categoryId) : categories[0]?.id,
        available: form.available,
        featured: form.featured,
      };

      if (editing) {
        const res = await fetch(`/api/menu/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setItems((prev) =>
          prev.map((i) => (i.id === editing.id ? { ...i, ...updated, category: editing.category } : i))
        );
      } else {
        const res = await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const created = await res.json();
        const cat = categories.find((c) => c.id === created.categoryId);
        setItems((prev) => [{ ...created, category: cat || categories[0] }, ...prev]);
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return;
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleAvailable = async (item: MenuItem) => {
    await fetch(`/api/menu/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i))
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Menu Items</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <h3 className="font-semibold">{editing ? "Edit" : "New"} Menu Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              placeholder="Name (English)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              placeholder="Name (Arabic)"
              value={form.nameAr}
              onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              placeholder="Description (English)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              placeholder="Description (Arabic)"
              value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price (USD)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <input
              type="number"
              step="1"
              placeholder="Price (SYP)"
              value={form.priceSyp}
              onChange={(e) => setForm({ ...form, priceSyp: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value={0}>Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.nameAr})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <Upload className="w-4 h-4" />
              <span className="text-sm">{uploading ? "Uploading..." : "Upload Image"}</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
            {form.image && (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                <Image src={form.image} alt="Preview" fill className="object-cover" sizes="48px" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Available</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Featured</span>
            </label>
          </div>

          <div className="flex gap-2">
            <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark disabled:opacity-50">
              {loading ? "Saving..." : "Save"}
            </button>
            <button onClick={resetForm} className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Image</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Category</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Price USD</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">SYP</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Available</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Featured</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-4">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="40px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">-</div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.nameAr}</p>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{item.category.name}</td>
                <td className="py-3 px-4 font-medium">${item.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-muted-foreground">{item.priceSyp.toLocaleString()} SYP</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => toggleAvailable(item)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      item.available
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {item.available && <span className="text-white text-xs">✓</span>}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  {item.featured && <span className="text-amber-500">★</span>}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      setForm({
                        name: item.name, nameAr: item.nameAr,
                        description: item.description || "",
                        descriptionAr: item.descriptionAr || "",
                        price: item.price.toString(),
                        priceSyp: item.priceSyp.toString(),
                        image: item.image || "",
                        categoryId: item.categoryId,
                        available: item.available,
                        featured: item.featured,
                      });
                      setEditing(item);
                      setShowForm(true);
                    }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
