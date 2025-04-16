-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "balance" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" INTEGER NOT NULL DEFAULT 0;
