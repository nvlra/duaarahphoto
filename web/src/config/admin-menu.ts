import { Home, ShoppingBag, Banknote, Images, Users, Package, FileText, Settings, LucideIcon } from 'lucide-react';

export interface AdminMenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
    { label: 'Order', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Keuangan', href: '/admin/finance', icon: Banknote },
    { label: 'Tim', href: '/admin/team', icon: Users },
    { label: 'Home', href: '/admin', icon: Home },
    { label: 'Galeri', href: '/admin/gallery', icon: Images },
    { label: 'Paket', href: '/admin/packages', icon: Package },
    { label: 'Invoice', href: '/admin/invoices', icon: FileText },
    { label: 'Konten', href: '/admin/content', icon: Settings },
];
