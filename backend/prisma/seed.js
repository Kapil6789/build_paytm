import prisma from "./db.config.js";
import bcrypt from "bcrypt";

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
    const passwordHash = await bcrypt.hash(data.password, 12);
    const existingUser = await prisma.user.findFirst({
      where: { username: data.username },
      select: { id: true },
    });
    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: { ...data, password: passwordHash },
          select: { id: true },
        })
      : await prisma.user.create({
          data: { ...data, password: passwordHash },
          select: { id: true },
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
