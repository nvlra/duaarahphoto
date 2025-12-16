"use client";

import React from "react";
import NextImage from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { RippleButton } from "@/components/ui/ripple-button";

export function Hero() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  // Parallax effect: Move image slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  return (
    <section ref={containerRef} className="bg-background pt-3 pb-3 px-3">
      <div className="w-full relative group">
        
        {/* Rounded Image Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-[85vh] md:h-[calc(100vh-2rem)] rounded-[2rem] overflow-hidden shadow-xl"
        >
          {/* Parallax Hero Image */}
          <motion.div style={{ y }} className="absolute inset-0 h-[120%] -top-[10%]">
            <NextImage
              src="https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1974&auto=format&fit=crop"
              alt="Hero Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Cinematic Wash Overlay (Super thin) */}
          <div className="absolute inset-0 bg-black/5" />
          
          {/* Text Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-start pt-[20vh]">
            <div className="mx-auto w-full max-w-7xl px-1 md:px-1 lg:px-1">
               <motion.h1 
                 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                 transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
                 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight text-neutral-800 leading-tight mb-6 drop-shadow-sm text-left dark:text-neutral-100"
               >
                  Capturing <br /> 
                  <span className="font-bold">Soulful </span>
                  <span className="italic font-light text-neutral-800/50 dark:text-white/50">Moments</span>
               </motion.h1>

               <motion.p 
                 initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                 transition={{ delay: 0.7, duration: 1.0, ease: "easeOut" }}
                 className="font-sans text-lg md:text-xl text-neutral-600 max-w-xl font-medium leading-relaxed drop-shadow-sm text-left mb-8 dark:text-neutral-300"
               >
                 Start your visual journey with us. Timeless photography for life&apos;s most precious chapters.
               </motion.p>

               <motion.div
                  initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ delay: 0.9, duration: 1.0, ease: "easeOut" }}
               >
                  <RippleButton className="px-7 py-3 bg-neutral-900 text-white border border-transparent rounded-full font-medium hover:bg-black/80 transition-all duration-300 shadow-lg text-sm dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
                      Contact Us
                  </RippleButton>
               </motion.div>
            </div>
          </div>

        </motion.div>

      </div>


    </section>
  );
}
