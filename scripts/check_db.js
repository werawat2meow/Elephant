const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Connecting to DB...");
  // list public tables
  const tables =
    await prisma.$queryRaw`SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;`;
  console.log("\nPublic tables:");
  console.table(tables);

  // check prisma migrations table
  try {
    const migrations =
      await prisma.$queryRaw`SELECT id, migration_name, finished_at FROM public."_prisma_migrations" ORDER BY finished_at DESC LIMIT 5;`;
    console.log("\n_prisma_migrations:");
    console.table(migrations);
  } catch (e) {
    console.log("\n_prisma_migrations not found or query failed:", e.message);
  }

  // check User row
  try {
    const user = await prisma.user.findUnique({
      where: { email: process.env.SEED_ADMIN_EMAIL || "admin@gmail.com" },
    });
    console.log("\nSeed admin user:");
    console.log(
      user
        ? {
            id: user.id,
            email: user.email,
            passwordSample: user.password
              ? user.password.slice(0, 40) + "..."
              : null,
          }
        : "No user found"
    );
  } catch (e) {
    console.log("\nError querying User table:", e.message);
  }

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
