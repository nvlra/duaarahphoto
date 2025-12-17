"use client";

import React, { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { motion } from "framer-motion";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { EntranceTransition } from "@/components/ui/entrance-transition";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { portfolioData } from "@/data/portfolio";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params);

  // Find Project
  let project = null;
  for (const cat of portfolioData) {
    const found = cat.projects.find((p) => p.id === slug);
    if (found) {
      project = found;
      break;
    }
  }

  if (!project) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <EntranceTransition>
      <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900 font-sans selection:bg-primary/20">
        <div className="bg-background rounded-b-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)] relative z-20 pb-24 overflow-hidden min-h-screen">

          {/* Hero Section */}
          <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
             <div className="absolute inset-0 z-0">
               <Image 
                 src={project.coverImage} 
                 alt={project.name} 
                 fill 
                 className="object-cover"
                 priority
               />
               <div className="absolute inset-0 bg-black/40" />
             </div>
             
             <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 text-white space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <p className="text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-2">
                    {project.location} • {project.date}
                  </p>
                  <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                    {project.name}
                  </h1>
                </motion.div>
             </div>
          </section>

          {/* Content Section */}
          <section className="py-24 px-4 max-w-7xl mx-auto">
             <div className="mb-24">
                 <ScrollBasedVelocity 
                    text={`${project.name} — ${project.location} — `} 
                    default_velocity={1} 
                    className="font-playfair font-bold text-6xl md:text-9xl text-muted-foreground/10" 
                  />
             </div>

             {/* Masonry-style Grid */}
             <div className="columns-1 md:columns-2 gap-8 space-y-8">
                {project.images.map((img, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="relative rounded-xl overflow-hidden group mb-8 break-inside-avoid"
                  >
                     <Image
                        src={img}
                        alt={`${project.name} ${i}`}
                        width={800}
                        height={1000} // Aspect ratio will be handled by auto height
                        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                     />
                  </motion.div>
                ))}
             </div>

             {/* Navigation Footer */}
             <div className="mt-32 text-center pb-12 border-t pt-12">
                <p className="text-muted-foreground mb-6 italic">Next Story</p>
                <Link href="/portfolio">
                   <h3 className="font-playfair text-3xl md:text-4xl font-bold hover:underline decoration-1 underline-offset-4 cursor-pointer">
                      View All Projects
                   </h3>
                </Link>
             </div>
          </section>

        </div>
        
        <div className="-mt-20 pt-20">
           <Footer />
        </div>
      </main>
      </EntranceTransition>
      <FloatingThemeToggle />
    </>
  );
}
