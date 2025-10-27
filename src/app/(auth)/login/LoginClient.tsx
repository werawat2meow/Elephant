"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

type Role = "MASTER_ADMIN" | "ADMIN" | "MANAGER" | "USER";

export default function LoginClient() {
  const router = useRouter();
  const { status, data: session, update } = useSession();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  // ถ้ามี session อยู่แล้ว ให้เด้งไปหน้าตาม role
  useEffect(() => {
    if (status === "authenticated") {
      const role =
        ((session as any)?.user?.role as Role | undefined) ??
        ((session as any)?.role as Role | undefined);
      if (role === "USER") router.replace("/requests");
      else if (role === "MANAGER") router.replace("/approvals");
      else router.replace("/dashboard");
    }
  }, [status, session, router]);

  const redirectByRole = (role?: Role) => {
    if (role === "USER") router.replace("/requests");
    else if (role === "MANAGER") router.replace("/approvals");
    else router.replace("/dashboard");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pw.trim()) return alert("กรุณากรอกให้ครบ");

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password: pw,
      });
      console.log("[client] signIn result →", res);

      if (!res || !res.ok) {
        alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        return;
      }

      const fresh = (await update()) as any;
      const role: Role | undefined =
        fresh?.user?.role ?? fresh?.role ?? (session as any)?.user?.role;

      if (!role) {
        await router.refresh();
      }
      redirectByRole(role);
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh flex justify-center items-start pt-20 px-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        <section className="neon-card w-full rounded-2xl p-7 text-center">
          <h1 className="neon-title text-2xl font-bold mb-4">Login</h1>

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

            <button
              type="submit"
              disabled={loading}
              className="neon-cta mt-1 w-fit mx-auto rounded-xl px-5 py-3 font-extrabold active:translate-y-[1px] disabled:opacity-60"
            >
              {loading ? "กำลังเข้าสู่ระบบ..." : "Login"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
