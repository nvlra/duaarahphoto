"use client";

import React, { useEffect, useState } from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { ArrowBigUpDashIcon } from "@/components/ui/arrow-big-up-dash-icon";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingThemeToggle() {
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-28 md:bottom-6 right-6 z-[999] flex flex-col gap-3 items-center">
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
      <AnimatedThemeToggler className="h-12 w-12 rounded-full border bg-background shadow-lg hover:bg-muted" />
    </div>
  );
}
