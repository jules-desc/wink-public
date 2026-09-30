/*
  Warnings:

  - Made the column `codeInsee` on table `collectivites` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "collectivites" ALTER COLUMN "codeInsee" SET NOT NULL;
