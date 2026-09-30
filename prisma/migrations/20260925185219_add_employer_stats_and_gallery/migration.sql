-- AlterTable
ALTER TABLE "collectivites" ADD COLUMN     "ageMoyen" DOUBLE PRECISION,
ADD COLUMN     "photosGallery" JSONB DEFAULT '[]',
ADD COLUMN     "ratioFemmes" DOUBLE PRECISION;
