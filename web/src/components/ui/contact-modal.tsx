"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more-icon";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
  // Dummy Data
  const whatsappNumber = "628123456789";
  const instagramUrl = "https://instagram.com/envielphoto"; // Dummy URL
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm z-[101] px-4"
          >
            <div className="bg-background/90 backdrop-blur-md border border-border p-6 rounded-3xl shadow-2xl relative overflow-hidden dark:bg-neutral-900/90 dark:border-neutral-800">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>

              <div className="text-center mb-8">
                <h3 className="font-playfair text-2xl font-bold mb-2">Get in Touch</h3>
                <p className="text-muted-foreground text-sm">
                  We&apos;d love to hear from you. Choose your preferred way to connect.
                </p>
              </div>

              <div className="space-y-4">
                {/* WhatsApp Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border border-transparent transition-all duration-300",
                    "bg-secondary/50 hover:bg-secondary border-border/50",
                    "group cursor-pointer"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <MessageCircleMoreIcon size={20} className="text-background hover:text-background p-0 hover:bg-transparent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">Chat with us directly</div>
                  </div>
                </a>

                {/* Instagram Button */}
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border border-transparent transition-all duration-300",
                    "bg-secondary/50 hover:bg-secondary border-border/50",
                    "group cursor-pointer"
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <InstagramIcon size={20} className="text-background hover:text-background p-0 hover:bg-transparent" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Instagram</div>
                    <div className="text-xs text-muted-foreground">Follow our latest work</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
