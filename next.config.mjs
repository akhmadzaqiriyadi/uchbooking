/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
const nextConfig = {};

const pwaConfig = withPWA({
  dest: 'public', // Direktori output untuk service worker
  register: true, // Daftarkan service worker secara otomatis
  skipWaiting: true, // Aktifkan service worker baru setelah diinstal
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan PWA di development untuk mempermudah debugging
  // Anda bisa menambahkan konfigurasi lain seperti fallbacks, runtimeCaching dll.
});

export default pwaConfig(nextConfig);
