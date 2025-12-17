"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

import { RippleButton } from "@/components/ui/ripple-button";
import { motion } from "framer-motion";
import { LimelightNav, NavItem } from "@/components/ui/limelight-nav";
import { UserIcon } from "@/components/ui/user-icon";
import { GalleryVerticalEndIcon } from "@/components/ui/gallery-vertical-end-icon";
import { FileStackIcon } from "@/components/ui/file-stack-icon";
import { HomeIcon } from "@/components/ui/home-icon";
import { CircleChevronLeftIcon } from "@/components/ui/circle-chevron-left-icon";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

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

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    // Defer setMounted to avoid synchronous state update in effect warning
    // and ensure hydration matches.
    const timer = setTimeout(() => setMounted(true), 0);
    
    let idleTimer: NodeJS.Timeout;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 5000); 
    };

    const handleScroll = () => {
      resetIdle();

      const sections = ['about', 'featured', 'services'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let current = 'home';
      // Find the furthest down section that is above the scroll line
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition) {
          current = section;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // User requested only scroll should activate (expand), touch should not.
    // window.addEventListener('touchstart', resetIdle);
    // window.addEventListener('click', resetIdle);
    // window.addEventListener('mousemove', resetIdle);

    resetIdle(); // Start timer

    return () => {
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(idleTimer);
        clearTimeout(timer);
    };
  }, []);

  const standardDockItems: NavItem[] = [
    { 
        id: 'home', 
        icon: <HomeIcon />, 
        label: 'Home', 
        onClick: () => handleNavClick('/') 
    },
    { 
        id: 'about', 
        icon: <UserIcon />, 
        label: 'About', 
        onClick: () => handleNavClick('/#about') 
    },
    {
        id: 'theme',
        icon: mounted ? (
          <motion.div
            key={resolvedTheme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {resolvedTheme === "dark" ? <Sun /> : <Moon />}
          </motion.div>
        ) : <Sun />,
        label: 'Theme',
        onClick: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
        selectable: false
    },
    { 
        id: 'featured', 
        icon: <GalleryVerticalEndIcon />, 
        label: 'Featured', 
        onClick: () => handleNavClick('/#featured') 
    },
    { 
        id: 'services', 
        icon: <FileStackIcon />, 
        label: 'Services', 
        onClick: () => handleNavClick('/#services') 
    },
  ];

  const backDockItem: NavItem[] = [
    {
        id: 'back',
        icon: <CircleChevronLeftIcon className="w-8 h-8" />,
        label: isProjectPage ? 'Back to Portfolio' : 'Back to Home',
        onClick: () => router.push(isProjectPage ? '/portfolio' : '/'),
        showLabel: true
    }
  ];

  // Logic: Show Standard Dock usually.
  // BUT if on Portfolio or Project page, REPLACE logic:
  // User said: "di bagian dock itu saja icon2nya ganti jadi tombol back berarti itu hide icon icon yang ada"
  const dockItems = (isPortfolioPage || isProjectPage) ? backDockItem : standardDockItems;

  return (
    <>
    <nav
      className={cn(
        "fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
        isIdle ? "w-[120px]" : "w-[calc(100%-2rem)]", // Mobile idle Width
        "md:w-[calc(100%-2rem)] max-w-7xl", // Desktop fixed Width overrides mobile
        "bg-white/90 backdrop-blur-md border border-neutral-200 shadow-lg rounded-full dark:bg-neutral-900/90 dark:border-neutral-800 dark:shadow-[0_4px_30px_rgba(255,255,255,0.1)]"
      )}
    >
      <div className="relative w-full px-4 md:px-8 h-12 md:h-16 flex items-center justify-center md:justify-between text-center md:text-left transition-all duration-500">
        {/* Logo */}
        <Link href="/" className={cn(
            "text-lg md:text-2xl font-bold font-poppins tracking-tight text-neutral-900 dark:text-white transition-all duration-500 whitespace-nowrap",
            isIdle ? "scale-100" : "scale-100" // Reset scale, as we are changing text length instead
        )}>
          {isIdle ? "Enviel" : "Enviel Project"}
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
              className="text-sm font-semibold font-poppins text-neutral-600 hover:text-black transition-colors dark:text-neutral-300 dark:hover:text-white"
            >
              {item.name === "Portfolio" ? "Portofolio" : item.name}
            </Link>
            ))
          )}
          
          {/* Theme Toggle for Desktop */}
          <div className="hidden md:block">
            <AnimatedThemeToggler />
          </div>

          <a 
            href="https://wa.me/628123456789?text=Hello%20Envi%2C%20I%20would%20like%20to%20book%20a%20session."
            target="_blank"
            rel="noopener noreferrer"
          >
            <RippleButton className="rounded-full h-10 px-6 text-xs font-bold font-poppins uppercase tracking-wider bg-neutral-900 text-white hover:bg-neutral-800 shadow-sm border-none dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200">
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
            activeId={activeSection} 
            className={cn(
                "w-full bg-white/90 backdrop-blur-md border-neutral-200 dark:bg-neutral-900/90 dark:border-neutral-800 shadow-2xl rounded-full px-4",
                (isPortfolioPage || isProjectPage) ? "justify-center" : "justify-between" // Center if single item, spread if regular
            )}
            iconClassName="text-neutral-600 dark:text-neutral-400"
        />
    </div>
    </>
  );
}
