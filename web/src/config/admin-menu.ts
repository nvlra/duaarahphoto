
import { 
  ShoppingBagIcon as ShoppingBag, 
  HandCoinsIcon as HandCoins, 
  ImagesIcon as Images, 
  SettingsIcon as Settings, 
  PackageIcon as Package, 
  UsersIcon as Users,
  HomeIcon as Home
} from "@/components/ui/animated-icons"

import type { AnimatedIconHandle } from "@/components/ui/animated-icons"

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; size?: number | string } & React.HTMLAttributes<HTMLElement> & React.RefAttributes<AnimatedIconHandle>>;
  showOnMobile?: boolean; // Control visibility on mobile
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    { label: 'Pesanan', href: '/admin/orders', icon: ShoppingBag, showOnMobile: true },
    { label: 'Keuangan', href: '/admin/finance', icon: HandCoins, showOnMobile: true },
    { label: 'Kelola Tim', href: '/admin/team', icon: Users, showOnMobile: true },
    { label: 'Home', href: '/admin', icon: Home, showOnMobile: true },
    { label: 'Galeri', href: '/admin/gallery', icon: Images, showOnMobile: true },
    { label: 'Kategori & Paket', href: '/admin/packages', icon: Package, showOnMobile: true },
    { label: 'Konten (CMS)', href: '/admin/content', icon: Images, showOnMobile: false }, // Using Images generic icon for now as in old sidebar
    { label: 'Pengaturan', href: '/admin/settings', icon: Settings, showOnMobile: true },
];
