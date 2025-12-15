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
      src: "https://images.unsplash.com/photo-1623162744158-9ff1266db095?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Professional, artistic, and truly attentive to detail. The album we received is a masterpiece we will cherish for generations.",
      name: "Emily & James",
      designation: "Wedding in Tuscany",
      src: "https://images.unsplash.com/photo-1590337856372-97dc0227289d?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "From the engagement shoot to the final dance, they were amazing. The cinematic video highlight reel still makes us cry happy tears.",
      name: "Olivia & William",
      designation: "Destination Wedding, Paris",
      src: "https://images.unsplash.com/photo-1583939003579-73013917c7ce?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "We couldn't have asked for a better team. They blended in seamlessly and captured candid moments we didn't even know happened.",
      name: "Sophia & Benjamin",
      designation: "Intimate Ceremony, Kyoto",
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=3540&auto=format&fit=crop",
    },
  ];

  return (
    <section id="stories" className="bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Love Notes
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
