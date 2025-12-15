"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 relative aspect-3/4 md:aspect-4/5 overflow-hidden rounded-lg"
          >
            <Image
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
              alt="Photographer"
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 space-y-6"
          >
            <h2 className="font-playfair text-4xl md:text-5xl font-bold">
              Cinematic. Timeless.<br />
              <span className="italic font-light text-muted-foreground">
                Authentically Yours.
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Enviel Photography stands at the intersection of fine art and documentary storytelling. We are not just photographers; we are visual narrators dedicated to capturing the raw, unscripted beauty of your connection.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our philosophy is simple: authentic moments resonate loudest. We step back to let your love unfold naturally, ensuring every image we craft is a true reflection of who you are—elegant, emotive, and eternally yours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
