"use client";

import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";

export function Hero() {
  return (
    <section className="bg-background overflow-hidden">
      <div className="flex flex-col overflow-hidden">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-foreground dark:text-white">
                Unveil the Art of <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none font-playfair">
                  Timeless Love
                </span>
              </h1>
            </>
          }
        >
          <div className="relative w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop"
              alt="hero"
              fill
              className="mx-auto rounded-2xl object-cover h-full object-center"
              draggable={false}
              priority
            />
          </div>
        </ContainerScroll>


      </div>
    </section>
  );
}
