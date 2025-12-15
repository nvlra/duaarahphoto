import { ThemeProvider } from "@/components/theme-provider";
import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="landing-theme"
    >
      {children}
      <FloatingThemeToggle />
    </ThemeProvider>
  );
}
