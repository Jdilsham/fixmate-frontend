import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Ban, CheckCircle, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";

const API = import.meta.env.VITE_BACKEND_URL;

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId , userRole) => {
    if (userRole === "ADMIN") {
      toast.error("Cannot ban an admin user");
      return;
    } // Prevent banning admins
    try {
      const response = await fetch(
        `${API}/api/admin/users/${userId}/toggle-ban`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (response.ok) {
        fetchUsers(); // Refresh list
      }
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <UserIcon className="w-5 h-5" /> User Management
      </h2>
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Joined</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  {user.firstName} {user.lastName}
                </td>
                <td className="p-4 text-muted-foreground">{user.email}</td>
                <td className="p-4">
                  <Badge variant="outline">{user.role}</Badge>
                </td>
                <td className="p-4">
                  {user.banned ? (
                    <span className="text-destructive flex items-center gap-1">
                      <Ban className="w-3 h-3" /> Banned
                    </span>
                  ) : (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  )}
                </td>
                <td className="p-4 text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  {user.role !== "ADMIN" && (
                    <Button
                    variant={user.banned ? "outline" : "destructive"}
                    size="sm"
                    onClick={() => handleToggleBan(user.id, user.role)}
                  >
                    {user.banned ? "Unban" : "Ban User"}
                  </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
