"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- Data for the image accordion ---
interface AccordionItemData {
  id: number;
  title: string;
  imageUrl: string;
}

const accordionItems: AccordionItemData[] = [
  {
    id: 1,
    title: "Wedding",
    imageUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Pre-Wedding",
    imageUrl:
      "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Candid Moments",
    imageUrl:
      "https://images.unsplash.com/photo-1522673607200-1645062cd958?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Cinematic",
    imageUrl:
      "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Details",
    imageUrl:
      "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
  },
];

// --- Accordion Item Component ---
interface AccordionItemProps {
  item: AccordionItemData;
  isActive: boolean;
  onMouseEnter: () => void;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isActive,
  onMouseEnter,
  onClick,
}) => {
  return (
      <div
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={cn(
          "relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out",
          // Mobile: Vertical Stack
          "w-full", 
          isActive ? "h-[300px]" : "h-[80px]",
          // Desktop: Horizontal Accordion
          "md:h-[450px]",
          isActive ? "md:w-[400px]" : "md:w-[60px]"
        )}
      >
        {/* Background Image */}
        <Image
          src={item.imageUrl}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
        {/* Dark overlay */}
        <div className={cn(
            "absolute inset-0 bg-black/40 transition-colors duration-500 hover:bg-black/20",
            isActive ? "bg-black/0" : "bg-black/50" // Darker on inactive for text contrast
        )}></div>

        {/* Caption Text */}
        <span
          className={cn(
            "absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out",
            // Mobile Text Position
            "left-6",
            isActive 
              ? "bottom-6 translate-y-0" // Active Mobile: Bottom Left
              : "top-1/2 -translate-y-1/2", // Inactive Mobile: Centered Vertically on Left
            
            // Desktop Text Position overrides
            "md:left-1/2 md:-translate-x-1/2 md:translate-y-0", // Reset mobile transforms
            isActive 
              ? "md:bottom-6 md:rotate-0 md:opacity-100" 
              : "md:bottom-24 md:w-auto md:rotate-90 md:opacity-80"
          )}
        >
          {item.title}
        </span>
      </div>
  );
};

// --- Main Component ---
export function InteractiveImageAccordion() {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Default to first item

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 w-full">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => {
             // Optional: Keep hover for desktop if desired, or remove to be purely click/tap consistent
             if (window.innerWidth >= 768) {
                 setActiveIndex(index);
             }
          }}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}