-- DropForeignKey
ALTER TABLE "AttributeDefinition" DROP CONSTRAINT "AttributeDefinition_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeOption" DROP CONSTRAINT "AttributeOption_attributeId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeOptionTranslation" DROP CONSTRAINT "AttributeOptionTranslation_optionId_fkey";

-- DropForeignKey
ALTER TABLE "AttributeTranslation" DROP CONSTRAINT "AttributeTranslation_attributeId_fkey";

-- AddForeignKey
ALTER TABLE "AttributeDefinition" ADD CONSTRAINT "AttributeDefinition_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTranslation" ADD CONSTRAINT "AttributeTranslation_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOption" ADD CONSTRAINT "AttributeOption_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOptionTranslation" ADD CONSTRAINT "AttributeOptionTranslation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "AttributeOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
