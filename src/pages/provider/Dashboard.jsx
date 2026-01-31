import { useState, useEffect } from "react";
import Header from "../../components/header";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { getAuthUser } from "../../../utils/auth";
import { Eye, CheckCircle, XCircle } from "lucide-react";


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

/* =======================
   ROLE CONFIG
======================= */
const ROLE_CONFIG = {
  SERVICE_PROVIDER: {
    tabs: [
      { id: "dashboard", label: "Dashboard", icon: Home },
      { id: "services", label: "Services", icon: Briefcase },
      { id: "calendar", label: "Calendar", icon: CalendarIcon },
      { id: "pendingBooking", label: "Pending Bookings", icon: ListCheck },
      { id: "profile", label: "Profile", icon: Settings },
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("dashboardActiveTab") || "dashboard";
  });

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem("dashboardActiveTab", activeTab);
    }
  }, [activeTab]);


  const [date, setDate] = useState(new Date());
  // Calendar – availability view
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateBookings, setDateBookings] = useState([]);
  const [calendarLoading, setCalendarLoading] = useState(false);


  const [isAvailable, setIsAvailable] = useState(false);
  const [editImageOpen, setEditImageOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const user = authUser && profile ? { ...authUser, ...profile } : authUser;
  const role = user?.role;

  const isProvider = role === "SERVICE_PROVIDER";

  const verificationStatus = profile?.verificationStatus;

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

    

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    setProfile(profileData);

    if (profileData?.verificationStatus === "APPROVED") {
      setWasPreviouslyApproved(true);
    }


    setIsAvailable(profileData?.available ?? false);

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

  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectBooking, setRejectBooking] = useState(null);


  const [showReverifyDialog, setShowReverifyDialog] = useState(false);
  const [wasPreviouslyApproved, setWasPreviouslyApproved] = useState(false);
  const [pendingUploadAction, setPendingUploadAction] = useState(null);


  useEffect(() => {
    if (role === "SERVICE_PROVIDER" && user?.id) {
      getProviderBookings(user.id)
        .then(setProviderBookings)
        .catch(() => toast.error("Failed to load bookings"));
    }
  }, [role, user?.id]);


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
          location: user?.city || "Not specified",
        }
      : null;

  const formatStatus = (status) =>
  status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());


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

  const busyDates = new Set(
    providerBookings
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <div className="max-w-8xl mx-auto px-4 md:px-6 pt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="bg-card border rounded-2xl p-4 sticky top-24 h-[calc(100vh-140px)] overflow-auto">
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

        <main className="flex-1 min-w-0">
          <div className="bg-card border rounded-2xl p-6">
            {/* DASHBOARD */}
            {activeTab === "dashboard" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-semibold">Rs. 0</p>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      {role === "SERVICE_PROVIDER"
                        ? "Jobs Completed"
                        : "Requests"}
                    </p>
                    <p className="text-2xl font-semibold">0</p>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-semibold">—</p>
                  </Card>
                </div>

                <BookingsTable role={role} bookings={bookings} />
              </>
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
                <h2 className="text-lg font-semibold mb-4">Availability</h2>

                <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
                  
                  {/* LEFT – Calendar */}
                  <Card className="p-4 rounded-2xl flex items-center justify-center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(day) => {
                        setSelectedDate(day);
                        setDateBookings([]);
                        loadBookingsForDate(day);
                      }}
                      disabled={(date) => date < new Date().setHours(0, 0, 0, 0)}
                      modifiers={{
                        busy: (date) =>
                          busyDates.has(date.toISOString().split("T")[0]),
                      }}
                      modifiersClassNames={{
                        busy:
                          "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-red-500",
                      }}
                      className="rounded-xl border"
                    />
                  </Card>


                  {/* RIGHT – Bookings */}
                  <Card className="p-6 rounded-2xl">
                    {!selectedDate && (
                      <p className="text-muted-foreground">
                        Select a date to view bookings
                      </p>
                    )}

                    {calendarLoading && (
                      <p className="text-sm text-muted-foreground">
                        Loading bookings...
                      </p>
                    )}

                    {selectedDate && !calendarLoading && dateBookings.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No bookings for this date
                      </p>
                    )}

                    {dateBookings.length > 0 && (
                      <div className="space-y-3">
                        {dateBookings.map((b) => (
                          <div
                            key={b.bookingId}
                            className="flex items-center justify-between rounded-xl border p-4 hover:bg-muted/40 transition"
                          >
                            <div>
                              <p className="font-medium">{b.customerName}</p>
                              <p className="text-sm text-muted-foreground">
                                {b.serviceName}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(b.scheduledAt).toLocaleTimeString("en-LK", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* STATUS */}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  b.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-500"
                                    : b.status === "ACCEPTED"
                                    ? "bg-green-500/20 text-green-500"
                                    : b.status === "COMPLETED"
                                    ? "bg-emerald-500/20 text-emerald-500"
                                    : b.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {b.status.replace("_", " ")}
                              </span>

                              {/* VIEW */}
                              <Button
                                size="icon"
                                variant="secondary"
                                title="View booking"
                                onClick={() => handleViewBooking(b)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

                              {/* ACCEPT / REJECT ONLY IF PENDING */}
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
                        ))}
                      </div>
                    )}
                  </Card>
                </div>
              </>
            )}



            {/* Pending requests */}
            {activeTab === "pendingBooking" && role === "SERVICE_PROVIDER" && (
              <>
                <Card className="p-6 rounded-2xl bg-card border shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Pending Bookings
                  </h2>

                  <span className="text-sm text-muted-foreground">
                    {providerBookings.length} total
                  </span>
                </div>


                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b text-muted-foreground">
                          <th className="py-3 px-2 font-medium">Customer</th>
                          <th className="px-2 font-medium">Phone</th>
                          <th className="px-2 font-medium">Address</th>
                          <th className="px-2 font-medium text-center">Status</th>
                          <th className="px-2 text-center font-medium">Actions</th>
                        </tr>
                      </thead>



                      <tbody>
                        {providerBookings.map((b) => (
                          <tr
                            key={b.bookingId}
                            className="border-b hover:bg-muted/40 transition"
                          >

                            <td className="py-3 px-2 font-medium">
                              {b.customerName}
                            </td>

                           <td className="px-2 py-3 text-muted-foreground">
                              {b.customerPhone}
                            </td>

                            <td className="px-2 py-3 text-muted-foreground">
                              {b.bookingAddress}
                            </td>

                            <td className="px-2 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-3 py-1
                                  rounded-full text-xs font-semibold
                                  ${
                                    b.status === "PENDING"
                                      ? "bg-yellow-500/20 text-yellow-600"
                                      : b.status === "ACCEPTED"
                                      ? "bg-green-500/20 text-green-600"
                                      : b.status === "REJECTED"
                                      ? "bg-red-500/20 text-red-600"
                                      : "bg-muted text-muted-foreground"
                                  }
                                `}
                              >
                                {b.status === "PENDING" && <Eye className="w-3 h-3" />}
                                {b.status === "ACCEPTED" && <CheckCircle className="w-3 h-3" />}
                                {b.status === "REJECTED" && <XCircle className="w-3 h-3" />}

                                {formatStatus(b.status)}
                              </span>
                            </td>




                            <td className="px-2 py-3">
                              <div className="flex justify-center items-center gap-2">

                                {/* View */}
                                <Button
                                  size="icon"
                                  variant="secondary"
                                  title="View booking"
                                  onClick={() => {
                                    setSelectedBooking(b);
                                    setViewOpen(true);
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>

                                {/* Approve / Reject only when pending */}
                                {b.status === "PENDING" && (
                                  <>
                                    <Button
                                      size="icon"
                                      title="Approve booking"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={async () => {
                                        try {
                                          await confirmBooking(b.bookingId, b.providerServiceId);
                                          toast.success("Booking approved");

                                          const updated = await getProviderBookings(user.id);
                                          setProviderBookings(updated);
                                        } catch (err) {
                                          toast.error(
                                            err?.response?.data?.message || "Failed to approve booking"
                                          );
                                        }
                                      }}
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                    </Button>

                                    <Button
                                      size="icon"
                                      variant="destructive"
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
                              </div>
                            </td>



                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )}

            {/* CUSTOMER - MY BOOKINGS */}
            {activeTab === "myBookings" && role === "CUSTOMER" && (
              <Card className="p-4 rounded-2xl bg-background">
                <h2 className="text-lg font-semibold mb-1">My Bookings</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Track all your service requests and their current status
                </p>

                {customerBookingsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-10 rounded-lg bg-muted animate-pulse"
                      />
                    ))}
                  </div>
                ) : customerBookings.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <p className="text-lg font-medium">No bookings yet</p>
                    <p className="text-sm text-muted-foreground">
                      Once you book a service, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="py-2">Service</th>
                          <th>Provider</th>
                          <th>Date</th>
                          <th>Status</th>
                          <th>Amount</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>

                      <tbody>
                      {customerBookings.map((b) => (
                        <tr
                          key={b.bookingId}
                          className="
                            border-b
                            hover:bg-muted/60
                            transition
                            duration-200
                            last:border-b-0
                          "
                        >


                          <td className="py-3">{b.serviceName}</td>

                          <td>{b.providerName || "Not assigned"}</td>

                          <td>
                            {new Date(b.scheduledAt).toLocaleDateString("en-LK", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </td>

                          <td className="px-2 text-center">
                            <span
                              className={`inline-flex items-center justify-center
                                min-w-[110px] px-3 py-1
                                rounded-full text-xs font-semibold tracking-wide
                                ${
                                  b.status === "PENDING"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : b.status === "ACCEPTED"
                                    ? "bg-green-500/20 text-green-400"
                                    : b.status === "PAYMENT_PENDING"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : b.status === "COMPLETED"
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : b.status === "REJECTED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-muted text-muted-foreground"
                                }`}
                            >
                              {b.status.replace("_", " ")}
                            </span>
                          </td>


                          <td>
                            {b.amount ? `Rs. ${b.amount}` : "To be decided"}
                          </td>

                          <td className="flex justify-center gap-2 py-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setSelectedBooking(b);
                                setViewOpen(true);
                              }}
                            >
                              View
                            </Button>

                            {b.status === "PAYMENT_PENDING" && b.status !== "REJECTED" && (
                              <Button
                                size="sm"
                                onClick={async () => {
                                  try {
                                    const payment = await getCustomerPayment(b.bookingId);
                                    setPaymentInfo(payment);
                                    setPaymentOpen(true);
                                  } catch (err) {
                                    console.error("PAYMENT LOAD ERROR:", err);
                                    toast.error("Failed to load payment info");
                                  }
                                }}
                              >
                                Pay
                              </Button>
                            )}
                          </td>

                        </tr>
                      ))}
                    </tbody>

                    </table>
                  </div>
                )}
              </Card>
            )}


            {/* PROFILE */}
            {activeTab === "profile" && (
              <>
                {/* PROFILE HEADER */}
                <div className="border-b pb-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start">

                  <div className=" flex flex-col relative w-28 h-28 md:w-36 md:h-36 shrink-0 justify-end">
                    <div className="absolute flex flex-col items-center inset-0 rounded-full bg-transparent">
                      <Avatar.Root
                        key={user?.profilePicture}
                        className="relative w-full h-full rounded-full overflow-hidden bg-background"
                      >
                        <Avatar.Image
                          src={user?.profilePicture}
                          alt="Profile Picture"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                        />
                        <Avatar.Fallback className="flex items-center justify-center w-full h-full text-2xl font-semibold">
                          U
                        </Avatar.Fallback>
                      </Avatar.Root>

                      {role === "SERVICE_PROVIDER" && (
                        <span
                          className={`w-5 h-5 rounded-full absolute top-4 right-2 border-2 border-background ${
                            isAvailable ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      )}


                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditImageOpen(true);
                        }}
                        className=" text center p-4 bg-muted-foreground dark:bg-card  "
                      >
                        edit picture
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-xl font-semibold">
                      {user?.fullName || user?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">{role}</p>

                    {role === "SERVICE_PROVIDER" && (
                      <p className="text-sm text-muted-foreground">
                        Skill:{" "}
                        <span className="font-medium">
                          {user?.service || "Not set"}
                        </span>
                      </p>
                    )}

                    {role === "SERVICE_PROVIDER" && (
                      <p className="text-sm text-muted-foreground">
                        {addressForm.city
                          ? `${addressForm.city}, ${addressForm.province}`
                          : "Location not set"}
                      </p>
                    )}

                    <p className="text-sm text-muted-foreground">
                      {user?.phone || "Phone number not set"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Verified:</span>{" "}
                      {user?.verified ? "Yes" : "No"}
                    </p>

                    {role === "SERVICE_PROVIDER" && (
                      <div className="mt-4 flex flex-col gap-1">

                        <div className="inline-flex items-center gap-3 rounded-xl bg-muted px-4 py-2">
                          <span className="text-sm font-medium">Availability:</span>
                            <button
                              type="button"
                              disabled={!canToggleAvailability}
                              onClick={async () => {
                                if (!canToggleAvailability) return;

                                const newVal = !isAvailable;
                                setIsAvailable(newVal);

                                try {
                                  await updateAvailability(newVal);
                                } catch {
                                  setIsAvailable(!newVal);
                                }
                              }}
                              className={`relative w-12 h-6 rounded-full transition-colors duration-300
                                ${isAvailable ? "bg-green-500" : "bg-gray-300"}
                                ${!canToggleAvailability ? "opacity-50 cursor-not-allowed" : ""}
                              `}
                            >
                              <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                                  isAvailable ? "translate-x-6" : "translate-x-0"
                                }`}
                              />
                            </button>
                        </div>

                        {!canToggleAvailability && (
                          <p className="text-xs text-muted-foreground ml-2">
                            Availability can be changed only after verification approval
                          </p>
                        )}

                        {canRequestVerification && (
                          <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 px-5 py-4">
                            <p className="text-sm text-blue-300 mb-3">
                              📄 All documents uploaded. Submit your profile for admin verification.
                            </p>

                            <button
                              onClick={async () => {
                                try {
                                  await requestVerification();
                                  toast.success("Verification request submitted");
                                  await reloadProfile();
                                } catch (err) {
                                  toast.error("Failed to request verification");
                                }
                              }}
                              className="
                                rounded-lg px-4 py-2 text-sm font-medium
                                bg-blue-600 text-white
                                hover:bg-blue-700
                                transition
                              "
                            >
                              Request Verification
                            </button>
                          </div>
                        )}


                      </div>
                    )}
                  </div>
                </div>

                {/* VERIFICATION STATUS BANNER (SERVICE PROVIDER ONLY) */}
                {role === "SERVICE_PROVIDER" && profile?.verificationStatus && (
                  <div
                    className={`
                      mb-6 rounded-xl border px-5 py-4 text-sm
                      ${
                        profile.verificationStatus === "PENDING"
                          ? "border-yellow-500/30 bg-yellow-500/10 text-yellow-300"
                          : profile.verificationStatus === "APPROVED"
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
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
                        ✅ <strong>Account verified</strong>
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
                  <h2 className="text-xl font-semibold mb-8">Update Profile</h2>

                  <div className="space-y-6">

                    {/* ================= BASIC INFORMATION ================= */}
                    <Card className="rounded-2xl border p-6 space-y-5">
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
                        <div className="flex gap-3 pt-4">
                          <Button onClick={handleSaveProfile}>Save Changes</Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Card>

                    {/* ================= IDENTITY VERIFICATION ================= */}
                    {role === "SERVICE_PROVIDER" && (
                      <Card className="rounded-2xl border p-6 space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold">Identity Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Upload your national ID card (front and back)
                          </p>
                        </div>

                        {/* ID FRONT */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ID Card – Front</label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIdFrontFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm
                              file:mr-4 file:rounded-lg file:border-0
                              file:bg-muted file:px-4 file:py-2
                              file:text-sm file:font-medium
                              hover:file:bg-muted/70
                              cursor-pointer"
                          />

                          <Button
                            onClick={handleUploadIdFront}
                            disabled={!idFrontFile}
                            className="w-full md:w-fit"
                          >
                            Upload Front
                          </Button>

                          {profile?.idFrontUrl && (
                            <p className="text-xs text-muted-foreground">
                              ✔ Front ID already uploaded. Uploading again requires re-verification.
                            </p>
                          )}
                        </div>

                        {/* ID BACK */}
                        <div className="space-y-2">
                          <label className="text-sm font-medium">ID Card – Back</label>

                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setIdBackFile(e.target.files?.[0] || null)}
                            className="block w-full text-sm
                              file:mr-4 file:rounded-lg file:border-0
                              file:bg-muted file:px-4 file:py-2
                              file:text-sm file:font-medium
                              hover:file:bg-muted/70
                              cursor-pointer"
                          />

                          <Button
                            onClick={handleUploadIdBack}
                            disabled={!idBackFile}
                            className="w-full md:w-fit"
                          >
                            Upload Back
                          </Button>

                          {profile?.idBackUrl && (
                            <p className="text-xs text-muted-foreground">
                              ✔ Back ID already uploaded. Uploading again requires re-verification.
                            </p>
                          )}
                        </div>
                      </Card>
                    )}


                    {/* ================= WORK PROOF (PDF) ================= */}
                    {role === "SERVICE_PROVIDER" && (
                      <Card className="rounded-2xl border p-6 space-y-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Work Proof (PDF)</h3>
                            <p className="text-sm text-muted-foreground">
                              Upload documents that prove your professional experience
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setWorkPdf(e.target.files?.[0] || null)}
                            className="block w-full text-sm
                              file:mr-4 file:rounded-lg file:border-0
                              file:bg-muted file:px-4 file:py-2
                              file:text-sm file:font-medium
                              hover:file:bg-muted/70
                              cursor-pointer"
                          />

                          <Button
                            onClick={handleUploadWorkPdf}
                            disabled={!workPdf}
                            className="w-full md:w-fit"
                          >
                            Upload Work Proof
                          </Button>

                          {profile?.workPdfUrl && (
                            <p className="text-xs text-muted-foreground">
                              📄 A work proof document is already uploaded. Uploading a new file
                              will require re-verification.
                            </p>
                          )}
                        </div>
                      </Card>
                    )}


                    {/* ================= PROFESSIONAL INFORMATION ================= */}
                    {role === "SERVICE_PROVIDER" && (
                      <Card className="rounded-2xl border p-6 space-y-5">
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
                            className={`w-full rounded-lg border px-3 py-2 bg-background ${
                              editingSection !== "professional"
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                          />
                        </div>

                        {editingSection === "professional" && (
                          <div className="flex gap-3 pt-4">
                            <Button onClick={handleSaveProfessionalInfo}>
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setEditingSection(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </Card>
                    )}

                    {/* ================= ADDRESS ================= */}
                    <Card className="rounded-2xl border p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Address</h3>
                          <p className="text-sm text-muted-foreground">
                            Your service location
                          </p>
                        </div>

                        {editingSection !== "address" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSection("address")}
                          >
                            {hasAddress ? "Edit" : "Add"}
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Address Line 1"
                          value={addressForm.addressLine1}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, addressLine1: e.target.value }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="Address Line 2"
                          value={addressForm.addressLine2}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, addressLine2: e.target.value }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="Province"
                          value={addressForm.province}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, province: e.target.value }))
                          }
                          disabled={editingSection !== "address"}
                        />

                        <Input
                          label="City"
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm((p) => ({ ...p, city: e.target.value }))
                          }
                          disabled={editingSection !== "address"}
                        />
                      </div>

                      {editingSection === "address" && (
                        <div className="flex gap-3 pt-4">
                          <Button onClick={handleSaveAddress}>Save Address</Button>
                          <Button
                            variant="outline"
                            onClick={() => setEditingSection(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </Card>

                    {/* ================= CHANGE PASSWORD ================= */}
                    <Card className="rounded-2xl border p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">Change Password</h3>
                          <p className="text-sm text-muted-foreground">
                            Update your account password
                          </p>
                        </div>

                        {editingSection !== "password" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingSection("password")}
                          >
                            Edit
                          </Button>
                        )}
                      </div>

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

                      {editingSection === "password" && (
                        <div className="flex gap-3 pt-4">
                          <Button
                            onClick={handleChangePassword}
                            disabled={changingPassword}
                          >
                            {changingPassword ? "Saving..." : "Change Password"}
                          </Button>

                          <Button
                            variant="outline"
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
                    </Card>

                  </div>
                </div>
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

