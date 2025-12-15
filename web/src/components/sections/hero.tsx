"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { ImageAutoSlider } from "@/components/ui/image-auto-slider";

export function Hero() {
  return (
    <section className="bg-background pt-20 md:pt-0">
      <div className="flex flex-col">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-foreground leading-tight mb-8">
                Crafting Visual <br /> <span className="italic font-light text-muted-foreground">Masterpieces</span>
              </h1>
              <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed mb-12">
                Premium photography services for those who value elegance, emotion, and artistry.
              </p>
            </>
          }
        >
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
             <ImageAutoSlider />
          </div>
        </ContainerScroll>


      </div>
    </section>
  );
}
