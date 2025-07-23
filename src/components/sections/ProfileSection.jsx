// src/components/sections/ProfileSection.jsx
"use client"; // Ini adalah Client Component

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
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

export default function ProfileSection() {
  return (
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
      <CardFooter className="flex flex-col items-start">
        <div>
          <h3 className="text-sm font-semibold">Catatan:</h3>
          <ul className="list-disc text-xs pl-4">
            <li>Booking dilakukan minimal H-1.</li>
            <li>Tidak meninggalkan sampah.</li>
            <li>Kirim dokumentasi kegiatan minimal satu.</li>
            <li>Meninggalkan ruangan dalam keadaan rapih.</li>
          </ul>
        </div>
        {/* Running Text */}
        <div className="w-full mt-4">
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="6"
            className="text-sm text-blue-600 bg-blue-100 p-2 rounded-md"
          > Senin - Jumat: 09.00 - 16.00 | Sabtu: 09.00 - 12.00 | Minggu & Hari Libur: Tutup
          </marquee>
        </div>
      </CardFooter>
    </Card>
  );
}