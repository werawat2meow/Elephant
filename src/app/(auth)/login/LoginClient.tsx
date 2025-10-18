"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession, useSession } from "next-auth/react";

export default function LoginClient() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  // ถ้ามี session อยู่แล้ว (เช่นกดย้อนมาที่ /login) ให้เด้งไปหน้าตาม role
  useEffect(() => {
    if (status === "authenticated") {
      const role = (session as any)?.role as "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER" | undefined;
      if (role === "USER") router.replace("/requests");
      else if (role === "MANAGER") router.replace("/approvals");
      else router.replace("/dashboard"); // MASTER_ADMIN / ADMIN
    }
  }, [status, session, router]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pw.trim()) return alert("กรุณากรอกให้ครบ");

    setLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: pw,
    });
    console.log("[client] signIn result →", res);

    if (!res || !res.ok) {
      setLoading(false);
      return alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    }

    const s = await getSession();
    const role = (s as any)?.role as "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER" | undefined;
    if (role === "USER") router.replace("/requests");
    else if (role === "MANAGER") router.replace("/approvals");
    else router.replace("/dashboard");
  };

  return (
    <main className="min-h-dvh flex justify-center items-start pt-20 px-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <div className="relative flex gap-2 bg-[#101216] neon-tabs rounded-full p-2">
          <button
            className={`relative z-10 px-6 py-2 font-bold rounded-full ${tab === "login" ? "text-[#001418]" : "text-[#a3adc2]"}`}
            onClick={() => setTab("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`relative z-10 px-6 py-2 font-bold rounded-full ${tab === "signup" ? "text-[#001418]" : "text-[#a3adc2]"}`}
            onClick={() => setTab("signup")}
            type="button"
          >
            Signup
          </button>
          <span className={`absolute inset-y-1 left-1 w-1/2 rounded-full bg-[var(--cyan)]
                        transition-transform duration-200 shadow-[0_0_10px_var(--cyan),0_0_24px_var(--cyan)]
                        ${tab === "signup" ? "translate-x-full" : ""}`} />
        </div>

        <section className="neon-card w-full rounded-2xl p-7 text-center">
          <h1 className="neon-title text-2xl font-bold mb-4">
            {tab === "login" ? "Login" : "Create account"}
          </h1>

          <form onSubmit={onSubmit} className="grid gap-4 text-left">
            <label className="block">
              <span className="sr-only">Email</span>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="neon-input w-full rounded-xl px-4 py-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <input
                id="pw"
                type="password"
                placeholder="Password"
                className="neon-input w-full rounded-xl px-4 py-3 outline-none"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
                autoComplete="current-password"
              />
            </label>

            {tab === "signup" && (
              <p className="text-sm text-[#a3adc2]">(เดโม่: ปุ่ม Sign up ยังไม่ผูกระบบ)</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="neon-cta mt-1 w-fit mx-auto rounded-xl px-5 py-3 font-extrabold active:translate-y-[1px] disabled:opacity-60"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : tab === "login" ? "Login" : "Sign up"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
