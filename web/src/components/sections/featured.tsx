"use client";

import React, { useRef } from "react";
import { InteractiveImageAccordion, AccordionItemData } from "@/components/ui/interactive-image-accordion";
import { RippleButton } from "@/components/ui/ripple-button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";

interface FeaturedProps {
  data?: {
    intro?: {
      title?: string;
      description?: string;
      ctaText?: string;
      ctaLink?: string;
    };
    items?: AccordionItemData[];
  };
}

export function Featured({ data }: FeaturedProps) {
  const containerRef = useRef(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, 0]); // Disabled parallax
  const yAccordion = useTransform(scrollYProgress, [0, 1], [0, 0]); // Disabled parallax to keep alignment fixed
  const scaleAccordion = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  const defaultTitle = `Capturing Soul <br /> In Every Frame`;
  const defaultDesc = `We don't just take pictures; we craft visual legacies. From intimate elopements to grand celebrations, we ensure every moment is immortalized with elegance and emotion.`;
  const defaultCtaText = "View Portfolio";
  const defaultCtaLink = "/portfolio";

  return (
    <section ref={containerRef} className="py-20 md:py-40 bg-background">
      <div id="featured" className="mx-auto max-w-7xl px-4 scroll-mt-32">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <motion.div 
            style={{ y: isDesktop ? yText : 0 }} 
            initial={isDesktop ? { opacity: 0, x: -100, filter: "blur(10px)" } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            whileInView={isDesktop ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.5, margin: "-100px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full lg:w-1/3 text-center lg:text-left space-y-8 lg: mt-4"
          >
            <div>
              <div 
                className="font-playfair text-3xl md:text-5xl font-bold leading-tight tracking-tight mb-6"
                dangerouslySetInnerHTML={{ __html: data?.intro?.title || defaultTitle }}
              />
              <div 
                className="text-lg text-muted-foreground font-light leading-relaxed prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: data?.intro?.description || defaultDesc }}
              />
            </div>
            
            <div className="flex justify-center lg:justify-start">
              <Link href={data?.intro?.ctaLink || defaultCtaLink}>
                <RippleButton className="rounded-lg px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  {data?.intro?.ctaText || defaultCtaText}
                </RippleButton>
              </Link>
            </div>
          </motion.div>

          {/* Right Side: Accordion */}
          <motion.div 
            style={{ y: yAccordion, scale: isDesktop ? scaleAccordion : 1 }}
            initial={isDesktop ? { opacity: 0, x: 50, filter: "blur(10px)" } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            whileInView={isDesktop ? { opacity: 1, x: 0, filter: "blur(0px)" } : { opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full lg:w-2/3"
          >
             <div className="flex items-center justify-center lg:justify-end">
                <InteractiveImageAccordion items={data?.items} />
             </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}