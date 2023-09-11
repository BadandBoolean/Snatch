/*
  Warnings:

  - You are about to drop the column `salonId` on the `ClientEmailAddress` table. All the data in the column will be lost.
  - You are about to drop the column `salonId` on the `ClientPhoneNumber` table. All the data in the column will be lost.
  - You are about to drop the column `salonId` on the `ProdClientEmailAddress` table. All the data in the column will be lost.
  - You are about to drop the column `salonId` on the `ProdClientPhoneNumber` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClientEmailAddress" DROP COLUMN "salonId";

-- AlterTable
ALTER TABLE "ClientPhoneNumber" DROP COLUMN "salonId";

-- AlterTable
ALTER TABLE "ProdClientEmailAddress" DROP COLUMN "salonId";

-- AlterTable
ALTER TABLE "ProdClientPhoneNumber" DROP COLUMN "salonId";

-- CreateTable
CREATE TABLE "DevPhoneOnSalon" (
    "phoneId" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,

    CONSTRAINT "DevPhoneOnSalon_pkey" PRIMARY KEY ("phoneId","salonId")
);

-- CreateTable
CREATE TABLE "DevEmailOnSalon" (
    "emailId" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,

    CONSTRAINT "DevEmailOnSalon_pkey" PRIMARY KEY ("emailId","salonId")
);

-- CreateTable
CREATE TABLE "ProdPhoneOnSalon" (
    "phoneId" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,

    CONSTRAINT "ProdPhoneOnSalon_pkey" PRIMARY KEY ("phoneId","salonId")
);

-- CreateTable
CREATE TABLE "ProdEmailOnSalon" (
    "emailId" TEXT NOT NULL,
    "salonId" TEXT NOT NULL,

    CONSTRAINT "ProdEmailOnSalon_pkey" PRIMARY KEY ("emailId","salonId")
);

-- AddForeignKey
ALTER TABLE "DevPhoneOnSalon" ADD CONSTRAINT "DevPhoneOnSalon_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "ClientPhoneNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevPhoneOnSalon" ADD CONSTRAINT "DevPhoneOnSalon_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevEmailOnSalon" ADD CONSTRAINT "DevEmailOnSalon_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "ClientEmailAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevEmailOnSalon" ADD CONSTRAINT "DevEmailOnSalon_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdPhoneOnSalon" ADD CONSTRAINT "ProdPhoneOnSalon_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "ProdClientPhoneNumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdPhoneOnSalon" ADD CONSTRAINT "ProdPhoneOnSalon_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdEmailOnSalon" ADD CONSTRAINT "ProdEmailOnSalon_emailId_fkey" FOREIGN KEY ("emailId") REFERENCES "ProdClientEmailAddress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdEmailOnSalon" ADD CONSTRAINT "ProdEmailOnSalon_salonId_fkey" FOREIGN KEY ("salonId") REFERENCES "Salon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
