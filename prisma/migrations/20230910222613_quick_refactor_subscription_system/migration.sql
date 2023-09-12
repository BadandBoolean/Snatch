/*
  Warnings:

  - You are about to drop the `ClientEmailAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ClientPhoneNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DevEmailOnSalon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DevPhoneOnSalon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdClientEmailAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdClientPhoneNumber` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdEmailOnSalon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProdPhoneOnSalon` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DevEmailOnSalon" DROP CONSTRAINT "DevEmailOnSalon_emailId_fkey";

-- DropForeignKey
ALTER TABLE "DevEmailOnSalon" DROP CONSTRAINT "DevEmailOnSalon_salonId_fkey";

-- DropForeignKey
ALTER TABLE "DevPhoneOnSalon" DROP CONSTRAINT "DevPhoneOnSalon_phoneId_fkey";

-- DropForeignKey
ALTER TABLE "DevPhoneOnSalon" DROP CONSTRAINT "DevPhoneOnSalon_salonId_fkey";

-- DropForeignKey
ALTER TABLE "ProdEmailOnSalon" DROP CONSTRAINT "ProdEmailOnSalon_emailId_fkey";

-- DropForeignKey
ALTER TABLE "ProdEmailOnSalon" DROP CONSTRAINT "ProdEmailOnSalon_salonId_fkey";

-- DropForeignKey
ALTER TABLE "ProdPhoneOnSalon" DROP CONSTRAINT "ProdPhoneOnSalon_phoneId_fkey";

-- DropForeignKey
ALTER TABLE "ProdPhoneOnSalon" DROP CONSTRAINT "ProdPhoneOnSalon_salonId_fkey";

-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "phoneSubsDev" TEXT[],
ADD COLUMN     "phoneSubsProd" TEXT[];

-- DropTable
DROP TABLE "ClientEmailAddress";

-- DropTable
DROP TABLE "ClientPhoneNumber";

-- DropTable
DROP TABLE "DevEmailOnSalon";

-- DropTable
DROP TABLE "DevPhoneOnSalon";

-- DropTable
DROP TABLE "ProdClientEmailAddress";

-- DropTable
DROP TABLE "ProdClientPhoneNumber";

-- DropTable
DROP TABLE "ProdEmailOnSalon";

-- DropTable
DROP TABLE "ProdPhoneOnSalon";
