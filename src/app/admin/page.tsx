"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles, LogOut, Clock, CheckCircle2, AlertCircle, Loader2,
  Users, Briefcase, TrendingUp, BarChart3, ArrowRight,
  Globe, Smartphone, Cloud, Cog, UserCheck, UserX, RefreshCw,
  Zap, Flag, Download, Kanban
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore, BookingRequest } from "@/lib/store";
import { format } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { NotificationBell } from "@/components/notifications";
import { toast } from "sonner";
const statusConfig = {
  requested: { color: "bg-amber-100 text-amber-700", icon: Clock, label: "Requested" },
  in_progress: { color: "bg-blue-100 text-blue-700", icon: Loader2, label: "In Progress" },
  completed: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, label: "Completed" },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle, label: "Rejected" },
};

const priorityConfig = {
  high: { color: "bg-red-100 text-red-700", label: "High Priority" },
  medium: { color: "bg-amber-100 text-amber-700", label: "Medium" },
  low: { color: "bg-emerald-100 text-emerald-700", label: "Low" },
};

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "web-dev": Globe,
  "app-dev": Smartphone,
  "saas": Cloud,
  "automation": Cog,
};

const defaultTeams = [
  { id: 'team-alpha', name: 'Team Alpha', members: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar'], status: 'free' as const, currentProjectId: null, currentProjectName: null, specialization: 'Web Development' },
  { id: 'team-beta', name: 'Team Beta', members: ['Sneha Gupta', 'Vikram Singh', 'Neha Reddy'], status: 'free' as const, currentProjectId: null, currentProjectName: null, specialization: 'Mobile Apps' },
  { id: 'team-gamma', name: 'Team Gamma', members: ['Arjun Nair', 'Kavya Iyer', 'Rohan Das'], status: 'free' as const, currentProjectId: null, currentProjectName: null, specialization: 'SaaS Development' },
  { id: 'team-delta', name: 'Team Delta', members: ['Ananya Joshi', 'Karthik Menon', 'Divya Rao'], status: 'free' as const, currentProjectId: null, currentProjectName: null, specialization: 'Business Automation' },
  { id: 'team-omega', name: 'Team Omega', members: ['Sanjay Verma', 'Meera Krishnan', 'Aditya Bhatt'], status: 'free' as const, currentProjectId: null, currentProjectName: null, specialization: 'Full Stack' },
];

export default function AdminDashboard() {
  const router = useRouter();
  const store = useAppStore();
  const { 
    currentUser, setCurrentUser, bookings, updateBooking, services, 
    teams: storeTeams, assignProjectToTeam, freeTeam, addNotification 
  } = store;
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "kanban">("list");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [, forceUpdate] = useState({});

  const teams = storeTeams && storeTeams.length > 0 ? storeTeams : defaultTeams;

  useEffect(() => {
    if (!currentUser || currentUser.role !== "admin") {
      router.push("/login?role=admin");
    }
  }, [currentUser, router]);

  const syncFromStorage = useCallback(() => {
    useAppStore.persist.rehydrate();
    forceUpdate({});
    setLastUpdate(new Date());
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

  const getPriority = (booking: BookingRequest): 'high' | 'medium' | 'low' => {
    if (booking.totalPrice >= 500000) return 'high';
    if (booking.totalPrice >= 200000) return 'medium';
    return 'low';
  };

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[getPriority(a)] - priorityOrder[getPriority(b)];
  });

  const handleStatusUpdate = (bookingId: string, newStatus: BookingRequest["status"]) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return;

    const statusMessages: Record<string, string> = {
      in_progress: "Project has been approved and started",
      completed: "Project has been completed successfully",
      rejected: "Project request has been declined",
    };

    updateBooking(bookingId, {
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

    if (newStatus === "completed") {
      const team = teams.find(t => t.currentProjectId === bookingId);
      if (team && freeTeam) {
        freeTeam(team.id);
      }
    }

    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.clientId,
      title: `Project ${newStatus === 'in_progress' ? 'Approved' : newStatus === 'completed' ? 'Completed' : 'Update'}`,
      message: statusMessages[newStatus],
      type: newStatus === 'rejected' ? 'error' : newStatus === 'completed' ? 'success' : 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    toast.success(`Booking ${newStatus === 'in_progress' ? 'approved' : newStatus}`);
  };

  const handleAssignTeam = (bookingId: string, teamId: string) => {
    if (!teamId || teamId === "none") return;
    
    const booking = bookings.find((b) => b.id === bookingId);
    const team = teams.find((t) => t.id === teamId);
    if (!booking || !team) return;

    if (assignProjectToTeam) {
      assignProjectToTeam(teamId, bookingId, booking.serviceName);
    }
    
    updateBooking(bookingId, {
      assignedTeam: [team.name],
      timeline: [
        ...booking.timeline,
        {
          date: new Date().toISOString(),
          status: 'team_assigned',
          message: `Project assigned to ${team.name}`,
        },
      ],
    });

    addNotification({
      id: `notif-${Date.now()}`,
      userId: booking.clientId,
      title: 'Team Assigned',
      message: `${team.name} has been assigned to your project`,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString(),
    });

    toast.success(`Assigned to ${team.name}`);
  };

  const generateInvoice = (booking: BookingRequest) => {
    const service = services.find(s => s.id === booking.serviceId);
    const invoiceContent = `
INVOICE
=======
Invoice #: INV-${booking.id.slice(-8).toUpperCase()}
Date: ${format(new Date(), 'dd MMM yyyy')}

Client: ${booking.clientName}
Email: ${booking.clientEmail}

Service: ${booking.serviceName}
Base Price: ${formatPrice(service?.basePrice || 0)}

Selected Features:
${booking.selectedFeatures.map(f => {
  const feature = service?.features.find(feat => feat.id === f);
  return `- ${feature?.name || f}: ${formatPrice(feature?.price || 0)}`;
}).join('\n')}

Total Amount: ${formatPrice(booking.totalPrice)}
Estimated Duration: ${booking.estimatedTime} days

Status: ${booking.status.toUpperCase()}

Thank you for choosing TechFlow!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${booking.id.slice(-8)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Invoice downloaded!');
  };

  const freeTeamsList = teams.filter(t => t.status === 'free');
  const busyTeamsList = teams.filter(t => t.status === 'busy');

  const kanbanColumns = [
    { id: 'requested', title: 'Pending', color: 'bg-amber-500' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-blue-500' },
    { id: 'completed', title: 'Completed', color: 'bg-emerald-500' },
  ];

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
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-700">Live Sync</span>
              </div>
              <Link href="/admin/reports">
                <Button variant="ghost" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reports
                </Button>
              </Link>
              <NotificationBell />
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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                List
              </Button>
              <Button
                variant={viewMode === "kanban" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("kanban")}
              >
                <Kanban className="w-4 h-4 mr-2" />
                Kanban
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">Total Bookings</p>
                    <p className="text-3xl font-bold">{stats.total}</p>
                  </div>
                  <Briefcase className="w-10 h-10 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-3xl font-bold text-amber-600">{stats.requested}</p>
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
                    <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600">{formatPrice(stats.totalRevenue)}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Management ({freeTeamsList.length} Available / {busyTeamsList.length} Busy)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {teams.map((team, index) => (
                  <motion.div
                    key={team.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
                      team.status === 'free' 
                        ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50' 
                        : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{team.name}</h4>
                      {team.status === 'free' ? (
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                          <UserCheck className="w-5 h-5 text-emerald-600" />
                        </motion.div>
                      ) : (
                        <UserX className="w-5 h-5 text-amber-600" />
                      )}
                    </div>
                    <Badge className={`${team.status === 'free' ? 'bg-emerald-500' : 'bg-amber-500'} text-white`}>
                      {team.status === 'free' ? 'Available' : 'Working'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2 font-medium">{team.specialization}</p>
                    <div className="mt-2 flex -space-x-2">
                      {team.members.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={member}
                        >
                          {member.charAt(0)}
                        </div>
                      ))}
                    </div>
                    {team.currentProjectName && (
                      <div className="mt-3 p-2 bg-white/80 rounded-lg text-xs border">
                        <span className="font-medium text-amber-700">Working on:</span>
                        <p className="text-muted-foreground truncate">{team.currentProjectName}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {viewMode === "kanban" ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Kanban className="w-5 h-5" />
                  Kanban Board
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {kanbanColumns.map((column) => (
                    <div key={column.id} className="bg-muted/30 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-3 h-3 rounded-full ${column.color}`} />
                        <h3 className="font-semibold">{column.title}</h3>
                        <Badge variant="secondary">
                          {bookings.filter((b) => b.status === column.id).length}
                        </Badge>
                      </div>
                      <div className="space-y-3">
                        {bookings
                          .filter((b) => b.status === column.id)
                          .map((booking) => {
                            const priority = getPriority(booking);
                            const ServiceIcon = serviceIcons[booking.serviceId] || Globe;
                            return (
                              <motion.div
                                key={booking.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <div className="flex items-center gap-2">
                                    <ServiceIcon className="w-4 h-4 text-indigo-600" />
                                    <span className="font-medium text-sm truncate">{booking.serviceName}</span>
                                  </div>
                                  <Badge className={priorityConfig[priority].color} variant="secondary">
                                    <Flag className="w-3 h-3 mr-1" />
                                    {priority}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2">{booking.clientName}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-indigo-600">{formatPrice(booking.totalPrice)}</span>
                                  <Link href={`/admin/booking/${booking.id}`}>
                                    <Button size="sm" variant="ghost">
                                      <ArrowRight className="w-3 h-3" />
                                    </Button>
                                  </Link>
                                </div>
                              </motion.div>
                            );
                          })}
                        {bookings.filter((b) => b.status === column.id).length === 0 && (
                          <p className="text-center text-sm text-muted-foreground py-8">No items</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Service Requests
                      <Badge variant="secondary" className="ml-2">
                        <Zap className="w-3 h-3 mr-1" />
                        Priority Queue
                      </Badge>
                    </CardTitle>
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
                        {sortedBookings.length === 0 ? (
                          <div className="text-center py-12 text-muted-foreground">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p>No bookings found</p>
                          </div>
                        ) : (
                          sortedBookings.map((booking, index) => {
                            const status = statusConfig[booking.status];
                            const StatusIcon = status.icon;
                            const ServiceIcon = serviceIcons[booking.serviceId] || Globe;
                            const assignedTeam = booking.assignedTeam?.[0];
                            const priority = getPriority(booking);

                            return (
                              <motion.div
                                key={booking.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card className="hover:shadow-lg transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-4 flex-1">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0">
                                          <ServiceIcon className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h4 className="font-semibold">{booking.serviceName}</h4>
                                            <Badge className={status.color}>
                                              <StatusIcon className="w-3 h-3 mr-1" />
                                              {status.label}
                                            </Badge>
                                            <Badge className={priorityConfig[priority].color} variant="secondary">
                                              <Flag className="w-3 h-3 mr-1" />
                                              {priorityConfig[priority].label}
                                            </Badge>
                                            {assignedTeam && (
                                              <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                                                <Users className="w-3 h-3 mr-1" />
                                                {assignedTeam}
                                              </Badge>
                                            )}
                                          </div>
                                          <p className="text-sm text-muted-foreground mb-2">
                                            {booking.clientName} • {booking.clientEmail}
                                          </p>
                                          <p className="text-sm text-muted-foreground line-clamp-2">
                                            {booking.projectDetails}
                                          </p>
                                          <div className="flex items-center gap-4 mt-3">
                                            <span className="text-lg font-bold text-indigo-600">{formatPrice(booking.totalPrice)}</span>
                                            <span className="text-sm text-muted-foreground">{booking.estimatedTime} days</span>
                                            <span className="text-sm text-muted-foreground">{format(new Date(booking.createdAt), "MMM dd, yyyy")}</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex flex-col gap-2 shrink-0 min-w-[160px]">
                                        {booking.status === "requested" && (
                                          <>
                                            <Button
                                              size="sm"
                                              onClick={() => handleStatusUpdate(booking.id, "in_progress")}
                                              className="bg-gradient-to-r from-indigo-500 to-purple-600 w-full"
                                            >
                                              <CheckCircle2 className="w-4 h-4 mr-1" />
                                              Approve
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              onClick={() => handleStatusUpdate(booking.id, "rejected")}
                                              className="w-full text-red-600 border-red-200 hover:bg-red-50"
                                            >
                                              <AlertCircle className="w-4 h-4 mr-1" />
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                        {booking.status === "in_progress" && !assignedTeam && (
                                          <Select 
                                            onValueChange={(value) => handleAssignTeam(booking.id, value)}
                                          >
                                            <SelectTrigger className="w-full border-indigo-300">
                                              <SelectValue placeholder="Assign Team" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {freeTeamsList.length > 0 ? (
                                                freeTeamsList.map((team) => (
                                                  <SelectItem key={team.id} value={team.id}>
                                                    <div className="flex items-center gap-2">
                                                      <UserCheck className="w-3 h-3 text-emerald-500" />
                                                      {team.name}
                                                    </div>
                                                  </SelectItem>
                                                ))
                                              ) : (
                                                <SelectItem value="none" disabled>
                                                  No free teams
                                                </SelectItem>
                                              )}
                                            </SelectContent>
                                          </Select>
                                        )}
                                        {booking.status === "in_progress" && (
                                          <Button
                                            size="sm"
                                            onClick={() => handleStatusUpdate(booking.id, "completed")}
                                            className="bg-emerald-600 hover:bg-emerald-700 w-full"
                                          >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Mark Complete
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => generateInvoice(booking)}
                                          className="w-full"
                                        >
                                          <Download className="w-4 h-4 mr-1" />
                                          Invoice
                                        </Button>
                                        <Link href={`/admin/booking/${booking.id}`}>
                                          <Button size="sm" variant="ghost" className="w-full">
                                            View Details
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

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {serviceStats.map((service) => {
                      const Icon = serviceIcons[service.id] || Globe;
                      return (
                        <motion.div
                          key={service.id}
                          whileHover={{ scale: 1.02 }}
                          className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg cursor-pointer"
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
                            {formatPrice(service.revenue)}
                          </p>
                        </motion.div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Recent Clients
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <motion.div 
                        key={booking.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                          {booking.clientName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{booking.clientName}</p>
                          <p className="text-xs text-muted-foreground truncate">{booking.clientEmail}</p>
                        </div>
                        <Badge className={statusConfig[booking.status].color} variant="secondary">
                          {statusConfig[booking.status].label}
                        </Badge>
                      </motion.div>
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
          )}
        </motion.div>
      </main>
    </div>
  );
}
