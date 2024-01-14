-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "iCalApptIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "iCalAppointment" (
    "iCalApptId" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iCalAppointment_pkey" PRIMARY KEY ("iCalApptId")
);
