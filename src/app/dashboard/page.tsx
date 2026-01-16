"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Cloud, Cog, ArrowRight, Plus,
  Sparkles, LogOut, Clock, CheckCircle2, AlertCircle, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Smartphone,
  Cloud,
  Cog,
};

const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested" },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed" },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected" },
};

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, services, bookings } = useAppStore();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const userBookings = bookings.filter((b) => b.clientId === currentUser.id);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechFlow</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:block">
                Welcome, <strong>{currentUser.name}</strong>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Browse services and manage your bookings</p>
            </div>
            <Link href="/services">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 gap-2">
                <Plus className="w-4 h-4" />
                Book New Service
              </Button>
            </Link>
          </div>

          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Our Services</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {services.map((service, index) => {
                const Icon = serviceIcons[service.icon] || Globe;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/services/${service.id}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-0 bg-card/50">
                        <CardContent className="p-6">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="font-semibold mb-1">{service.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-indigo-600">
                              From ${service.basePrice.toLocaleString()}
                            </span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Your Bookings</h2>
            {userBookings.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No bookings yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by exploring our services and booking your first project
                  </p>
                  <Link href="/services">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600">
                      Browse Services
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {userBookings.map((booking, index) => {
                  const status = statusConfig[booking.status];
                  const StatusIcon = status.icon;
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link href={`/track/${booking.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold">{booking.serviceName}</h3>
                                  <Badge className={status.color}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {status.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {booking.projectDetails.slice(0, 100)}
                                  {booking.projectDetails.length > 100 && "..."}
                                </p>
                              </div>
                              <div className="flex items-center gap-6 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Estimated</p>
                                  <p className="font-medium">{booking.estimatedTime} days</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Total</p>
                                  <p className="font-medium">${booking.totalPrice.toLocaleString()}</p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </section>
        </motion.div>
      </main>
    </div>
  );
}
