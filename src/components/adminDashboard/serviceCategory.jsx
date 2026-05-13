import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

import {
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "../../../utils/admin";

export default function ServiceCategoryManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "" });
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Could not load categories");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!newCategory.name.trim()) return;

    try {
      setLoading(true);

      await createAdminCategory({
        name: newCategory.name,
      });

      toast.success("Category added!");

      setNewCategory({ name: "" });

      fetchCategories();
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id) => {
    const newName = prompt("Enter new category name:");

    if (!newName) return;

    try {
      await updateAdminCategory(id, { name: newName });

      toast.success("Category updated!");

      fetchCategories();
    } catch (error) {
      toast.error("Failed to update category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This might affect existing services.")) return;

    try {
      await deleteAdminCategory(id);

      toast.success("Category removed");

      fetchCategories();
    } catch (error) {
      toast.error("Cannot delete: Category might be in use");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {/* Add Category */}
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
            Add Category
          </Button>
        </form>
      </Card>

      {/* Category Table */}
      <Card className="p-4 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Category Name</th>
              <th className="p-3 text-right pr-15">Actions</th>
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
                      className="text-red-500 hover:bg-red-50"
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
