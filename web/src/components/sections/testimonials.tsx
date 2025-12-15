"use client";

import React from "react";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "The most magical day of our lives was captured perfectly. The team made us feel so comfortable, and the photos are just breathtaking.",
      name: "Sarah & Michael",
      designation: "Married in Bali, 2024",
      src: "https://images.unsplash.com/photo-1621621667797-e06afc217fb0?q=80&w=3540&auto=format&fit=crop",
    },
    {
    quote:
      "Enviel Creative didn't just take photos; they told our story. Every emotion, every glance, every tear was preserved forever.",
    name: "Jessica & David",
    designation: "Elopement in Swiss Alps",
    src: "https://images.unsplash.com/photo-1623770857664-913b77209930?q=80&w=2070&auto=format&fit=crop",
  },
  {
    quote:
      "The cinematic quality of their work is unmatched. Looking at our wedding album feels like watching a high-end romantic film.",
    name: "Michael & Sarah",
    designation: "Wedding in Bali",
    src: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1974&auto=format&fit=crop",
  },
  {
    quote:
      "We are camera shy, but the team made us feel so comfortable. The candid moments they captured are our absolute favorites.",
    name: "Olivia & William",
    designation: "Pre-wedding in Kyoto",
    src: "https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1974&auto=format&fit=crop",
  },
  {
    quote:
      "Professional, artistic, and truly visionary. They turned our simple garden wedding into a fairytale visual experience.",
    name: "Emily & James",
    designation: "Intimate Wedding in London",
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
  {
    quote:
      "From the first consultation to the final delivery, everything was perfect. The packaging of the prints was the cherry on top!",
    name: "Sophia & Daniel",
    designation: "Wedding in New York",
    src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
  },
  ];

  return (
    <section id="stories" className="bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Testimoni
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Kind words from the beautiful souls we&apos;ve had the privilege to capture.
          </p>
        </div>
        
        <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
      </div>
    </section>
  );
}
