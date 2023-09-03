-- AlterTable
ALTER TABLE "ClientEmailAddress" ADD COLUMN     "salonId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "ClientPhoneNumber" ADD COLUMN     "salonId" TEXT NOT NULL DEFAULT '';
