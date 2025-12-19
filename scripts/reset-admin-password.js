const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email =
    process.argv[2] || process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
  const newPassword = process.argv[3] || "Admin123!";
  const hash = await bcrypt.hash(newPassword, 10);

  const result = await prisma.user.updateMany({
    where: { email },
    data: { password: hash },
  });

  console.log("Updated users count:", result.count);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
