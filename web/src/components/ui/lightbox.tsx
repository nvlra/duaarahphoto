"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface LightboxProps {
  images: string[];
  selectedIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  projectName?: string;
}

export function Lightbox({ 
  images, 
  selectedIndex, 
  onClose, 
  onNavigate,
  projectName = "Image"
}: LightboxProps) {
  const isOpen = selectedIndex !== null;

  const handlePrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null && selectedIndex < images.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  };

  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowLeft" && selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
    if (e.key === "ArrowRight" && selectedIndex < images.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  }, [selectedIndex, images.length, onClose, onNavigate]);

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && selectedIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-9999 bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 text-white/70 text-sm font-medium">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
            disabled={selectedIndex === 0}
            className={cn(
              "absolute left-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all",
              selectedIndex === 0 && "opacity-30 cursor-not-allowed hover:bg-white/10"
            )}
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            disabled={selectedIndex === images.length - 1}
            className={cn(
              "absolute right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all",
              selectedIndex === images.length - 1 && "opacity-30 cursor-not-allowed hover:bg-white/10"
            )}
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>

          {/* Image Container */}
          <motion.div
            key={selectedIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-[90vw] h-[85vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${projectName} ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </motion.div>

          {/* Thumbnail Strip (optional, for larger galleries) */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[80vw] overflow-x-auto py-2 px-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); onNavigate(i); }}
                  className={cn(
                    "relative w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden shrink-0 transition-all border-2",
                    i === selectedIndex 
                      ? "border-white opacity-100" 
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
