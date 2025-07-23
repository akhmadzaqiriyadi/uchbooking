// src/components/LoadingSpinner.jsx
"use client"; // Tambahkan ini karena kita akan menggunakan useState dan useEffect
import Image from "next/image";
import { useState, useEffect } from "react"; // Import useState dan useEffect

export default function LoadingSpinner() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        }
        return "";
      });
    }, 300); // Ganti setiap 300ms

    return () => clearInterval(interval); // Bersihkan interval
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 bg-opacity-95">
      <Image
        src="/images/logo.png"
        alt="Memuat..."
        width={250} // Sesuaikan ukuran sesuai kebutuhan
        height={250} // Sesuaikan ukuran sesuai kebutuhan
        className="animate-pulse" // Animasi berdenyut sederhana untuk logo
      />
      <p className="mt-4 text-xl font-semibold text-blue-950">
        Memuat{dots}
      </p>
    </div>
  );
}