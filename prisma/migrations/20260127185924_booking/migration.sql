-- AlterTable
ALTER TABLE "House" ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'null',
ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tags" JSONB NOT NULL DEFAULT 'null';

-- CreateTable
CREATE TABLE "Properties_for_rent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,
    "display" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "dawarlyphone" TEXT,
    "price" INTEGER NOT NULL,
    "location" TEXT NOT NULL,
    "tags" JSONB NOT NULL,
    "pinding" BOOLEAN NOT NULL DEFAULT false,
    "attributes" JSONB NOT NULL,

    CONSTRAINT "Properties_for_rent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "propertyId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);
