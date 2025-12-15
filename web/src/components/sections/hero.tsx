"use client";

import React from "react";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center md:mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-playfair text-5xl font-bold tracking-tight text-foreground md:text-7xl lg:text-8xl"
          >
            Experience
            <br />
            <span className="text-muted-foreground font-poppins text-4xl md:text-6xl font-light italic">
              Photography
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground font-light"
          >
            Capturing the essence of your most beautiful moments with a touch of elegance and cinematic flair.
          </motion.p>
        </div>

        {/* Accordion / Featured Categories */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.6, duration: 0.8 }}
           className="w-full"
        >
          <div className="mb-8 text-center md:text-left">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Featured Collections
            </h2>
          </div>
          <InteractiveImageAccordion />
        </motion.div>
      </div>
    </section>
  );
}
