"use client";
import React from "react";
import { usePathname } from "next/navigation";
import ClientLayout from "./ClientLayout";
import { LanguageProvider } from "../contexts/LanguageContext";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  return (
    <LanguageProvider>
      {isAdmin ? children : <ClientLayout>{children}</ClientLayout>}
    </LanguageProvider>
  );
}
