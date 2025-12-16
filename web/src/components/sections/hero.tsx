"use client";

import React from "react";
import NextImage from "next/image";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="bg-background pt-4 pb-10 px-4">
      <div className="w-full relative group">
        
        {/* Rounded Image Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[85vh] md:h-[90vh] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Static Hero Image */}
          <div className="absolute inset-0">
            <NextImage
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Dark Overlay for Text Readability */}
          <div className="absolute inset-0 bg-black/20" />

          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 pt-32 md:pt-0">
             <motion.h1 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5, duration: 0.8 }}
               className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight mb-6 drop-shadow-lg text-left"
             >
                Capturing <br /> <span className="italic font-light">Soulful Moments</span>
             </motion.h1>

             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7, duration: 0.8 }}
               className="font-sans text-lg md:text-xl text-white/90 max-w-xl font-light leading-relaxed drop-shadow-md text-left mb-8"
             >
               Start your visual journey with us. Timeless photography for life&apos;s most precious chapters.
             </motion.p>

             <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-full font-medium hover:bg-white hover:text-black transition-all duration-300"
             >
                View Portfolio
             </motion.button>
          </div>

        </motion.div>

      </div>


    </section>
  );
}
