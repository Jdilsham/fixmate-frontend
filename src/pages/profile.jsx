import { useState } from "react";
import Header from "../components/header";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ================= SIDEBAR ================= */}
          <aside className="w-full lg:w-1/4 lg:min-w-[260px]">
            <div className="lg:sticky lg:top-24 bg-card border border-border rounded-3xl p-6">
              {/* Profile summary */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-lg font-semibold">
                  J
                </div>
                <div>
                  <h3 className="font-semibold">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Electrician</p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex lg:flex-col gap-2 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "services", label: "Services" },
                  { id: "reviews", label: "Reviews" },
                  { id: "settings", label: "Settings" },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      shrink-0 text-left px-4 py-3 rounded-xl transition
                      ${
                        activeTab === item.id
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-muted text-foreground"
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ================= CONTENT ================= */}
          <main className="w-full lg:w-3/4">
            <div className="bg-card border border-border rounded-3xl p-8 min-h-[500px]">
              {activeTab === "overview" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Profile Overview
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    This section shows general information about the
                    professional, including experience, location, and
                    availability.
                  </p>
                </section>
              )}

              {activeTab === "services" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Services Offered
                  </h2>
                  <p className="text-muted-foreground">
                    List of services provided by this professional.
                  </p>
                </section>
              )}

              {activeTab === "reviews" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Customer Reviews
                  </h2>
                  <p className="text-muted-foreground">
                    Ratings and feedback from previous clients.
                  </p>
                </section>
              )}

              {activeTab === "settings" && (
                <section>
                  <h2 className="text-3xl font-semibold mb-4">
                    Account Settings
                  </h2>
                  <p className="text-muted-foreground">
                    Manage profile and account preferences.
                  </p>
                </section>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
