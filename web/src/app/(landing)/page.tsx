import React from "react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";

import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";
import { EntranceTransition } from "@/components/ui/entrance-transition";
import { HashScrollHandler } from "@/components/ui/hash-scroll-handler";


export default async function Home() {
  // Read cookie on server
  const cookieStore = await cookies();
  const hasEntered = cookieStore.get("hasEntered")?.value === "true";

  return (
    <>
      <HashScrollHandler />
      <Navbar />
      <EntranceTransition initialEntered={hasEntered}>
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
