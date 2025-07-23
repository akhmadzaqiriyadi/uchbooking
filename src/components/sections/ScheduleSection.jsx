// src/components/sections/ScheduleSection.jsx
"use client";

import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

export default function ScheduleSection({ currentDate }) {
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(null);
  const [scheduleData, setScheduleData] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);

  // Fetch schedule data when schedule date changes
  useEffect(() => {
    if (selectedScheduleDate) {
      const formattedDate = format(selectedScheduleDate, "yyyy-MM-dd");
      console.log("Fetching schedule for date:", formattedDate);
      fetchScheduleData(formattedDate);
    }
  }, [selectedScheduleDate]);

  async function fetchScheduleData(date) {
    try {
      setScheduleLoading(true);
      console.log(`Fetching schedule data for ${date}`);
      const res = await fetch(`/api/schedule?date=${date}`);

      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }

      const data = await res.json();
      console.log("Schedule data response:", data);

      if (data.success) {
        setScheduleData(data.bookings);
      } else {
        console.error("API returned error:", data.message);
        setScheduleData([]);
      }
    } catch (error) {
      console.error("Error fetching schedule data:", error);
      setScheduleData([]);
    } finally {
      setScheduleLoading(false);
    }
  }

  // Group schedule data by room
  const scheduleByRoom = scheduleData.reduce((acc, booking) => {
    if (!acc[booking.room]) {
      acc[booking.room] = [];
    }
    acc[booking.room].push(booking);
    return acc;
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle className="-ml-2">Jadwal Ruangan</CardTitle>
        <CardDescription className="-ml-2">
          Lihat jadwal penggunaan ruangan
        </CardDescription>
      </CardHeader>
      <CardContent className="mx-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="scheduleDate">Pilih Tanggal</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="scheduleDate"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedScheduleDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedScheduleDate ? (
                    format(selectedScheduleDate, "PPP")
                  ) : (
                    <span>Pilih Tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedScheduleDate}
                  onSelect={setSelectedScheduleDate}
                  fromDate={currentDate} // Restrict past dates
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {scheduleLoading ? (
            <div className="flex justify-center py-8">
              <p>Memuat jadwal...</p>
            </div>
          ) : selectedScheduleDate ? (
            Object.keys(scheduleByRoom).length > 0 ? (
              <div className="space-y-6">
                {Object.keys(scheduleByRoom).map((room) => (
                  <div key={room} className="space-y-2">
                    <h3 className="text-md font-semibold">{room}</h3>
                    <div className="bg-gray-50 rounded-md p-3">
                      {scheduleByRoom[room].map((booking, idx) => (
                        <div
                          key={idx}
                          className="py-2 border-b last:border-b-0"
                        >
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">
                              {booking.startTime} - {booking.endTime}
                            </div>
                            <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {booking.name}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {booking.purpose}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Tidak ada booking untuk tanggal ini
                </p>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Pilih tanggal untuk melihat jadwal
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}