import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Ban, CheckCircle, User as UserIcon } from "lucide-react";
import toast from "react-hot-toast";
import { getAdminUsers, toggleBanUser } from "../../../utils/admin";
import BanUserConfirmDialog from "./BanUserConfirmDialog";

export default function UserManagementTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const openConfirmDialog = (user) => {
    if (user.role === "ADMIN") {
      toast.error("Cannot ban admin user");
      return;
    }

    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const handleToggleBan = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);

      await toggleBanUser(selectedUser.id);

      toast.success(
        selectedUser.banned
          ? "User unbanned successfully"
          : "User banned successfully",
      );

      setIsConfirmOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-colors dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)]">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold">
              <UserIcon size={20} /> User Management
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
              Manage platform users and control account access.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center text-slate-500 dark:text-slate-300">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="py-10 text-center text-slate-500 dark:text-slate-300">
            No users found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 transition-colors dark:border-cyan-400/10 dark:bg-[#0d2a42]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-cyan-400/10 dark:text-slate-300">
                  <th className="px-4 py-4 font-medium">Name</th>
                  <th className="px-4 py-4 font-medium">Email</th>
                  <th className="px-4 py-4 font-medium">Role</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                  <th className="px-4 py-4 font-medium">Joined</th>
                  <th className="px-4 py-4 text-center font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-200 transition-colors hover:bg-slate-100/70 dark:border-cyan-400/10 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">
                      {user.firstName} {user.lastName}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      <Badge variant="outline">{user.role}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      {user.banned ? (
                        <span className="flex items-center gap-1 text-red-500 dark:text-red-400">
                          <Ban size={14} /> Banned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle size={14} /> Active
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-600 dark:text-slate-300">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-4 text-center">
                      {user.role !== "ADMIN" && (
                        <Button
                          variant={user.banned ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => openConfirmDialog(user)}
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
        )}
      </div>

      <BanUserConfirmDialog
        open={isConfirmOpen}
        onClose={() => {
          if (actionLoading) return;
          setIsConfirmOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleToggleBan}
        loading={actionLoading}
        userName={
          selectedUser
            ? `${selectedUser.firstName} ${selectedUser.lastName}`
            : ""
        }
        isBanned={selectedUser?.banned || false}
      />
    </>
  );
}
