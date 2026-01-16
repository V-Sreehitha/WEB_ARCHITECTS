"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Globe, Smartphone, Cloud, Cog, ArrowLeft, ArrowRight,
  Sparkles, LogOut, Check, Clock, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppStore } from "@/lib/store";

const serviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe,
  Smartphone,
  Cloud,
  Cog,
};

const serviceColors: Record<string, string> = {
  "web-dev": "from-indigo-500 to-purple-500",
  "app-dev": "from-emerald-500 to-teal-500",
  "saas": "from-amber-500 to-orange-500",
  "automation": "from-rose-500 to-pink-500",
};

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { currentUser, setCurrentUser, services } = useAppStore();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const service = services.find((s) => s.id === id);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser || !service) {
    return null;
  }

  const Icon = serviceIcons[service.icon] || Globe;
  const colorClass = serviceColors[service.id] || "from-indigo-500 to-purple-500";

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId)
        ? prev.filter((f) => f !== featureId)
        : [...prev, featureId]
    );
  };

  const selectedFeaturesList = service.features.filter((f) =>
    selectedFeatures.includes(f.id)
  );

  const totalPrice = service.basePrice + selectedFeaturesList.reduce((sum, f) => sum + f.price, 0);
  const totalTime = service.baseTime + selectedFeaturesList.reduce((sum, f) => sum + f.time, 0);

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  const handleProceed = () => {
    const queryParams = new URLSearchParams({
      features: selectedFeatures.join(","),
    });
    router.push(`/book/${service.id}?${queryParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/services">
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
              <div className="flex items-start gap-6 mb-8">
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
                  <Icon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
                  <p className="text-lg text-muted-foreground">{service.description}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Select Features</h2>
              <p className="text-muted-foreground mb-6">
                Customize your project by selecting the features you need. Each feature adds to the total cost and timeline.
              </p>

              <div className="space-y-3">
                {service.features.map((feature, index) => {
                  const isSelected = selectedFeatures.includes(feature.id);
                  return (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50/50 shadow-md"
                            : "hover:border-muted-foreground/30"
                        }`}
                        onClick={() => toggleFeature(feature.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleFeature(feature.id)}
                                className="pointer-events-none"
                              />
                              <div>
                                <p className="font-medium">{feature.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="flex items-center gap-1 text-emerald-600">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-medium">+${feature.price.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                <span>+{feature.time} days</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
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
                  <h3 className="text-xl font-bold mb-6">Project Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b">
                      <span className="text-muted-foreground">Base Service</span>
                      <span className="font-medium">${service.basePrice.toLocaleString()}</span>
                    </div>
                    
                    {selectedFeaturesList.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Selected Features:</p>
                        {selectedFeaturesList.map((feature) => (
                          <div key={feature.id} className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-emerald-500" />
                              {feature.name}
                            </span>
                            <span>+${feature.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold">Total Estimate</span>
                      <span className="text-2xl font-bold text-indigo-600">
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Estimated Timeline</span>
                      <span className="font-medium">{totalTime} days</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleProceed}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 gap-2"
                    size="lg"
                  >
                    Proceed to Booking
                    <ArrowRight className="w-4 h-4" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Final pricing may vary based on project requirements
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
