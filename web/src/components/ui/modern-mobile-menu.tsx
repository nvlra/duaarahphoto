"use client"

import React, { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ADMIN_MENU_ITEMS, AdminMenuItem } from '@/config/admin-menu';

export interface InteractiveMenuProps {
  items?: AdminMenuItem[];
  accentColor?: string;
}

const defaultAccentColor = 'var(--component-active-color-default)';

const InteractiveMenu: React.FC<InteractiveMenuProps> = ({ items, accentColor }) => {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const finalItems = useMemo(() => {
     if (items && Array.isArray(items) && items.length > 0) return items;
     // Filter items for mobile: only show items with showOnMobile !== false
     return ADMIN_MENU_ITEMS.filter(item => item.showOnMobile !== false);
  }, [items]);

  // Derive active index directly from pathname
  const activeIndex = useMemo(() => {
    const index = finalItems.findIndex(item => 
       item.href === '/admin' 
          ? pathname === '/admin' 
          : pathname.startsWith(item.href)
    );
    return index !== -1 ? index : 0;
  }, [pathname, finalItems]);

  // Auto-scroll to center active item
  useEffect(() => {
    const nav = navRef.current;
    const activeItem = itemsRef.current[activeIndex];

    if (nav && activeItem) {
      const navWidth = nav.offsetWidth;
      const itemLeft = activeItem.offsetLeft;
      const itemWidth = activeItem.offsetWidth;

      // Calculate center position
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
      className="flex items-center p-2 rounded-full bg-background/80 backdrop-blur-md border shadow-lg gap-2 overflow-x-auto w-full no-scrollbar justify-start px-2 h-full mx-auto"
      role="navigation"
      style={navStyle}
    >
      {finalItems.map((item, index) => {
        const isActive = index === activeIndex;
        const IconComponent = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            ref={el => { itemsRef.current[index] = el }}
            className={`
              relative shrink-0 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
              ${isActive ? 'bg-primary text-primary-foreground scale-110 shadow-sm' : 'text-muted-foreground hover:bg-muted hover:scale-105'}
            `}
            aria-label={item.label}
          >
            <IconComponent className="w-5 h-5" size={20} />
            {isActive && (
               <span className="absolute -bottom-1 w-1 h-1 bg-primary-foreground rounded-full opacity-0 animate-in fade-in zoom-in duration-300"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export { InteractiveMenu };
