import React from "react";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Featured } from "@/components/sections/featured";
import { BrandMarquee } from "@/components/sections/brand-marquee";
import { Pricing } from "@/components/sections/pricing";
import { About } from "@/components/sections/about";

import { Testimonials } from "@/components/sections/testimonials";
import { Footer } from "@/components/sections/footer";
import { HashScrollHandler } from "@/components/ui/hash-scroll-handler";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export const revalidate = 0;

export default async function Home() {
  // Read cookie on server
  const cookieStore = await cookies();
  const hasEntered = cookieStore.get("hasEntered")?.value === "true";

  // Fetch Page Content
  const { data: sections } = await supabase
    .from('page_sections')
    .select('key, content')
    .in('key', ['hero', 'about', 'featured', 'pricing', 'testimonials', 'footer']);

  const heroContent = sections?.find(s => s.key === 'hero')?.content || {};
  const aboutContent = sections?.find(s => s.key === 'about')?.content || {};

  const featuredContent = sections?.find(s => s.key === 'featured')?.content || {};
  const pricingContent = sections?.find(s => s.key === 'pricing')?.content || {};
  const testimonialsContent = sections?.find(s => s.key === 'testimonials')?.content || {};
  const footerContent = sections?.find(s => s.key === 'footer')?.content || {};

  return (
    <>
      <HashScrollHandler />
      <Navbar />
      {/* EntranceTransition removed/disabled logic simplified */}
      <div className={hasEntered ? "" : ""}>
         <main className="min-h-screen bg-background font-sans selection:bg-primary/20">
           <Hero 
             title={heroContent.title}
             subtitle={heroContent.subtitle}
             imageUrl={heroContent.imageUrl}
             ctaText={heroContent.ctaText}
           />

           <About data={aboutContent} />
           <Featured data={featuredContent} />
           <BrandMarquee />
           <Pricing data={pricingContent} />
           <Testimonials data={testimonialsContent} />
           <Footer data={footerContent} />
         </main>
      </div>
    </>
  );
}
