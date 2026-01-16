import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AppState {
  currentUser: User | null;
  users: User[];
  bookings: BookingRequest[];
  services: Service[];
  
  setCurrentUser: (user: User | null) => void;
  addUser: (user: User) => void;
  addBooking: (booking: BookingRequest) => void;
  updateBooking: (id: string, updates: Partial<BookingRequest>) => void;
  getUserBookings: (userId: string) => BookingRequest[];
  getAllBookings: () => BookingRequest[];
}

const defaultServices: Service[] = [
  {
    id: 'web-dev',
    name: 'Website Development',
    description: 'Custom websites tailored to your business needs with modern technologies',
    icon: 'Globe',
    basePrice: 2000,
    baseTime: 14,
    features: [
      { id: 'responsive', name: 'Responsive Design', price: 300, time: 2 },
      { id: 'cms', name: 'Content Management System', price: 500, time: 3 },
      { id: 'ecommerce', name: 'E-commerce Integration', price: 800, time: 5 },
      { id: 'seo', name: 'SEO Optimization', price: 400, time: 2 },
      { id: 'analytics', name: 'Analytics Dashboard', price: 350, time: 2 },
      { id: 'multilang', name: 'Multi-language Support', price: 600, time: 4 },
    ]
  },
  {
    id: 'app-dev',
    name: 'Mobile App Development',
    description: 'Native and cross-platform mobile applications for iOS and Android',
    icon: 'Smartphone',
    basePrice: 5000,
    baseTime: 30,
    features: [
      { id: 'ios', name: 'iOS Development', price: 2000, time: 10 },
      { id: 'android', name: 'Android Development', price: 2000, time: 10 },
      { id: 'push', name: 'Push Notifications', price: 400, time: 3 },
      { id: 'offline', name: 'Offline Mode', price: 600, time: 4 },
      { id: 'payment', name: 'Payment Integration', price: 800, time: 5 },
      { id: 'social', name: 'Social Login', price: 300, time: 2 },
    ]
  },
  {
    id: 'saas',
    name: 'SaaS Development',
    description: 'Scalable software-as-a-service platforms with subscription management',
    icon: 'Cloud',
    basePrice: 8000,
    baseTime: 45,
    features: [
      { id: 'auth', name: 'User Authentication', price: 500, time: 3 },
      { id: 'subscription', name: 'Subscription Management', price: 1200, time: 7 },
      { id: 'api', name: 'REST API Development', price: 1500, time: 8 },
      { id: 'dashboard', name: 'Admin Dashboard', price: 1000, time: 5 },
      { id: 'reports', name: 'Reporting & Analytics', price: 800, time: 4 },
      { id: 'multitenancy', name: 'Multi-tenancy Support', price: 2000, time: 10 },
    ]
  },
  {
    id: 'automation',
    name: 'Business Automation',
    description: 'Streamline your workflows with custom automation solutions',
    icon: 'Cog',
    basePrice: 3000,
    baseTime: 20,
    features: [
      { id: 'workflow', name: 'Workflow Automation', price: 800, time: 5 },
      { id: 'integration', name: 'Third-party Integrations', price: 600, time: 4 },
      { id: 'email', name: 'Email Automation', price: 400, time: 3 },
      { id: 'crm', name: 'CRM Integration', price: 700, time: 4 },
      { id: 'reporting', name: 'Automated Reporting', price: 500, time: 3 },
      { id: 'chatbot', name: 'AI Chatbot', price: 1200, time: 7 },
    ]
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [],
      bookings: [],
      services: defaultServices,
      
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
    }),
    {
      name: 'it-service-booking-storage',
    }
  )
);
