-- AlterTable
ALTER TABLE "House" ADD COLUMN     "pinding" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "display" SET DEFAULT false;

-- AlterTable
ALTER TABLE "UserProfile" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
