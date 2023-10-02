-- DropForeignKey
ALTER TABLE "Appointment" DROP CONSTRAINT "Appointment_salonId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "salonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
