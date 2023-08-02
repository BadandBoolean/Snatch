-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "bookingOptions" TEXT[] DEFAULT ARRAY['Phone', 'website', 'Walk-in']::TEXT[];
