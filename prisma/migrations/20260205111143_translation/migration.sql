/*
  Warnings:

  - You are about to drop the column `label` on the `AttributeDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `options` on the `AttributeDefinition` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SubCategory` table. All the data in the column will be lost.
  - Added the required column `key` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "AttributeDefinition_subCategoryId_idx";

-- AlterTable
ALTER TABLE "AttributeDefinition" DROP COLUMN "label",
DROP COLUMN "options";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "name",
ADD COLUMN     "key" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "SubCategoryTranslation" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subCategoryId" TEXT NOT NULL,

    CONSTRAINT "SubCategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeTranslation" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "AttributeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,

    CONSTRAINT "AttributeOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AttributeOptionTranslation" (
    "id" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "AttributeOptionTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubCategoryTranslation_subCategoryId_idx" ON "SubCategoryTranslation"("subCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategoryTranslation_subCategoryId_lang_key" ON "SubCategoryTranslation"("subCategoryId", "lang");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeTranslation_attributeId_lang_key" ON "AttributeTranslation"("attributeId", "lang");

-- CreateIndex
CREATE INDEX "AttributeOption_attributeId_idx" ON "AttributeOption"("attributeId");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeOption_attributeId_value_key" ON "AttributeOption"("attributeId", "value");

-- CreateIndex
CREATE UNIQUE INDEX "AttributeOptionTranslation_optionId_lang_key" ON "AttributeOptionTranslation"("optionId", "lang");

-- AddForeignKey
ALTER TABLE "SubCategoryTranslation" ADD CONSTRAINT "SubCategoryTranslation_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeTranslation" ADD CONSTRAINT "AttributeTranslation_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOption" ADD CONSTRAINT "AttributeOption_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "AttributeDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AttributeOptionTranslation" ADD CONSTRAINT "AttributeOptionTranslation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "AttributeOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
