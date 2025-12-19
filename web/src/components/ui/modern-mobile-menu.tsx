"use client"

import React, { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_MENU_ITEMS, AdminMenuItem } from '@/config/admin-menu';

export interface InteractiveMenuProps {
  items?: AdminMenuItem[];
  accentColor?: string;
}

import { AnimatedIconHandle } from '@/components/ui/animated-icons';

const defaultAccentColor = 'var(--component-active-color-default)';

import { motion } from 'framer-motion';

const MobileMenuItem = ({ item, isActive, setItemRef, onClick }: { 
    item: AdminMenuItem; 
    isActive: boolean; 
    setItemRef: (el: HTMLAnchorElement | null) => void;
    onClick: () => void;
}) => {
    const iconRef = useRef<AnimatedIconHandle>(null);
    const IconComponent = item.icon;

    useEffect(() => {
        if (isActive) {
            iconRef.current?.startAnimation();
        } else {
            iconRef.current?.stopAnimation();
        }
    }, [isActive]);

    return (
        <Link
            href={item.href}
            ref={setItemRef}
            onClick={() => {
                iconRef.current?.startAnimation();
                onClick();
            }}
            className={`
              relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 z-10
              ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}
            `}
            aria-label={item.label}
        >
            {isActive && (
                <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
            )}
            
            <IconComponent 
                ref={iconRef} 
                className="w-5 h-5 relative z-20" 
                size={20} 
            />
        </Link>
    );
};

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor }) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const finalItems = useMemo(() => {
     if (items && Array.isArray(items) && items.length > 0) return items;
     return ADMIN_MENU_ITEMS.filter(item => item.showOnMobile !== false);
  }, [items]);

  // Derive active index directly from pathname
  const activeIndex = useMemo(() => {
    // Strategy: Find all items that match the start of the pathname.
    // Then select the one with the longest href (most specific match).
    
    let bestMatchIndex = -1;
    let maxLen = 0;

    finalItems.forEach((item, index) => {
        // Handle root path '/admin' nuance:
        // If pathname is exactly '/admin' or '/admin/', it matches.
        // If pathname is '/admin/foo', logic should favor '/admin/foo' if exists,
        // but if only '/admin' exists, it should match '/admin'.
        // However, usually we want '/admin' to ONLY match exact root, not subpages unless no other match?
        // Let's stick to "Longest Match Wins".
        // '/admin' (len 6). '/admin/orders' (len 13). = Orders wins.
        
        // Exact match check first (priority)
        if (pathname === item.href) {
            // Check if this exact match is better than current best (it usually is max len)
             if (item.href.length >= maxLen) {
                maxLen = item.href.length;
                bestMatchIndex = index;
            }
        }
        // StartsWith match
        else if (pathname.startsWith(item.href)) {
             // Handle edge case: item.href='/admin', pathname='/admin-settings' (not directory)
             // Should ensure boundary. next/navigation usually handles 'startsWith' loosely.
             // We can check if next char is '/' or end.
             const nextChar = pathname[item.href.length];
             if (!nextChar || nextChar === '/') {
                 if (item.href.length > maxLen) {
                    maxLen = item.href.length;
                    bestMatchIndex = index;
                 }
             }
        }
    });

    return bestMatchIndex;
  }, [pathname, finalItems]);

  // Auto-scroll to center active item
  useEffect(() => {
    if (activeIndex === -1) return;
    
    const nav = navRef.current;
    const activeItem = itemsRef.current[activeIndex];

    if (nav && activeItem) {
      const navWidth = nav.offsetWidth;
      const itemLeft = activeItem.offsetLeft;
      const itemWidth = activeItem.offsetWidth;

      const scrollLeft = itemLeft - (navWidth / 2) + (itemWidth / 2);

      nav.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const navStyle = useMemo(() => {
      const activeColor = accentColor || defaultAccentColor;
      return { '--component-active-color': activeColor } as React.CSSProperties;
  }, [accentColor]); 

  return (
    <nav
      ref={navRef}
      className="flex items-center p-2 rounded-full bg-background/80 backdrop-blur-md border shadow-lg gap-2 overflow-x-auto w-full no-scrollbar justify-start px-2 h-full mx-auto max-w-[90vw]"
      role="navigation"
      style={navStyle}
    >
      {finalItems.map((item, index) => (
        <MobileMenuItem 
          key={item.label} 
          item={item} 
          isActive={index === activeIndex} 
          setItemRef={(el) => { itemsRef.current[index] = el }}
          onClick={() => {}} 
        />
      ))}
    </nav>
  );
};

export { InteractiveMenu };
