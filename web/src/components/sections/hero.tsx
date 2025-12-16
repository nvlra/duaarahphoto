"use client";

import React from "react";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-background pt-32 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto relative group">
        
        {/* Rounded Image Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[80vh] md:h-[85vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Image Slider */}
          <div className="absolute inset-0">
             <ImageAutoSlider />
          </div>

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/30 md:bg-black/20" />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 pb-20 md:pb-6 pt-32 md:pt-0">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-6 drop-shadow-lg"
             >
                Capturing <br /> <span className="italic font-light">Soulful Moments</span>
             </motion.h1>

             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7, duration: 0.8 }}
               className="font-sans text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
             >
               Start your visual journey with us. Timeless photography for life&apos;s most precious chapters.
             </motion.p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
