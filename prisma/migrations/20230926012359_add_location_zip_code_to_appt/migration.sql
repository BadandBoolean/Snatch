-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "location" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "zipcode" TEXT NOT NULL DEFAULT '';
