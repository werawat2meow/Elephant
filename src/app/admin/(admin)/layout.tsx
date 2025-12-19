import React from "react";
import ClientAdminAuth from "../../ClientAdminAuth";
import AdminHeader from "./components/AdminHeader";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="p-8 text-black bg-gray-50">
          <ClientAdminAuth>{children}</ClientAdminAuth>
        </main>
      </div>
    </div>
  );
}
