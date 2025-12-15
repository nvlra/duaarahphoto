import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />
      <Hero />
      <Featured />
      <About />
      <Testimonials />
      <Footer />
    </main>
  );
}
