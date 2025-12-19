import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // Added Playfair_Display
import "./globals.css";

const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enviel Admin",
  description: "Admin dashboard for Enviel.",
};

import { ToastProvider } from "@/components/ui/ios-toast";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} font-poppins antialiased`}
      >
            <ToastProvider>
              {children}
            </ToastProvider>
      </body>
    </html>
  );
}
