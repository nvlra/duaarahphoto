import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";

import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";
import { EntranceTransition } from "@/components/ui/entrance-transition";

export default function Home() {
  return (
    <EntranceTransition>
      <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
        <Navbar />
        <Hero />

        <Featured />
        <Pricing />
        <About />
        <Testimonials />
        <Footer />
      </main>
    </EntranceTransition>
  );
}
