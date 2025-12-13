"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 300,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = useCallback(async () => {
    // Fallback for browsers without View Transitions API
    if (
      !buttonRef.current || 
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark")
      return
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    )
  }, [resolvedTheme, setTheme, duration])

  if (!mounted) {
    return (
      <button
        className={cn("relative flex items-center justify-center", className)}
        {...props}
      >
        <div className="h-5 w-5" /> {/* Placeholder to prevent layout shift */}
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn("relative flex items-center justify-center", className)}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
           key={resolvedTheme === "dark" ? "dark" : "light"}
           initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
           animate={{ opacity: 1, scale: 1, rotate: 0 }}
           exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
           transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
