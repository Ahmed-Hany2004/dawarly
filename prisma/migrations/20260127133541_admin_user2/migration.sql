/*
  Warnings:

  - You are about to drop the column `isAdmin` on the `UserProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UserProfile" DROP COLUMN "isAdmin";
