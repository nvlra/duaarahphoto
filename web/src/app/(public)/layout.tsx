import { FloatingThemeToggle } from "@/components/ui/floating-theme-toggle";
import { ThemeProvider } from "@/components/theme-provider";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      storageKey="landing-theme"
    >
      {children}
      <FloatingThemeToggle />
    </ThemeProvider>
  );
}
