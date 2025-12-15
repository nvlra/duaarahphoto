"use client";

import React from "react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export function FloatingThemeToggle() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatedThemeToggler className="h-12 w-12 rounded-full border bg-background shadow-lg hover:bg-muted" />
    </div>
  );
}
