"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Sparkles, LogOut, Upload, Check, Clock, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore, BookingRequest } from "@/lib/store";
import { toast } from "sonner";

const budgetRanges = [
  "Under $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000+",
];

export default function BookingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser, setCurrentUser, services, addBooking } = useAppStore();
  
  const [projectDetails, setProjectDetails] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = services.find((s) => s.id === id);
  const featureIds = searchParams.get("features")?.split(",").filter(Boolean) || [];

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser || !service) {
    return null;
  }

  const selectedFeatures = service.features.filter((f) => featureIds.includes(f.id));
  const totalPrice = service.basePrice + selectedFeatures.reduce((sum, f) => sum + f.price, 0);
  const totalTime = service.baseTime + selectedFeatures.reduce((sum, f) => sum + f.time, 0);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map((f) => f.name);
      setAttachments((prev) => [...prev, ...fileNames]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!projectDetails.trim()) {
      toast.error("Please provide project details");
      return;
    }

    if (!budgetRange) {
      toast.error("Please select a budget range");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const booking: BookingRequest = {
      id: `booking-${Date.now()}`,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      serviceId: service.id,
      serviceName: service.name,
      selectedFeatures: featureIds,
      totalPrice,
      estimatedTime: totalTime,
      projectDetails,
      budgetRange,
      attachments,
      status: "requested",
      assignedTeam: [],
      timeline: [
        {
          date: new Date().toISOString(),
          status: "requested",
          message: "Service request submitted successfully",
        },
      ],
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    addBooking(booking);
    toast.success("Booking submitted! You'll receive a confirmation email shortly.");
    router.push(`/track/${booking.id}`);

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href={`/services/${id}?features=${featureIds.join(",")}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
              <p className="text-muted-foreground mb-8">
                Provide details about your project to help us understand your requirements better.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="project-details">Project Details *</Label>
                      <Textarea
                        id="project-details"
                        placeholder="Describe your project requirements, goals, and any specific features you need..."
                        value={projectDetails}
                        onChange={(e) => setProjectDetails(e.target.value)}
                        rows={6}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name (Optional)</Label>
                        <Input
                          id="company"
                          placeholder="Your company name"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range *</Label>
                      <Select value={budgetRange} onValueChange={setBudgetRange} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          {budgetRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Attachments (Optional)</Label>
                      <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-indigo-500/50 transition-colors">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, DOC, Images up to 10MB
                          </p>
                        </label>
                      </div>
                      {attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {attachments.map((file, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-muted rounded-full text-sm"
                            >
                              {file}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 gap-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Booking Request"}
                  {!isSubmitting && <Check className="w-4 h-4" />}
                </Button>
              </form>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="border-0 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="pb-4 border-b">
                      <p className="font-medium mb-1">{service.name}</p>
                      <p className="text-sm text-muted-foreground">Base package</p>
                      <p className="text-right font-medium">${service.basePrice.toLocaleString()}</p>
                    </div>
                    
                    {selectedFeatures.length > 0 && (
                      <div className="space-y-2 pb-4 border-b">
                        <p className="text-sm font-medium text-muted-foreground">Add-ons:</p>
                        {selectedFeatures.map((feature) => (
                          <div key={feature.id} className="flex justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <Check className="w-3 h-3 text-emerald-500" />
                              {feature.name}
                            </span>
                            <span>+${feature.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                        <span className="font-semibold">Total</span>
                      </div>
                      <span className="text-2xl font-bold text-indigo-600">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Timeline</span>
                      </div>
                      <span className="font-medium">{totalTime} days</span>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-emerald-50 rounded-xl">
                    <p className="text-sm text-emerald-700 font-medium mb-1">
                      What happens next?
                    </p>
                    <ul className="text-xs text-emerald-600 space-y-1">
                      <li>• We&apos;ll review your request within 24 hours</li>
                      <li>• You&apos;ll receive a detailed proposal</li>
                      <li>• Track progress in real-time</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
