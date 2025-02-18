/*
  Warnings:

  - A unique constraint covering the columns `[Id]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Id` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "Id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_Id_key" ON "Account"("Id");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_Id_fkey" FOREIGN KEY ("Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
