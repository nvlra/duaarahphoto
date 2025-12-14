import { Sidebar } from "@/components/admin-sidebar"
import { AdminProfileDropdown } from "@/components/admin-top-nav"
import { MobileNavHeader } from "@/components/mobile-nav-header"
import { InteractiveMenu } from "@/components/ui/modern-mobile-menu"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-dvh w-full overflow-hidden flex-row">
      <aside className="hidden w-64 border-r bg-muted/40 md:block shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="relative flex-1 flex flex-col overflow-hidden">
          <header className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between gap-2 md:gap-4 border-b bg-background/80 backdrop-blur-md px-3 md:px-6 z-50 transition-all">
            
            <div className="flex items-center gap-2 md:gap-4 z-10">
               <div className="md:hidden">
                  <AnimatedThemeToggler />
               </div>
               
               <div className="hidden md:block">
               </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
              <MobileNavHeader />
            </div>

            <div className="flex items-center gap-2 z-10">
                <div className="hidden md:block">
                   <AnimatedThemeToggler />
                </div>

                <div className="md:hidden">
                   <AdminProfileDropdown showLabel={true} />
                </div>
                <div className="hidden md:block">
                   <AdminProfileDropdown showLabel={true} />
                </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto w-full">
            <div className="px-4 md:px-8 pb-24 md:pb-8 pt-20 md:pt-24">
              {children}
            </div>
          </main>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 md:hidden">
         <InteractiveMenu />
      </div>
    </div>
  )
}
