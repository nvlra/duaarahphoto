"use client";

import React from "react";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";

import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";
import { EntranceTransition } from "@/components/ui/entrance-transition";


export default function Home() {
  // Handle scroll to hash on mount (for navigation from other pages)
  React.useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const targetId = hash.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        // Small timeout to ensure layout is ready
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <EntranceTransition>
        <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
          <Hero />

          <About />
          <Featured />
          <BrandMarquee />
          <Pricing />
          <Testimonials />
          <Footer />

        </main>
      </EntranceTransition>
    </>
  );
}
