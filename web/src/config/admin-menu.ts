import { LucideIcon } from 'lucide-react';
import { 
  ShoppingBagIcon as ShoppingBag, 
  BanknoteIcon as Banknote, 
  ImagesIcon as Images, 
  SettingsIcon as Settings, 
  PackageIcon as Package, 
  UsersIcon as Users,
  HomeIcon as Home
} from "@/components/ui/animated-icons"

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: LucideIcon | React.ComponentType<{ className?: string; size?: number | string } & React.HTMLAttributes<HTMLElement>>;
  showOnMobile?: boolean; // Control visibility on mobile
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    { label: 'Order', href: '/admin/orders', icon: ShoppingBag, showOnMobile: true },
    { label: 'Keuangan', href: '/admin/finance', icon: Banknote, showOnMobile: true },
    { label: 'Tim', href: '/admin/team', icon: Users, showOnMobile: true },
    { label: 'Home', href: '/admin', icon: Home, showOnMobile: true },
    { label: 'Galeri', href: '/admin/gallery', icon: Images, showOnMobile: true },
    { label: 'Paket', href: '/admin/packages', icon: Package, showOnMobile: true },

    { label: 'Konten', href: '/admin/content', icon: Settings, showOnMobile: true },
];
