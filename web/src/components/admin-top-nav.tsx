"use client"

import Link from "next/link"
import { User, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AdminProfileDropdown({ showLabel = false }: { showLabel?: boolean }) {
  const router = useRouter()
  
  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()
      if (error) {
          console.error("Logout error", error)
      }
      router.push("/admin/login")
      router.refresh()
  }

  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="ghost" size="sm" className={`rounded-full ${showLabel ? 'px-2' : 'w-9 h-9 px-0'}`}>
              <div className="bg-primary/10 p-1 rounded-full shrink-0">
                 <User className="h-5 w-5" />
              </div>
              {showLabel && (
                  <span className="ml-2 text-sm font-medium">Profil</span>
              )}
           </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="z-[100]">
           <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
           <DropdownMenuSeparator />
           <DropdownMenuItem asChild>
              <Link href="/admin/profile" className="cursor-pointer">
                 <User className="mr-2 h-4 w-4" /> Profil
              </Link>
           </DropdownMenuItem>
           <DropdownMenuItem asChild>
              <Link href="/admin/settings" className="cursor-pointer">
                 <Settings className="mr-2 h-4 w-4" /> Pengaturan
              </Link>
           </DropdownMenuItem>
           <DropdownMenuSeparator />
           <DropdownMenuItem className="text-red-600 cursor-pointer" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Keluar
           </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
  )
}

export function AdminTopNav() {
  return (
    <div className="flex items-center gap-2">
      <AnimatedThemeToggler />
      <AdminProfileDropdown />
    </div>
  )
}
