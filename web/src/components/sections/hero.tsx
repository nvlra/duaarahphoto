"use client";

import React from "react";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
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

        {/* Auto Slider */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.5, duration: 0.8 }}
           className="mb-16 -mx-4 md:mx-0"
        >
          <ImageAutoSlider />
        </motion.div>


      </div>
    </section>
  );
}
