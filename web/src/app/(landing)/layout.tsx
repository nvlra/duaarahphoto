import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <FloatingThemeToggle />
    </>
  );
}
