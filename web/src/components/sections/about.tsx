"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function About() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Animation: Smoother transition synchronized with scroll velocity
  // Animation: Smoother transition synchronized with scroll velocity
  const width = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["100%", "48%", "48%", "100%"]);
  // Text Fades In -> Hold -> Fades Out
  const opacityText = useTransform(scrollYProgress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0]);
  
  const yImage = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const yText = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section id="about" ref={containerRef} className="py-32 md:py-40 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col md:flex-row items-start gap-12 md:gap-20 relative">
          {/* Image Side - Animated Width (Wrapped for Stability) */}
          <div className="w-full aspect-square md:aspect-[2/1] relative">
            <motion.div
              style={{ width, y: yImage }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full overflow-hidden rounded-lg z-20"
            >
              <Image
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
                alt="Photographer"
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
            className="w-full md:w-1/2 space-y-6 md:absolute md:right-0 md:top-0 md:mt-10"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              Cinematic. Timeless.<br />
              <span className="italic font-light text-muted-foreground">
                Authentically Yours.
              </span>
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed text-justify md:text-left">
                <p className="text-lg font-light">
                  Enviel Photography stands at the intersection of fine art and documentary storytelling. We are not just photographers; we are visual narrators dedicated to capturing the raw, unscripted beauty of your connection.
                </p>
                <p className="text-lg font-light">
                  Our philosophy is simple: authentic moments resonate loudest. We step back to let your love unfold naturally, ensuring every image we craft is a true reflection of who you are—elegant, emotive, and eternally yours.
                </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
