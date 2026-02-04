"use client";
import { useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export default function AutoCarousel({ data }: { data: any }) {
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      nextRef.current?.click();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex justify-center items-center">
      <Carousel className="w-full rounded-xl overflow-hidden shadow-lg">
        <CarouselContent>
          {data.carousel.map((c: any, index: number) => (
            <CarouselItem key={c.id}>
              <Image
                src={c.banner}
                width={1860}
                height={500}
                alt={`Banner ${index + 1}`}
                className="w-full object-cover"
                priority
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* ปุ่มควบคุม */}
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-50 " />
        <CarouselNext
          className="absolute right-2 top-1/2 -translate-y-1/2 z-50 "
          ref={nextRef}
        />
      </Carousel>
    </div>
  );
}
