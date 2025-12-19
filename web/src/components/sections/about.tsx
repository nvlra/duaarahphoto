"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface AboutProps {
  data?: {
    title?: string;
    content?: string;
    imageUrl?: string;
  };
}

export function About({ data }: AboutProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring config for buttery transitions
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);

  // Animation: Smoother transition synchronized with scroll velocity
  const width = useTransform(smoothProgress, [0, 0.3, 0.7, 1], ["100%", "48%", "48%", "100%"]);
  // Text Fades In -> Hold -> Fades Out
  const opacityText = useTransform(smoothProgress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]);
  
  const yImage = useTransform(smoothProgress, [0, 1], [0, 50]);
  const yText = useTransform(smoothProgress, [0, 1], [0, -50]);

  const defaultImage = "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop";
  const defaultTitle = `Cinematic. Timeless.<br /><span class="italic font-light text-muted-foreground">Authentically Yours.</span>`;
  const defaultContent = `
    <p>Enviel Photography stands at the intersection of fine art and documentary storytelling. We are not just photographers; we are visual narrators dedicated to capturing the raw, unscripted beauty of your connection.</p>
    <br/>
    <p>Our philosophy is simple: authentic moments resonate loudest. We step back to let your love unfold naturally, ensuring every image we craft is a true reflection of who you are—elegant, emotive, and eternally yours.</p>
  `;

  return (
    <section id="about" ref={containerRef} className="py-32 md:py-40 bg-secondary/30 dark:bg-transparent">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 relative">
          {/* Image Side - Animated Width (Wrapped for Stability) */}
          <div className="w-full aspect-video md:aspect-[2/1] relative">
            <motion.div
              style={{ width, y: yImage }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-1/2 -translate-x-1/2 top-0 h-full overflow-hidden rounded-xl z-20 shadow-2xl border border-white/10 md:left-0 md:translate-x-0"
            >
              <Image
                src={data?.imageUrl || defaultImage}
                alt="About Enviel"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>

          {/* Text Side - Fades In/Out */}
          <motion.div
            style={{ y: yText, opacity: opacityText }}
            viewport={{ once: false, margin: "-100px" }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full md:w-1/2 space-y-6 mt-16 md:absolute md:right-0 md:top-0 md:mt-10 text-center md:text-left"
          >
            <div 
                className="font-playfair text-2xl md:text-5xl font-bold leading-tight tracking-tight max-w-none [&_span]:text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: data?.title || defaultTitle }}
            />
            <div 
                className="space-y-6 text-muted-foreground leading-relaxed text-center md:text-left text-sm md:text-base max-w-none"
                dangerouslySetInnerHTML={{ __html: data?.content || defaultContent }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
