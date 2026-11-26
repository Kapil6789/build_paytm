import bcrypt from "bcrypt";
import prisma from "./db.config.js";

const bcryptHashPattern = /^\$2[aby]\$\d{2}\$/;

try {
  const users = await prisma.user.findMany({
    select: { id: true, password: true },
  });
  let hashedCount = 0;

  for (const user of users) {
    if (bcryptHashPattern.test(user.password)) continue;

    const passwordHash = await bcrypt.hash(user.password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: passwordHash },
    });
    hashedCount += 1;
  }

  console.log(`Hashed ${hashedCount} existing password(s).`);
} catch (error) {
  console.error("Could not hash existing passwords:", error.message);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
