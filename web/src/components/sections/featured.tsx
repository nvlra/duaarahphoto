"use client";

import React, { useRef } from "react";
import { InteractiveImageAccordion } from "@/components/ui/interactive-image-accordion";
import { RippleButton } from "@/components/ui/ripple-button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

export function Featured() {
  const containerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const yAccordion = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scaleAccordion = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section ref={containerRef} className="py-20 md:py-40 bg-background">
      <div id="featured" className="mx-auto max-w-7xl px-4 scroll-mt-32">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <motion.div 
            style={{ y: isDesktop ? yText : 0 }} // Also disable yText on mobile if desired, but user Scale was the main point. I'll keep yText unless requested, but safer to disable parallax too if "effect" meant movement. Let's stick to scale first as "membesar".
            initial={{ opacity: 0, x: -100, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5, margin: "-100px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full lg:w-1/3 text-center lg:text-left space-y-8"
          >
            <div>
              <h2 className="font-playfair text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
                Capturing Soul <br />
                In Every Frame
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                We don&apos;t just take pictures; we craft visual legacies. From intimate elopements to grand celebrations, we ensure every moment is immortalized with elegance and emotion.
              </p>
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Link href="/portfolio">
                <RippleButton className="rounded-lg px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  View Portfolio
                </RippleButton>
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Accordion */}
          <motion.div 
            style={{ y: yAccordion, scale: isDesktop ? scaleAccordion : 1 }}
            initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: false, amount: 0.1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
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