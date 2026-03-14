import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ShieldCheck,
  FileText,
  Image as ImageIcon,
  CalendarDays,
  Award,
  UserCircle2,
  ExternalLink,
  BadgeCheck,
  AlertTriangle,
} from "lucide-react";
import { getProviderDetails, buildAdminAssetUrl } from "../../../utils/admin";

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-cyan-400/10 dark:bg-[#102c44]">
    <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
      <Icon className="h-4 w-4 text-orange-500 dark:text-cyan-300" />
      <span>{label}</span>
    </div>

    <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">
      {value || "Not provided"}
    </p>
  </div>
);

const DocumentCard = ({ title, src, alt, buttonText = "Open file" }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-cyan-400/10 dark:bg-[#102c44]">
    <div className="mb-3 flex items-center gap-2">
      <ImageIcon className="h-4 w-4 text-orange-500 dark:text-cyan-300" />
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
        {title}
      </p>
    </div>

    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-cyan-400/10 dark:bg-[#0a1f32]">
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-72 w-full object-cover"
        />
      ) : (
        <div className="flex h-72 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
          No image available
        </div>
      )}
    </div>

    {src && (
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 dark:border-cyan-400/20 dark:bg-cyan-500/10 dark:text-cyan-200"
      >
        {buttonText}
        <ExternalLink className="h-4 w-4" />
      </a>
    )}
  </div>
);

const SummaryMiniCard = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-cyan-400/10 dark:bg-[#102c44]">
    <div className="mb-2 flex items-center gap-2 text-xs uppercase text-slate-500 dark:text-slate-400">
      <Icon className="h-4 w-4 text-orange-500 dark:text-cyan-300" />
      {label}
    </div>

    <p className="text-sm font-semibold text-slate-900 dark:text-white">
      {value}
    </p>
  </div>
);

export default function ProviderDetailsModal({ providerId, isOpen, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && providerId) {
      fetchDetails();
    }
  }, [isOpen, providerId]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await getProviderDetails(providerId);
      setDetails(data);
    } catch {
      toast.error("Could not load provider details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const idFrontSrc = buildAdminAssetUrl(details?.idFrontUrl);
  const idBackSrc = buildAdminAssetUrl(details?.idBackUrl);
  const workPdfSrc = buildAdminAssetUrl(details?.workPdf);
  const profileImageSrc = buildAdminAssetUrl(details?.profileImage);

  const isProfileComplete = !!details?.isProfileComplete;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
        !w-[95vw] !max-w-[1600px]
        overflow-hidden rounded-3xl border border-slate-200 bg-[#f8fafc] p-0 shadow-2xl
        dark:border-cyan-400/15 dark:bg-[#061a2a]

        [&>button]:absolute
        [&>button]:top-5
        [&>button]:right-6
        [&>button]:h-9
        [&>button]:w-9
        [&>button]:rounded-full
        [&>button]:bg-white
        [&>button]:border
        [&>button]:border-slate-300
        [&>button]:shadow-sm
        [&>button]:flex
        [&>button]:items-center
        [&>button]:justify-center
        [&>button]:hover:bg-orange-50
        [&>button]:transition

        [&>button_svg]:h-4
        [&>button_svg]:w-4
        [&>button_svg]:text-slate-600

        dark:[&>button]:bg-[#0d2a42]
        dark:[&>button]:border-cyan-400/20
        dark:[&>button]:hover:bg-cyan-500/10
        "
      >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />


        <div className="w-full max-h-[92vh] overflow-y-auto">

          <div className="border-b border-slate-200 bg-gradient-to-r from-orange-50 via-white to-orange-50 px-8 py-6 dark:border-cyan-400/10 dark:from-[#0b2940] dark:via-[#0d314d] dark:to-[#0b2940]">

            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">

              <div className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold">
                    Provider Verification Details
                  </DialogTitle>
                </DialogHeader>

                <p className="mt-2 text-slate-600 dark:text-slate-300">
                  Review provider profile information and submitted documents
                  before approving the provider.
                </p>
              </div>

              {details && (
                <div className="flex items-start gap-2 pr-10">

                 <Badge
                    className={`rounded-md px-2 py-[2px] text-[11px] font-medium ${
                      isProfileComplete
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {isProfileComplete ? "Profile Complete" : "Profile Incomplete"}
                  </Badge>

                  <Badge className="rounded-md px-2 py-[2px] text-[11px] font-medium bg-orange-100 text-orange-700">
                    {details.verificationStatus}
                  </Badge>

                </div>
              )}

            </div>
          </div>

          <div className="space-y-10 p-10">

            {loading ? (
              <div className="text-center">Loading...</div>
            ) : details ? (
              <>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

                  <div className="flex gap-6 rounded-3xl border bg-white p-6 dark:bg-[#0d2a42]">

                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl border bg-slate-100 dark:bg-[#123550]">
                      {profileImageSrc ? (
                        <img src={profileImageSrc} className="h-full w-full object-cover" />
                      ) : (
                        <UserCircle2 className="h-12 w-12 text-orange-500" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="text-2xl font-bold">
                        {details.fullName}
                      </h2>

                      <p className="break-all text-slate-600 dark:text-slate-300">
                        {details.email}
                      </p>

                      <div className="mt-3 flex gap-2">
                        <Badge>{details.skill}</Badge>
                        <Badge variant="secondary">
                          {details.experience}
                        </Badge>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-4">

                    <SummaryMiniCard
                      icon={ShieldCheck}
                      label="Status"
                      value={details.verificationStatus}
                    />

                    <SummaryMiniCard
                      icon={CalendarDays}
                      label="Joined"
                      value={new Date(details.joinedAt).toLocaleDateString()}
                    />

                    <SummaryMiniCard
                      icon={AlertTriangle}
                      label="Profile Check"
                      value={
                        isProfileComplete
                          ? "Profile complete"
                          : "Profile incomplete"
                      }
                    />

                  </div>

                </section>

                <section>
                  <h3 className="mb-4 text-xl font-bold">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <InfoCard icon={Mail} label="Email" value={details.email} />
                    <InfoCard icon={Phone} label="Phone" value={details.phone} />
                    <InfoCard icon={Briefcase} label="Skill" value={details.skill} />
                    <InfoCard icon={Award} label="Experience" value={details.experience} />
                    <InfoCard icon={ShieldCheck} label="License" value={details.licenceNumber} />
                    <InfoCard icon={MapPin} label="City" value={details.city} />
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-xl font-bold">
                    Provider Description
                  </h3>

                  <div className="rounded-3xl border bg-white p-6 dark:bg-[#0d2a42]">
                    {details.description}
                  </div>
                </section>

                <section>
                  <h3 className="mb-4 text-xl font-bold">
                    Verification Documents
                  </h3>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <DocumentCard
                      title="ID Front"
                      src={idFrontSrc}
                      alt="ID Front"
                    />

                    <DocumentCard
                      title="ID Back"
                      src={idBackSrc}
                      alt="ID Back"
                    />
                  </div>

                  <div className="mt-6 rounded-3xl border bg-white p-6 dark:bg-[#0d2a42]">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-orange-500" />
                      Professional License / Work Document
                    </div>

                    {workPdfSrc ? (
                      <a
                        href={workPdfSrc}
                        target="_blank"
                        className="rounded-xl bg-orange-500 px-4 py-2 text-white"
                      >
                        View PDF
                      </a>
                    ) : (
                      <p className="text-slate-500">Not provided</p>
                    )}
                  </div>

                </section>

              </>
            ) : (
              <div>No provider found</div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}