"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, Smartphone, Cloud, Cog, ArrowRight, ArrowLeft, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { useEffect } from "react";
 
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

export default function ServicesPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, services } = useAppStore();

  useEffect(() => {
    if (!currentUser || currentUser.role !== "client") {
      router.push("/login");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    setCurrentUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 glass-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Choose a Service</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the IT service that best fits your needs. You&apos;ll be able to customize features and see pricing in the next step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, index) => {
              const Icon = serviceIcons[service.icon] || Globe;
              const colorClass = serviceColors[service.id] || "from-indigo-500 to-purple-500";
              
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/services/${service.id}`}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-card/50 overflow-hidden">
                      <CardContent className="p-8">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                        <p className="text-muted-foreground mb-6">{service.description}</p>
                        
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <p className="text-sm text-muted-foreground">Starting from</p>
<p className="text-2xl font-bold text-indigo-600">
                                {formatPrice(service.basePrice)}
                              </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Est. timeline</p>
                            <p className="text-lg font-semibold">{service.baseTime} days</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-4 border-t">
                          <span className="text-sm text-muted-foreground">
                            {service.features.length} customizable features
                          </span>
                          <div className="flex items-center gap-2 text-indigo-600 font-medium">
                            Configure
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
