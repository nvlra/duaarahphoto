"use client";

import React from "react";
import { CreativePricing, PricingTier } from "@/components/ui/creative-pricing";
import { Camera, Film, Aperture } from "lucide-react";
import { motion } from "framer-motion";

const packages: PricingTier[] = [
  {
    name: "Essence",
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
    name: "Timeless",
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
    name: "Cinematic",
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

export function Pricing() {
  return (
    <section className="bg-background py-10 md:py-20 relative overflow-hidden">
        {/* Decorative background elements can be added here if needed */}
      <motion.div
        initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <CreativePricing 
          tag="Enviel Collection" 
          title="Package" 
          description="We believe in transparency and providing value that lasts a lifetime. Choose a collection or customize your own."
          tiers={packages} 
        />
      </motion.div>
    </section>
  );
}
