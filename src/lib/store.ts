import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'admin';
  createdAt: string;
}

export interface ServiceFeature {
  id: string;
  name: string;
  price: number;
  time: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  basePrice: number;
  baseTime: number;
  features: ServiceFeature[];
}

export interface BookingRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  serviceId: string;
  serviceName: string;
  selectedFeatures: string[];
  totalPrice: number;
  estimatedTime: number;
  projectDetails: string;
  budgetRange: string;
  attachments: string[];
  status: 'requested' | 'in_progress' | 'completed' | 'rejected';
  assignedTeam: string[];
  timeline: { date: string; status: string; message: string }[];
  messages: { sender: string; message: string; date: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  clientId: string;
  clientName: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'admin';
  message: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[];
  status: 'free' | 'busy';
  currentProjectId: string | null;
  currentProjectName: string | null;
  specialization: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  bookings: BookingRequest[];
  services: Service[];
  notifications: Notification[];
  reviews: Review[];
  chatMessages: ChatMessage[];
  teams: Team[];
  
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  addBooking: (booking: BookingRequest) => void;
  updateBooking: (id: string, updates: Partial<BookingRequest>) => void;
  getUserBookings: (userId: string) => BookingRequest[];
  getAllBookings: () => BookingRequest[];
  
  addNotification: (notification: Notification) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: (userId: string) => void;
  getUserNotifications: (userId: string) => Notification[];
  
  addReview: (review: Review) => void;
  getServiceReviews: (serviceId: string) => Review[];
  getBookingReview: (bookingId: string) => Review | undefined;
  
  addChatMessage: (message: ChatMessage) => void;
  getBookingChatMessages: (bookingId: string) => ChatMessage[];
  
  updateTeam: (teamId: string, updates: Partial<Team>) => void;
  assignProjectToTeam: (teamId: string, bookingId: string, bookingName: string) => void;
  freeTeam: (teamId: string) => void;
  getTeams: () => Team[];
}

