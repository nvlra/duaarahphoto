"use client";

import { RippleButton } from "@/components/ui/ripple-button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more-icon";
import { useState, useRef, useEffect } from "react";

export interface PricingTier {
  name: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  popular?: boolean;
}

interface CreativePricingProps {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}

export function CreativePricing({
  tag,
  title = "Invest in Memories",
  description = "Choose the collection that best fits your special day",
  tiers,
}: CreativePricingProps) {
  const [activeIndex, setActiveIndex] = useState(() => {
    const popularIndex = tiers.findIndex((tier) => tier.popular);
    return popularIndex !== -1 ? popularIndex : 0;
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Set default active index to the popular tier
  useEffect(() => {
    const popularIndex = tiers.findIndex((tier) => tier.popular);
    if (popularIndex !== -1) {
      // Scroll to popular item on mount after a short delay to ensure layout
      setTimeout(() => {
        if (scrollContainerRef.current) {
           const totalWidth = scrollContainerRef.current.scrollWidth - 32;
           const itemWidth = totalWidth / tiers.length;
           // Center the item
           const containerWidth = scrollContainerRef.current.clientWidth;
           const scrollPos = (itemWidth * popularIndex) - (containerWidth / 2) + (itemWidth / 2);
           
           scrollContainerRef.current.scrollTo({
             left: scrollPos,
             behavior: "instant"
           });
        }
      }, 100);
    }
  }, [tiers]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const totalWidth = scrollContainerRef.current.scrollWidth - 32; 
      const itemWidth = totalWidth / tiers.length;
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / itemWidth);
      setActiveIndex(Math.min(Math.max(newIndex, 0), tiers.length - 1));
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center space-y-6 mb-8 md:mb-16">
        {tag && (
          <div className="font-playfair text-xl text-primary/80 italic">
            {tag}
          </div>
        )}
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-5xl font-bold font-playfair text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <p className="font-sans text-base md:text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          {description}
        </p>
      </div>

      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex md:grid md:grid-cols-3 gap-0 md:gap-8 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 pt-6 -mx-4 md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group flex flex-col h-full w-full md:w-auto md:min-w-0 flex-shrink-0 snap-center px-4 md:px-0",
              "transition-all duration-500 hover:-translate-y-2",
              index === 1 ? "md:-mt-8 md:mb-8 z-10" : "" // Elevate middle card
            )}
          >
            {/* Card Background with simple border for minimalism */}
            <div
              className={cn(
                "absolute inset-0 bg-background",
                "border border-border rounded-xl",
                "shadow-sm transition-shadow duration-500",
                "group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:group-hover:shadow-[0_8px_30px_rgb(255,255,255,0.03)]"
              )}
            />

            <div className="relative p-8 flex flex-col h-full z-10">
              {tier.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background 
                  font-sans px-4 py-1 rounded-full text-xs tracking-widest uppercase font-semibold shadow-lg"
                >
                  Most Popular
                </div>
              )}

              <div className="mb-8 text-center feature-header">
                <div
                  className={cn(
                    "w-12 h-12 mx-auto rounded-full mb-4",
                    "flex items-center justify-center",
                    "bg-secondary/30 text-foreground"
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className="font-playfair text-2xl font-bold text-foreground mb-2">
                  {tier.name}
                </h3>
                <p className="font-sans text-sm text-muted-foreground px-4">
                  {tier.description}
                </p>
              </div>

              {/* Divider */}
              <div className="w-12 h-px bg-border mx-auto mb-8" />

              <div className="space-y-4 mb-8 h-[280px] overflow-y-auto scrollbar-hide">
                {tier.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="mt-1 min-w-[16px]">
                         <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="font-sans text-sm text-foreground/80 leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4">
                <a
                  href={`https://wa.me/62812000000000?text=Hello%20Enviel%2C%20I%20am%20interested%20in%20the%20${tier.name}%20package.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <RippleButton
                    className={cn(
                      "w-full h-12 font-sans tracking-wide text-sm transition-all duration-300",
                      tier.popular
                        ? "bg-foreground text-background hover:bg-foreground/90 shadow-md"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border"
                    )}
                    rippleColor={tier.popular ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.1)"}
                  >
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4" /> {/* Spacer for optical centering */}
                      Inquire Now
                      <MessageCircleMoreIcon className="w-4 h-4" />
                    </span>
                  </RippleButton>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Mobile Pagination Dots */}
      <div className="flex md:hidden justify-center gap-2 mt-2 relative z-10">
        {tiers.map((_, index) => (
            <div
                key={index}
                className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === activeIndex ? "w-6 bg-foreground" : "w-2 bg-border"
                )}
            />
        ))}
      </div>
    </div>
  );
}
