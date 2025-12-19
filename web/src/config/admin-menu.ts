
import { 
  ShoppingBagIcon as ShoppingBag, 
  HandCoinsIcon as HandCoins, 
  ImagesIcon as Images, 
  SettingsIcon as Settings, 
  PackageIcon as Package, 
  UsersIcon as Users,
  HomeIcon as Home,
  SquarePenIcon as SquarePen,
  CalendarCheckIcon as Calendar
} from "@/components/ui/animated-icons"

import type { AnimatedIconHandle } from "@/components/ui/animated-icons"

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string } & React.HTMLAttributes<HTMLElement> & React.RefAttributes<AnimatedIconHandle>>;
  showOnMobile?: boolean; // Control visibility on mobile
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    { label: 'Home', href: '/admin', icon: Home, showOnMobile: true },
    { label: 'Pesanan', href: '/admin/orders', icon: ShoppingBag, showOnMobile: true },
    { label: 'Keuangan', href: '/admin/finance', icon: HandCoins, showOnMobile: true },
    { label: 'Kelola Tim', href: '/admin/team', icon: Users, showOnMobile: true },
    { label: 'Kategori & Paket', href: '/admin/packages', icon: Package, showOnMobile: false },
    { label: 'Portfolio', href: '/admin/projects', icon: Images, showOnMobile: true },
    { label: 'Kalender', href: '/admin/calendar', icon: Calendar, showOnMobile: true },
    { label: 'Landing Page', href: '/admin/landing', icon: SquarePen, showOnMobile: false },

    { label: 'Pengaturan', href: '/admin/settings', icon: Settings, showOnMobile: false },
];
