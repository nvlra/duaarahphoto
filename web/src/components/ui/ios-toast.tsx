"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, Info, AlertTriangle, X as CloseIcon } from "lucide-react"

// --- Types ---
type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  toast: {
    success: (title: string, description?: string) => void
    error: (title: string, description?: string) => void
    info: (title: string, description?: string) => void
    warning: (title: string, description?: string) => void
  }
}

// --- Icons ---
const ICONS = {
  success: <Check className="w-5 h-5 text-white" />,
  error: <X className="w-5 h-5 text-white" />,
  info: <Info className="w-5 h-5 text-white" />,
  warning: <AlertTriangle className="w-5 h-5 text-white" />,
}

const BG_COLORS = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-amber-500",
}

// --- Context ---
const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context.toast
}

// --- Component ---
const ToastItem = memo(({ toast, index, total, onRemove }: { toast: Toast, index: number, total: number, onRemove: (id: string) => void }) => {
  const inverseIndex = total - 1 - index // 0 = top (newest), 1 = second, ...
  
  // Stacking Logic from User Request (approximate)
  const scale = 1 - inverseIndex * 0.05
  const opacity = 1 - (inverseIndex / total) * 0.2
  const y = inverseIndex * 15 // Offset in pixels instead of % for simpler framer control
  
  // Blur effect for stacked items
  const blur = inverseIndex > 0 ? "blur-[2px]" : "blur-0"

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ 
        opacity: opacity, 
        y: y, 
        scale: scale,
        zIndex: total - index
      }}
      exit={{ opacity: 0, scale: 0.9, y: y - 20 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`absolute bottom-0 w-full max-w-sm flex justify-center pointer-events-none`}
      style={{
        zIndex: total - index
      }}
    >
      <div className={`
        pointer-events-auto
        relative flex items-center gap-3 w-full p-4 
        rounded-2xl shadow-lg border border-white/10
        backdrop-blur-xl bg-white/80 dark:bg-slate-900/80
        ${blur} transition-all duration-300
      `}>
          {/* Icon Box */}
          <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${BG_COLORS[toast.type]} shadow-sm`}>
             {ICONS[toast.type]}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
             <h3 className="text-sm font-semibold text-foreground leading-tight">{toast.title}</h3>
             {toast.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{toast.description}</p>
             )}
          </div>

          {/* Close Button */}
          <button 
            onClick={() => onRemove(toast.id)}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
             <CloseIcon className="w-4 h-4 text-muted-foreground" />
          </button>
      </div>
    </motion.div>
  )
})

ToastItem.displayName = "ToastItem"

// --- Provider ---
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: ToastType, title: string, description?: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = { id, type, title, description, duration: 5000 }
    
    setToasts((prev) => [...prev, newToast])

    // Auto dismiss
    setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = {
    success: (title: string, desc?: string) => addToast("success", title, desc),
    error: (title: string, desc?: string) => addToast("error", title, desc),
    info: (title: string, desc?: string) => addToast("info", title, desc),
    warning: (title: string, desc?: string) => addToast("warning", title, desc),
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-0 left-0 flex flex-col items-center justify-end pointer-events-none z-[9999] px-4 h-[200px]">
         <AnimatePresence mode="popLayout">
           {toasts.map((t, i) => (
             <ToastItem 
               key={t.id} 
               toast={t} 
               index={toasts.length - 1 - i} // Pass index relative to newest (0 = newest)
               total={toasts.length} 
               onRemove={removeToast} 
             />
           ))}
         </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
