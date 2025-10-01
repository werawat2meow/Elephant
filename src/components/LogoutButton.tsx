"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const onLogout = () => {
    localStorage.removeItem("demo-auth");
    router.replace("/login");
  };

  return (
    <button
      onClick={onLogout}
      className="px-4 py-2 rounded-xl font-semibold text-[#001418]
                 bg-gradient-to-r from-[#ff3c3c] to-[#ff6b6b]
                 shadow-[0_0_12px_rgba(255,60,60,0.6),0_0_24px_rgba(255,60,60,0.4)]
                 hover:scale-105 active:scale-95
                 transition-transform duration-150 ease-in-out"
    >
      Logout
    </button>
  );
}
