"use client";

import React, { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ArrowBigUpDashIcon } from "@/components/ui/arrow-big-up-dash-icon";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more-icon";

export function FloatingThemeToggle() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isBookActive, setIsBookActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-expand "Book Now" every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
        setIsBookActive(true);
        setTimeout(() => setIsBookActive(false), 2000); // Show for 2 seconds
    }, 30000); // Every 1 minute

    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-28 md:bottom-6 right-6 z-999 flex flex-col gap-3 items-end md:items-center">
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className={cn(
              "h-12 w-12 rounded-full border bg-background shadow-lg hover:bg-muted flex items-center justify-center transition-colors"
            )}
            title="Scroll to Top"
          >
            <ArrowBigUpDashIcon size={24} className="hover:bg-transparent" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* WhatsApp Book Now */}
      <a 
        href="https://wa.me/628123456789?text=Hello%20Envi%2C%20I%20would%20like%20to%20book%20a%20session."
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
            "h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-500",
            "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900", // High contrast
            isBookActive ? "w-36 px-4" : "w-12 px-0"
        )}
      >
        <span className={cn(
            "whitespace-nowrap text-sm font-bold transition-all duration-500 overflow-hidden",
            isBookActive ? "max-w-[100px] opacity-100 pr-2" : "max-w-0 opacity-0 pr-0"
        )}>
            Book Now
        </span>
        <MessageCircleMoreIcon size={20} className="shrink-0" />
      </a>

      <AnimatedThemeToggler className="h-12 w-12 rounded-full border bg-background shadow-lg hover:bg-muted" />
    </div>
  );
}
