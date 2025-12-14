"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Images, ShoppingBag, Banknote, Settings, Menu, Package, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Pesanan",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    title: "Keuangan",
    href: "/admin/finance",
    icon: Banknote,
  },
  {
    title: "Kelola Tim",
    href: "/admin/team",
    icon: Users,
  },
  {
    title: "Galeri",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Kategori & Paket",
    href: "/admin/packages",
    icon: Package,
  },
  {
    title: "Konten (CMS)",
    href: "/admin/content",
    icon: Images,
  },
  {
    title: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12 h-full bg-background border-r", className)}>
      <div className="space-y-6 py-6 px-4">
        {/* Brand Title with Logo */}
        <div className="flex items-center gap-3 px-2 mb-6">
            <Avatar className="h-10 w-10 rounded-lg">
               <AvatarImage src="https://github.com/shadcn.png" alt="Duaarah" />
               <AvatarFallback className="rounded-lg">DP</AvatarFallback>
            </Avatar>
            <div>
               <h1 className="text-lg font-bold tracking-tight text-foreground leading-none">
                  Enviel Admin
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
                <LayoutDashboard className="mr-3 h-4 w-4" />
                Home
              </Link>
           </Button>
        </div>

        {/* Main Menu Section */}
        <div>
           <h3 className="mb-2 px-4 text-sm font-medium text-muted-foreground">
             Main Menu
           </h3>
           <div className="space-y-1">
             {sidebarItems.map((item) => (
               <Button
                 key={item.href}
                 variant="ghost"
                 className={cn(
                   "w-full justify-start h-10 px-4 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                   pathname.startsWith(item.href) && "text-foreground bg-muted font-medium"
                 )}
                 asChild
               >
                 <Link href={item.href}>
                   <item.icon className="mr-3 h-4 w-4 opacity-70" />
                   {item.title}
                 </Link>
               </Button>
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
