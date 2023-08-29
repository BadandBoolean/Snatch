/*
  Warnings:

  - You are about to drop the column `services` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `stylists` on the `Salon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Salon" DROP COLUMN "services",
DROP COLUMN "stylists";

-- CreateTable
CREATE TABLE "Stylist" (
    "id" TEXT NOT NULL,
    "salonname" TEXT NOT NULL DEFAULT 'Salon Name',
    "salonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Stylist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "salonname" TEXT NOT NULL DEFAULT 'Salon Name',
    "salonId" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stylist" ADD CONSTRAINT "Stylist_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
