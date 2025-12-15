import Link from "next/link";
import React from "react";

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-playfair text-2xl font-bold">ENVIEL</h3>
            <p className="text-zinc-400 text-sm max-w-xs">
              Capturing life&apos;s most precious moments with art and soul. Based in
              Indonesia.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Menu</h4>
            <nav className="flex flex-col space-y-2 text-zinc-400">
              <Link href="#" className="hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Stories
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contact</h4>
            <div className="text-zinc-400 space-y-2">
              <p>hello@envielphoto.com</p>
              <p>+62 812 3456 7890</p>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="hover:text-white">
                  Instagram
                </Link>
                <Link href="#" className="hover:text-white">
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Enviel Photography. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
