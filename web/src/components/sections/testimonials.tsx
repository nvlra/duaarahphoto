"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah & James",
    text: "The photos are absolutely breathtaking. You captured moments we didn't even realize were happening. Truly a magical experience.",
  },
  {
    id: 2,
    name: "Emily & Michael",
    text: "Professional, kind, and incredibly talented. Looking through our album feels like reliving the day all over again.",
  },
  {
    id: 3,
    name: "Jessica & David",
    text: "We wanted something candid and not stiff, and you delivered exactly that. Every shot feels so natural and full of emotion.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-4">
            Love Notes
          </h2>
          <p className="text-muted-foreground">What our couples say about us</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="p-8 rounded-2xl bg-secondary/20 border border-border/50 relative"
            >
              <Quote className="text-muted-foreground/20 w-10 h-10 mb-4" />
              <p className="text-lg font-light italic mb-6 text-foreground/90">
                &quot;{item.text}&quot;
              </p>
              <div className="font-playfair font-bold text-xl">
                - {item.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
