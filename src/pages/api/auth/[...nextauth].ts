import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("Auth attempt for:", credentials?.email);
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }
          let user;
          try {
            user = await prisma.user.findUnique({
              where: { email: credentials.email },
            });
            console.log("Found user:", !!user);
          } catch (dbErr) {
            console.error("DB lookup error", dbErr);
            return null;
          }
          if (!user || !user.password) {
            console.log("No user or no password");
            return null;
          }
          let isValid = false;
          try {
            isValid = await compare(credentials.password, user.password);
          } catch (cmpErr) {
            console.error("bcrypt compare error", cmpErr);
            return null;
          }
          console.log("Password valid:", isValid);
          if (!isValid) return null;
          console.log("Auth success for:", credentials.email);
          return user;
        } catch (err) {
          console.error("Authorize error", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
  },
});
