"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlowButton } from "@/components/ui/flow-button";

export const EntranceTransition = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEntered, setIsEntered] = useState(false);

  const playSound = () => {
    const audio = new Audio("/audio/whoosh.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed", e));
  };

  const handleEnter = () => {
      playSound();
      setIsEntered(true);
  };

  // Force scroll to top on mount (refresh)
  React.useEffect(() => {
    window.scrollTo(0, 0);
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
  }, []);

  React.useEffect(() => {
    if (!isEntered) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isEntered]);

  return (
    <div className={`bg-background min-h-screen w-full relative ${!isEntered ? "overflow-hidden" : ""}`}>
      {/* Button Overlay */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
          >
            <FlowButton
               text="Open Web"
               onClick={handleEnter}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Reveal Animation */}
      <motion.div
        initial={{
          clipPath: "circle(0% at 50% 50%)",
          scale: 1.6, 
          filter: "blur(20px) brightness(1.2)", 
        }}
        animate={
          isEntered
            ? {
                clipPath: "circle(150% at 50% 50%)",
                scale: 1,
                filter: "blur(0px) brightness(1)",
                transitionEnd: {
                    filter: "none",
                    transform: "none",
                    clipPath: "none"
                }
              }
            : {}
        }
        transition={{
          duration: 1.5, // Faster to match whoosh
          ease: [0.22, 1, 0.36, 1], 
        }}
        className="w-full min-h-screen bg-background relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};
