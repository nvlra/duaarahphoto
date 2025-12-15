"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RippleButton } from "@/components/ui/ripple-button";

export const EntranceTransition = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isEntered, setIsEntered] = useState(false);

  const playSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3");
    audio.volume = 0.5;
    audio.play().catch((e) => console.log("Audio play failed", e));
  };

  const handleEnter = () => {
      playSound();
      setIsEntered(true);
  };

  return (
    <div className="bg-black min-h-screen w-full relative overflow-hidden">
      {/* Button Overlay */}
      <AnimatePresence>
        {!isEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
          >
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white font-playfair text-3xl font-light tracking-[0.2em]"
            >
                ENVIEL
            </motion.h1>
            <RippleButton
              onClick={handleEnter}
              className="px-8 py-6 text-lg tracking-widest uppercase bg-white text-black hover:bg-gray-200"
              rippleColor="rgba(0,0,0,0.2)"
            >
              Enter Gallery
            </RippleButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content with Reveal Animation */}
      <motion.div
        initial={{
          clipPath: "circle(0% at 50% 50%)",
          filter: "blur(50px) brightness(1.5)", // High blur and brightness for "warp" feel
          scale: 1.5, // High scale for "stretch/zoom" feeling
        }}
        animate={
          isEntered
            ? {
                clipPath: "circle(150% at 50% 50%)",
                filter: "blur(0px) brightness(1)",
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 2, // Slower but not too slow
          ease: [0.76, 0, 0.24, 1], // Cinematic ease (Quart-like)
        }}
        className="w-full min-h-screen bg-background relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};
