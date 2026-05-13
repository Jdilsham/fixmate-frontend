export function getBookingStatusView(booking) {
  if (booking.paymentStatus === "REQUESTED") {
    return {
      label: "Payment Pending",
      className: "bg-yellow-500/20 text-yellow-400",
    };
  }

  if (
    booking.paymentStatus === "PAID" ||
    booking.paymentStatus === "CONFIRMED"
  ) {
    return {
      label: "Paid",
      className: "bg-green-500/20 text-green-400",
    };
  }

  // FALLBACK TO BOOKING STATUS
  switch (booking.status) {
    case "PENDING":
      return {
        label: "Pending",
        className: "bg-yellow-500/20 text-yellow-400",
      };

    case "ACCEPTED":
      return {
        label: "Accepted",
        className: "bg-green-500/20 text-green-400",
      };

    case "IN_PROGRESS":
      return {
        label: "In Progress",
        className: "bg-blue-500/20 text-blue-400",
      };

    case "COMPLETED":
      return {
        label: "Completed",
        className: "bg-emerald-500/20 text-emerald-400",
      };

    case "REJECTED":
      return {
        label: "Rejected",
        className: "bg-red-500/20 text-red-400",
      };

    default:
      return {
        label: booking.status ?? "Unknown",
        className: "bg-muted text-muted-foreground",
      };
  }
}