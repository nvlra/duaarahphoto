import Link from "next/link";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { MessageCircleMoreIcon } from "@/components/ui/message-circle-more-icon";
import React from "react";

interface FooterProps {
  data?: {
    brandName?: string;
    copyrightText?: string;
    instagramLink?: string;
    whatsappLink?: string;
  };
}

export function Footer({ data }: FooterProps) {
  const brandName = data?.brandName || "ENVIEL";
  const copyrightText = data?.copyrightText || `© ${new Date().getFullYear()} Enviel Phoject.`;
  const instagramLink = data?.instagramLink || "https://instagram.com/nvlra";
  const whatsappLink = data?.whatsappLink || "https://wa.me/6281200000000";

  return (
    <footer className="bg-background text-foreground pt-12 pb-32 md:py-12 relative z-10 border-t border-border/50">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h3 
            className="font-playfair text-xl font-bold"
            dangerouslySetInnerHTML={{ __html: brandName }}
          />
          <p 
            className="text-muted-foreground text-sm mt-1"
            dangerouslySetInnerHTML={{ __html: copyrightText }}
          />
        </div>

        <div className="flex gap-4 items-center">
          <Link href={instagramLink} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
             <InstagramIcon className="text-muted-foreground hover:text-foreground hover:bg-transparent" size={24} />
          </Link>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
             <MessageCircleMoreIcon className="text-muted-foreground hover:text-foreground hover:bg-transparent" size={24} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
