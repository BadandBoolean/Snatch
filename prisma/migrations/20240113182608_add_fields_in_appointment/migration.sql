/*
  Warnings:

  - Added the required column `providerId` to the `CurrentiCalAppointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "icalApptId" TEXT;

-- AlterTable
ALTER TABLE "CurrentiCalAppointment" ADD COLUMN     "providerId" TEXT NOT NULL;
