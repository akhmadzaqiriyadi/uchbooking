"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function CreativeHubPage() {
  const [formData, setFormData] = useState({
    name: "",
    npm: "",
    prodi: "",
    email: "",
    purpose: "",
    date: "",
    startTime: "",
    endTime: "",
    room: "",
    audience: "",
  });

  const [date, setDate] = useState(null);
  const [operatingHours, setOperatingHours] = useState({ start: 0, end: 0 });
  const [bookedRanges, setBookedRanges] = useState([]);
  const [availableIntervals, setAvailableIntervals] = useState([]);
  const [availableStartTimes, setAvailableStartTimes] = useState([]);
  const [availableEndTimes, setAvailableEndTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fullyBooked, setFullyBooked] = useState(false);

  // Update formData when date changes
  useEffect(() => {
    if (date) {
      const formattedDate = format(date, "yyyy-MM-dd");
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  }, [date]);

  useEffect(() => {
    if (formData.date && formData.room) {
      fetchAvailability(formData.date, formData.room);
    }
  }, [formData.date, formData.room]);

  async function fetchAvailability(date, room) {
    try {
      setMessage("");
      const res = await fetch(`/api/available-slots?date=${date}&room=${room}`);
      const data = await res.json();
      if (data.success) {
        setOperatingHours(data.operatingHours);
        setBookedRanges(data.bookedRanges);
        setAvailableIntervals(data.availableIntervals);
        setFullyBooked(data.availableIntervals.length === 0);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
    }
  }

  useEffect(() => {
    const startTimes = [];
    availableIntervals.forEach((interval) => {
      for (let hour = interval.start; hour < interval.end; hour++) {
        startTimes.push(`${hour}:00`);
      }
    });
    startTimes.sort((a, b) => parseInt(a) - parseInt(b));
    setAvailableStartTimes(startTimes);
  }, [availableIntervals]);

  useEffect(() => {
    if (formData.startTime && availableIntervals.length > 0) {
      const selectedHour = parseInt(formData.startTime.split(":")[0], 10);
      const currentInterval = availableIntervals.find(
        (interval) =>
          selectedHour >= interval.start && selectedHour < interval.end
      );
      if (currentInterval) {
        const endTimes = [];
        for (let hour = selectedHour + 1; hour <= currentInterval.end; hour++) {
          endTimes.push(`${hour}:00`);
        }
        setAvailableEndTimes(endTimes);
      } else {
        setAvailableEndTimes([]);
      }
    } else {
      setAvailableEndTimes([]);
    }
  }, [formData.startTime, availableIntervals]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoomChange = (value) => {
    setFormData({ ...formData, room: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.startTime || !formData.endTime) {
      setMessage("Pilih waktu mulai dan selesai dengan benar.");
      setLoading(false);
      return;
    }

    const startHour = parseInt(formData.startTime.split(":")[0], 10);
    const endHour = parseInt(formData.endTime.split(":")[0], 10);
    if (endHour <= startHour) {
      setMessage("Waktu selesai harus lebih dari waktu mulai.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        alert(
          "Booking berhasil! Informasi persetujuan akan dikirim via email."
        );
        window.location.reload();
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setMessage("Gagal melakukan booking!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="container max-w-xl mx-auto px-6 py-12 bg-white shadow-md rounded-md">
        <div className="flex justify-center items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="UCH UTY Creative Hub Logo"
            width={300}
            height={300}
          />
        </div>
        <Tabs defaultValue="profil" className="w-full flex flex-col mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profil">Profil</TabsTrigger>
            <TabsTrigger value="booking">Booking</TabsTrigger>
          </TabsList>

          <TabsContent value="profil">
            <Card>
              <CardHeader>
                <CardTitle className="text-blue-950">
                  Tentang UCH UTY Creative Hub
                </CardTitle>
                <CardDescription>
                  Informasi tentang fasilitas dan ruangan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Carousel
                  className="w-full"
                  plugins={[
                    Autoplay({
                      delay: 2000,
                    }),
                  ]}
                >
                  <CarouselContent>
                    {[
                      "/images/room1.png",
                      "/images/room2.png",
                      "/images/room3.png",
                    ].map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <Card>
                            <CardContent>
                              <div className="relative w-full aspect-[16/9]">
                                <Image
                                  src={src}
                                  alt={`Creative Hub Image ${index + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-cover rounded-md"
                                  priority={index === 0}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </CardContent>
              <CardFooter>
                <div>
                  <h3 className="text-base font-semibold">Jam Operasional</h3>
                  <ul className="list-disc text-sm pl-4">
                    <li>Senin - Jumat: 09.00 - 16.00</li>
                    <li>Sabtu: 09.00 - 12.00</li>
                    <li>Minggu & Hari Libur: Tutup</li>
                  </ul>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <CardTitle className="-ml-2">Form Booking Ruangan</CardTitle>
                <CardDescription className="-ml-2">
                  Isi formulir untuk mengajukan booking ruangan
                </CardDescription>
              </CardHeader>
              <CardContent className="mx-2">
                {message && (
                  <p className="text-sm text-center mb-4">{message}</p>
                )}

                {fullyBooked ? (
                  <div className="text-center">
                    <p className="text-red-500 mb-4">
                      Semua jam sudah terisi penuh, silakan pilih tanggal lain.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => (window.location.href = "/")}
                    >
                      Back to Home
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama</Label>
                        <Input
                          id="name"
                          type="text"
                          name="name"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="npm">NPM</Label>
                        <Input
                          id="npm"
                          type="text"
                          name="npm"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="prodi">Program Studi</Label>
                        <Input
                          id="prodi"
                          type="text"
                          name="prodi"
                          required
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          name="email"
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">Keperluan</Label>
                      <Textarea
                        id="purpose"
                        name="purpose"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Tanggal</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pilih Tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="room">Ruangan</Label>
                        <Select onValueChange={handleRoomChange}>
                          <SelectTrigger id="room">
                            <SelectValue placeholder="Pilih Ruangan" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Think Tank Room">
                              Think Tank Room
                            </SelectItem>
                            <SelectItem value="Prototyping Room">
                              Prototyping Room
                            </SelectItem>
                            <SelectItem value="Coworking Space">
                              Coworking Space
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Waktu Mulai</Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({ ...formData, startTime: value })
                          }
                        >
                          <SelectTrigger id="startTime">
                            <SelectValue placeholder="Pilih Waktu Mulai" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStartTimes.map((slot, index) => (
                              <SelectItem key={index} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">Waktu Selesai</Label>
                        <Select
                          onValueChange={(value) =>
                            setFormData({ ...formData, endTime: value })
                          }
                        >
                          <SelectTrigger id="endTime">
                            <SelectValue placeholder="Pilih Waktu Selesai" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableEndTimes.map((slot, index) => (
                              <SelectItem key={index} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="audience">Banyak Audiens (Max 15)</Label>
                      <Input
                        id="audience"
                        type="number"
                        name="audience"
                        max="15"
                        required
                        onChange={handleChange}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading || fullyBooked}
                      className="w-full bg-blue-950"
                    >
                      {loading ? "Memproses..." : "Ajukan Booking"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}