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
              onClick={() => setIsEntered(true)}
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
          filter: "blur(20px)",
          scale: 1.1,
        }}
        animate={
          isEntered
            ? {
                clipPath: "circle(150% at 50% 50%)",
                filter: "blur(0px)",
                scale: 1,
              }
            : {}
        }
        transition={{
          duration: 1.5,
          ease: [0.22, 1, 0.36, 1], // Custom cubic bezier for smooth "cinematic" feel
        }}
        className="w-full min-h-screen bg-background relative z-10"
      >
        {children}
      </motion.div>
    </div>
  );
};
