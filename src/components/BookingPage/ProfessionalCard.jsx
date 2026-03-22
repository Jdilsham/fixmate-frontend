import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProviderRating, getProviderReviews } from "../../../utils/booking";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


export default function ProfessionalCard({ service }) {

  const navigate = useNavigate();
  const [providerRating, setProviderRating] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    if (!service?.providerId) return;

    const fetchRating = async () => {
      try {
        const data = await getProviderRating(service.providerId);
        setProviderRating(data);
      } catch (error) {
        console.error("Failed to fetch provider rating:", error);
        setProviderRating(null);
      }
    };

    fetchRating();
  }, [service?.providerId]);

  const handleViewRatings = async () => {
    if (!service?.providerId) return;

    try {
      setReviewsLoading(true);
      const data = await getProviderReviews(service.providerId);
      setReviews(data);
      setShowReviews(true);
    } catch (error) {
      console.error("Failed to fetch provider reviews:", error);
      setReviews([]);
      setShowReviews(true);
    } finally {
      setReviewsLoading(false);
    }
  };

  if (!service) return null;

  return (
    <Card className="rounded-2xl border border-border bg-card/70 dark:bg-card/50 shadow-lg">
      <CardContent className="p-5 flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <Avatar className="size-14 ring-2 ring-primary/20">
            <AvatarImage
              src={`${import.meta.env.VITE_BACKEND_URL}${service.providerProfileImage}`}
              alt={service.providerName}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {service.providerName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-tight truncate">
              {service.providerName}
            </h2>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Service:</span>{" "}
              <span className="text-foreground font-semibold">
                {service.serviceTitle}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Location:</span>{" "}
              <span className="text-foreground font-semibold">
                {service.location}
              </span>
            </p>
          </div>
        </div>

        {/* PRICE */}
        <div className="rounded-xl bg-muted/35 border border-border px-5 py-4 text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Starting from
          </p>
          <p className="text-2xl font-bold text-orange-500 mt-1">
            LKR {service.hourlyRate}
          </p>
          <p className="text-[11px] text-muted-foreground">per hour</p>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Fixed Price</span>
            {service.fixedPriceAvailable ? (
              <span className="px-2.5 py-1 rounded-full bg-green-500/15 text-green-600 text-xs font-medium">
                Available
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full border text-xs text-muted-foreground">
                Not Available
              </span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Rating</span>

            <span className="flex items-center gap-1 font-medium text-foreground">
              <span className="text-yellow-500">★</span>
              {providerRating !== null ? Number(providerRating).toFixed(1) : "New"}
            </span>
          </div>
        </div>

      
        <div className="rounded-xl bg-muted/25 px-4 py-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {service.serviceDescription ||
            "Professional service delivered with quality workmanship and reliability."}
        </div>

        <Button
          onClick={handleViewRatings}
          variant="fixmate"
          size="lg"
          className="w-full h-11 rounded-2xl"
        >
          View Ratings
        </Button>

      </CardContent>

      <Dialog open={showReviews} onOpenChange={setShowReviews}>
      <DialogContent
        className="
          max-w-2xl overflow-hidden rounded-3xl
          border border-border bg-background/85 dark:bg-background/65
          backdrop-blur-xl shadow-2xl
        "
      >
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-accent via-primary to-cyan-400" />

        <DialogHeader className="pt-2 pr-12">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                Provider Ratings & Reviews
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                See what customers say about {service.providerName}.
              </DialogDescription>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-background/60 dark:bg-background/35 px-3 py-1 text-[11px] text-muted-foreground">
              <span className="text-yellow-500">★</span>
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 max-h-[430px] overflow-y-auto space-y-3 pr-1 no-scrollbar">
          {reviewsLoading ? (
            <div className="rounded-2xl border border-border bg-muted/20 dark:bg-muted/15 px-4 py-8 text-sm text-muted-foreground text-center">
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-border bg-muted/20 dark:bg-muted/15 px-4 py-8 text-sm text-muted-foreground text-center">
              No reviews yet.
            </div>
          ) : (
            reviews.map((review, index) => (
              <div
                key={review.id ?? index}
                className="
                  rounded-2xl border border-border
                  bg-muted/20 dark:bg-muted/15
                  p-4 transition-colors
                  hover:bg-muted/30 dark:hover:bg-muted/20
                "
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">
                      {review.customerName || `Customer ${index + 1}`}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {review.createdAt
                        ? new Date(review.createdAt).toLocaleDateString("en-LK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "Recent review"}
                    </p>
                  </div>

                  <div
                    className="
                      inline-flex shrink-0 items-center gap-1
                      rounded-full border border-border
                      bg-background/60 dark:bg-background/30
                      px-2.5 py-1 text-sm font-semibold text-foreground
                    "
                  >
                    <span className="text-yellow-500">★</span>
                    {Number(review.rating).toFixed(1)}
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-background/55 dark:bg-background/25 px-3 py-3">
                  <p className="text-sm leading-relaxed text-foreground/90 break-words">
                    {review.comment || "No comment provided."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
    </Card>
  );
}