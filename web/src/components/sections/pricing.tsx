"use client";

import React, { useRef } from "react";
import { CreativePricing, PricingTier } from "@/components/ui/creative-pricing";
import { Camera, Film, Aperture } from "lucide-react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const packages: PricingTier[] = [
  {
    name: "Silver",
    icon: <Camera className="w-6 h-6" />,
    description: "Perfect for intimate ceremonies and elopements.",
    features: [
      "4 Hours of Coverage",
      "1 Professional Photographer",
      "200+ Edited High-Res Images",
      "Online Private Gallery",
      "Downloadable Digital Files",
    ],
  },
  {
    name: "Gold",
    icon: <Aperture className="w-6 h-6" />,
    description: "Our signature collection for complete wedding day stories.",
    popular: true,
    features: [
      "8 Hours of Coverage",
      "2 Professional Photographers",
      "500+ Edited High-Res Images",
      "Engagement Session Included",
      "Online Private Gallery",
      "12x12 Fine Art Album (20 Pages)",
    ],
  },
  {
    name: "Diamond",
    icon: <Film className="w-6 h-6" />,
    description: "The ultimate luxury experience for grand celebrations.",
    features: [
      "Full Day Coverage (Up to 12 Hours)",
      "2 Professional Photographers",
      "1 Videographer (Highlight Reel)",
      "800+ Edited High-Res Images",
      "Engagement & Pre-Wedding Session",
      "Premium Leather Album Box Set",
      "Same-Day Edit Slideshow",
    ],
  },
];

interface PricingSectionProps {
  data?: {
    intro?: {
      title?: string;
      description?: string;
    };
    tiers?: {
      name: string;
      description: string;
      price?: string;
      features: string[];
      popular: boolean;
      icon: string;
    }[];
  };
}

const getIcon = (name: string) => {
    switch(name) {
        case "Camera": return <Camera className="w-6 h-6" />;
        case "Aperture": return <Aperture className="w-6 h-6" />;
        case "Film": return <Film className="w-6 h-6" />;
        default: return <Camera className="w-6 h-6" />;
    }
};

export function Pricing({ data }: PricingSectionProps) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  
  // Smooth spring config for buttery transitions
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const smoothProgress = useSpring(scrollYProgress, springConfig);
  
  // Parallax: Content moves slightly slower than scroll to create depth
  const y = useTransform(smoothProgress, [0, 1], [0, 80]);

  // Transform data to component format
  const tiers: PricingTier[] = (data?.tiers && data.tiers.length > 0) 
    ? data.tiers.map(t => ({
        name: t.name,
        icon: getIcon(t.icon),
        description: t.description,
        features: t.features,
        popular: t.popular
    }))
    : packages; // Fallback to default if no data

  // Use dynamic title/desc or defaults
  const title = data?.intro?.title || "Services";
  const desc = data?.intro?.description || "We believe in transparency and providing value that lasts a lifetime. Choose a collection or customize your own.";

  return (
    <section id="services" ref={containerRef} className="bg-background pt-4 pb-16 md:pt-16 md:pb-32 relative overflow-hidden scroll-mt-32">
        {/* Decorative background elements can be added here if needed */}
      <motion.div
        style={{ y }}
        initial={{ opacity: 0, y: 50, filter: "blur(0px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <CreativePricing 
          title={title} 
          description={desc}
          tiers={tiers} 
        />
      </motion.div>
    </section>
  );
}
