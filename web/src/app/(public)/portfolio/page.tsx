"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/sections/navbar";
import { Footer } from "@/components/sections/footer";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { RippleButton } from "@/components/ui/ripple-button";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { supabase } from "@/lib/supabaseClient";
import { Loader2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  slug: string;
  category: string;
  date: string;
  location: string;
  cover_image: string;
  gallery_images: string[];
}

export default function PortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .order('date', { ascending: false }); // Or created_at
            
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchProjects();
  }, []);

  // Derive unique categories
  const categories = useMemo(() => {
      const cats = Array.from(new Set(projects.map(p => p.category).filter(Boolean)));
      return ["All", ...cats];
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
      if (activeCategory === "All") return projects;
      return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-100 dark:bg-neutral-900 font-sans selection:bg-primary/20">
        <div className="bg-background rounded-b-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] dark:shadow-[0_40px_100px_-20px_rgba(255,255,255,0.1)] relative z-20 pb-24 overflow-hidden min-h-screen">

          {/* Hero / Filter Section */}
          <section className="pt-32 pb-12 md:pt-48 md:pb-16 px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-4 tracking-tight">
                Selected Works
              </h1>
            </motion.div>

            {/* Sticky Category Nav */}
            {!loading && (
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex flex-wrap justify-center gap-4 mt-8 sticky top-24 z-30 py-4 bg-background/80 backdrop-blur-sm"
                >
                {categories.map((cat) => (
                    <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                        "px-6 py-2 rounded-full text-base font-medium transition-all duration-300 border font-playfair tracking-wide capitalize",
                        activeCategory === cat
                        ? "bg-foreground text-background border-transparent shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] dark:shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] scale-105"
                        : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground"
                    )}
                    >
                    {cat}
                    </button>
                ))}
                </motion.div>
            )}
          </section>

          {/* Client Projects Loop */}
          <section className="px-4 max-w-7xl mx-auto space-y-32 pb-32">
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    No projects found in this category.
                </div>
            ) : (
                <div className="space-y-32">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="group appear-animate">
                        {/* Project Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border/50 pb-4">
                          <div>
                            <h2 className="font-playfair text-4xl md:text-5xl font-bold tracking-tight">
                              {project.title}
                            </h2>
                            <p className="text-muted-foreground font-sans mt-2 flex items-center gap-2">
                              <span className="uppercase tracking-widest text-xs font-semibold">{project.location}</span>
                              <span className="w-1 h-1 bg-border rounded-full" />
                              <span className="text-sm italic">{project.date}</span>
                            </p>
                          </div>
                          <Link href={`/portfolio/${project.slug}`}>
                            <RippleButton
                              className="rounded-full px-6 py-2 text-sm"
                            >
                              View Full Gallery
                            </RippleButton>
                          </Link>
                        </div>

                        {/* Preview Images Grid */}
                        <div className="flex flex-col gap-4">
                          {/* Preview Section: 1 Row on Desktop */}
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:h-[400px]">
                            {/* Main Cover Image - Takes 2 cols */}
                            {project.cover_image && (
                                <Link href={`/portfolio/${project.slug}`} className="relative col-span-1 md:col-span-2 h-[300px] md:h-full rounded-xl overflow-hidden cursor-pointer group/image">
                                <Image
                                    src={project.cover_image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors" />
                                </Link>
                            )}

                            {/* Preview Images - Take 1 col each */}
                            {(project.gallery_images || []).slice(0, 2).map((img, i) => (
                              <Link href={`/portfolio/${project.slug}`} key={i} className="relative col-span-1 h-[200px] md:h-full rounded-xl overflow-hidden cursor-pointer group/image hidden md:block">
                                <Image
                                  src={img}
                                  alt={`${project.title} ${i}`}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover/image:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
            )}
          </section>

        </div>
        <div className="-mt-20 pt-20">
           <Footer />
        </div>
      </main>
      <FloatingThemeToggle />
    </>
  );
}
