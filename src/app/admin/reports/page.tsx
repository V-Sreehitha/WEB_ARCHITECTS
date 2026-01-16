"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, LogOut, TrendingUp, Users, Briefcase,
  Globe, Smartphone, Cloud, Cog, DollarSign, Calendar, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-dev": Globe,
  "app-dev": Smartphone,
  "saas": Cloud,
  "automation": Cog,
};

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ec4899"];

export default function AdminReportsPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, bookings, services } = useAppStore();

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
    totalBookings: bookings.length,
    totalClients: new Set(bookings.map((b) => b.clientId)).size,
    totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0),
    completedRevenue: bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + b.totalPrice, 0),
    avgProjectValue: bookings.length > 0 
      ? Math.round(bookings.reduce((sum, b) => sum + b.totalPrice, 0) / bookings.length)
      : 0,
    completionRate: bookings.length > 0
      ? Math.round((bookings.filter((b) => b.status === "completed").length / bookings.length) * 100)
      : 0,
  };

  const serviceData = services.map((service, index) => {
    const serviceBookings = bookings.filter((b) => b.serviceId === service.id);
    return {
      name: service.name.split(" ")[0],
      fullName: service.name,
      bookings: serviceBookings.length,
      revenue: serviceBookings.reduce((sum, b) => sum + b.totalPrice, 0),
      color: COLORS[index % COLORS.length],
    };
  });

  const statusData = [
    { name: "Requested", value: bookings.filter((b) => b.status === "requested").length, color: "#f59e0b" },
    { name: "In Progress", value: bookings.filter((b) => b.status === "in_progress").length, color: "#3b82f6" },
    { name: "Completed", value: bookings.filter((b) => b.status === "completed").length, color: "#10b981" },
    { name: "Rejected", value: bookings.filter((b) => b.status === "rejected").length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  const monthlyData = [
    { month: "Jan", bookings: Math.floor(Math.random() * 10), revenue: Math.floor(Math.random() * 50000) },
    { month: "Feb", bookings: Math.floor(Math.random() * 10), revenue: Math.floor(Math.random() * 50000) },
    { month: "Mar", bookings: Math.floor(Math.random() * 10), revenue: Math.floor(Math.random() * 50000) },
    { month: "Apr", bookings: Math.floor(Math.random() * 10), revenue: Math.floor(Math.random() * 50000) },
    { month: "May", bookings: Math.floor(Math.random() * 10), revenue: Math.floor(Math.random() * 50000) },
    { month: "Jun", bookings: bookings.length, revenue: stats.totalRevenue },
  ];

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
                <Badge variant="secondary" className="ml-2">Reports</Badge>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-indigo-100 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-10 h-10 text-indigo-200" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.totalBookings}</p>
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
                    <p className="text-sm text-muted-foreground">Total Clients</p>
                    <p className="text-3xl font-bold">{stats.totalClients}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                    <p className="text-3xl font-bold">{stats.completionRate}%</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip
                        formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]}
                        contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                      />
                      <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                        {serviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => [value, "Bookings"]}
                          contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">No booking data available</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="bookings"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot={{ fill: "#6366f1" }}
                      name="Bookings"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="revenue"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ fill: "#10b981" }}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceData.map((service, index) => {
                    const Icon = serviceIcons[services[index]?.id] || Globe;
                    const percentage = stats.totalBookings > 0
                      ? (service.bookings / stats.totalBookings) * 100
                      : 0;
                    
                    return (
                      <div key={service.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{ backgroundColor: `${service.color}20` }}
                            >
                              <Icon className="w-5 h-5" style={{ color: service.color }} />
                            </div>
                            <div>
                              <p className="font-medium">{service.fullName}</p>
                              <p className="text-xs text-muted-foreground">
                                {service.bookings} bookings
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold" style={{ color: service.color }}>
                            ${service.revenue.toLocaleString()}
                          </p>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: service.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Average Project Value</p>
                  <p className="text-2xl font-bold">${stats.avgProjectValue.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Completed Revenue</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    ${stats.completedRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-xl">
                  <p className="text-sm text-muted-foreground mb-1">Pipeline Value</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${(stats.totalRevenue - stats.completedRevenue).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
