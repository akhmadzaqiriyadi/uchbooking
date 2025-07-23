// src/components/InstallPWAButton.jsx
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; // Menggunakan komponen Button Anda

export default function InstallPWAButton() {
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      // Mencegah prompt native browser muncul secara otomatis
      event.preventDefault();
      // Simpan event untuk digunakan nanti saat tombol diklik
      setInstallPrompt(event);
    };

    // Tambahkan event listener saat komponen di-mount
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Bersihkan event listener saat komponen di-unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []); // [] agar listener hanya didaftarkan sekali

  const handleInstallClick = () => {
    if (installPrompt) {
      // Tampilkan prompt instalasi PWA native dari browser
      installPrompt.prompt();

      // Lacak pilihan pengguna (diterima atau ditolak)
      installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Pengguna menerima instalasi PWA');
        } else {
          console.log('Pengguna menolak instalasi PWA');
        }
        // Bersihkan prompt setelah digunakan agar tombol tidak muncul lagi
        setInstallPrompt(null);
      });
    }
  };

  // Hanya render tombol jika event beforeinstallprompt tersedia
  // (artinya, PWA bisa diinstal di browser saat ini)
  if (!installPrompt) {
    return null;
  }

  return (
    <Button
      onClick={handleInstallClick}
      className="fixed bottom-4 right-4 z-50 bg-blue-900 hover:bg-blue-950 text-white shadow-lg"
    >
      Instal Aplikasi
    </Button>
  );
}