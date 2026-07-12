"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Category = {
  id: number; name: string; nameAr: string; slug: string; order: number;
  _count: { menuItems: number };
};

export default function AdminCategoriesClient({ categories: initial }: { categories: Category[] }) {
  const [categories, setCategories] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", nameAr: "", slug: "" });
  const [loading, setLoading] = useState(false);

  const generateSlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const resetForm = () => {
    setForm({ name: "", nameAr: "", slug: "" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const data = { ...form, slug: form.slug || generateSlug(form.name) };
      if (editing) {
        const res = await fetch(`/api/categories?id=${editing.id}`, {
          method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const updated = await res.json();
        setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, ...updated } : c)));
      } else {
        const res = await fetch("/api/categories", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data),
        });
        const created = await res.json();
        setCategories((prev) => [...prev, { ...created, _count: { menuItems: 0 } }]);
      }
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
          <h3 className="font-semibold">{editing ? "Edit" : "New"} Category</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              placeholder="Slug (auto)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
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
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Order</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Arabic</th>
              <th className="text-left py-3 px-4 text-muted-foreground font-medium">Slug</th>
              <th className="text-center py-3 px-4 text-muted-foreground font-medium">Items</th>
              <th className="text-right py-3 px-4 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border/50 hover:bg-muted/50">
                <td className="py-3 px-4 text-muted-foreground">{cat.order}</td>
                <td className="py-3 px-4 font-medium">{cat.name}</td>
                <td className="py-3 px-4 text-muted-foreground">{cat.nameAr}</td>
                <td className="py-3 px-4 text-muted-foreground">{cat.slug}</td>
                <td className="py-3 px-4 text-center">{cat._count.menuItems}</td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => { setForm({ name: cat.name, nameAr: cat.nameAr, slug: cat.slug }); setEditing(cat); setShowForm(true); }}
                    className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
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
