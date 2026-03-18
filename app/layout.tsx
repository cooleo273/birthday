import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import SurpriseOverlay from "@/components/features/SurpriseOverlay";
import EasterEggDetector from "@/components/features/EasterEggDetector";
import MusicPlayer from "@/components/ui/MusicPlayer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hana's Birthday Journey 💖",
  description: "A magical 60-day romantic adventure made just for Hana",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

import PageTransition from "@/components/layout/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background text-foreground transition-colors duration-500`}>
        <PageTransition>
          {children}
        </PageTransition>
        <MusicPlayer />
        <SurpriseOverlay />
        <EasterEggDetector />
        <Navbar />
      </body>
    </html>
  );
}
