/*
  Warnings:

  - You are about to drop the column `service` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `whoWith` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Stylist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_realSalonId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_salonId_fkey";

-- DropForeignKey
ALTER TABLE "Stylist" DROP CONSTRAINT "Stylist_salonId_fkey";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "service",
DROP COLUMN "whoWith";

-- DropTable
DROP TABLE "Service";

-- DropTable
DROP TABLE "Stylist";
