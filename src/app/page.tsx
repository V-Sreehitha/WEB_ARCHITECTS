"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Globe, Smartphone, Cloud, Cog, ArrowRight, CheckCircle2, 
  Sparkles, Users, Clock, Shield, Menu, X
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

const features = [
  { icon: CheckCircle2, title: "Transparent Pricing", description: "See cost estimates upfront" },
  { icon: Clock, title: "Clear Timelines", description: "Know exactly when to expect delivery" },
  { icon: Users, title: "Expert Teams", description: "Dedicated professionals for your project" },
  { icon: Shield, title: "Quality Assured", description: "Rigorous testing and support" },
];

const testimonials = [
  { name: "Sarah Chen", role: "Startup Founder", text: "The booking process was seamless. Got my MVP delivered on time!" },
  { name: "Michael Torres", role: "E-commerce Owner", text: "Finally, a platform where I can see exactly what I'm paying for." },
  { name: "Emily Johnson", role: "Marketing Director", text: "The real-time tracking feature kept us informed throughout." },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">TechFlow</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-muted-foreground hover:text-foreground transition-colors">Services</a>
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
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
              <a href="#services" className="block py-2 text-muted-foreground">Services</a>
              <a href="#features" className="block py-2 text-muted-foreground">Features</a>
              <a href="#testimonials" className="block py-2 text-muted-foreground">Testimonials</a>
              <div className="pt-3 space-y-2">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600">Get Started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      <section className="relative pt-32 pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Streamlined IT Service Booking
              </span>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Book IT Services
                <span className="gradient-text block">Like Never Before</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Browse services, select features, see estimates, and track your project — all in one place. No more confusion or endless emails.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 gap-2">
                    Start Booking <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/login?role=admin">
                  <Button size="lg" variant="outline" className="gap-2">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative float-animation"
            >
              <div className="relative glass-card rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Project Status</span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">In Progress</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">E-commerce Website</h3>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">65% Complete</span>
                  <span className="text-muted-foreground">Est. 5 days left</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Design Approved</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

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
              Choose from our range of professional IT services and customize them to fit your needs
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
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
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

     
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">How It Works</h2>
              <div className="space-y-6">
                {[
                  { step: "01", title: "Browse Services", desc: "Explore our range of IT services and find what fits your needs" },
                  { step: "02", title: "Select Features", desc: "Customize your project by selecting specific features" },
                  { step: "03", title: "Submit Request", desc: "Fill in your project details and submit your booking" },
                  { step: "04", title: "Track Progress", desc: "Monitor your project status in real-time" },
].map((item) => (
                    <div key={item.step} className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-8"
            >
              <h3 className="text-2xl font-bold mb-6">Quick Estimate</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <span>Website Development</span>
                  <span className="font-semibold">From $2,000</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <span>Mobile App</span>
                  <span className="font-semibold">From $5,000</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <span>SaaS Platform</span>
                  <span className="font-semibold">From $8,000</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                  <span>Automation</span>
                  <span className="font-semibold">From $3,000</span>
                </div>
              </div>
              <Link href="/signup">
                <Button className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600">
                  Get Detailed Quote
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 bg-card/50 backdrop-blur">
                  <CardContent className="p-6">
                    <p className="text-lg mb-6 text-muted-foreground">&quot;{testimonial.text}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join hundreds of satisfied clients and streamline your IT project booking today
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-indigo-500 to-purple-600 gap-2">
                  Create Free Account <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">TechFlow</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 TechFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
