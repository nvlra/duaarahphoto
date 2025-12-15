import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";
import { VelocityScroll } from "@/components/ui/scroll-based-velocity";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <Hero />
      <div className="py-4 md:py-8">
        <VelocityScroll
          text="Enviel Creative"
          default_velocity={3}
          className="font-playfair text-center text-4xl font-bold tracking-[-0.02em] text-foreground drop-shadow-sm md:text-7xl md:leading-20"
        />
      </div>
      <Featured />
      <Pricing />
      <About />
      <Testimonials />
      <Footer />
    </main>
  );
}
