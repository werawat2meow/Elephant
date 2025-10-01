"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginNeon() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !pw.trim()) {
      alert("กรุณากรอกให้ครบ");
      return;
    }
    // mock login
    localStorage.setItem("demo-auth", "1");
    router.push("/dashboard");
  };

  return (
    <main className="min-h-dvh flex justify-center items-start pt-20 px-4">
      <div className="flex flex-col items-center gap-4 w-full max-w-xl">
        {/* Tabs */}
        <div className="relative flex gap-2 bg-[#101216] neon-tabs rounded-full p-2">
          <button
            className={`relative z-10 px-6 py-2 font-bold rounded-full ${
              tab === "login" ? "text-[#001418]" : "text-[#a3adc2]"
            }`}
            onClick={() => setTab("login")}
            type="button"
          >
            Login
          </button>
          <button
            className={`relative z-10 px-6 py-2 font-bold rounded-full ${
              tab === "signup" ? "text-[#001418]" : "text-[#a3adc2]"
            }`}
            onClick={() => setTab("signup")}
            type="button"
          >
            Signup
          </button>
          <span
            className={`absolute inset-y-1 left-1 w-1/2 rounded-full bg-[var(--cyan)]
                        transition-transform duration-200 shadow-[0_0_10px_var(--cyan),0_0_24px_var(--cyan)]
                        ${tab === "signup" ? "translate-x-full" : ""}`}
          />
        </div>

        {/* Card */}
        <section className="neon-card w-full rounded-2xl p-7 text-center">
          <h1 className="neon-title text-2xl font-bold mb-4">
            {tab === "login" ? "Login" : "Create account"}
          </h1>

          <form onSubmit={onSubmit} className="grid gap-4 text-left">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                className="neon-input w-full rounded-xl px-4 py-3 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="pw" className="sr-only">Password</label>
              <input
                id="pw"
                type="password"
                placeholder="Password"
                className="neon-input w-full rounded-xl px-4 py-3 outline-none"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                required
              />
            </div>

            {tab === "signup" && (
              <p className="text-sm text-[#a3adc2]">
                (เดโม่: ปุ่ม Sign up ยังไม่ผูกระบบ)
              </p>
            )}

            <button
              type="submit"
              className="neon-cta mt-1 w-fit mx-auto rounded-xl px-5 py-3 font-extrabold active:translate-y-[1px]"
            >
              {tab === "login" ? "Login" : "Sign up"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
