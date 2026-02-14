import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import { Eye, CheckCircle, XCircle } from "lucide-react";
import { Camera } from "lucide-react";
import PageBackground from "../../components/animate-ui/components/backgrounds/PageBackground";
import ProviderDashboardOverview from "../../components/provider-dashboard/ProviderDashboardOverview";


import BookingsTable from "../../components/dashboard/bookingTable";
import {
  Home,
  Calendar as CalendarIcon,
  Settings,
  Briefcase,
  ListCheck,
} from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import EditImageModal from "../../components/dashboard/editProfilePic";
import EmployerGrid from "../../components/dashboard/addService/employerGrid";
import {
  getProviderBookings,
  getCustomerBookings,
  confirmBooking,
  rejectBookingApi,
} from "../../../utils/booking";

import BookingViewDialog from "../../components/dashboard/bookings/BookingViewDialog";
import CustomerPaymentDialog from "../../components/dashboard/payments/CustomerPaymentDialog";
import { getCustomerPayment } from "../../../utils/payment";
import RejectBookingDialog from "../../components/dashboard/bookings/RejectBookingDialog";
import ReVerificationDialog from "../../components/dashboard/ReVerificationDialog";
import AvailabilityConfirmDialog from "../../components/dashboard/AvailabilityConfirmDialog";
import ActivateAccountModal from "../../components/provider-activation/ActivateAccountModal";
import StepProfessionalInfo from "../../components/provider-activation/StepProfessionalInfo";
import StepAddress from "../../components/provider-activation/StepAddress";
import StepDocuments from "../../components/provider-activation/StepDocuments";
import StartJobConfirmDialog from "../../components/dashboard/bookings/StartJobConfirmDialog";
import EndWorkDialog from "../../components/dashboard/bookings/EndWorkDialog";
import { getBookingStatusView } from "../../../utils/bookingStatus";
import { formatWorkedTime, calculateFinalAmount } from "../../../utils/time";
import CustomerManageBooking from "../../components/dashboard/bookings/CustomerManageBooking";
import { getProviderPaymentByBooking, confirmProviderPayment } from "../../../utils/payment";
import ProviderManageBooking from "../../components/dashboard/bookings/ProviderManageBooking";
import AcceptBookingDialog from "../../components/dashboard/bookings/AcceptBookingDialog";



import {
  getUserProfile,
  updateAvailability,
  updateProviderProfile,
  updateCustomerProfile,
  getProviderAddress,
  addProviderAddress,
  updateProviderAddress,
  getCustomerAddress,
  addCustomerAddress,
  updateCustomerAddress,
  changePassword,
  updateProfessionalInfo,
  uploadIdFront,
  uploadIdBack,
  uploadWorkPdf,
  requestVerification
} from "../../../utils/profile";

const API = import.meta.env.VITE_BACKEND_URL;

const formatPrice = (amount) => {
  if (amount === null || amount === undefined) return "—";
  return `Rs. ${Number(amount).toLocaleString("en-LK")}`;
};

const MANAGED_KEY = "activeManagedBooking";



