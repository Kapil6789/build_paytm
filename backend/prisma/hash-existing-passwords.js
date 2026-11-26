import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Set DATABASE_URL or DIRECT_URL before hashing passwords.");
}

const directUrl = new URL(connectionString);
directUrl.hostname = directUrl.hostname.replace("-pooler.", ".");
const prisma = new PrismaClient({
  datasources: { db: { url: directUrl.toString() } },
});

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
