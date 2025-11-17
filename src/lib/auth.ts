import { prisma } from "@/lib/prisma";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: { email: {}, password: {} },
      async authorize(c) {
        console.log("AUTH DEBUG: start authorize", c);

        if (!c?.email || !c?.password) {
          console.log("AUTH DEBUG: missing email or password");
          return null;
        }

        // 1) หา user จาก DB
        const user = await prisma.user.findUnique({
          where: { email: c.email },
        });
        console.log("AUTH DEBUG: user from DB =", user);

        if (!user) {
          console.log("AUTH DEBUG: user not found");
          return null;
        }

        // check password
        const ok = await bcrypt.compare(c.password, user.passwordHash);
        console.log("AUTH DEBUG: password valid =", ok);

        if (!ok) {
          console.log("AUTH DEBUG: password incorrect");
          return null;
        }

        // 2) หา employee เพื่อนำ idCard
        const emp = await prisma.employee.findFirst({
          where: {
            OR: [{ userId: user.id }, { email: user.email }],
          },
          select: { idCard: true },
        });

        console.log("AUTH DEBUG: employee =", emp);

        // 3) คืนข้อมูล user เพื่อใส่ใน token
        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? "",
          role: user.role,
          idCard: emp?.idCard ?? null,
        } as any;
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = (user as any).id;
        (token as any).role = (user as any).role;
        (token as any).idCard = (user as any).idCard ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) (session.user as any).id = Number(token.sub);
      if ((token as any).idCard) (session.user as any).idCard = (token as any).idCard;
      if ((token as any).role) (session as any).role = (token as any).role;
      return session;
    },
  },

  pages: { signIn: "/login" },
  debug: true,
};
