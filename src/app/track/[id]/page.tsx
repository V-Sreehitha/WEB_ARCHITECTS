"use client";
import { useEffect, use, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Sparkles, LogOut, Clock, CheckCircle2, 
  AlertCircle, Loader2, MessageSquare, Calendar, IndianRupee, Star,
  Users, Download, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { ReviewForm } from "@/components/review";
import { NotificationBell } from "@/components/notifications";
import { ProgressTracker } from "@/components/progress-tracker";

const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested", step: 1 },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress", step: 2 },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed", step: 3 },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected", step: 0 },
};

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser, setCurrentUser, bookings, services, getBookingReview } = useAppStore();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [, forceUpdate] = useState({});

  const booking = bookings.find((b) => b.id === id);
  const service = booking ? services.find((s) => s.id === booking.serviceId) : null;
  const existingReview = booking ? getBookingReview(booking.id) : undefined;

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const syncFromStorage = useCallback(() => {
    useAppStore.persist.rehydrate();
    forceUpdate({});
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'it-service-booking-storage') {
        syncFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      syncFromStorage();
    }, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [syncFromStorage]);

  if (!currentUser || !booking) {
    return null;
  }

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const downloadInvoice = () => {
    const invoiceContent = `
=====================================
         TECHFLOW INVOICE
=====================================

Invoice #: INV-${booking.id.slice(-8).toUpperCase()}
Date: ${format(new Date(), 'dd MMM yyyy')}

CLIENT DETAILS
--------------
Name: ${booking.clientName}
Email: ${booking.clientEmail}

PROJECT DETAILS
---------------
Service: ${booking.serviceName}
Base Price: ${formatPrice(service?.basePrice || 0)}

Selected Features:
${booking.selectedFeatures.map(f => {
  const feature = service?.features.find(feat => feat.id === f);
  return `  - ${feature?.name || f}: ${formatPrice(feature?.price || 0)}`;
}).join('\n')}

SUMMARY
-------
Total Amount: ${formatPrice(booking.totalPrice)}
Estimated Duration: ${booking.estimatedTime} days
Status: ${booking.status.toUpperCase()}

=====================================
Thank you for choosing TechFlow!
=====================================
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.id.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">TechFlow</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span className="hidden sm:inline">Live</span>
              </div>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {currentUser.name}
              </span>
              <NotificationBell />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{booking.serviceName}</h1>
                <Badge className={status.color}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {status.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">Booking ID: {booking.id}</p>
            </div>
            <Button onClick={downloadInvoice} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>

          <Card className="mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
              <h2 className="text-lg font-semibold text-white">Project Progress</h2>
            </div>
            <CardContent className="p-6">
              <ProgressTracker status={booking.status} assignedTeam={booking.assignedTeam} />
            </CardContent>
          </Card>

          {booking.assignedTeam && booking.assignedTeam.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="mb-8 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Your Team</h3>
                      <p className="text-indigo-700 font-medium">{booking.assignedTeam[0]}</p>
                      <p className="text-sm text-muted-foreground">Working on your project</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                  Project Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{booking.serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-medium">
                      {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Est. Duration</span>
                    <span className="font-medium">{booking.estimatedTime} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget Range</span>
                    <span className="font-medium">{booking.budgetRange}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-emerald-600" />
                  Pricing
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">{formatPrice(service?.basePrice || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Features</span>
                    <span className="font-medium">
                      +{formatPrice((booking.totalPrice || 0) - (service?.basePrice || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">Total Estimate</span>
                    <span className="font-bold text-indigo-600 text-lg">
                      {formatPrice(booking.totalPrice)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Project Requirements</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {booking.projectDetails}
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Activity Timeline
              </h3>
              <div className="space-y-4">
                {booking.timeline.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        className="w-3 h-3 rounded-full bg-indigo-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                      />
                      {index < booking.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-muted flex-1 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{event.message}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(event.date), "MMM dd, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {booking.status === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Star className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {existingReview ? "Thanks for your review!" : "Rate Your Experience"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {existingReview 
                            ? `You gave ${existingReview.rating} stars`
                            : "Help us improve by sharing your feedback"
                          }
                        </p>
                      </div>
                    </div>
                    {!existingReview && (
                      <Button
                        onClick={() => setShowReviewForm(true)}
                        className="bg-gradient-to-r from-emerald-500 to-teal-600"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Leave Review
                      </Button>
                    )}
                    {existingReview && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= existingReview.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </main>

      <AnimatePresence>
        {showReviewForm && booking && (
          <ReviewForm
            bookingId={booking.id}
            serviceId={booking.serviceId}
            onClose={() => setShowReviewForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
