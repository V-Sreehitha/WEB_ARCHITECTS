"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Cloud,
  Cog,
  ArrowRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Globe,
    title: "Website Development",
    description: "Custom websites with modern designs and responsive layouts",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform apps for iOS and Android",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Cloud,
    title: "SaaS Development",
    description: "Scalable cloud platforms with subscription management",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Cog,
    title: "Business Automation",
    description: "Streamline workflows with custom automation solutions",
    color: "from-rose-500 to-pink-500",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechFlow</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#services"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                How It Works
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden glass-card border-t"
          >
            <div className="px-4 py-4 space-y-3">
              <a href="#services" className="block py-2 text-muted-foreground">
                Services
              </a>
              <a
                href="#how-it-works"
                className="block py-2 text-muted-foreground"
              >
                How It Works
              </a>
              <div className="pt-3 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" /> Streamlined IT Service Booking
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Book IT Services
                <span className="gradient-text block">Like Never Before</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Browse services, select features, see estimates, and track your
                project — all in one place. No more confusion or endless emails.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 gap-2"
                  >
                    Start Booking <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Animation/Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden lg:flex justify-center"
            >
              
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our range of professional IT services and customize
              them to fit your needs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <div
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <service.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                    <p className="text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        className="py-20 bg-gradient-to-r from-indigo-50 to-purple-50"
        id="how-it-works"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Booking IT services has never been easier. Just follow these simple steps and get your project started in minutes.
            </p>
          </motion.div>

          {/* Horizontal Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row justify-between items-start gap-6"
          >
            {[
              {
                step: "01",
                title: "Browse Services",
                desc: "Discover our full range of IT solutions, from websites to mobile apps, SaaS, and automation.",
              },
              {
                step: "02",
                title: "Select Features",
                desc: "Customize your project by choosing the exact features you need.",
              },
              {
                step: "03",
                title: "Submit Your Request",
                desc: "Fill out a simple form with your project details and send your request instantly.",
              },
              {
                step: "04",
                title: "Track & Collaborate",
                desc: "Monitor progress in real-time, communicate with your team, and approve milestones with ease.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex-1 flex flex-col items-center text-center p-6 bg-white/30 backdrop-blur rounded-xl shadow-lg"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

     <footer className="py-6 text-center" style={{ 
  background: "linear-gradient(90deg, #F3F9F4 0%, #DAF0E3 100%)"
}}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  
    <p className="text-gray-700 text-sm font-medium">
      © Jan, 2026 <span className="font-semibold">TechFlow</span> · Done by <span className="font-semibold">WEB ARCHITECTS</span>
    </p>
  </div>
</footer>


    </div>
  );
}
