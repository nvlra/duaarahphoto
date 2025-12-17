"use client";

import React from "react";
import {
  ScrollVelocityContainer,
  ScrollVelocityRow,
} from "@/components/ui/scroll-based-velocity";

export function BrandMarquee() {
  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden">
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
        <ScrollVelocityContainer className="font-playfair text-base md:text-2xl lg:text-3xl font-bold tracking-[-0.02em] text-foreground/20 dark:text-foreground/40">
          <ScrollVelocityRow baseVelocity={5} direction={1}>
            <span className="mx-6">Enviel Project</span>
            <span className="mx-6">•</span>
            <span className="mx-6">Enviel Project</span>
            <span className="mx-6">•</span>
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={5} direction={-1}>
            <span className="mx-6">Enviel Project</span>
            <span className="mx-6">•</span>
            <span className="mx-6">Enviel Project</span>
            <span className="mx-6">•</span>
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
        <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r"></div>
        <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l"></div>
      </div>
    </section>
  );
}
