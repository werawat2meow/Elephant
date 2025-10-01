import MainNav from "./MainNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
      {/* Sidebar */}
      <aside className="border-r border-[rgba(255,255,255,.07)]/50 md:min-h-[calc(100dvh-72px)]">
        <MainNav />
      </aside>

      {/* Content */}
      <section className="p-6">{children}</section>
    </div>
  );
}
