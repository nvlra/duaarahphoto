"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { 
  HomeIcon as Home,
  type AnimatedIconHandle
} from "@/components/ui/animated-icons"

import { ADMIN_MENU_ITEMS, type AdminMenuItem } from "@/config/admin-menu"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

interface SidebarMenuItemProps {
  item: AdminMenuItem;
  isActive: boolean;
}

const SidebarMenuItem = ({ item, isActive }: SidebarMenuItemProps) => {
  const iconRef = React.useRef<AnimatedIconHandle>(null);
  
  return (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={cn(
        "w-full justify-start relative overflow-hidden group/btn",
        isActive ? "bg-secondary" : "hover:bg-transparent"
      )}
      asChild
      onMouseEnter={() => {
        iconRef.current?.startAnimation?.();
      }}
      onMouseLeave={() => {
        iconRef.current?.stopAnimation?.();
      }}
    >
      <Link href={item.href}>
        {isActive && (
           <motion.div
             layoutId="active-nav-bg"
             className="absolute inset-0 bg-primary/10 border-l-2 border-primary"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
           />
        )}
        <item.icon 
          ref={iconRef}
          className="mr-3 h-4 w-4 opacity-70 group-hover/btn:opacity-100 transition-opacity" 
          size={16} 
        />
        <span className="relative z-10">{item.label}</span>
      </Link>
    </Button>
  );
};

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()
  const [brand, setBrand] = useState<{ name: string; logo: string }>({
    name: "Enviel Admin",
    logo: "" 
  })

  useEffect(() => {
    const fetchBrand = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('invoice_settings')
                .select('brand_name, brand_logo_url')
                .eq('user_id', user.id)
                .single()
            
            if (data) {
                setBrand({
                    name: data.brand_name || "Enviel Admin",
                    logo: data.brand_logo_url || ""
                })
            }
        }
    }
    fetchBrand()
  }, [])

  return (
    <div className={cn("pb-12 h-full bg-background border-r", className)}>
      <div className="space-y-6 py-6 px-4">
        {/* Brand Title with Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
            <Avatar className="h-10 w-10 rounded-lg border bg-muted/20">
               {brand.logo ? (
                   <AvatarImage src={brand.logo} alt={brand.name} className="object-cover" />
               ) : (
                   <AvatarImage src="https://github.com/shadcn.png" alt="Enviel" />
               )}
               <AvatarFallback className="rounded-lg">{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
               <h1 className="text-lg font-bold tracking-tight text-foreground leading-none truncate">
                  {brand.name}
               </h1>
               <p className="text-sm text-muted-foreground mt-1 font-medium">Admin Dashboard</p>
            </div>
        </div>

        {/* Home Button - Prominent (Black/Primary) */}
        <div>
           <Button
              variant={pathname === "/admin" ? "default" : "outline"}
              className={cn(
                "w-full justify-start h-10 px-4 font-medium text-sm shadow-sm",
                pathname === "/admin" 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 border-none" 
                  : "text-muted-foreground hover:text-foreground border-transparent bg-muted/50 hover:bg-muted"
              )}
              asChild
           >
              <Link href="/admin">
                <Home className="mr-3 h-4 w-4" size={16} />
                Home
              </Link>
           </Button>
        </div>

        {/* Main Menu Section */}
        <div className="px-3 py-2">
          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
              Main Menu
            </h2>
            {ADMIN_MENU_ITEMS.filter(item => item.label !== 'Home').map((item, index) => (
               <SidebarMenuItem 
                 key={index} 
                 item={item} 
                 isActive={pathname === item.href || pathname.startsWith(item.href + '/')} 
               />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 p-0 w-72">
        <Sidebar className="pt-4 border-r-0" />
      </SheetContent>
    </Sheet>
  )
}
