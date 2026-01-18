import { useState, useEffect } from "react";
import Header from "../components/header";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "../components/ui/button";
import { getAuthUser } from "../../utils/auth";

const API = import.meta.env.VITE_BACKEND_URL;

export default function ProfilePage() {
  const { id } = useParams(); // provider id
  const navigate = useNavigate();
  const [authUser] = useState(() => getAuthUser());


  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [date, setDate] = useState(new Date());

  // ---------------- AUTH GUARD ----------------
  useEffect(() => {
    if (!authUser) {
      navigate("/login");
    }
  }, [authUser, navigate]);

  // ---------------- FETCH PROVIDER PROFILE ----------------
useEffect(() => {
  if (!authUser) return;

  const controller = new AbortController();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API}/api/provider/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("Profile not found");

      const data = await res.json();
      setProfile(data);
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error(err);
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();

  return () => controller.abort();
}, [id]); 


  // ---------------- TABS ----------------
  const tabs = [
    { id: "overview", label: "Overview" },

    { id: "reviews", label: "Reviews" },
  ];

  // ---------------- UI STATES ----------------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="h-screen flex items-center justify-center">
        Profile not found
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 flex gap-8">
        {/* ================= SIDEBAR ================= */}
        <aside className="w-1/4">
          <div className="bg-card border rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center font-semibold">
                {profile.fullName?.charAt(0)}
              </div>

              <div>
                <h3 className="font-semibold">{profile.fullName}</h3>
                <p className="text-sm text-muted-foreground">{profile.skill}</p>
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
                  className={`px-4 py-3 rounded-xl text-left transition ${
                    activeTab === tab.id ? "bg-accent" : "hover:bg-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 bg-card border rounded-3xl p-8 relative">
          {activeTab === "overview" && (
            <div className="space-y-4 ">
              <p className="text-muted-foreground">{profile.description}</p>
              <p className="text-muted-foreground">{profile.experience}</p>

              <p>⭐ Rating: {profile.rating ?? "N/A"}</p>

              <h3 className="text-lg font-semibold mt-6">Services</h3>

              <div className="space-y-3">
                {(profile.services ?? []).map((service) => (
                  <div
                    key={service.providerServiceId}
                    className="flex items-center justify-between border rounded-xl p-4"
                  >
                    <div>
                      <p className="font-medium">{service.serviceTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        Rs. {service.fixedPrice ?? "—"}
                      </p>
                    </div>

                    <Button
                      onClick={() =>
                        navigate(`/book/${service.providerServiceId}`)
                      }
                    >
                      Book
                    </Button>
                  </div>
                ))}

                {(!profile.services || profile.services.length === 0) && (
                  <p className="text-sm text-muted-foreground">
                    No services available.
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <p className="text-muted-foreground">Reviews coming soon.</p>
          )}
        </main>
      </div>
    </div>
  );
}
