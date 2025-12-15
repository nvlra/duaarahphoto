"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode, memo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Check, X, Info, AlertTriangle } from "lucide-react"

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
const ToastItem = memo(({ toast, onRemove }: { toast: Toast, onRemove: (id: string) => void }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="w-full max-w-[400px] flex justify-center pointer-events-auto cursor-pointer"
      onClick={() => onRemove(toast.id)}
    >
      <div 
        className={`
            relative mx-auto min-h-fit w-full overflow-hidden rounded-2xl p-4
            transition-all duration-200 ease-in-out hover:scale-[103%]
            bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]
            dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]
        `}
      >
        <div className="flex flex-row items-center gap-3">
          <div
            className={`flex size-10 items-center justify-center rounded-2xl ${BG_COLORS[toast.type]}`}
          >
            {ICONS[toast.type]}
          </div>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white">
              <span className="text-sm sm:text-lg">{toast.title}</span>
              <span className="mx-1">·</span>
              <span className="text-xs text-gray-500">Baru saja</span>
            </figcaption>
            {toast.description && (
                <p className="text-sm font-normal dark:text-white/60">
                    {toast.description}
                </p>
            )}
          </div>
        </div>
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
        setToasts((prev) => !prev.length ? [] : prev.filter((t) => t.id !== id)) // Safety check
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
      <div className="fixed top-6 right-0 left-0 flex flex-col items-center justify-start pointer-events-none z-[9999] px-4 gap-2">
         <AnimatePresence mode="popLayout" initial={false}>
           {toasts.map((t) => (
             <ToastItem 
               key={t.id} 
               toast={t} 
               onRemove={removeToast} 
             />
           ))}
         </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
