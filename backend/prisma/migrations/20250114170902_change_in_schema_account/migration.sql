/*
  Warnings:

  - You are about to drop the column `Id` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_Id_fkey";

-- DropIndex
DROP INDEX "Account_Id_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "Id",
ALTER COLUMN "userId" DROP DEFAULT;
DROP SEQUENCE "Account_userId_seq";

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
