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
    <div className="flex h-screen w-full overflow-hidden flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-muted/40 md:block shrink-0">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Main Content Area */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Header (absolute top) */}
          <header className="absolute top-0 left-0 right-0 h-14 flex items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 z-50 transition-all">
            
            {/* Left Section */}
            <div className="flex items-center gap-4 z-10">
               {/* Mobile: Theme Toggler on Left */}
               <div className="md:hidden">
                  <AnimatedThemeToggler />
               </div>
               
               {/* Desktop: Breadcrumbs or Title (Hidden on Mobile) */}
               <div className="hidden md:block">
                   {/* Breadcrumb Placeholder */}
               </div>
            </div>

            {/* Center Section (Mobile Only - Title) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
              <MobileNavHeader />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 z-10">
                {/* Desktop: Theme Toggler on Right */}
                <div className="hidden md:block">
                   <AnimatedThemeToggler />
                </div>

                {/* Profile: Show text on mobile, icon only on desktop */}
                <div className="md:hidden">
                   <AdminProfileDropdown showLabel={true} />
                </div>
                <div className="hidden md:block">
                   <AdminProfileDropdown showLabel={true} />
                </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <main className="flex-1 overflow-y-auto w-full">
            <div className="px-6 md:px-8 pb-32 md:pb-8 pt-20 md:pt-24">
              {children}
            </div>
          </main>
        </div>
      </div>


      {/* Modern Mobile Menu (Floating Dock) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
         <InteractiveMenu />
      </div>
    </div>
  )
}
