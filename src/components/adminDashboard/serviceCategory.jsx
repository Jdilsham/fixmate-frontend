import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ServiceCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API}/api/admin/categories`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Could not load categories");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;

    try {
      setLoading(true);
      const response = await fetch(`${API}/api/admin/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newCategory),
      });

      if (response.ok) {
        toast.success("Category added!");
        setNewCategory({ name: "", description: "" });
        fetchCategories();
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new category name:");
    if (!newName) return;

    try {
      const response = await fetch(`${API}/api/admin/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: newName }),
      });

      if (response.ok) {
        toast.success("Category updated!");
        fetchCategories();
      } else {
        toast.error("Failed to update category");
      }
    } catch (error) {
      toast.error("Network error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This might affect existing services.")) return;

    try {
      const response = await fetch(`${API}/api/admin/category/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        toast.success("Category removed");
        fetchCategories();
      } else {
        toast.error("Cannot delete: Category might be in use");
      }
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      <Card className="p-6 border rounded-2xl">
        <h3 className="text-lg font-bold mb-4">Add New Category</h3>
        <form
          onSubmit={handleCreate}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Input
            placeholder="Category Name (e.g. Plumbing)"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
            className="flex-1"
          />
          
          <Button type="submit" disabled={loading}>
            <span className="mr-2"> Add Category</span>
          </Button>
        </form>
      </Card>

      <Card className="p-4 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="">
            <tr className="border-b  text-left">
              <th className="p-3">Category Name</th>

              <th className="p-3 text-right pr-15 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b hover:bg-muted/30">
                <td className="p-3 font-medium">
                  {cat.categoryName || cat.name}
                </td>

                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleUpdate(cat.id)}
                      className="text-foreground hover:bg-muted-foreground/10"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(cat.id)}
                      className="text-foreground hover:bg-muted-foreground/10"
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