const defaultServices: Service[] = [
  {
    id: 'web-dev',
    name: 'Website Development',
    description: 'Custom websites tailored to your business needs with modern technologies',
    icon: 'Globe',
    basePrice: 100000,
    baseTime: 7,
    features: [
      { id: 'responsive', name: 'Responsive Design', price: 5000, time: 1 },
      { id: 'cms', name: 'Content Management System', price: 8000, time: 2 },
      { id: 'ecommerce', name: 'E-commerce Integration', price: 10000, time: 2 },
      { id: 'seo', name: 'SEO Optimization', price: 5000, time: 1 },
      { id: 'analytics', name: 'Analytics Dashboard', price: 6000, time: 1 },
      { id: 'multilang', name: 'Multi-language Support', price: 8000, time: 2 },
    ]
  },
  {
    id: 'app-dev',
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    icon: 'Smartphone',
    basePrice: 200000,
    baseTime: 14,
    features: [
      { id: 'ios', name: 'iOS Development', price: 10000, time: 3 },
      { id: 'android', name: 'Android Development', price: 10000, time: 3 },
      { id: 'push', name: 'Push Notifications', price: 5000, time: 1 },
      { id: 'offline', name: 'Offline Mode', price: 7000, time: 2 },
      { id: 'payment', name: 'Payment Integration', price: 8000, time: 2 },
      { id: 'social', name: 'Social Login', price: 4000, time: 1 },
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Development',
    description: 'Scalable software-as-a-service platforms with subscription management',
    icon: 'Cloud',
    basePrice: 300000,
    baseTime: 21,
    features: [
      { id: 'auth', name: 'User Authentication', price: 6000, time: 2 },
      { id: 'subscription', name: 'Subscription Management', price: 9000, time: 3 },
      { id: 'api', name: 'REST API Development', price: 10000, time: 3 },
      { id: 'dashboard', name: 'Admin Dashboard', price: 8000, time: 2 },
      { id: 'reports', name: 'Reporting & Analytics', price: 7000, time: 2 },
      { id: 'multitenancy', name: 'Multi-tenancy Support', price: 10000, time: 3 },
    ]
  },
  {
    id: 'automation',
    name: 'Business Automation',
    description: 'Streamline your workflows with custom automation solutions',
    icon: 'Cog',
    basePrice: 150000,
    baseTime: 10,
    features: [
      { id: 'workflow', name: 'Workflow Automation', price: 8000, time: 2 },
      { id: 'integration', name: 'Third-party Integrations', price: 6000, time: 2 },
      { id: 'email', name: 'Email Automation', price: 5000, time: 1 },
      { id: 'crm', name: 'CRM Integration', price: 7000, time: 2 },
      { id: 'reporting', name: 'Automated Reporting', price: 6000, time: 1 },
      { id: 'chatbot', name: 'AI Chatbot', price: 9000, time: 3 },
    ]
  },
];

const defaultTeams: Team[] = [
  {
    id: 'team-alpha',
    name: 'Team Alpha',
    members: ['Rahul Sharma', 'Priya Patel', 'Amit Kumar'],
    status: 'free',
    currentProjectId: null,
    currentProjectName: null,
    specialization: 'Web Development',
  },
  {
    id: 'team-beta',
    name: 'Team Beta',
    members: ['Sneha Gupta', 'Vikram Singh', 'Neha Reddy'],
    status: 'free',
    currentProjectId: null,
    currentProjectName: null,
    specialization: 'Mobile Apps',
  },
  {
    id: 'team-gamma',
    name: 'Team Gamma',
    members: ['Arjun Nair', 'Kavya Iyer', 'Rohan Das'],
    status: 'free',
    currentProjectId: null,
    currentProjectName: null,
    specialization: 'SaaS Development',
  },
  {
    id: 'team-delta',
    name: 'Team Delta',
    members: ['Ananya Joshi', 'Karthik Menon', 'Divya Rao'],
    status: 'free',
    currentProjectId: null,
    currentProjectName: null,
    specialization: 'Business Automation',
  },
  {
    id: 'team-omega',
    name: 'Team Omega',
    members: ['Sanjay Verma', 'Meera Krishnan', 'Aditya Bhatt'],
    status: 'free',
    currentProjectId: null,
    currentProjectName: null,
    specialization: 'Full Stack',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      bookings: [],
      services: defaultServices,
      notifications: [],
      reviews: [],
      chatMessages: [],
      teams: defaultTeams,
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      addUser: (user) => set((state) => ({ users: [...state.users, user] })),
      
      addBooking: (booking) => set((state) => ({ bookings: [...state.bookings, booking] })),
      
      updateBooking: (id, updates) => set((state) => ({
        bookings: state.bookings.map((b) => 
          b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
        )
      })),
      
      getUserBookings: (userId) => get().bookings.filter((b) => b.clientId === userId),
      
      getAllBookings: () => get().bookings,
      
      addNotification: (notification) => set((state) => ({ 
        notifications: [notification, ...state.notifications] 
      })),
      
      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      })),
      
      clearNotifications: (userId) => set((state) => ({
        notifications: state.notifications.filter((n) => n.userId !== userId)
      })),
      
      getUserNotifications: (userId) => get().notifications.filter((n) => n.userId === userId),
      
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
      
      getServiceReviews: (serviceId) => get().reviews.filter((r) => r.serviceId === serviceId),
      
      getBookingReview: (bookingId) => get().reviews.find((r) => r.bookingId === bookingId),
      
      addChatMessage: (message) => set((state) => ({ 
        chatMessages: [...state.chatMessages, message] 
      })),
      
      getBookingChatMessages: (bookingId) => get().chatMessages.filter((m) => m.bookingId === bookingId),
      
      updateTeam: (teamId, updates) => set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId ? { ...t, ...updates } : t
        )
      })),
      
      assignProjectToTeam: (teamId, bookingId, bookingName) => set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId 
            ? { ...t, status: 'busy' as const, currentProjectId: bookingId, currentProjectName: bookingName }
            : t
        )
      })),
      
      freeTeam: (teamId) => set((state) => ({
        teams: state.teams.map((t) =>
          t.id === teamId 
            ? { ...t, status: 'free' as const, currentProjectId: null, currentProjectName: null }
            : t
        )
      })),
      
      getTeams: () => get().teams,
    }),
      {
        name: 'it-service-booking-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          currentUser: state.currentUser,
          users: state.users,
          bookings: state.bookings,
          notifications: state.notifications,
          reviews: state.reviews,
          chatMessages: state.chatMessages,
          teams: state.teams,
        }),
      }
    )
  );

export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
};
