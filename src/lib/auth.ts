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
    async jwt({ token, user }) { if (user) token.role = (user as any).role; return token; },
    async session({ session, token }) { (session as any).role = token.role; return session; },
  },
  pages: { signIn: "/login" },
};
