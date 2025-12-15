"use client";

import { RippleButton } from "@/components/ui/ripple-button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  tag = "Our Packages",
  title = "Invest in Memories",
  description = "Choose the collection that best fits your special day",
  tiers,
}: CreativePricingProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16">
      <div className="text-center space-y-6 mb-16">
        <div className="font-playfair text-xl text-primary/80 italic">
          {tag}
        </div>
        <div className="relative inline-block">
          <h2 className="text-4xl md:text-5xl font-bold font-playfair text-foreground tracking-tight">
            {title}
          </h2>
        </div>
        <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto font-light">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "relative group flex flex-col h-full",
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

              <div className="space-y-4 mb-8 grow">
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
                <RippleButton
                  className={cn(
                    "w-full h-12 font-sans tracking-wide text-sm transition-all duration-300",
                    tier.popular
                      ? "bg-foreground text-background hover:bg-foreground/90 shadow-md"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent hover:border-border"
                  )}
                  rippleColor={tier.popular ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.1)"}
                >
                  Inquire Now
                </RippleButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
