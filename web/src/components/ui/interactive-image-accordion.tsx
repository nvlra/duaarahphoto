"use client";

import React, { useState } from "react";
import Image from "next/image";
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
}

const AccordionItem: React.FC<AccordionItemProps> = ({
  item,
  isActive,
  onMouseEnter,
}) => {
  return (
    <div
      className={cn(
        "relative h-[450px] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-in-out",
        isActive ? "w-[400px]" : "w-[60px]"
      )}
      onMouseEnter={onMouseEnter}
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
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40 transition-colors duration-500 hover:bg-black/20"></div>

      {/* Caption Text */}
      <span
        className={cn(
          "absolute text-white text-lg font-semibold whitespace-nowrap transition-all duration-300 ease-in-out",
          isActive
            ? "bottom-6 left-1/2 -translate-x-1/2 rotate-0 opacity-100"
            : "w-auto text-left bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-80"
        )}
      >
        {item.title}
      </span>
    </div>
  );
};

// --- Main Component ---
export function InteractiveImageAccordion() {
  const [activeIndex, setActiveIndex] = useState<number>(2); // Default to middle item

  return (
    <div className="flex flex-row items-center justify-center gap-4 overflow-x-auto p-4 py-8 no-scrollbar scroll-smooth">
      {accordionItems.map((item, index) => (
        <AccordionItem
          key={item.id}
          item={item}
          isActive={index === activeIndex}
          onMouseEnter={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
