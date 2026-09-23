import prisma from "./db.config.js";

const demoUsers = Array.from({ length: 10 }, (_, index) => {
  const number = String(index + 1).padStart(2, "0");
  const balance = (index + 1) * 1000;

  return {
    username: `demo.user${number}@example.com`,
    password: `demo-password-${number}`,
    firstName: `Demo${number}`,
    lastName: "User",
    balance,
  };
});

try {
  for (const data of demoUsers) {
    const user = await prisma.user.upsert({
      where: { password: data.password },
      update: {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        balance: data.balance,
      },
      create: data,
    });

    await prisma.account.upsert({
      where: { userId: user.id },
      update: { balance: data.balance },
      create: { userId: user.id, balance: data.balance },
    });
  }

  console.log("Seeded 10 demo users and accounts.");
} catch (error) {
  console.error("Could not seed the database:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
