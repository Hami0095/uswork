import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "Upwork Agency Operator",
  description: "Premium internal SaaS platform for managing Upwork freelancer profiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <SidebarProvider>
          <AppSidebar />
          <main className="flex-1 w-full">
            <SidebarTrigger className="m-4 lg:hidden" />
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
