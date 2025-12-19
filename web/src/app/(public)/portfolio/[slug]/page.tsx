"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { motion } from "framer-motion";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { Lightbox } from "@/components/ui/lightbox";
import { ScrollBasedVelocity } from "@/components/ui/scroll-based-velocity";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  location: string;
  description: string;
  cover_image: string;
  gallery_images: string[];
}

export default function ProjectPage({ params }: Props) {
  const { slug } = use(params);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
             console.error("Error fetching project:", error);
             setProject(null);
        } else {
             setProject(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
        fetchProject();
    }
  }, [slug]);

  if (loading) {
      return (
          <div className="min-h-screen bg-background flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
      );
  }

  if (!project) {
    notFound();
  }

  // Ensure gallery_images is array
  const gallery = project.gallery_images || [];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900 font-sans selection:bg-primary/20">
        <div className="bg-background rounded-b-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)] relative z-20 pb-24 overflow-hidden min-h-screen">

          {/* Hero Section */}
          <section className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
             <div className="absolute inset-0 z-0">
               {project.cover_image && (
                   <Image 
                     src={project.cover_image} 
                     alt={project.title} 
                     fill 
                     className="object-cover"
                     priority
                   />
               )}
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
                    {project.title}
                  </h1>
                </motion.div>
             </div>
          </section>

          {/* Content Section */}
          <section className="py-24 px-4 max-w-7xl mx-auto">
             <div className="mb-24 space-y-12">
                 <ScrollBasedVelocity 
                    text={`${project.title} — ${project.location} — `} 
                    default_velocity={1} 
                    className="font-playfair font-bold text-6xl md:text-9xl text-muted-foreground/10" 
                  />
                 
                 {/* Description */}
                 {project.description && (
                     <div 
                        className="max-w-3xl mx-auto text-lg md:text-xl text-center leading-relaxed font-light text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: project.description }}
                     />
                 )}
             </div>

             {/* Masonry-style Grid */}
             {gallery.length > 0 ? (
                 <div className="columns-1 md:columns-2 gap-8 space-y-8">
                    {gallery.map((img, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="relative rounded-xl overflow-hidden group mb-8 break-inside-avoid cursor-pointer"
                        onClick={() => setSelectedImageIndex(i)}
                      >
                         <Image
                            src={img}
                            alt={`${project.title} ${i}`}
                            width={800}
                            height={1000}
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                         />
                         {/* Hover Overlay */}
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                           <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium tracking-wider">
                             Click to view
                           </span>
                         </div>
                      </motion.div>
                    ))}
                 </div>
             ) : (
                 <div className="text-center py-20 text-muted-foreground">
                     No gallery images found for this project.
                 </div>
             )}

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
      
      {/* Lightbox */}
      {gallery.length > 0 && (
          <Lightbox
            images={gallery}
            selectedIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
            onNavigate={(index) => setSelectedImageIndex(index)}
            projectName={project.title}
          />
      )}
      
      <FloatingThemeToggle />
    </>
  );
}
