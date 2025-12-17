"use client";

import React, { useState, cloneElement } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;
const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  showLabel?: boolean;
  selectable?: boolean;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeId?: string | number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeId,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
}: LimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  // Removed limelight refs and effects

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    if (items[index].selectable !== false) {
      setActiveIndex(index);
      onTabChange?.(index);
    }
    itemOnClick?.();
  };

  return (
    <nav className={`relative inline-flex items-center h-16 rounded-full bg-card text-foreground border px-2 overflow-hidden ${className}`}>
      {items.map(({ id, icon, label, onClick, showLabel }, index) => {
        const Icon = icon as React.ReactElement<{ className?: string }>;
        const isActive = activeId !== undefined ? activeId === id : activeIndex === index;
        return (
          <a
            key={id}
            className={`relative z-20 flex h-full cursor-pointer items-center justify-center ${showLabel ? 'px-4 w-auto gap-2' : 'p-5'} ${iconContainerClassName}`}
            onClick={() => handleItemClick(index, onClick)}
            aria-label={label}
          >
            {cloneElement(Icon, {
              className: `w-6 h-6 transition-all duration-300 ease-in-out ${
                isActive ? 'opacity-100 scale-110 text-black dark:text-white' : 'opacity-50 scale-95 text-neutral-500'
              } ${Icon.props.className || ''} ${iconClassName || ''}`,
            })}
            {showLabel && (
                <span className={`text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isActive ? 'opacity-100 text-black dark:text-white' : 'opacity-50 text-neutral-500'}`}>
                    {label}
                </span>
            )}
          </a>
        );
      })}
    </nav>
  );
};
