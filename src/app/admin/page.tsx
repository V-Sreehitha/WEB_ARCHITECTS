"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles, LogOut, Clock, CheckCircle2, AlertCircle, Loader2,
  Users, Briefcase, TrendingUp, BarChart3, ArrowRight,
  Globe, Smartphone, Cloud, Cog
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, BookingRequest } from "@/lib/store";
import { format } from "date-fns";

const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested" },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed" },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected" },
};

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-dev": Globe,
  "app-dev": Smartphone,
  "saas": Cloud,
  "automation": Cog,
};

export default function AdminDashboard() {
  const router = useRouter();
  const { currentUser, setCurrentUser, bookings, updateBooking, services } = useAppStore();
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login?role=admin");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const stats = {
    total: bookings.length,
    requested: bookings.filter((b) => b.status === "requested").length,
    inProgress: bookings.filter((b) => b.status === "in_progress").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    totalRevenue: bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.totalPrice, 0),
  };

  const serviceStats = services.map((service) => {
    const serviceBookings = bookings.filter((b) => b.serviceId === service.id);
    return {
      ...service,
      count: serviceBookings.length,
      revenue: serviceBookings.reduce((sum, b) => sum + b.totalPrice, 0),
    };
  });

  const filteredBookings = activeTab === "all" 
    ? bookings 
    : bookings.filter((b) => b.status === activeTab);

  const handleStatusUpdate = (bookingId: string, newStatus: BookingRequest["status"]) => {
    const statusMessages: Record<string, string> = {
      in_progress: "Project has been started by the team",
      completed: "Project has been completed successfully",
      rejected: "Project request has been declined",
    };

    updateBooking(bookingId, {
      status: newStatus,
      timeline: [
        ...bookings.find((b) => b.id === bookingId)!.timeline,
        {
          date: new Date().toISOString(),
          status: newStatus,
          message: statusMessages[newStatus],
        },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">TechFlow</span>
                <Badge variant="secondary" className="ml-2">Admin</Badge>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/admin/reports">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground hidden sm:block">
                {currentUser.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold">{stats.requested}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="text-3xl font-bold">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Service Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
                      <TabsTrigger value="requested">Pending ({stats.requested})</TabsTrigger>
                      <TabsTrigger value="in_progress">In Progress ({stats.inProgress})</TabsTrigger>
                      <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4">
                      {filteredBookings.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          No bookings found
                        </div>
                      ) : (
                        filteredBookings.map((booking, index) => {
                          const status = statusConfig[booking.status];
                          const StatusIcon = status.icon;
                          const ServiceIcon = serviceIcons[booking.serviceId] || Globe;

                          return (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4 flex-1">
                                      <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                                        <ServiceIcon className="w-5 h-5 text-indigo-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                          <h4 className="font-semibold truncate">{booking.serviceName}</h4>
                                          <Badge className={status.color}>
                                            <StatusIcon className="w-3 h-3 mr-1" />
                                            {status.label}
                                          </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {booking.clientName} • {booking.clientEmail}
                                        </p>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                          {booking.projectDetails}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                          <span>${booking.totalPrice.toLocaleString()}</span>
                                          <span>{booking.estimatedTime} days</span>
                                          <span>{format(new Date(booking.createdAt), "MMM dd, yyyy")}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex flex-col gap-2 shrink-0">
                                      {booking.status === "requested" && (
                                        <>
                                          <Button
                                            size="sm"
                                            onClick={() => handleStatusUpdate(booking.id, "in_progress")}
                                            className="bg-gradient-to-r from-indigo-500 to-purple-600"
                                          >
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleStatusUpdate(booking.id, "rejected")}
                                          >
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                      {booking.status === "in_progress" && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleStatusUpdate(booking.id, "completed")}
                                          className="bg-emerald-600 hover:bg-emerald-700"
                                        >
                                          Complete
                                        </Button>
                                      )}
                                      <Link href={`/admin/booking/${booking.id}`}>
                                        <Button size="sm" variant="ghost" className="w-full">
                                          View
                                          <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          );
                        })
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Service Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {serviceStats.map((service) => {
                    const Icon = serviceIcons[service.id] || Globe;
                    return (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{service.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {service.count} bookings
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-emerald-600">
                          ${service.revenue.toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Recent Clients
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                        {booking.clientName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{booking.clientName}</p>
                        <p className="text-xs text-muted-foreground">{booking.clientEmail}</p>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No clients yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
