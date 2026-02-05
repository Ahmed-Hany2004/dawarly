-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "propertyId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "House" ADD COLUMN     "description" TEXT,
ALTER COLUMN "location" DROP DEFAULT,
ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "tags" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Properties_for_rent" ADD COLUMN     "description" TEXT;
