"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpIcon, type ArrowUpIconHandle } from "@/components/ui/arrow-up-icon";

const SwipeArrow = () => {
    const arrowRef = useRef<ArrowUpIconHandle>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            arrowRef.current?.startAnimation();
        }, 1500); // Pulse every 1.5s
        return () => clearInterval(interval);
    }, []);

    return <ArrowUpIcon ref={arrowRef} />;
};

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const EntranceTransition = ({
  children,
  initialEntered = false,
}: {
  children: React.ReactNode;
  initialEntered?: boolean;
}) => {
  const [isEntered, setIsEntered] = useState(initialEntered);

  const playSound = () => {
    const audio = new Audio("/audio/whoosh.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed", e));
  };

  const handleEnter = () => {
      playSound();
      setIsEntered(true);
      // Set cookie for server-side detection (1 year expiry)
      document.cookie = "hasEntered=true; path=/; max-age=31536000";
  };

  // Force scroll to top on mount (refresh) if not entered? 
  // Actually on refresh if entered, we want to stay where we are? 
  // User wants "refresh" -> no animation.
  React.useEffect(() => {
    if (!isEntered) {
        window.scrollTo(0, 0);
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        document.body.style.overflow = "hidden";
    }
  }, [isEntered]);

  React.useEffect(() => {
    if (isEntered) {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEntered]);

  return (
    <div className={`bg-background min-h-screen w-full relative ${!isEntered ? "overflow-hidden" : ""}`}>
      {/* Swipe Up Overlay */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }} // Smooth slide up
            className="fixed inset-0 z-[9999] bg-white dark:bg-neutral-950 flex flex-col items-center justify-center gap-4 cursor-grab active:cursor-grabbing"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.7} // More elasticity for "full" feel
            onDragEnd={(_, info) => {
              if (info.offset.y < -200) { // Requires significant swipe up
                handleEnter();
              }
            }}
          >
            <div className="flex flex-col items-center gap-2 animate-pulse text-neutral-900 dark:text-neutral-100 pointer-events-none select-none">
              <span className="text-sm font-bold tracking-widest uppercase">Swipe up to open web</span>
              <SwipeArrow />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="w-full min-h-screen bg-background relative z-10">
        {children}
      </div>
    </div>
  );
};