const ROLE_CONFIG = {
  SERVICE_PROVIDER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "pendingBooking", label: "Bookings", icon: ListCheck },
      { id: "managebookings", label: "Manage Bookings", icon: ListCheck },
      { id: "profile", label: "Profile", icon: Settings }
    ],
  },
  CUSTOMER: {
    tabs: [
        { id: "dashboard", label: "Dashboard", icon: Home },
        { id: "myBookings", label: "My Bookings", icon: ListCheck },
        { id: "profile", label: "Profile", icon: Settings },
    ],
  },
};

  // ================= BOOKING SORT ORDER =================
  const BOOKING_STATUS_PRIORITY = {
    PENDING: 1,
    ACCEPTED: 2,
    IN_PROGRESS: 3,
    PAYMENT_PENDING: 4,
    COMPLETED: 5,
    REJECTED: 6,
  };

  const sortBookings = (bookings = []) => {
    return [...bookings].sort((a, b) => {
      //status priority
      const statusDiff =
        (BOOKING_STATUS_PRIORITY[a.status] ?? 99) -
        (BOOKING_STATUS_PRIORITY[b.status] ?? 99);

      if (statusDiff !== 0) return statusDiff;

      //newest first
      const dateA = new Date(a.scheduledAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.scheduledAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  };

  const filterBookingsByStatus = (bookings = [], status) => {
    if (status === "ALL") return bookings;
    return bookings.filter((b) => b.status === status);
  };

export default function Dashboard() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [bookingStatusFilter, setBookingStatusFilter] = useState(() => {
    return localStorage.getItem("bookingStatusFilter") || "ALL";
  });

  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("dashboardActiveTab") || "dashboard";
  });

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("dashboardActiveTab", activeTab);
    }
  }, [activeTab]);


  const [date, setDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState(null);
  const [dateBookings, setDateBookings] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  const [customerSelectedDate, setCustomerSelectedDate] = useState(null);
  const [customerDateBookings, setCustomerDateBookings] = useState([]);
  const [customerCalendarLoading, setCustomerCalendarLoading] = useState(false);


  const [calendarSearch, setCalendarSearch] = useState("");
  const [calendarStatusFilter, setCalendarStatusFilter] = useState("ALL");

  const [isAvailable, setIsAvailable] = useState(false);
  const [editImageOpen, setEditImageOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [acceptBooking, setAcceptBooking] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const user = authUser && profile ? { ...authUser, ...profile } : authUser;
  const role = user?.role;

  const isProvider = role === "SERVICE_PROVIDER";

  const verificationStatus =
    profile?.verificationStatus ?? "NOT_SUBMITTED";

  const isPendingVerification =
    isProvider && verificationStatus === "PENDING";

  const isApproved =
    isProvider && verificationStatus === "APPROVED";

  const isReuploadingVerificationDocs =
  isApproved &&
  (profile?.idFrontUrl || profile?.idBackUrl || profile?.workPdfUrl);

  const canRequestVerification =
  isProvider &&
  profile?.verificationStatus === "NOT_SUBMITTED" &&
  profile?.idFrontUrl &&
  profile?.idBackUrl &&
  profile?.workPdfUrl;


  const [paymentInfo, setPaymentInfo] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const [providerPaymentInfo, setProviderPaymentInfo] = useState(null);
  const [providerPaymentLoading, setProviderPaymentLoading] = useState(false);


  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const [professionalForm, setProfessionalForm] = useState({
    skill: "",
    experience: "",
    description: "",
  });

  const [workPdf, setWorkPdf] = useState(null);


  const [hasAddress, setHasAddress] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  const [addressForm, setAddressForm] = useState({
    addressLine1: "",
    addressLine2: "",
    province: "",
    city: "",
    latitude: "",
    longitude: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [idFrontFile, setIdFrontFile] = useState(null);
  const [idBackFile, setIdBackFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(false);


  const reloadProfile = async () => {
    const auth = getAuthUser();
    if (!auth) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    setAuthUser(auth);

    setLoading(true);

    const profileData = await getUserProfile();

    console.log("FULL PROFILE FROM BACKEND =", profileData);


    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    setProfile(profileData);

    if (profileData?.verificationStatus === "APPROVED") {
      setWasPreviouslyApproved(true);
    }


    if (typeof profileData?.available === "boolean") {
      setIsAvailable(profileData.available);
    }


    setProfileForm({
      firstName: profileData?.fullName?.split(" ")[0] || "",
      lastName: profileData?.fullName?.split(" ")[1] || "",
      phone: profileData?.phone || "",
    });

    if (profileData?.role === "SERVICE_PROVIDER") {
      setProfessionalForm({
        skill: profileData?.skill || "",
        experience: profileData?.experience || "",
        description: profileData?.description || "",
      });
    }


    // LOAD ADDRESS (ROLE BASED)
    try {
      const addr =
        profileData.role === "SERVICE_PROVIDER"
          ? await getProviderAddress()
          : await getCustomerAddress();

      if (addr) {
        setHasAddress(true);
        setAddressForm({
          addressLine1: addr.addressLine1 || "",
          addressLine2: addr.addressLine2 || "",
          province: addr.province || "",
          city: addr.city || "",
          latitude: addr.latitude ?? "",
          longitude: addr.longitude ?? "",
        });
      } else {
        setHasAddress(false);
      }
    } catch (err) {
      console.error("Failed to load address", err);
      setHasAddress(false);
    }

    setActiveTab((prev) => prev || "dashboard");

    setLoading(false);


  };

  const [providerBookings, setProviderBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);

  const [customerBookings, setCustomerBookings] = useState([]);
  const [customerBookingsLoading, setCustomerBookingsLoading] = useState(false);

  // CUSTOMER MyBookings UI helpers (customer only)
  const [customerStatusFilter, setCustomerStatusFilter] = useState("ALL");
  const [customerSearch, setCustomerSearch] = useState("");

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectBooking, setRejectBooking] = useState(null);


  const [showReverifyDialog, setShowReverifyDialog] = useState(false);
  const [wasPreviouslyApproved, setWasPreviouslyApproved] = useState(false);
  const [pendingUploadAction, setPendingUploadAction] = useState(null);

  const [showAvailabilityDialog, setShowAvailabilityDialog] = useState(false);
  const [pendingAvailability, setPendingAvailability] = useState(null);

  const [showActivateModal, setShowActivateModal] = useState(false);

  const [customerManageBookingOpen, setCustomerManageBookingOpen] = useState(false);

  // ================= ACTIVATE ACCOUNT FLOW =================
  const [activateStep, setActivateStep] = useState(1);

  const [activateProfessionalForm, setActivateProfessionalForm] = useState({
    skill: "",
    experience: "",
    description: "",
  });


  const [managedBooking, setManagedBooking] = useState(null);
  const [startingJob, setStartingJob] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [endWorkOpen, setEndWorkOpen] = useState(false);
  const [startConfirmOpen, setStartConfirmOpen] = useState(false);
  const [finalElapsedSeconds, setFinalElapsedSeconds] = useState(null);


  const refreshManagedBooking = async (bookingId) => {
    const updated = await getProviderBookings(user.id);     // refetch list
    setProviderBookings(updated);

    const latest = updated.find(b => b.bookingId === bookingId);
    if (latest) setManagedBooking(prev => ({ ...prev, ...latest }));
  };

  useEffect(() => {
    if (!managedBooking) return;

    if (endWorkOpen) return;

    // Only run timer for valid states
    if (!["IN_PROGRESS", "PAYMENT_PENDING"].includes(managedBooking.status)) {
      setElapsedSeconds(0);
      return;
    }

    if (!managedBooking.startedAt) return;

    const startTime = new Date(managedBooking.startedAt).getTime();

    const updateTimer = () => {
      const seconds = Math.max(
        0,
        Math.floor((Date.now() - startTime) / 1000)
      );

      setElapsedSeconds(seconds);

      localStorage.setItem(
        "elapsedSeconds",
        JSON.stringify({
          bookingId: managedBooking.bookingId,
          seconds,
        })
      );
    };

    // run immediately
    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [managedBooking?.status, managedBooking?.startedAt, endWorkOpen]);


  useEffect(() => {
    if (!managedBooking) return;

    const cached = localStorage.getItem("elapsedSeconds");
    if (!cached) return;

    try {
      const { bookingId, seconds } = JSON.parse(cached);

      if (bookingId === managedBooking.bookingId) {
        setElapsedSeconds(seconds);
      }
    } catch {
      localStorage.removeItem("elapsedSeconds");
    }
  }, [managedBooking?.bookingId]);


  useEffect(() => {
      if (role === "SERVICE_PROVIDER" && user?.id) {
        getProviderBookings(user.id)
          .then(setProviderBookings)
          .catch(() => toast.error("Failed to load bookings"));
      }
    }, [role, user?.id]);

  useEffect(() => {
    if (role !== "SERVICE_PROVIDER") return;
    if (!providerBookings || providerBookings.length === 0) return;

    const raw = localStorage.getItem(MANAGED_KEY);
    if (!raw) return;

    try {
      const { bookingId } = JSON.parse(raw);
      if (!bookingId) return;

      const booking = providerBookings.find((b) => b.bookingId === bookingId);

      if (!booking) {
        localStorage.removeItem(MANAGED_KEY);
        return;
      }

      setManagedBooking((prev) =>
        prev
          ? prev
          : {
              ...booking,
              bookingId: booking.bookingId ?? booking.id,
              scheduledAt: booking.scheduledAt,
              startedAt: booking.startedAt ?? null,
            }
      );

      setActiveTab("managebookings");
    } catch (e) {
      localStorage.removeItem(MANAGED_KEY);
    }
  }, [role, providerBookings]);

  useEffect(() => {
    if (role !== "SERVICE_PROVIDER") return;
    if (!managedBooking?.bookingId) return;

    if (["COMPLETED", "REJECTED"].includes(managedBooking.status)) {
      localStorage.removeItem(MANAGED_KEY); // activeManagedBooking
      localStorage.removeItem("activeJob");
      localStorage.removeItem("elapsedSeconds");
      localStorage.removeItem("pendingPaymentBooking");
    }
  }, [role, managedBooking?.status, managedBooking?.bookingId]);

  useEffect(() => {
    if (role !== "SERVICE_PROVIDER") return;

    if (!providerBookings || providerBookings.length === 0) return;

    const raw = localStorage.getItem("pendingPaymentBooking");
    if (!raw) return;

    try {
      const { bookingId } = JSON.parse(raw);

      const booking = providerBookings.find(
        (b) => b.bookingId === bookingId
      );

      if (!booking) {
        return;
      }

      setManagedBooking({
        ...booking,
        status: "PAYMENT_PENDING",
      });

      setSelectedBooking(booking);
      setActiveTab("managebookings");
    } catch (err) {
      console.error(err);
    }
  }, [providerBookings, role]);
    
  useEffect(() => {
    if (role !== "SERVICE_PROVIDER") return;
    if (!managedBooking?.bookingId) return;

    let alive = true;

    (async () => {
      try {
        // always keep booking details fresh
        const updated = await getProviderBookings(user.id);
        if (!alive) return;

        setProviderBookings(updated);

        const latest = updated.find(b => b.bookingId === managedBooking.bookingId);
        if (latest) setManagedBooking(prev => (prev ? { ...prev, ...latest } : prev));

        // if payment pending, sync payment info
        if (latest?.status === "PAYMENT_PENDING") {
          const p = await getProviderPaymentByBooking(managedBooking.bookingId);
          if (!alive) return;
          setProviderPaymentInfo(p);
        }
      } catch (e) {
        // keep quiet to avoid toast spam
        console.warn("sync managed booking failed", e);
      }
    })();

    return () => { alive = false; };
  }, [role, user?.id, managedBooking?.bookingId]);

  useEffect(() => {
    if (!providerBookings.length) return;

    const activeJobRaw = localStorage.getItem("activeJob");
    if (!activeJobRaw) return;

    const activeJob = JSON.parse(activeJobRaw);

    const booking = providerBookings.find(
      (b) => b.bookingId === activeJob.bookingId
    );

    if (!booking) {
      localStorage.removeItem("activeJob");
      localStorage.removeItem("elapsedSeconds");
      return;
    }

    // restore booking into manage view
    setManagedBooking({
      ...booking,
      status: "IN_PROGRESS",
      startedAt: activeJob.startedAt,
    });

    // ensure correct tab
    setActiveTab("managebookings");
  }, [providerBookings]);

  useEffect(() => {
    if (role !== "SERVICE_PROVIDER") return;
    if (!managedBooking?.bookingId) return;

    if (managedBooking.status !== "PAYMENT_PENDING") {
      setProviderPaymentInfo(null);
      return;
    }

    let alive = true;

    (async () => {
      try {
        setProviderPaymentLoading(true);
        const data = await getProviderPaymentByBooking(managedBooking.bookingId);
        if (alive) setProviderPaymentInfo(data);
      } catch (e) {
        // don't spam backend — just keep current UI state
        console.warn("Failed to fetch provider payment:", e);
      } finally {
        if (alive) setProviderPaymentLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [role, managedBooking?.bookingId, managedBooking?.status]);



  useEffect(() => {
    if (role === "CUSTOMER") {
        setCustomerBookingsLoading(true);

        getCustomerBookings()
          .then((data) => {
            setCustomerBookings(data);
          })
          .catch(() => {
            toast.error("Failed to load your bookings");
          })
          .finally(() => {
            setCustomerBookingsLoading(false);
          });
      }
  }, [role]);

  useEffect(() => {
    localStorage.setItem("bookingStatusFilter", bookingStatusFilter);
  }, [bookingStatusFilter]);


  const handleSaveProfile = async () => {
    try {
      const payload = {
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        phone: profileForm.phone,
      };

      if (role === "SERVICE_PROVIDER") {
        await updateProviderProfile(payload);
      } else if (role === "CUSTOMER") {
        await updateCustomerProfile(payload);
      }

      toast.success("Profile updated successfully");
      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleSaveAddress = async () => {
    try {
      const payload = {
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2,
        province: addressForm.province,
        city: addressForm.city,
        latitude: addressForm.latitude ? Number(addressForm.latitude) : null,
        longitude: addressForm.longitude ? Number(addressForm.longitude) : null,
      };

      if (role === "SERVICE_PROVIDER") {
        if (hasAddress) {
          await updateProviderAddress(payload);
        } else {
          await addProviderAddress(payload);
          setHasAddress(true);
        }
      } else if (role === "CUSTOMER") {
        if (hasAddress) {
          await updateCustomerAddress(payload);
        } else {
          await addCustomerAddress(payload);
          setHasAddress(true);
        }
      }

      toast.success("Address saved successfully");
      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  const handleSaveProfessionalInfo = async () => {
    try {
      await updateProfessionalInfo({
        skill: professionalForm.skill,
        experience: professionalForm.experience,
        description: professionalForm.description,
      });

      toast.success("Professional information saved");
      setEditingSection(null);
      await reloadProfile();
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
          "Failed to save professional information"
      );
    }
  };

const handleUploadIdFront = () => {
  if (!idFrontFile) {
    toast.error("Select ID front image");
    return;
  }

  setPendingUploadAction(() => async () => {
    await uploadIdFront(idFrontFile);
    toast.success("ID front uploaded. Re-verification required.");
  });

  setShowReverifyDialog(true);
};

const handleUploadIdBack = () => {
  if (!idBackFile) {
    toast.error("Select ID back image");
    return;
  }

  setPendingUploadAction(() => async () => {
    await uploadIdBack(idBackFile);
    toast.success("ID back uploaded. Re-verification required.");
  });

  setShowReverifyDialog(true);
};

const handleUploadWorkPdf = () => {
  if (!workPdf) {
    toast.error("Select work PDF");
    return;
  }

  setPendingUploadAction(() => async () => {
    await uploadWorkPdf(workPdf);
    toast.success("Work proof uploaded. Re-verification required.");
  });

  setShowReverifyDialog(true);
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
        confirmationPassword: confirmPassword,
      });

      toast.success("Password changed successfully");

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setEditingSection(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setChangingPassword(false);
    }
  };

  useEffect(() => {
    reloadProfile();
  }, []);

  
  const tabs = ROLE_CONFIG[role]?.tabs || [];

  useEffect(() => {
    if (tabs.length === 0) return;
    if (!tabs.some((t) => t.id === activeTab)) {
      setActiveTab("dashboard");
    }
  }, [activeTab, tabs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Session expired. Please login again.
      </div>
    );
  }

  const bookings =
    role === "SERVICE_PROVIDER"
      ? [
          {
            id: 1,
            customerName: "John Doe",
            service: "Electrical Repair",
            date: "2025-01-02",
            amount: 4500,
            status: "Completed",
          },
        ]
      : [
          {
            id: 1,
            providerName: "Mike Electric",
            service: "Wiring Fix",
            date: "2025-01-01",
            amount: 3000,
            status: "Completed",
          },
        ];

  const providerProfile =
    role === "SERVICE_PROVIDER"
      ? {
          id: user?.id,
          fullName: user?.fullName,
          profilePicture: user?.profilePicture,
          service: user?.service,
          description: user?.description || "No description provided.",
          location: addressForm.city
          ? `${addressForm.city}, ${addressForm.province}` 
          : "Not specified",
        }
      : null;

  const formatStatus = (status) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const CUSTOMER_STATUS_PRIORITY = {
    PAYMENT_PENDING: 1,
    ACCEPTED: 2,
    PENDING: 3,
    IN_PROGRESS: 4,
    COMPLETED: 5,
    REJECTED: 6,
  };

  const sortCustomerBookings = (bookings = []) => {
    return [...bookings].sort((a, b) => {
      const statusDiff =
        (CUSTOMER_STATUS_PRIORITY[a.status] ?? 99) -
        (CUSTOMER_STATUS_PRIORITY[b.status] ?? 99);

      if (statusDiff !== 0) return statusDiff;

      const dateA = new Date(a.scheduledAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.scheduledAt || b.createdAt || 0).getTime();

      return dateB - dateA;
    });
  };

  const filterCustomerBookings = (bookings = []) => {
    let list = [...bookings];

    // status filter
    if (customerStatusFilter !== "ALL") {
      list = list.filter((b) => b.status === customerStatusFilter);
    }

    const q = customerSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        const service = (b.serviceName || "").toLowerCase();
        const provider = (b.providerName || "").toLowerCase();
        return service.includes(q) || provider.includes(q);
      });
    }

    return sortCustomerBookings(list);
  };

const customerStatusBadgeClass = (status) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-500";
    case "ACCEPTED":
      return "bg-green-500/20 text-green-500";
    case "IN_PROGRESS":
      return "bg-orange-500/20 text-orange-500";
    case "PAYMENT_PENDING":
      return "bg-blue-500/20 text-blue-500";
    case "COMPLETED":
      return "bg-emerald-500/20 text-emerald-500";
    case "REJECTED":
      return "bg-red-500/20 text-red-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};


  const loadBookingsForDate = async (day) => {
    if (!day || !user?.id) return;

      try {
        setCalendarLoading(true);

        const allBookings = await getProviderBookings(user.id);

        const selectedDay = day.toISOString().split("T")[0];

        const filtered = allBookings.filter((b) => {
          if (!b.scheduledAt) return false;

          const bookingDay = new Date(b.scheduledAt)
            .toISOString()
            .split("T")[0];

          return bookingDay === selectedDay;
        });

        setDateBookings(filtered);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load bookings for selected date");
      } finally {
        setCalendarLoading(false);
      }
  };

  // ================= CUSTOMER DATE BOOKINGS =================
  const loadCustomerBookingsForDate = (day) => {
    if (!day) return;

    try {
      setCustomerCalendarLoading(true);

      const selectedDay = day.toISOString().split("T")[0];

      const filtered = customerBookings.filter((b) => {
        if (!b.scheduledAt) return false;

        const bookingDay = new Date(b.scheduledAt)
          .toISOString()
          .split("T")[0];

        return bookingDay === selectedDay;
      });

      setCustomerDateBookings(filtered);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setCustomerCalendarLoading(false);
    }
  };


  const busyDates = new Set(
    providerBookings
      .filter((b) => b.scheduledAt)
      .map(
        (b) =>
          new Date(b.scheduledAt).toISOString().split("T")[0]
      )
  );

  // ================= CUSTOMER BUSY DATES =================
  const customerBusyDates = new Set(
    customerBookings
      .filter((b) => b.scheduledAt)
      .map(
        (b) =>
          new Date(b.scheduledAt).toISOString().split("T")[0]
      )
  );



  const handleViewBooking = (booking) => {
  setSelectedBooking(booking);
  setViewOpen(true);
};

  const handleAcceptBooking = async (booking) => {
      try {
        await confirmBooking(booking.bookingId, booking.providerServiceId);
        toast.success("Booking accepted");

        // refresh both views
        const updated = await getProviderBookings(user.id);
        setProviderBookings(updated);

        if (selectedDate) {
          loadBookingsForDate(selectedDate);
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to accept booking"
        );
      }
  };

  const handleRejectBooking = (booking) => {
    setRejectBooking(booking);
    setRejectOpen(true);
  };


  const canToggleAvailability =
  role === "SERVICE_PROVIDER" &&
  profile?.verificationStatus === "APPROVED";


  const handleAvailabilityToggle = () => {
    if (!canToggleAvailability) return;

    const next = !isAvailable;

    // store intended action
    setPendingAvailability(next);

    // open confirmation popup
    setShowAvailabilityDialog(true);
  };


  const confirmAvailabilityChange = async () => {
    try {
      if (pendingAvailability === null) return;

      // optimistic UI update
      setIsAvailable(pendingAvailability);

      await updateAvailability(pendingAvailability);

      toast.success(
        pendingAvailability
          ? "Your services are now active"
          : "Your services are temporarily disabled"
      );
    } catch (err) {
      // rollback UI on error
      setIsAvailable((prev) => !prev);
      toast.error("Failed to update availability");
    } finally {
      setShowAvailabilityDialog(false);
      setPendingAvailability(null);
    }
  };

  const handleActivateProfessionalNext = async () => {
    try {
      await updateProfessionalInfo({
        skill: activateProfessionalForm.skill,
        experience: activateProfessionalForm.experience,
        description: activateProfessionalForm.description,
      });

      toast.success("Professional details saved");
      setActivateStep(2);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Failed to save professional details"
      );
    }
  };

  const handleActivateAddressNext = async () => {
    try {
      const payload = {
        addressLine1: addressForm.addressLine1,
        addressLine2: addressForm.addressLine2,
        province: addressForm.province,
        city: addressForm.city,
        latitude: addressForm.latitude
          ? Number(addressForm.latitude)
          : null,
        longitude: addressForm.longitude
          ? Number(addressForm.longitude)
          : null,
      };

      if (hasAddress) {
        await updateProviderAddress(payload);
      } else {
        await addProviderAddress(payload);
        setHasAddress(true);
      }

      toast.success("Address saved");
      setActivateStep(3);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to save address"
      );
    }
  };

  const handleActivateSubmit = async () => {
    try {
      await uploadIdFront(idFrontFile);
      await uploadIdBack(idBackFile);
      await uploadWorkPdf(workPdf);

      await requestVerification();

      toast.success("Verification request sent");
      setShowActivateModal(false);
      setActivateStep(1);

      await reloadProfile();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
        "Failed to submit verification"
      );
    }
  };

const handleStartJob = async () => {
  if (!managedBooking) return;

  try {
    setStartingJob(true);

    await fetch(
      `${API}/api/provider/bookings/${managedBooking.bookingId}/start?providerServiceId=${managedBooking.providerServiceId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getAuthUser()?.token}`,
        },
      }
    );

    const startedAt = new Date().toISOString();

    setManagedBooking((prev) => ({
      ...prev,
      status: "IN_PROGRESS",
      startedAt,
    }));

    localStorage.setItem(
      "activeJob",
      JSON.stringify({
        bookingId: managedBooking.bookingId,
        providerServiceId: managedBooking.providerServiceId,
        startedAt,
      })
    );

    toast.success("Job started");
  } catch (err) {
    toast.error("Failed to start job");
  } finally {
    setStartingJob(false);
  }
};

  const handleFinalizeFromPopup = async (payload) => {
    if (!managedBooking?.bookingId) {
      toast.error("Invalid booking");
      return;
    }

    try {
      await fetch(
        `${API}/api/provider/bookings/${managedBooking.bookingId}/finalize?providerServiceId=${managedBooking.providerServiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthUser()?.token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      localStorage.removeItem("activeJob");

      setManagedBooking((prev) => {
        if (!prev) return prev;

        const finalAmount =
          prev.paymentType === "FIXED"
            ? payload.finalAmount
            : calculateFinalAmount({
                paymentType: prev.paymentType,
                hourlyRate: prev.hourlyRate,
                workedSeconds: elapsedSeconds,
              });

        setSelectedBooking((sb) =>
          sb?.bookingId === prev.bookingId
            ? {
                ...sb,
                paymentAmount: finalAmount,
                workedSeconds: elapsedSeconds,
                status: "PAYMENT_PENDING",
              }
            : sb
        );

        setProviderBookings((list) =>
          list.map((b) =>
            b.bookingId === prev.bookingId
              ? {
                  ...b,
                  paymentAmount: finalAmount,
                  workedSeconds: elapsedSeconds,
                  status: "PAYMENT_PENDING",
                }
              : b
          )
        );

        return {
          ...prev,
          status: "PAYMENT_PENDING",
          paymentAmount: finalAmount,
          workedSeconds: elapsedSeconds,
        };
    });

      localStorage.setItem(
        "pendingPaymentBooking",
        JSON.stringify({
          bookingId: managedBooking.bookingId,
        })
      );

      setEndWorkOpen(false);
      toast.success("Job completed. Ready for payment");

    } catch (err) {
      console.error(err);
      toast.error("Failed to finalize job");
    }
  };


  const handleRequestPayment = async (booking) => {
    try {
      const res = await fetch(`${API}/api/provider/payments/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthUser()?.token}`,
        },
        body: JSON.stringify({
          bookingId: booking.bookingId ?? booking.id,
          amount: booking.paymentAmount,
          workedSeconds: booking.workedSeconds,
        }),
      });

      let created = null;
      try {
        created = await res.json();
      } catch {

      }

      if (!res.ok) {
        throw new Error(created?.message || "Failed to request payment");
      }

      setProviderPaymentInfo(
        created ?? {
          paymentId: true, 
          paymentStatus: "REQUESTED",
          paymentMethod: null,
        }
      );

      toast.success("Payment request sent");

      try {
        const p = await getProviderPaymentByBooking(booking.bookingId ?? booking.id);
        setProviderPaymentInfo(p);
      } catch (e) {
        console.warn("Payment created, but failed to fetch payment info:", e);
      }

      setProviderBookings((prev) =>
        prev.map((b) =>
          b.bookingId === (booking.bookingId ?? booking.id)
            ? { ...b, status: "PAYMENT_PENDING" }
            : b
        )
      );

      if (managedBooking?.bookingId === (booking.bookingId ?? booking.id)) {
        setManagedBooking((prev) => (prev ? { ...prev, status: "PAYMENT_PENDING" } : prev));
      }

      localStorage.removeItem("pendingPaymentBooking");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to request payment");
    }
  };

  const providerStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/20";
      case "ACCEPTED":
        return "bg-blue-500/15 text-blue-400 border-blue-500/20";
      case "IN_PROGRESS":
        return "bg-orange-500/15 text-orange-400 border-orange-500/20";
      case "PAYMENT_PENDING":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";
      case "COMPLETED":
        return "bg-green-500/15 text-green-400 border-green-500/20";
      case "REJECTED":
        return "bg-red-500/15 text-red-400 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };
  
  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <PageBackground />
      </div>

    <Header />

        <div className="max-w-8xl mx-auto px-4 md:px-6 pt-6
          grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6
          h-[calc(100vh-96px)] overflow-hidden">
        <aside className="hidden lg:block w-64 shrink-0 h-full">
          <div className="bg-card/60 backdrop-blur-xl border border-white/10 dark:border-white/10
            rounded-2xl p-4 shadow-lg h-full flex flex-col">
           <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
              Navigation
            </p>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 min-w-0 overflow-y-auto pr-1">
          <div className="bg-card/55 backdrop-blur-xl border border-white/10 dark:border-white/10 rounded-2xl p-6 shadow-lg">
            {/* CUSTOMER MANAGE BOOKING (OVERRIDES TABS) */}
            {role === "CUSTOMER" && customerManageBookingOpen && (
              <CustomerManageBooking
                booking={selectedBooking}
                onBack={() => {
                  setCustomerManageBookingOpen(false);
                  setSelectedBooking(null);
                  setActiveTab("myBookings");
                }}
              />
            )}

            {/* PROVIDER MANAGE BOOKING (OVERRIDES TABS) */}
            {role === "SERVICE_PROVIDER" && activeTab === "managebookings" && (
              <ProviderManageBooking
                booking={managedBooking}
                providerPaymentInfo={providerPaymentInfo}
                providerPaymentLoading={providerPaymentLoading}
                elapsedSeconds={elapsedSeconds}
                onBack={() => {
                  setActiveTab("pendingBooking"); // only navigation, no logic changed
                }}
                onStart={() => setStartConfirmOpen(true)}
                onEnd={() => {
                  setFinalElapsedSeconds(elapsedSeconds);
                  setEndWorkOpen(true);
                }}
                onRequestPayment={async () => {
                  await handleRequestPayment(managedBooking);

                  // keep your existing refresh pattern (same logic you already do in UI)
                  try {
                    const p = await getProviderPaymentByBooking(managedBooking.bookingId);
                    setProviderPaymentInfo(p);
                  } catch {}

                  await refreshManagedBooking(managedBooking.bookingId);
                }}
                onConfirmCash={async () => {
                  await confirmProviderPayment(
                    providerPaymentInfo.paymentId ?? providerPaymentInfo.id
                  );
                  toast.success("Payment confirmed");

                  const updated = await getProviderBookings(user.id);
                  setProviderBookings(updated);

                  const p = await getProviderPaymentByBooking(managedBooking.bookingId);
                  setProviderPaymentInfo(p);

                  setManagedBooking((prev) =>
                    prev ? { ...prev, status: "COMPLETED" } : prev
                  );
                }}
              />
            )}

            {!(
              (role === "CUSTOMER" && customerManageBookingOpen) ||
              (role === "SERVICE_PROVIDER" && activeTab === "managebookings")
            ) && (
            <>

            {/* DASHBOARD */}
            {activeTab === "dashboard" && role === "SERVICE_PROVIDER" && (
              <ProviderDashboardOverview
                onGoManageBookings={() => setActiveTab("pendingBooking")}
                onGoServices={() => setActiveTab("services")}
                onGoProfile={() => setActiveTab("profile")}
              />
            )}

            {/* SERVICES */}
            {activeTab === "services" && role === "SERVICE_PROVIDER" && (
              <>
                <h2 className="text-lg font-semibold mb-4">My Services</h2>

                {providerProfile && (
                  <EmployerGrid profile={providerProfile} />
                )}
              </>
            )}


            {/* CALENDAR */}
            {activeTab === "calendar" && role === "SERVICE_PROVIDER" && (
              <>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Availability</h2>
                    <p className="text-sm text-muted-foreground">
                      Pick a date to view bookings. Busy dates are marked with a red dot.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const today = new Date();
                        setSelectedDate(today);
                        setDateBookings([]);
                        loadBookingsForDate(today);
                      }}
                    >
                      Today
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedDate(null);
                        setDateBookings([]);
                        setCalendarSearch("");
                        setCalendarStatusFilter("ALL");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
                  <Card className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

                    {/* Content */}
                    <div className="p-5 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold">Calendar</p>

                        {/* Legend */}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            Busy
                          </span>
                        </div>
                      </div>

                      <div className="rounded-2xl border bg-background/40 p-3 flex items-center justify-center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(day) => {
                            setSelectedDate(day);
                            setDateBookings([]);
                            setCalendarSearch("");
                            setCalendarStatusFilter("ALL");
                            loadBookingsForDate(day);
                          }}
                          disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                          modifiers={{
                            busy: (date) => busyDates.has(date.toISOString().split("T")[0]),
                          }}
                          modifiersClassNames={{
                            busy:
                              "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
                          }}
                          className="rounded-xl"
                        />
                      </div>

                      {/* Selected date info */}
                      <div className="mt-4 rounded-2xl border bg-muted/20 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Selected Date
                        </p>

                        <p className="text-sm font-semibold mt-1">
                          {selectedDate
                            ? selectedDate.toLocaleDateString("en-LK", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "2-digit",
                              })
                            : "No date selected"}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedDate
                            ? "Bookings will appear on the right."
                            : "Select a date to view bookings."}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="relative overflow-hidden rounded-3xl border bg-card shadow-sm">
                    <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

                    {/* Content */}
                    <div className="p-6 pt-7">
                      {/* Top bar */}
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
                        <div className="min-w-0">
                          <p className="text-lg font-semibold">Bookings</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedDate
                              ? "Manage bookings for the selected day"
                              : "Select a date to see bookings"}
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
                          <input
                            value={calendarSearch}
                            onChange={(e) => setCalendarSearch(e.target.value)}
                            placeholder="Search by customer or service..."
                            className="
                              w-full sm:w-72
                              rounded-full border
                              bg-background
                              px-4 py-2
                              text-sm
                              focus:outline-none focus:ring-2 focus:ring-primary/40
                            "
                            disabled={!selectedDate}
                          />

                          <div className="relative">
                            <select
                              value={calendarStatusFilter}
                              onChange={(e) => setCalendarStatusFilter(e.target.value)}
                              disabled={!selectedDate}
                              className="
                                appearance-none
                                rounded-full
                                px-5 py-2 pr-10
                                text-sm font-semibold
                                bg-background
                                text-foreground
                                border border-border
                                shadow-sm
                                hover:bg-muted
                                focus:outline-none
                                focus:ring-2 focus:ring-primary/40
                                transition
                                cursor-pointer
                                disabled:opacity-60 disabled:cursor-not-allowed
                              "
                            >
                              <option value="ALL">All</option>
                              <option value="PENDING">Pending</option>
                              <option value="ACCEPTED">Accepted</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="PAYMENT_PENDING">Payment Pending</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="REJECTED">Rejected</option>
                            </select>

                            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                              ▼
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      {!selectedDate && (
                        <div className="rounded-2xl border bg-muted/10 p-10 text-center">
                          <p className="text-base font-semibold">No date selected</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Pick a date from the calendar to view bookings.
                          </p>
                        </div>
                      )}

                      {selectedDate && calendarLoading && (
                        <div className="rounded-2xl border bg-muted/10 p-10 text-center">
                          <p className="text-sm text-muted-foreground">Loading bookings...</p>
                        </div>
                      )}

                      {selectedDate && !calendarLoading && (() => {
                        const q = calendarSearch.trim().toLowerCase();
                        let list = [...(dateBookings || [])];

                        if (calendarStatusFilter !== "ALL") {
                          list = list.filter((b) => b.status === calendarStatusFilter);
                        }

                        if (q) {
                          list = list.filter((b) => {
                            const name = (b.customerName || "").toLowerCase();
                            const service = (b.serviceName || "").toLowerCase();
                            return name.includes(q) || service.includes(q);
                          });
                        }

                        const total = dateBookings?.length ?? 0;
                        const shown = list.length;

                        return (
                          <>
                            {/* Summary row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                              <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                                <span className="w-2 h-2 rounded-full bg-primary/70" />
                                Showing {shown} of {total}
                              </span>

                              {q || calendarStatusFilter !== "ALL" ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCalendarSearch("");
                                    setCalendarStatusFilter("ALL");
                                  }}
                                  className="text-xs font-semibold text-primary hover:underline"
                                >
                                  Reset filters
                                </button>
                              ) : null}
                            </div>

                            {list.length === 0 ? (
                              <div className="rounded-2xl border bg-muted/10 p-10 text-center">
                                <p className="text-base font-semibold">No bookings found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Try a different filter or search term.
                                </p>
                              </div>
                            ) : (
                              <div className="max-h-[460px] overflow-auto pr-1 space-y-3">
                                {list.map((b) => (
                                  <div
                                    key={b.bookingId}
                                    className="
                                      group
                                      rounded-2xl border
                                      bg-background/50
                                      p-4
                                      shadow-sm
                                      hover:shadow-md
                                      transition
                                    "
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="min-w-0">
                                        <p className="font-semibold truncate">{b.customerName}</p>
                                        <p className="text-sm text-muted-foreground truncate">
                                          {b.serviceName}
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                          <span className="rounded-full border px-2 py-1 bg-muted/30">
                                            {b.scheduledAt
                                              ? new Date(b.scheduledAt).toLocaleTimeString("en-LK", {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                })
                                              : "—"}
                                          </span>

                                          {b.bookingId ? (
                                            <span className="rounded-full border px-2 py-1 bg-muted/30">
                                              #{b.bookingId}
                                            </span>
                                          ) : null}
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${providerStatusBadge(
                                            b.status
                                          )}`}
                                        >
                                          {String(b.status || "—").replaceAll("_", " ")}
                                        </span>

                                        <Button
                                          size="icon"
                                          variant="secondary"
                                          title="View booking"
                                          onClick={() => handleViewBooking(b)}
                                        >
                                          <Eye className="w-4 h-4" />
                                        </Button>

                                        {b.status === "PENDING" && (
                                          <>
                                            <Button
                                              size="icon"
                                              title="Accept booking"
                                              className="bg-green-600 hover:bg-green-700 text-white"
                                              onClick={() => handleAcceptBooking(b)}
                                            >
                                              <CheckCircle className="w-4 h-4" />
                                            </Button>

                                            <Button
                                              size="icon"
                                              variant="destructive"
                                              title="Reject booking"
                                              onClick={() => handleRejectBooking(b)}
                                            >
                                              <XCircle className="w-4 h-4" />
                                            </Button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </Card>
                </div>
              </>
            )}

            
            {/* Bookings */}
            {activeTab === "pendingBooking" && role === "SERVICE_PROVIDER" && (
              <>
                <Card className="p-0 overflow-hidden rounded-3xl border bg-card shadow-sm">
                  <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

                  {/* Header */}
                  <div className="px-6 py-5 border-b bg-card">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Bookings
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          View requests, accept/reject pending ones, and manage accepted jobs.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        {/* Filter */}
                        <div className="relative">
                          <select
                            value={bookingStatusFilter}
                            onChange={(e) => setBookingStatusFilter(e.target.value)}
                            className="
                              appearance-none
                              rounded-full
                              px-5 py-2 pr-10
                              text-sm font-medium
                              bg-background
                              text-foreground
                              border border-border
                              shadow-sm
                              hover:bg-muted
                              focus:outline-none focus:ring-2 focus:ring-primary/40
                              transition
                              cursor-pointer
                            "
                          >
                            <option value="ALL">All</option>
                            <option value="PENDING">Pending</option>
                            <option value="ACCEPTED">Accepted</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="PAYMENT_PENDING">Payment Pending</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                            ▼
                          </span>
                        </div>

                        {/* Count */}
                        <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-2 text-xs font-semibold text-muted-foreground">
                          <span className="w-2 h-2 rounded-full bg-primary/60" />
                          {filterBookingsByStatus(providerBookings, bookingStatusFilter).length} bookings
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/70">
                        <tr className="border-b text-muted-foreground">
                          <th className="py-4 px-4 font-medium text-left">Customer</th>
                          <th className="py-4 px-4 font-medium text-left">Phone</th>
                          <th className="py-4 px-4 font-medium text-left">Address</th>
                          <th className="py-4 px-4 font-medium text-center">Status</th>
                          <th className="py-4 px-4 font-medium text-center">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-border">
                        {(() => {
                          const filtered = filterBookingsByStatus(
                            providerBookings,
                            bookingStatusFilter
                          );
                          const sorted = sortBookings(filtered);

                          if (sorted.length === 0) {
                            return (
                              <tr>
                                <td colSpan={5} className="py-10 text-center">
                                  <p className="text-base font-semibold">No bookings found</p>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Try changing the filter.
                                  </p>
                                </td>
                              </tr>
                            );
                          }
                          return sorted.map((b) => (
                            <tr key={b.bookingId} className="border-0">
                              <td colSpan={5} className="px-4 py-2">
                                <div
                                  className="
                                    group
                                    grid grid-cols-1 md:grid-cols-[260px_160px_1fr_140px_220px]
                                    items-center
                                    gap-4
                                    rounded-2xl
                                    border
                                    bg-background/60
                                    px-4 py-4
                                    shadow-sm
                                    hover:shadow-md
                                    hover:-translate-y-[1px]
                                    transition
                                  "
                                >
                                  {/* Customer */}
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className="
                                        w-10 h-10 rounded-full
                                        bg-muted
                                        border
                                        flex items-center justify-center
                                        text-xs font-bold
                                      "
                                    >
                                      {(b.customerName || "C")[0]?.toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                      <p className="font-semibold truncate">{b.customerName}</p>
                                      <p className="text-xs text-muted-foreground truncate">
                                        Booking #{b.bookingId}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Phone */}
                                  <div className="text-sm">
                                    <span className="md:hidden text-xs uppercase tracking-wide text-muted-foreground block">
                                      Phone
                                    </span>
                                    <span className="font-medium text-foreground/90">
                                      {b.customerPhone}
                                    </span>
                                  </div>

                                  {/* Address */}
                                  <div className="min-w-0">
                                    <span className="md:hidden text-xs uppercase tracking-wide text-muted-foreground block">
                                      Address
                                    </span>
                                    <p className="text-sm text-muted-foreground truncate" title={b.bookingAddress}>
                                      {b.bookingAddress}
                                    </p>
                                  </div>

                                  {/* Status */}
                                  <div className="flex md:justify-center">
                                    {(() => {
                                      const status = getBookingStatusView(b);
                                      return (
                                        <span
                                          className={`
                                            inline-flex items-center gap-1
                                            rounded-full
                                            px-3 py-1
                                            text-xs font-semibold
                                            border border-border/60
                                            ${status.className}
                                          `}
                                        >
                                          {status.label}
                                        </span>
                                      );
                                    })()}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex md:justify-end">
                                    <div
                                      className="
                                        inline-flex items-center gap-2
                                        rounded-full
                                        border
                                        bg-muted/30
                                        p-1.5
                                        shadow-sm
                                      "
                                    >
                                      {/* VIEW - always */}
                                      <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full"
                                        title="View booking"
                                        onClick={() => {
                                          setSelectedBooking(b);
                                          setViewOpen(true);
                                        }}
                                      >
                                        <Eye className="w-4 h-4" />
                                      </Button>

                                      {/* PENDING: Accept + Reject (NO Manage) */}
                                      {b.status === "PENDING" && (
                                        <>
                                          <Button
                                            size="icon"
                                            title="Accept booking"
                                            className="rounded-full bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => {
                                              setAcceptBooking(b);
                                              setAcceptOpen(true);
                                            }}
                                          >
                                            <CheckCircle className="w-4 h-4" />
                                          </Button>

                                          <Button
                                            size="icon"
                                            variant="destructive"
                                            className="rounded-full"
                                            title="Reject booking"
                                            onClick={() => {
                                              setRejectBooking(b);
                                              setRejectOpen(true);
                                            }}
                                          >
                                            <XCircle className="w-4 h-4" />
                                          </Button>
                                        </>
                                      )}

                                      {/* NOT PENDING: Manage */}
                                      {b.status !== "PENDING" && (
                                        <Button
                                          size="sm"
                                          className="rounded-full bg-blue-600 hover:bg-blue-700 text-white px-4"
                                          onClick={() => {
                                            localStorage.setItem(
                                              MANAGED_KEY,
                                              JSON.stringify({
                                                bookingId: b.bookingId,
                                                providerServiceId: b.providerServiceId,
                                              })
                                            );

                                            setManagedBooking({
                                              ...b,
                                              bookingId: b.bookingId ?? b.id,
                                              scheduledAt: b.scheduledAt,
                                              startedAt: b.startedAt ?? null,
                                            });

                                            setActiveTab("managebookings");
                                          }}
                                        >
                                          Manage
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ));
                          
                        })()}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {/* CUSTOMER - MY BOOKINGS */}
            {activeTab === "myBookings" && role === "CUSTOMER" && (
              <>
                {/* Header */}
                <div className="flex flex-col gap-4 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">My Bookings</h2>
                      <p className="text-sm text-muted-foreground">
                        View your requests and complete payments when required
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCustomerSearch("");
                          setCustomerStatusFilter("ALL");
                        }}
                        className="sm:order-3"
                      >
                        Clear
                      </Button>

                      {/* Search */}
                      <input
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        placeholder="Search by service or provider..."
                        className="
                          w-full sm:w-64
                          rounded-full border
                          bg-background
                          px-4 py-2
                          text-sm
                          focus:outline-none focus:ring-2 focus:ring-primary/40
                        "
                      />

                      {/* Status Filter */}
                      <div className="relative">
                        <select
                          value={customerStatusFilter}
                          onChange={(e) => setCustomerStatusFilter(e.target.value)}
                          className="
                            w-full sm:w-auto
                            appearance-none
                            rounded-full
                            px-5 py-2 pr-10
                            text-sm font-semibold
                            bg-background
                            text-foreground
                            border border-border
                            shadow-sm
                            hover:bg-muted
                            focus:outline-none
                            focus:ring-2 focus:ring-primary/40
                            transition
                            cursor-pointer
                          "
                        >
                          <option value="ALL">All</option>
                          <option value="PENDING">Pending</option>
                          <option value="ACCEPTED">Accepted</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="PAYMENT_PENDING">Payment Pending</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="REJECTED">Rejected</option>
                        </select>

                        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                          ▼
                        </span>
                      </div>

                      {/* Count */}
                      <span className="px-3 py-2 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border sm:self-center">
                        {filterCustomerBookings(customerBookings).length} bookings
                      </span>
                    </div>
                  </div>

                  {/* Quick Summary (Customer only) - moved BELOW header */}
                  {!customerBookingsLoading && (
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Payment Pending", status: "PAYMENT_PENDING", cls: "bg-blue-500/15 text-blue-500 border-blue-500/20" },
                        { label: "Pending", status: "PENDING", cls: "bg-yellow-500/15 text-yellow-500 border-yellow-500/20" },
                        { label: "Accepted", status: "ACCEPTED", cls: "bg-green-500/15 text-green-500 border-green-500/20" },
                        { label: "Completed", status: "COMPLETED", cls: "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" },
                      ].map((x) => {
                        const count = (customerBookings || []).filter((b) => b.status === x.status).length;

                        return (
                          <button
                            key={x.status}
                            onClick={() => setCustomerStatusFilter(x.status)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition hover:opacity-90 ${x.cls}`}
                            title="Click to filter"
                            type="button"
                          >
                            {x.label}: {count}
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setCustomerStatusFilter("ALL")}
                        className="px-3 py-2 rounded-full text-xs font-semibold border bg-muted text-muted-foreground hover:bg-muted/80 transition"
                        title="Show all"
                      >
                        All: {customerBookings?.length ?? 0}
                      </button>
                    </div>
                  )}
                </div>

                {/* Loading */}
                {customerBookingsLoading && (
                  <Card className="p-6 rounded-2xl">
                    <p className="text-sm text-muted-foreground">Loading your bookings...</p>
                  </Card>
                )}

                {/* Empty */}
                {!customerBookingsLoading &&
                  filterCustomerBookings(customerBookings).length === 0 && (
                    <Card className="p-10 rounded-2xl text-center">
                      <p className="text-lg font-semibold">No bookings found</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Try changing filters or search keywords
                      </p>
                    </Card>
                  )}

                {/* List */}
                {!customerBookingsLoading &&
                  filterCustomerBookings(customerBookings).length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filterCustomerBookings(customerBookings).map((b) => (
                        <Card
                          key={b.bookingId}
                          className="p-5 rounded-2xl border hover:shadow-md transition"
                        >
                          {/* Top Row */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-base font-semibold truncate">
                                {b.serviceName}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {b.providerName || "Provider not assigned"}
                              </p>
                            </div>

                            <span
                              className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${customerStatusBadgeClass(
                                b.status
                              )}`}
                            >
                              {b.status.replaceAll("_", " ")}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-xl bg-muted/30 p-3">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Scheduled
                              </p>
                              <p className="font-semibold">
                                {b.scheduledAt
                                  ? new Date(b.scheduledAt).toLocaleString("en-LK", {
                                      year: "numeric",
                                      month: "short",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })
                                  : "—"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-muted/30 p-3">
                              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Amount
                              </p>
                              <p className="font-semibold">
                                {formatPrice(b.paymentAmount)}
                              </p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="mt-5 flex items-center justify-end gap-2">
                            {/* VIEW (same behavior as your old code) */}
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedBooking(b);
                                setViewOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>

                            {/* PAY (same behavior as your old code) */}
                            {b.status === "PAYMENT_PENDING" && (
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={async () => {
                                  try {
                                    const payment = await getCustomerPayment(b.bookingId);
                                    setPaymentInfo(payment);
                                    setPaymentOpen(true);
                                  } catch {
                                    toast.error("Failed to load payment info");
                                  }
                                }}
                              >
                                Pay Now
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
              </>
            )}

            {/* PROFILE */}
            {activeTab === "profile" && (
              <>
              {/* ================= PROFILE HEADER ================= */}
              <Card className="relative overflow-hidden rounded-3xl border mb-10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent/80 via-primary/70 to-cyan-400/60" />

                {/* soft background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/30" />
                <div className="relative p-6 md:p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-center">
                    {/* LEFT — Avatar */}
                    <div className="flex flex-col items-center gap-3">
                      <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full">
                        <div className="absolute -inset-2 rounded-full bg-gradient-to-br from-primary/30 to-transparent blur-xl" />

                        <div className="relative w-full h-full rounded-full border bg-background shadow-lg overflow-hidden">
                          <Avatar.Root className="w-full h-full">
                            <Avatar.Image
                              src={user?.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover rounded-full"
                            />
                            <Avatar.Fallback className="flex items-center justify-center w-full h-full rounded-full text-4xl font-bold bg-muted">
                              {user?.fullName?.[0] || "U"}
                            </Avatar.Fallback>
                          </Avatar.Root>

                          {/* Availability dot */}
                          {role === "SERVICE_PROVIDER" && (
                            <span
                              className={`
                                absolute bottom-2 right-2
                                w-4 h-4 rounded-full
                                border-2 border-background
                                ${isAvailable ? "bg-green-500" : "bg-red-500"}
                              `}
                            />
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setEditImageOpen(true)}
                        className="
                          inline-flex items-center gap-2
                          px-4 py-2
                          rounded-full
                          text-sm font-medium
                          border bg-background/70
                          hover:bg-muted
                          transition
                          shadow-sm
                        "
                      >
                        <Camera className="w-4 h-4 opacity-80" />
                        Edit Profile Photo
                      </button>
                    </div>

                    {/* RIGHT — Details */}
                    <div className="space-y-6 min-w-0">
                      {/* Name + Role */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight truncate">
                            {user?.fullName}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-1">
                            {role === "SERVICE_PROVIDER"
                              ? "Manage your provider profile & verification"
                              : "Manage your profile details"}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-background">
                            {role}
                          </span>

                          {/* Provider status chip (only provider) */}
                          {role === "SERVICE_PROVIDER" && (
                            <>
                              {verificationStatus === "APPROVED" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-green-500/10 text-green-700 dark:text-green-300">
                                  ✓ Verified
                                </span>
                              )}
                              {verificationStatus === "PENDING" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-yellow-500/10 text-yellow-700 dark:text-yellow-300">
                                  ⏳ Pending
                                </span>
                              )}
                              {verificationStatus === "NOT_SUBMITTED" && (
                                <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-orange-500/10 text-orange-700 dark:text-orange-300">
                                  ⚠ Not Activated
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Info cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Skill → ONLY for Service Provider */}
                        {role === "SERVICE_PROVIDER" && (
                          <div className="rounded-2xl border bg-background/70 p-4">
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                              Skill
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              {user?.skill || "Not set"}
                            </p>
                          </div>
                        )}

                        {/* Location */}
                        <div className="rounded-2xl border bg-background/70 p-4">
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Location
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {addressForm.city
                              ? `${addressForm.city}, ${addressForm.province}`
                              : "Not set"}
                          </p>
                        </div>

                        {/* Phone */}
                        <div
                          className={`rounded-2xl border bg-background/70 p-4 ${
                            role === "SERVICE_PROVIDER" ? "md:col-span-2" : ""
                          }`}
                        >
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Phone
                          </p>
                          <p className="text-sm font-semibold mt-1">
                            {user?.phone || "Not set"}
                          </p>
                        </div>
                      </div>

                      {/* Availability (provider only) */}
                      {role === "SERVICE_PROVIDER" && (
                        <div className="rounded-2xl border bg-background/70 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">Availability</p>
                              <p className="text-xs text-muted-foreground">
                                {canToggleAvailability
                                  ? "Turn on/off to receive new jobs"
                                  : "Verify your account to change availability"}
                              </p>
                            </div>

                            <button
                              onClick={handleAvailabilityToggle}
                              disabled={!canToggleAvailability}
                              className={`relative w-14 h-7 rounded-full transition
                                ${isAvailable ? "bg-green-500" : "bg-gray-300"}
                                ${!canToggleAvailability ? "opacity-50 cursor-not-allowed" : ""}
                              `}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform
                                  ${isAvailable ? "translate-x-7" : "translate-x-0"}
                                `}
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Activate button (only when NOT_SUBMITTED) */}
                      {role === "SERVICE_PROVIDER" && verificationStatus === "NOT_SUBMITTED" && (
                        <div className="rounded-2xl border bg-orange-500/5 p-4">
                          <p className="text-sm font-semibold text-orange-700 dark:text-orange-300">
                            Activate your provider account
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload ID + work proof to request verification and start receiving bookings.
                          </p>

                          <button
                            onClick={() => setShowActivateModal(true)}
                            className="mt-3 inline-flex items-center px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium"
                          >
                            Activate Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>

                
                {/* VERIFICATION STATUS BANNER (SERVICE PROVIDER ONLY) */}
                {role === "SERVICE_PROVIDER" && profile?.verificationStatus && (
                    <div
                      className={`
                        mb-6 rounded-xl border px-5 py-4 text-sm
                        ${
                          profile.verificationStatus === "PENDING"
                            ? "border-yellow-500/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-300"
                            : profile.verificationStatus === "APPROVED"
                            ? "border-green-500/30 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300"
                            : "border-muted bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {profile.verificationStatus === "PENDING" && (
                        <>
                          ⏳ <strong>Verification in progress</strong>
                          <br />
                          Your documents are under admin review. You cannot change availability
                          or accept jobs until approval.
                        </>
                      )}

                      {profile.verificationStatus === "APPROVED" && (
                        <>
                          <strong>Account verified</strong>
                          <br />
                          Your documents are approved. You can receive bookings normally.
                        </>
                      )}

                      {profile.verificationStatus === "NOT_SUBMITTED" && (
                        <>
                          ⚠️ <strong>Verification not submitted</strong>
                          <br />
                          Please upload ID documents and work proof to request verification.
                        </>
                      )}
                    </div>
                  )}

                  {/* UPDATE PROFILE */}
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold tracking-tight">Update Profile</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Manage your personal details, documents, and security settings.
                    </p>
                  </div>

                  <div className="space-y-6">

                    {/* ================= BASIC INFORMATION ================= */}
                    <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-5 shadow-sm">
                    
                      <div className="flex items-center justify-between">
                        
                        <div>
                          <h3 className="text-lg font-semibold">Basic Information</h3>
                          <p className="text-sm text-muted-foreground">
                            Personal details visible on your profile
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          value={profileForm.firstName}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, firstName: e.target.value }))
                          }
                          disabled={editingSection !== "basic"}
                        />

                        <Input
                          label="Last Name"
                          value={profileForm.lastName}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, lastName: e.target.value }))
                          }
                          disabled={editingSection !== "basic"}
                        />

                        <Input
                          label="Phone Number"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, phone: e.target.value }))
                          }
                          disabled={editingSection !== "basic"}
                        />
                      </div>

                      {editingSection === "basic" && (
                       <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button className="rounded-full px-6" onClick={handleSaveProfile}>
                          Save Changes
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-full px-6"
                          onClick={() => setEditingSection(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                      )}
                    </Card>

                    {/* ================= PROFESSIONAL INFORMATION ================= */}
                    {role === "SERVICE_PROVIDER" && (
                      <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Professional Information</h3>
                            <p className="text-sm text-muted-foreground">
                              Your skills and experience
                            </p>
                          </div>

                          {editingSection !== "professional" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={() => setEditingSection("professional")}
                            >
                              Edit
                            </Button>
                          )}
                        </div>

                        <Input
                          label="Skill"
                          value={professionalForm.skill}
                          onChange={(e) =>
                            setProfessionalForm((p) => ({ ...p, skill: e.target.value }))
                          }
                          disabled={editingSection !== "professional"}
                        />

                        <Input
                          label="Experience"
                          value={professionalForm.experience}
                          onChange={(e) =>
                            setProfessionalForm((p) => ({ ...p, experience: e.target.value }))
                          }
                          disabled={editingSection !== "professional"}
                        />

                        <div className="space-y-1">
                          <label className="text-sm font-medium">Description</label>
                          <textarea
                            rows={4}
                            value={professionalForm.description}
                            onChange={(e) =>
                              setProfessionalForm((p) => ({ ...p, description: e.target.value }))
                            }
                            disabled={editingSection !== "professional"}
                            className={`
                              w-full
                              rounded-lg
                              border
                              bg-background
                              px-3 py-2
                              text-sm
                              leading-relaxed
                              focus:outline-none
                              focus:ring-2 focus:ring-primary/40
                              transition
                              ${editingSection !== "professional"
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                              }
                            `}
                          />
                        </div>

                        {editingSection === "professional" && (
                          <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <Button
                              className="rounded-full px-6"
                              onClick={handleSaveProfessionalInfo}
                            >
                              Save Changes
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-full px-6"
                              onClick={() => setEditingSection(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Card>
                    )}

                    {/* ================= IDENTITY VERIFICATION ================= */}
                    {role === "SERVICE_PROVIDER" && (
                      <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-6 shadow-sm">
                        <div>
                          <h3 className="text-lg font-semibold">Identity Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Upload your national ID card (front and back)
                          </p>
                        </div>

                        {/* ================= ID FRONT ================= */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">

                          {/* LEFT — Upload Card */}
                          <div className="rounded-2xl border bg-card/60 p-5 md:p-6 space-y-4 shadow-sm">
                            <div>
                              <label className="text-sm font-semibold">ID Card – Front</label>
                              <p className="text-xs text-muted-foreground">
                                Upload a clear photo of the front side
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setIdFrontFile(e.target.files?.[0] || null)}
                                className="
                                  block w-full text-sm
                                  file:mr-3 file:rounded-full file:border-0
                                  file:bg-muted file:px-4 file:py-2
                                  file:text-xs file:font-semibold
                                  hover:file:bg-muted/70
                                  cursor-pointer
                                "
                              />

                              <Button
                                onClick={handleUploadIdFront}
                                disabled={!idFrontFile}
                                className="shrink-0 rounded-full px-5"
                              >
                                Upload
                              </Button>
                            </div>

                            {profile?.idFrontUrl && (
                              <p className="text-xs flex items-center gap-1
                                text-amber-700 dark:text-amber-300">
                                ⚠ Re-uploading will require re-verification
                              </p>

                            )}
                          </div>

                          {/* RIGHT — Preview Card */}
                          {profile?.idFrontUrl && (
                            <div className="rounded-2xl border bg-muted/30 p-5 shadow-sm">
                              <p className="text-xs font-semibold mb-2 text-muted-foreground">
                                Current ID (Front)
                              </p>

                              <div className="relative overflow-hidden rounded-2xl border bg-background">
                              <img
                                src={`${API}${profile.idFrontUrl}`}
                                alt="ID Front"
                                className="
                                  w-full h-64 md:h-72 object-cover
                                  rounded-lg
                                  transition-transform duration-300
                                  hover:scale-105
                                "
                              />
                              </div>
                            </div>
                          )}
                        </div>


                        <hr className="border-muted" />

                        {/* ================= ID CARD – BACK ================= */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-start">

                          {/* LEFT — Upload Card */}
                          <div className="rounded-xl border bg-card p-5 space-y-4">
                            <div>
                              <label className="text-sm font-semibold">ID Card – Back</label>
                              <p className="text-xs text-muted-foreground">
                                Upload a clear photo of the back side
                              </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setIdBackFile(e.target.files?.[0] || null)}
                                className="
                                  block w-full text-sm
                                  file:mr-3 file:rounded-full file:border-0
                                  file:bg-muted file:px-4 file:py-2
                                  file:text-xs file:font-semibold
                                  hover:file:bg-muted/70
                                  cursor-pointer
                                "
                              />

                              <Button
                                onClick={handleUploadIdBack}
                                disabled={!idFrontFile}
                                className="shrink-0 rounded-full px-5"
                              >
                                Upload
                              </Button>
                            </div>

                            {profile?.idBackUrl && (
                               <p className="text-xs flex items-center gap-1
                                text-amber-700 dark:text-amber-300">
                                ⚠ Re-uploading will require re-verification
                              </p>
                            )}
                          </div>

                          {/* RIGHT — Preview Card */}
                          {profile?.idBackUrl && (
                            <div className="rounded-2xl border bg-muted/30 p-5 shadow-sm">
                              <p className="text-xs font-semibold mb-2 text-muted-foreground">
                                Current ID (Back)
                              </p>

                              <div className="relative overflow-hidden rounded-2xl border bg-background">
                                <img
                                  src={`${API}${profile.idBackUrl}`}
                                  alt="ID Back"
                                  className="
                                    w-full h-64 md:h-72 object-cover
                                    rounded-lg
                                    transition-transform duration-300
                                    hover:scale-105
                                  "
                                />
                              </div>
                            </div>
                          )}
                        </div>

                      </Card>
                    )}


                  {/* ================= WORK PROOF (PDF) ================= */}
                  {role === "SERVICE_PROVIDER" && (
                    <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 items-stretch">
                      {/* LEFT — Upload Card */}
                      <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-5 shadow-sm h-full">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold">Work Proof (PDF)</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Upload documents that prove your professional experience
                            </p>
                          </div>

                          <span className="shrink-0 px-3 py-1 rounded-full text-xs font-semibold border bg-muted/40 text-muted-foreground">
                            PDF
                          </span>
                        </div>

                        {/* Upload input */}
                        <div className="rounded-2xl border bg-card/50 p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                            <input
                              type="file"
                              accept="application/pdf"
                              onChange={(e) => setWorkPdf(e.target.files?.[0] || null)}
                              className="block w-full text-sm
                                file:mr-3 file:rounded-full file:border-0
                                file:bg-muted file:px-4 file:py-2
                                file:text-xs file:font-semibold
                                hover:file:bg-muted/80
                                cursor-pointer"
                            />

                            <Button
                              onClick={handleUploadWorkPdf}
                              disabled={!workPdf}
                              className="shrink-0 rounded-full px-5"
                            >
                              Upload
                            </Button>
                          </div>

                          {/* helper */}
                          <p className="text-xs text-muted-foreground">
                            Tip: upload a clear scanned document (letters, certificates, work agreements, etc.)
                          </p>

                          {profile?.workPdfUrl && (
                            <div className="text-xs flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-700 dark:text-amber-300">
                              <span className="text-sm">⚠</span>
                              <span>Re-uploading will require re-verification</span>
                            </div>
                          )}
                        </div>
                      </Card>

                      {/* RIGHT — Preview Card */}
                      {profile?.workPdfUrl && (
                        <Card className="rounded-3xl border bg-muted/30 p-6 md:p-7 shadow-sm h-full flex flex-col justify-center">
                          <p className="text-xs font-semibold mb-3 text-muted-foreground">
                            Current Work Proof
                          </p>

                          <div className="rounded-2xl border bg-background p-4 flex items-center gap-4">
                            {/* PDF Icon */}
                            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-sm font-extrabold">
                              PDF
                            </div>

                            {/* File Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">
                                {profile.workPdfUrl.split("/").pop()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Uploaded document
                              </p>
                            </div>

                            {/* View */}
                            <a
                              href={`${API}${profile.workPdfUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 inline-flex items-center justify-center rounded-full border bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80 transition"
                            >
                              View
                            </a>
                          </div>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* ================= ADDRESS ================= */}
                  <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Address</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Your service location details
                        </p>
                      </div>

                      {editingSection !== "address" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full px-4"
                          onClick={() => setEditingSection("address")}
                        >
                          {hasAddress ? "Edit" : "Add"}
                        </Button>
                      )}
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl border bg-card/60 p-5 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Address Line 1"
                          value={addressForm.addressLine1}
                          onChange={(e) =>
                            setAddressForm((p) => ({
                              ...p,
                              addressLine1: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="Address Line 2"
                          value={addressForm.addressLine2}
                          onChange={(e) =>
                            setAddressForm((p) => ({
                              ...p,
                              addressLine2: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="Province"
                          value={addressForm.province}
                          onChange={(e) =>
                            setAddressForm((p) => ({
                              ...p,
                              province: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="City"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm((p) => ({
                              ...p,
                              city: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "address"}
                        />
                      </div>

                      {/* Actions */}
                      {editingSection === "address" && (
                        <div className="flex gap-3 pt-5">
                          <Button className="rounded-full px-6" onClick={handleSaveAddress}>
                            Save Address
                          </Button>

                          <Button
                            variant="outline"
                            className="rounded-full px-6"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* ================= CHANGE PASSWORD ================= */}
                  <Card className="rounded-3xl border bg-background/50 p-6 md:p-7 space-y-6 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">Change Password</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Update your account password
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

                    {/* Form */}
                    <div className="rounded-2xl border bg-card/60 p-5 md:p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Current Password"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              currentPassword: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "password"}
                        />

                        <div className="hidden md:block" />

                        <Input
                          label="New Password"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              newPassword: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "password"}
                        />

                        <Input
                          label="Confirm New Password"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((p) => ({
                              ...p,
                              confirmPassword: e.target.value,
                            }))
                          }
                          disabled={editingSection !== "password"}
                        />
                      </div>

                      {/* Actions */}
                      {editingSection === "password" && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-5">
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
              </>
            )}
          </>
          )}
          </div>
        </main>
      </div>
      {editImageOpen && (
        <EditImageModal
          onClose={() => {
            setEditImageOpen(false);
            reloadProfile();
          }}
        />
      )}
      <BookingViewDialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        booking={selectedBooking}
        mode={role === "CUSTOMER" ? "CUSTOMER" : "PROVIDER"}
        onManage={(booking) => {
          setViewOpen(false);
          setSelectedBooking(booking);

          if (role === "CUSTOMER") {
            setCustomerManageBookingOpen(true);
          } else {
            localStorage.setItem(
              "activeManagedBooking",
              JSON.stringify({
                bookingId: booking.bookingId ?? booking.id,
                providerServiceId: booking.providerServiceId,
              })
            );

            setManagedBooking((prev) =>
              prev
                ? prev
                : {
                    ...booking,
                    bookingId: booking.bookingId ?? booking.id,
                    scheduledAt: booking.scheduledAt,
                    startedAt: booking.startedAt ?? null,
                  }
            );

            setActiveTab("managebookings");
          }
        }}
        onRequestPayment={handleRequestPayment}
      />

      <CustomerPaymentDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        paymentInfo={paymentInfo}
      />

      <RejectBookingDialog
              open={rejectOpen}
              onClose={() => {
                setRejectOpen(false);
                setRejectBooking(null);
              }}
              onConfirm={async (reason) => {
                try {
                  await rejectBookingApi(
                    rejectBooking.bookingId,
                    rejectBooking.providerServiceId,
                    reason
                  );

                  toast.success("Booking rejected");

                  const updated = await getProviderBookings(user.id);
                  setProviderBookings(updated);

                  setRejectOpen(false);
                  setRejectBooking(null);
                } catch (err) {
                  toast.error(
                    err?.response?.data?.message || "Failed to reject booking"
                  );
                }
              }}
        />

        <ReVerificationDialog
        open={showReverifyDialog}
        onClose={() => {
          setShowReverifyDialog(false);
          setPendingUploadAction(null);
        }}
        onConfirm={async () => {
          if (pendingUploadAction) {
            await pendingUploadAction();
          }
          setShowReverifyDialog(false);
          setPendingUploadAction(null);
        }}
      />

        <AvailabilityConfirmDialog
          open={showAvailabilityDialog}
          onClose={() => {
            setShowAvailabilityDialog(false);
            setPendingAvailability(null);
          }}
          onConfirm={confirmAvailabilityChange}
          nextState={pendingAvailability}
        />

        <ActivateAccountModal
          open={showActivateModal}
          onClose={() => {
            setShowActivateModal(false);
            setActivateStep(1);
          }}
        >
          {/* STEP CONTENT */}
          {activateStep === 1 && (
           <StepProfessionalInfo
              data={activateProfessionalForm}
              onChange={setActivateProfessionalForm}
              onNext={handleActivateProfessionalNext}
            />
          )}
          {activateStep === 2 && (
            <StepAddress
              data={addressForm}
              onChange={setAddressForm}
              hasAddress={hasAddress}
              onNext={handleActivateAddressNext}
            />
          )}
          {activateStep === 3 && (
            <StepDocuments
              idFrontFile={idFrontFile}
              idBackFile={idBackFile}
              workPdf={workPdf}
              setIdFrontFile={setIdFrontFile}
              setIdBackFile={setIdBackFile}
              setWorkPdf={setWorkPdf}
              onSubmit={handleActivateSubmit}
            />
          )}

        </ActivateAccountModal>

        <EndWorkDialog
          open={endWorkOpen}
          onClose={() => setEndWorkOpen(false)}
          booking={managedBooking}
          elapsedSeconds={finalElapsedSeconds ?? elapsedSeconds}
          onFinalize={handleFinalizeFromPopup}
        />
        <StartJobConfirmDialog
          open={startConfirmOpen}
          onClose={() => setStartConfirmOpen(false)}
          booking={managedBooking}
          onConfirm={async () => {
            setStartConfirmOpen(false);
            await handleStartJob();

            // optional but recommended (keeps state synced with backend)
            await refreshManagedBooking(managedBooking.bookingId);
          }}
        />

        <AcceptBookingDialog
          open={acceptOpen}
          booking={acceptBooking}
          loading={acceptLoading}
          onClose={() => {
            setAcceptOpen(false);
            setAcceptBooking(null);
          }}
          onConfirm={async () => {
            if (!acceptBooking) return;

            try {
              setAcceptLoading(true);

              await confirmBooking(acceptBooking.bookingId, acceptBooking.providerServiceId);
              toast.success("Booking accepted");

              const updated = await getProviderBookings(user.id);
              setProviderBookings(updated);

              setAcceptOpen(false);
              setAcceptBooking(null);
            } catch (err) {
              toast.error("Failed to accept booking");
            } finally {
              setAcceptLoading(false);
            }
          }}
        />

    </div>

              
  );
}

/* =======================
   REUSABLE INPUT
======================= */
function Input({
  label,
  type = "text",
  value,
  defaultValue,
  onChange,
  disabled,
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-lg border px-3 py-2 bg-background ${
          disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">
        {children}
      </p>
    </div>
  );
}