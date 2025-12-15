"use client";

import React from "react";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";
import { RippleButton } from "@/components/ui/ripple-button";
import { motion } from "framer-motion";

export function Featured() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/3 text-center lg:text-left space-y-8"
          >
            <div>
              <h2 className="font-playfair text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                Accelerate Gen-AI <br />
                Tasks on Any Device
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                Build high-performance AI apps on-device without the hassle of model compression or edge deployment.
              </p>
            </div>
            
            <RippleButton className="rounded-lg px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
              Book Now
            </RippleButton>
          </motion.div>

          {/* Right Side: Accordion */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-2/3"
          >
             <div className="flex items-center justify-center lg:justify-end">
                <InteractiveImageAccordion />
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
