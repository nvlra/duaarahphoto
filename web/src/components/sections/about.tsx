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
              src="https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=2000&auto=format&fit=crop"
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
              Capturing Love, <br />
              <span className="italic font-light text-muted-foreground">
                One Frame at a Time
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe that every love story is unique and deserves to be told with authenticity and grace. Our approach combines documentary-style candids with timeless editorial portraits.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From the quiet nervous glances to the tearful vows and the wild dance floor energy, we are there to preserve the feelings, not just the visuals.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
