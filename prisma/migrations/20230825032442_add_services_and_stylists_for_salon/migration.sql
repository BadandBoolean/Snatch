-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "services" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stylists" TEXT[] DEFAULT ARRAY[]::TEXT[];
