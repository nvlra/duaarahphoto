"use client";

import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { motion, useAnimation, type Variants } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

interface GenericAnimatedIconProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon;
  size?: number | string;
  // Generic animation variants (hover, etc)
  animationType?: 'scale' | 'rotate' | 'shake' | 'bounce';
}

const GenericAnimatedIcon = forwardRef<AnimatedIconHandle, GenericAnimatedIconProps>(
  ({ icon: Icon, onMouseEnter, onMouseLeave, className, size = 28, animationType = 'scale', ...props }, ref) => {
    const controls = useAnimation();
    const isControlledRef = useRef(false);

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => controls.start('animate'),
        stopAnimation: () => controls.start('normal'),
      };
    });

    const variants: Variants = {
        normal: { 
            scale: 1, 
            rotate: 0, 
            y: 0, 
            x: 0 
        },
        animate: {
            scale: animationType === 'scale' ? 1.2 : 1,
            rotate: animationType === 'rotate' ? 15 : 0,
            y: animationType === 'bounce' ? -5 : 0,
            x: animationType === 'shake' ? [0, -2, 2, -2, 2, 0] : 0,
            transition: { type: 'spring', stiffness: 300, damping: 10 }
        }
    };

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('animate');
        } else {
          onMouseEnter?.(e);
        }
      },
      [controls, onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isControlledRef.current) {
          controls.start('normal');
        } else {
          onMouseLeave?.(e);
        }
      },
      [controls, onMouseLeave]
    );

    return (
      <div
        className={cn("cursor-pointer select-none rounded-md transition-colors duration-200 hover:bg-accent flex items-center justify-center", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <motion.div
            variants={variants}
            animate={controls}
            transition={{ type: 'spring', stiffness: 300, damping: 10 }}
        >
             <Icon size={size} />
        </motion.div>
      </div>
    );
  }
);

GenericAnimatedIcon.displayName = 'GenericAnimatedIcon';

export { GenericAnimatedIcon };
