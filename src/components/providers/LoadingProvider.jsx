// src/components/providers/LoadingProvider.jsx
"use client"; // Ini adalah Client Component

import { useState, useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner"; // Import LoadingSpinner di sini

export default function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulasikan loading selama 2 detik
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Sesuaikan durasi sesuai kebutuhan

    return () => clearTimeout(timer); // Bersihkan timer saat komponen di-unmount
  }, []);

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Tampilkan spinner jika isLoading true */}
      {children}
    </>
  );
}