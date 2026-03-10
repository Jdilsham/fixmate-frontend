import { useEffect, useState } from "react";
import * as Avatar from "@radix-ui/react-avatar";
import { Camera } from "lucide-react";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EditImageModal from "../dashboard/editProfilePic";
import {
  getUserProfile,
  updateCustomerProfile,
  changePassword,
} from "../../../utils/profile";

function Input({ label, name, type = "text", value, onChange, disabled }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 bg-background ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

export default function AdminProfileSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editImageOpen, setEditImageOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [changingPassword, setChangingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const reloadProfile = async () => {
    try {
      setLoading(true);

      const profileData = await getUserProfile();

      if (!profileData) {
        toast.error("Failed to load profile");
        return;
      }

      setProfile(profileData);

      setProfileForm({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    const payload = {
      firstName: profileForm.firstName.trim(),
      lastName: profileForm.lastName.trim(),
      phone: profileForm.phone.trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.phone) {
      toast.error("First name, last name, and phone are required");
      return;
    }

    try {
      await updateCustomerProfile(payload);

      toast.success("Profile updated successfully");
      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error("Update profile failed:", err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setChangingPassword(true);

      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      toast.success("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setEditingSection(null);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    reloadProfile();
  }, []);

  if (loading) {
    return (
      <Card className="rounded-3xl border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-colors dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#071c2c_0%,#0a2236_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)]">
        Loading profile...
      </Card>
    );
  }

  return (
    <>
      <Card className="relative mb-10 overflow-hidden rounded-3xl border border-slate-200 bg-white text-slate-900 shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition-colors dark:border-cyan-400/20 dark:bg-[linear-gradient(180deg,#14314d_0%,#1d4668_100%)] dark:text-white dark:shadow-[0_10px_25px_rgba(0,0,0,0.20)]">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-primary to-cyan-400" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/30" />

        <div className="relative p-6 md:p-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[240px_1fr]">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-40 w-40 rounded-full md:h-56 md:w-56">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-xl" />

                <div className="relative h-full w-full overflow-hidden rounded-full border bg-background shadow-lg">
                  <Avatar.Root className="h-full w-full">
                    <Avatar.Image
                      src={profile?.profilePicture || ""}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                    <Avatar.Fallback className="flex h-full w-full items-center justify-center rounded-full bg-muted text-4xl font-bold">
                      {profile?.fullName?.[0] || "A"}
                    </Avatar.Fallback>
                  </Avatar.Root>
                </div>
              </div>

              <button
                onClick={() => setEditImageOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                <Camera className="h-4 w-4 opacity-80" />
                Edit Profile Photo
              </button>
            </div>

            <div className="min-w-0 space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <h2 className="truncate text-2xl font-bold tracking-tight md:text-3xl">
                    {profile?.fullName || "Admin User"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                    Manage your admin profile information
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold dark:bg-[#0d2a42]">
                    {profile?.role || "ADMIN"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Email
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {profile?.email || "Not set"}
                  </p>
                </div>

                <div className="rounded-2xl border bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                    Phone
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {profile?.phone || "Not set"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="space-y-5 rounded-3xl border bg-background/50 p-6 shadow-sm md:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <p className="text-sm text-muted-foreground">
                Personal details for your admin account
              </p>
            </div>

            {editingSection !== "basic" && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-4"
                onClick={() => setEditingSection("basic")}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="First Name"
              name="firstName"
              value={profileForm.firstName}
              onChange={handleProfileInputChange}
              disabled={editingSection !== "basic"}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={profileForm.lastName}
              onChange={handleProfileInputChange}
              disabled={editingSection !== "basic"}
            />

            <Input
              label="Phone Number"
              name="phone"
              value={profileForm.phone}
              onChange={handleProfileInputChange}
              disabled={editingSection !== "basic"}
            />

            <Input
              label="Email"
              name="email"
              value={profile?.email || ""}
              onChange={() => {}}
              disabled={true}
            />
          </div>

          {editingSection === "basic" && (
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button className="rounded-full px-6" onClick={handleSaveProfile}>
                Save Changes
              </Button>

              <Button
                variant="outline"
                className="rounded-full px-6"
                onClick={() => {
                  setEditingSection(null);
                  setProfileForm({
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    phone: profile?.phone || "",
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </Card>

        <Card className="space-y-6 rounded-3xl border bg-background/50 p-6 shadow-sm md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your admin account password
              </p>
            </div>

            {editingSection !== "password" && (
              <Button
                size="sm"
                variant="outline"
                className="rounded-full px-4"
                onClick={() => setEditingSection("password")}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="rounded-2xl border bg-card/60 p-5 md:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordInputChange}
                disabled={editingSection !== "password"}
              />

              <div className="hidden md:block" />

              <Input
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordInputChange}
                disabled={editingSection !== "password"}
              />

              <Input
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordInputChange}
                disabled={editingSection !== "password"}
              />
            </div>

            {editingSection === "password" && (
              <div className="flex flex-col gap-3 pt-5 sm:flex-row">
                <Button
                  className="rounded-full px-6"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                >
                  {changingPassword ? "Saving..." : "Change Password"}
                </Button>

                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={() => {
                    setEditingSection(null);
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {editImageOpen && (
        <EditImageModal
          onClose={() => {
            setEditImageOpen(false);
            reloadProfile();
          }}
        />
      )}
    </>
  );
}