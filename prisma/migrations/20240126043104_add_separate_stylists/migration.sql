-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "realSalonId" TEXT;

-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "realSalonId" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "realSalonId" TEXT;

-- CreateTable
CREATE TABLE "RealSalon" (
    "id" TEXT NOT NULL,
    "salonname" TEXT NOT NULL DEFAULT '',
    "physicalAddress" TEXT NOT NULL DEFAULT '',
    "emailAddress" TEXT NOT NULL DEFAULT '',
    "phoneNumber" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "RealSalon_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_realSalonId_fkey" FOREIGN KEY ("realSalonId") REFERENCES "RealSalon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_realSalonId_fkey" FOREIGN KEY ("realSalonId") REFERENCES "RealSalon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_realSalonId_fkey" FOREIGN KEY ("realSalonId") REFERENCES "RealSalon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
