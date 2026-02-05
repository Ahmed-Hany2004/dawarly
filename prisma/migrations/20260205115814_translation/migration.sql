-- DropForeignKey
ALTER TABLE "SubCategoryTranslation" DROP CONSTRAINT "SubCategoryTranslation_subCategoryId_fkey";

-- AddForeignKey
ALTER TABLE "SubCategoryTranslation" ADD CONSTRAINT "SubCategoryTranslation_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
