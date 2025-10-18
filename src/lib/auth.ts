import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        if (!c?.email || !c?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: c.email } });
        if (!user) return null;
        const ok = await bcrypt.compare(c.password, user.passwordHash);
        if (!ok) return null;
        return { id: String(user.id), email: user.email, name: user.name ?? "", role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      console.log("[cb] jwt:before →", { token, user, account, trigger, session });
      if (user && (user as any).role) token.role = (user as any).role; // ยัด role ลง token
      console.log("[cb] jwt:after  →", token);
      return token;
    },
    async session({ session, token }) {
      console.log("[cb] session:before →", { session, token });
      if (token && (token as any).role) (session as any).role = (token as any).role; // map role
      console.log("[cb] session:after  →", session);
      return session;
    },
  },
  pages: { signIn: "/login" },
  debug: true, // เปิด log ของ next-auth เพิ่ม
};
