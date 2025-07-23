// src/app/layout.js
// Hapus "use client"; dari baris ini karena file ini akan kembali menjadi Server Component
// import "use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Hapus import useState dan useEffect karena sudah dipindahkan ke LoadingProvider
// import { useState, useEffect } from "react";
// LoadingSpinner tidak lagi diimpor langsung di sini, tapi di LoadingProvider
// import LoadingSpinner from "@/components/LoadingSpinner";

import LoadingProvider from "@/components/providers/LoadingProvider"; // Import LoadingProvider

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "UCH UTY Creative Hub",
  description: "Creativity l Innovation l Technology",
  icons: {
    icon: "/fav.ico",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  // Logic isLoading state dan useEffect dipindahkan ke LoadingProvider
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect(() => { /* ... */ }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Bungkus children dengan LoadingProvider untuk menampilkan loading visual */}
        <LoadingProvider>
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}