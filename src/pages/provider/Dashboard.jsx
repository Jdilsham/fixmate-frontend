import { useEffect, useState } from "react";
import { getAuthUser } from "../../../utils/auth";
import axios from "axios";
import { Card } from "../../components/ui/card";

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const authUser = getAuthUser(); // decoded from token
  const token = localStorage.getItem("token");

  const tabs = [
    { id: "Dashboard", label: "Dashboard" },
    { id: "Services", label: "Services" },
    { id: "Profile", label: "Profile" },
    { id: "Settings", label: "Settings" },
  ];

  // fetch provider profile using token
  useEffect(() => {
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API}/api/auth/login`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load provider profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  // safety net
  useEffect(() => {
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("Dashboard");
    }
  }, [activeTab]);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!profile) {
    return <div className="p-6">Profile not found</div>;
  }

  return (
    <div className="flex gap-6 p-6 h-full">
      {/* SIDEBAR */}
      <aside className="w-1/4 sticky  ">
        <div className=" h-full bg-card border rounded-3xl p-6 sticky top-24">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
              {profile.usernamename?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h3 className="font-semibold">{profile.username}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {profile.service}
              </p>
              <p className="text-sm text-muted-foreground">
                {profile.location}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-left transition ${
                  activeTab === tab.id
                    ? "bg-primary text-white"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 bg-accent-foreground rounded-xl p-6">
        {activeTab === "Dashboard" && (
          <div className="h-full ">
            <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
            <p>Welcome to your dashboard, {profile.username}!</p>
            <section className="flex justify-around">
              <Card className="mt-6 p-4 w-1/4 text-center">
                <h3 className="font-semibold mb-2">Total Revenue</h3>
                <p>Service: {profile.service}</p>
                <p>Location: {profile.location}</p>
              </Card>
              <Card className="mt-6 p-4 w-1/4 h-1/3 text-center">
                <h3 className="font-semibold mb-2">Orders Complete</h3>
                <p>Service: {profile.service}</p>
                <p>Location: {profile.location}</p>
              </Card>
              <Card className="mt-6 p-4 w-1/4 h-1/3 text-center">
                <h3 className="font-semibold mb-2">Earnings</h3>
                <p>Service: {profile.service}</p>
                <p>Location: {profile.location}</p>
              </Card>
            </section>
          </div>
        )}
        {activeTab === "Services" && (
          <div className="h-full">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
          </div>
        )}
        {activeTab === "Settings" && (
          <div className="h-full">
            <h2 className="text-xl font-semibold mb-4">Settings</h2>
          </div>
        )}
        {activeTab === "Profile" && (
          <div className="h-full">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
          </div>
        )}
      </main>
    </div>
  );
}
