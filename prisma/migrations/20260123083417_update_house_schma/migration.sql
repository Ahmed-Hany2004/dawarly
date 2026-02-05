/*
  Warnings:

  - Added the required column `display` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "House" ADD COLUMN     "dawarlyphone" TEXT,
ADD COLUMN     "display" BOOLEAN NOT NULL;
