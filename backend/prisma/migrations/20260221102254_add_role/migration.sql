/*
  Warnings:

  - You are about to drop the column `admin` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "admin",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
