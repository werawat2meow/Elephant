"use client";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ClientAdminAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    getSession().then((session) => {
      if (!mounted) return;
      if (!session) {
        try { sessionStorage.setItem('jasmine-admin-return', window.location.pathname + window.location.hash); } catch {}
        router.replace("/admin/login");
      } else {
        setChecked(true);
      }
    });
    return () => {
      mounted = false;
    };
  }, [router]);

  if (!checked) return null;
  return <>{children}</>;
}
