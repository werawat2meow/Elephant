// Server Component OK (ไม่มี hooks)
import AutoTranslateLoader from "@/components/AutoTranslateLoader";
import AppHeader from "@/components/AppHeader";
import AppShell from "@/components/AppShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* โหลดตัวแปลภาษา + Navbar */}
      <AutoTranslateLoader />
      <AppHeader />
      <AppShell>{children}</AppShell>
    </>
  );
}
