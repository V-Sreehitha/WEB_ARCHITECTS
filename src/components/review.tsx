"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, Review } from "@/lib/store";
import { toast } from "sonner";

interface ReviewFormProps {
  bookingId: string;
  serviceId: string;
  onClose: () => void;
}

export function ReviewForm({ bookingId, serviceId, onClose }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser, addReview, addNotification } = useAppStore();

  const handleSubmit = async () => {
    if (!currentUser) return;
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    const review: Review = {
      id: `review-${Date.now()}`,
      bookingId,
      clientId: currentUser.id,
      clientName: currentUser.name,
      serviceId,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    addReview(review);
    addNotification({
      id: `notif-${Date.now()}`,
      userId: "all",
      title: "New Review Submitted",
      message: `${currentUser.name} left a ${rating}-star review`,
      type: "success",
      read: false,
      createdAt: new Date().toISOString(),
    });

    toast.success("Thank you for your review!");
    setIsSubmitting(false);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Rate Your Experience</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={onClose}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">How would you rate our service?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent!"}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Share your experience (optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us what you liked or what we can improve..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 shadow-sm border"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
          {review.clientName.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">{review.clientName}</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface ReviewStatsProps {
  serviceId: string;
}

export function ReviewStats({ serviceId }: ReviewStatsProps) {
  const { reviews } = useAppStore();
  const serviceReviews = reviews.filter((r) => r.serviceId === serviceId);
  
  if (serviceReviews.length === 0) return null;

  const avgRating = serviceReviews.reduce((sum, r) => sum + r.rating, 0) / serviceReviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: serviceReviews.filter((r) => r.rating === rating).length,
    percentage: (serviceReviews.filter((r) => r.rating === rating).length / serviceReviews.length) * 100,
  }));

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-indigo-600">{avgRating.toFixed(1)}</div>
          <div className="flex justify-center gap-0.5 my-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-muted-foreground">{serviceReviews.length} reviews</div>
        </div>
        <div className="flex-1 space-y-1">
          {ratingCounts.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-2 text-sm">
              <span className="w-3">{rating}</span>
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
              <span className="w-8 text-muted-foreground">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
