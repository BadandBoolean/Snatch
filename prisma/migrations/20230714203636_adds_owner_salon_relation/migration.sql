/*
  Warnings:

  - You are about to drop the column `owner` on the `Salon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ownerId]` on the table `Salon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Salon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Salon" DROP COLUMN "owner",
ADD COLUMN     "ownerId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Salon_ownerId_key" ON "Salon"("ownerId");

-- AddForeignKey
ALTER TABLE "Salon" ADD CONSTRAINT "Salon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
