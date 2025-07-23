// src/app/page.js
"use client";
// Semua import komponen UI yang spesifik untuk form booking atau carousel profil sekarang dipindahkan ke komponen section masing-masing.
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
import { cn } from "@/lib/utils"; // cn masih digunakan untuk Tabs
// import Autoplay from "embla-carousel-autoplay";
// import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
// import { Card, CardContent, CardDescription, CardHeader, CardFooter, CardTitle } from "@/components/ui/card";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { Label } from "@/components/ui/label";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image"; // Image masih digunakan untuk logo di luar section
import { useState } from "react"; // useState masih digunakan untuk currentDate

// prodiData sekarang diimpor di BookingFormSection
// import { prodiData } from "@/constants/prodiData";

// Import komponen section baru
import ProfileSection from "@/components/sections/ProfileSection";
import ScheduleSection from "@/components/sections/ScheduleSection";
import BookingFormSection from "@/components/sections/BookingFormSection"; // Import BookingFormSection
import InstallPWAButton from '@/components/InstallPWAButton'; 

export default function CreativeHubPage() {
  // Semua state dan fungsi yang terkait dengan form booking dipindahkan ke BookingFormSection.jsx
  // const [formData, setFormData] = useState({ /* ... */ });
  // const [date, setDate] = useState(null);
  // const [operatingHours, setOperatingHours] = useState({ /* ... */ });
  // const [bookedRanges, setBookedRanges] = useState([]);
  // const [availableIntervals, setAvailableIntervals] = useState([]);
  // const [availableStartTimes, setAvailableStartTimes] = useState([]);
  // const [availableEndTimes, setAvailableEndTimes] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState("");
  // const [fullyBooked, setFullyBooked] = useState(false);
  // const [scheduleData, setScheduleData] = useState([]);
  // const [scheduleLoading, setScheduleLoading] = useState(false);

  // Set current date for restricting past dates. Ini tetap di sini karena bisa digunakan oleh ScheduleSection dan BookingFormSection.
  const currentDate = new Date();

  // Semua useEffects dan fungsi yang terkait dengan booking form sekarang dipindahkan ke komponen section masing-masing.
  // useEffect(() => { /* ... */ }, [date]);
  // useEffect(() => { /* ... */ }, [formData.date, formData.room]);
  // useEffect(() => { /* ... */ }, [selectedScheduleDate]); // ini sudah dipindah ke ScheduleSection
  // async function fetchScheduleData(date) { /* ... */ } // ini sudah dipindah ke ScheduleSection
  // async function fetchAvailability(date, room) { /* ... */ }
  // useEffect(() => { /* ... */ }, [availableIntervals]);
  // useEffect(() => { /* ... */ }, [formData.startTime, availableIntervals]);
  // const handleChange = (e) => { /* ... */ };
  // const handleRoomChange = (value) => { /* ... */ };
  // const handleSubmit = async (e) => { /* ... */ };
  // const scheduleByRoom = scheduleData.reduce((acc, booking) => { /* ... */ }); // ini sudah dipindah ke ScheduleSection

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container max-w-xl mx-auto px-6 py-12 bg-white shadow-md rounded-md">
        {/* Header Logo Section */}
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="UCH UTY Creative Hub Logo"
            width={300}
            height={300}
          />
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="profil" className="w-full flex flex-col mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="jadwal">Jadwal</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          {/* Profile Tab Content menggunakan komponen ProfileSection */}
          <TabsContent value="profil">
            <ProfileSection />
          </TabsContent>

          {/* Schedule Tab Content menggunakan komponen ScheduleSection */}
          <TabsContent value="jadwal">
            <ScheduleSection currentDate={currentDate} />
          </TabsContent>

          {/* Booking Form Tab Content menggunakan komponen BookingFormSection */}
          <TabsContent value="booking">
            {/* Teruskan currentDate ke BookingFormSection */}
            <BookingFormSection currentDate={currentDate} />
          </TabsContent>
        </Tabs>
      </div>
      <InstallPWAButton />
    </div>
  );
}