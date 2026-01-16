"use client";

import { useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, LogOut, Clock, CheckCircle2, 
  AlertCircle, Loader2, MessageSquare, Calendar, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { format } from "date-fns";

const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested", step: 1 },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress", step: 2 },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed", step: 3 },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected", step: 0 },
};

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser, setCurrentUser, bookings, services } = useAppStore();

  const booking = bookings.find((b) => b.id === id);
  const service = booking ? services.find((s) => s.id === booking.serviceId) : null;

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser || !booking) {
    return null;
  }

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const progressSteps = [
    { label: "Requested", step: 1 },
    { label: "In Progress", step: 2 },
    { label: "Completed", step: 3 },
  ];

  const currentStep = status.step;

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
              <span className="text-sm text-muted-foreground hidden sm:block">
                {currentUser.name}
              </span>
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
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Project Progress</h2>
              
              <div className="relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / 3) * 100}%` }}
                  />
                </div>
                
                <div className="relative flex justify-between">
                  {progressSteps.map((step) => {
                    const isCompleted = currentStep >= step.step;
                    const isCurrent = currentStep === step.step;
                    return (
                      <div key={step.label} className="flex flex-col items-center">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all ${
                            isCompleted 
                              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" 
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-4 ring-indigo-200" : ""}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <span className="text-sm font-medium">{step.step}</span>
                          )}
                        </div>
                        <span className={`mt-2 text-sm ${isCompleted ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                  Pricing
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">${service?.basePrice.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Features</span>
                    <span className="font-medium">
                      +${((booking.totalPrice || 0) - (service?.basePrice || 0)).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t">
                    <span className="font-semibold">Total Estimate</span>
                    <span className="font-bold text-indigo-600">
                      ${booking.totalPrice.toLocaleString()}
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

          <Card>
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
                      <div className="w-3 h-3 rounded-full bg-indigo-500" />
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
        </motion.div>
      </main>
    </div>
  );
}
