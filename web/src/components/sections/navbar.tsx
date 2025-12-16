"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { RippleButton } from "@/components/ui/ripple-button";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Portfolio", href: "#featured" },
  { name: "Services", href: "#services" },
  { name: "Testimoni", href: "#stories" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav
      className={cn(
        "fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl",
        "bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg rounded-full dark:bg-neutral-900/90 dark:border-neutral-800"
      )}
    >
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="#" className="text-xl font-bold font-playfair tracking-tight text-neutral-900 uppercase dark:text-white">
          ENVIEL PHOTO
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
            >
              {item.name === "Portfolio" ? "Portofolio" : item.name}
            </Link>
          ))}
          <RippleButton className="rounded-full h-10 px-6 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border-none dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
            Book Now
          </RippleButton>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b overflow-hidden"
          >
            <div className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium py-2 border-b border-border/50"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <RippleButton className="w-full mt-4 rounded-full">Book Now</RippleButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
