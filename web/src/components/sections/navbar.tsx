"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Home, LayoutGrid, Sparkles, MessageSquareQuote, CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

import { RippleButton } from "@/components/ui/ripple-button";
import { motion, AnimatePresence } from "framer-motion";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Portfolio", href: "/#featured" },
  { name: "Services", href: "/#services" },
  { name: "Testimoni", href: "/#stories" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isPortfolioPage = pathname === "/portfolio";
  const isProjectPage = pathname?.startsWith("/portfolio/") && pathname !== "/portfolio";

  // Handle smooth scroll for anchor links
  const handleNavClick = (href: string) => {
    // Only handle hash links that point to home sections
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      
      if (window.location.pathname === "/") {
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // If not on home, route to home with hash
        router.push(href);
      }
    } else {
        router.push(href);
    }
  };

  const dockItems: NavItem[] = [
    { 
        id: 'home', 
        icon: <Home />, 
        label: 'Home', 
        onClick: () => handleNavClick('/#about') // Using About as "Home" anchor or just top? Let's use #about or scroll top logic. Actually, Home usually means Top.
    },
    { 
        id: 'portfolio', 
        icon: <LayoutGrid />, 
        label: 'Portfolio', 
        onClick: () => handleNavClick('/#featured') 
    },
    { 
        id: 'services', 
        icon: <Sparkles />, 
        label: 'Services', 
        onClick: () => handleNavClick('/#services') 
    },
    { 
        id: 'testimoni', 
        icon: <MessageSquareQuote />, 
        label: 'Stories', 
        onClick: () => handleNavClick('/#stories') 
    },
  ];

  return (
    <>
    <nav
      className={cn(
        "fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl",
        "bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg rounded-full dark:bg-neutral-900/90 dark:border-neutral-800 dark:shadow-[0_4px_30px_rgba(255,255,255,0.1)]"
      )}
    >
      <div className="w-full px-4 md:px-8 h-16 flex items-center justify-center md:justify-between text-center md:text-left">
        {/* Logo */}
        <Link href="/" className="text-lg md:text-xl font-bold font-playfair tracking-tight text-neutral-900 uppercase dark:text-white">
          ENVIEL PHOTO
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
          {isProjectPage ? (
             <Link 
              href="/portfolio"
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Portfolio
            </Link>
          ) : isPortfolioPage ? (
            <Link 
              href="/"
              className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>
          ) : (
            navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
              className="text-sm font-medium text-neutral-600 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
            >
              {item.name === "Portfolio" ? "Portofolio" : item.name}
            </Link>
            ))
          )}
          <a 
            href="https://wa.me/628123456789?text=Hello%20Enviel%2C%20I%20would%20like%20to%20book%20a%20session."
            target="_blank"
            rel="noopener noreferrer"
          >
            <RippleButton className="rounded-full h-10 px-6 text-xs font-bold uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border-none dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
              Book Now
            </RippleButton>
          </a>
        </div>
      </div>
    </nav>

    {/* Mobile Bottom Dock */}
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%]">
        <LimelightNav 
            items={dockItems} 
            className="w-full bg-white/90 backdrop-blur-md border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-800 shadow-2xl rounded-2xl justify-between px-4"
            iconClassName="text-neutral-600 dark:text-neutral-400"
        />
    </div>
    </>
  );
}
