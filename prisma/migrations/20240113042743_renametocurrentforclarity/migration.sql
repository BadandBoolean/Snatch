/*
  Warnings:

  - You are about to drop the column `iCalApptIds` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the `iCalAppointment` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Salon" DROP COLUMN "iCalApptIds",
ADD COLUMN     "curriCalApptIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- DropTable
DROP TABLE "iCalAppointment";

-- CreateTable
CREATE TABLE "CurrentiCalAppointment" (
    "iCalApptId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CurrentiCalAppointment_pkey" PRIMARY KEY ("iCalApptId")
);
