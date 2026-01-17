import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { ChatWidget } from "@/components/chat-widget";
import { StoreProvider } from "@/components/store-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TechFlow - IT Service Booking Platform",
  description: "Book IT services like website development, mobile apps, SaaS platforms, and business automation with transparent pricing and real-time tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="cde9f84d-d8fe-4890-ad0f-7e67657880e4"
        />
        <StoreProvider>
          {children}
          <ChatWidget />
        </StoreProvider>
        <Toaster position="top-right" richColors />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
