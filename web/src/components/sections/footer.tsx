import Link from "next/link";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more-icon";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-background text-foreground pt-12 pb-32 md:py-12 relative z-10 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 className="font-playfair text-xl font-bold">ENVIEL</h3>
          <p className="text-muted-foreground text-sm mt-1">
             © {new Date().getFullYear()} Enviel Photography.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="https://instagram.com/envielphoto" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
             <InstagramIcon className="text-muted-foreground hover:text-foreground hover:bg-transparent" size={24} />
          </Link>
          <Link href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
             <MessageCircleMoreIcon className="text-muted-foreground hover:text-foreground hover:bg-transparent" size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
