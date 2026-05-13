import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import Header from "../components/header";
import Footercard from "../components/footer";
import JobCard from "../components/wantedPage/jobCard";
import WantedNoticeModal from "../components/wantedPage/wantedNoticeModal";
import { Button } from "@/components/ui/button";
import PageBackground from "../components/animate-ui/components/backgrounds/PageBackground";
import { getAuthUser } from "../../utils/auth";
import toast from "react-hot-toast";
const API = import.meta.env.VITE_BACKEND_URL;

export default function Wanted() {
  const footerRef = useRef(null);
  const [hideFab, setHideFab] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const auth = getAuthUser();
  const isServiceProvider = auth?.role === "SERVICE_PROVIDER";
  const isCustomer = auth?.role === "CUSTOMER";
  
  

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API}/api/wanted`, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (postId) => {
  if (!auth?.token) return toast.error("Please login to sign up for work.");

  try {
    const res = await fetch(`${API}/api/wanted/${postId}/apply`, {
      method: "POST",
      headers: { Authorization: `Bearer ${auth.token}` },
    });

    if (!res.ok) {
      const msg = await res.text();
      return toast.error("Failed to apply: " + msg);
    }

    toast.success("Success! You've joined this project.");

    
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === postId
          ? { ...job, applied: true, currentJoined: job.currentJoined + 1 }
          : job
      )
    );

  } catch (e) {
    console.error("Application error:", e);
    toast.error("Something went wrong.");
  }
};

  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHideFab(entry.isIntersecting),
      { threshold: 0.9 },
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full min-h-screen text-foreground overflow-x-hidden">
      <PageBackground />
      <Header />

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-10 left-[-120px] h-64 w-64 rounded-full blur-3xl bg-fuchsia-400/25 dark:bg-fuchsia-400/18" />

        <div className="absolute top-10 right-[-140px] h-72 w-72 rounded-full blur-3xl bg-cyan-400/25 dark:bg-cyan-400/18" />

        <div className="absolute top-40 left-1/2 -translate-x-1/2 h-72 w-[820px] rounded-full blur-3xl bg-gradient-to-r from-blue-400/20 via-indigo-400/18 to-emerald-400/20 dark:from-blue-400/16 dark:via-indigo-400/14 dark:to-emerald-400/16" />

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[760px] rounded-full blur-3xl bg-gradient-to-r from-orange-300/20 via-amber-200/18 to-yellow-200/18 dark:from-cyan-500/10 dark:via-blue-500/10 dark:to-emerald-500/10" />

        <div
          className="absolute inset-0 opacity-[0.10] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <section className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-5xl font-semibold mb-4">Wanted Professionals</h1>
        <p className="text-lg text-muted-foreground">
          Browse projects or post a recruitment notice to find skilled
          professionals.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-40">
        <div className="flex flex-col gap-8">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                {...job}
                isApplied={job.applied}
                onApply={handleApply}
                isProvider={isServiceProvider}
                
              />
            ))
          ) : (
            <p className="text-center opacity-50 py-10">
              No active notices found.
            </p>
          )}
        </div>
      </section>

      {isCustomer && (
        <Button
          size="icon-lg"
          aria-label="Add wanted notice"
          onClick={() => setIsModalOpen(true)}
          className={`
            fixed bottom-6 right-6 z-100
            rounded-2xl shadow-xl
            transition-all duration-300
            ${hideFab ? "opacity-0 pointer-events-none" : "opacity-100"}
          `}
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <WantedNoticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={fetchJobs}
      />

      <section ref={footerRef} className="pt-32 pb-24">
        <Footercard />
      </section>
    </div>
  );
}
