const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

// Load .env manually
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(?:"([^"]*)"|(.*))$/);
    if (m) process.env[m[1]] = m[2] ?? m[3];
  });
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const email = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
    const plain = process.env.SEED_ADMIN_PASSWORD || "Admin123!";
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("No user found with email", email);
      return;
    }
    if (!user.password) {
      console.log("User has no password stored");
      return;
    }
    const ok = await bcrypt.compare(plain, user.password);
    console.log("Email:", email);
    console.log("Stored password hash:", user.password.slice(0, 60) + "...");
    console.log("Plain (from .env):", plain);
    console.log("Password matches hash?:", ok);
  } catch (e) {
    console.error("Error checking password:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
