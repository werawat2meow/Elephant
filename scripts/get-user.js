const fs = require("fs");
const path = require("path");
// Load .env manually to avoid extra dependency
const envPath = path.resolve(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)=(?:"([^"]*)"|(.*))$/);
    if (m) process.env[m[1]] = m[2] ?? m[3];
  });
}
const { PrismaClient } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@gmail.com" },
    });
    console.log(
      "User:",
      user
        ? {
            id: user.id,
            email: user.email,
            password: user.password ? "[HASHED]" : null,
          }
        : null
    );
  } catch (e) {
    console.error("Error querying user:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
