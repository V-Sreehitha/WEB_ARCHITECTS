"use client";

import { useEffect, use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, LogOut, Clock, CheckCircle2, AlertCircle,
  Loader2, MessageSquare, Calendar, DollarSign, User, Mail, Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useAppStore, BookingRequest } from "@/lib/store";
import { format } from "date-fns";
import { toast } from "sonner";

const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested" },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed" },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected" },
};

export default function AdminBookingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser, setCurrentUser, bookings, services, updateBooking } = useAppStore();
  const [message, setMessage] = useState("");

  const booking = bookings.find((b) => b.id === id);
  const service = booking ? services.find((s) => s.id === booking.serviceId) : null;

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login?role=admin");
    }
  }, [currentUser, router]);

  if (!currentUser || !booking || currentUser.role !== "admin") {
    return null;
  }

  const status = statusConfig[booking.status];
  const StatusIcon = status.icon;

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const handleStatusUpdate = (newStatus: BookingRequest["status"]) => {
    const statusMessages: Record<string, string> = {
      in_progress: "Project has been started by the team",
      completed: "Project has been completed successfully",
      rejected: "Project request has been declined",
    };

    updateBooking(booking.id, {
      status: newStatus,
      timeline: [
        ...booking.timeline,
        {
          date: new Date().toISOString(),
          status: newStatus,
          message: statusMessages[newStatus],
        },
      ],
    });
    toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    updateBooking(booking.id, {
      messages: [
        ...booking.messages,
        {
          sender: "admin",
          message: message.trim(),
          date: new Date().toISOString(),
        },
      ],
      timeline: [
        ...booking.timeline,
        {
          date: new Date().toISOString(),
          status: booking.status,
          message: `Admin sent a message: "${message.trim()}"`,
        },
      ],
    });
    setMessage("");
    toast.success("Message sent to client");
  };

  const selectedFeatures = service?.features.filter((f) =>
    booking.selectedFeatures.includes(f.id)
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/admin">
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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

            <div className="flex gap-2">
              {booking.status === "requested" && (
                <>
                  <Button
                    onClick={() => handleStatusUpdate("in_progress")}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600"
                  >
                    Approve & Start
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    Reject
                  </Button>
                </>
              )}
              {booking.status === "in_progress" && (
                <Button
                  onClick={() => handleStatusUpdate("completed")}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Mark Completed
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Client Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {booking.clientName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{booking.clientName}</h3>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {booking.clientEmail}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {booking.projectDetails}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Send Message to Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>

                  {booking.messages.length > 0 && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold mb-4">Message History</h4>
                      <div className="space-y-3">
                        {booking.messages.map((msg, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg ${
                              msg.sender === "admin"
                                ? "bg-indigo-50 ml-8"
                                : "bg-muted mr-8"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {msg.sender === "admin" ? "You" : booking.clientName} • {format(new Date(msg.date), "MMM dd, h:mm a")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {booking.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Project Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{booking.serviceName}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="font-medium">
                      {format(new Date(booking.createdAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Duration</span>
                    <span className="font-medium">{booking.estimatedTime} days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="font-medium">{booking.budgetRange}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Pricing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span className="font-medium">${service?.basePrice.toLocaleString() || 0}</span>
                  </div>
                  
                  {selectedFeatures.length > 0 && (
                    <div className="space-y-2 pt-2 border-t">
                      <p className="text-sm text-muted-foreground">Features:</p>
                      {selectedFeatures.map((feature) => (
                        <div key={feature.id} className="flex justify-between text-sm">
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            {feature.name}
                          </span>
                          <span>+${feature.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-indigo-600 text-xl">
                      ${booking.totalPrice.toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {booking.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {booking.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-muted rounded-lg text-sm"
                        >
                          <span className="truncate">{file}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
