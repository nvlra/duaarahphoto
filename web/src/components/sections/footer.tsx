import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-muted -mt-[5rem] pt-32 pb-16 relative z-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold text-foreground">ENVIEL</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Capturing life&apos;s most precious moments with art and soul. Based in
              Indonesia.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-foreground">Menu</h4>
            <nav className="flex flex-col space-y-2 text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Portfolio
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Stories
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg text-foreground">Contact</h4>
            <div className="text-muted-foreground space-y-2">
              <p>hello@envielphoto.com</p>
              <p>+62 812 3456 7890</p>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="hover:text-primary">
                  Instagram
                </Link>
                <Link href="#" className="hover:text-primary">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Enviel Photography. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
