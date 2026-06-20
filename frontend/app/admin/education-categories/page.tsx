"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit } from "lucide-react";

export default function EducationCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/`,
      );
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        setError("Failed to fetch categories.");
      }
    } catch (err) {
      setError("An error occurred fetching categories.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing || editingId === null) {
      setFormData({ ...formData, name, slug: generateSlug(name) });
    } else {
      setFormData({ ...formData, name });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url =
        isEditing && editingId
          ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/${editingId}/`
          : `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/`;

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: "", slug: "", description: "" });
        setIsEditing(false);
        setEditingId(null);
        fetchCategories();
      } else {
        const data = await res.json();
        alert(`Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      alert("An error occurred saving the category.");
    }
  };

  const handleEdit = (cat: any) => {
    setIsEditing(true);
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/education-categories/${slug}`,
        {
          method: "DELETE",
        },
      );
      if (res.ok) {
        fetchCategories();
      } else {
        alert("Failed to delete category.");
      }
    } catch (err) {
      alert("Error deleting category.");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", slug: "", description: "" });
  };

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-serif">
          Education Categories
        </h1>
        <p className="text-gray-500 mt-1">
          Manage the dynamic categories for the Education hub.
        </p>
        <p className="text-sm text-blue-600 mt-2 bg-blue-50 p-2 rounded inline-block">
          <strong>Tip:</strong> Create a category named exactly{" "}
          <strong>"Introductory"</strong> to use its latest post as the Hero
          section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? "Edit Category" : "Add New Category"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={handleNameChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Technical Analysis"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug
                </label>
                <input
                  required
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  readOnly={isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  {isEditing ? "Update" : "Add Category"}
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No categories found. Create one!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {cat.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {cat.slug}
                      </td>
                      <td className="px-6 py-4 flex justify-end gap-3">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.slug)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
