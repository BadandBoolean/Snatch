-- AlterTable
ALTER TABLE "Salon" ADD COLUMN     "acceptNewClients" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "allowWalkIns" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "email" TEXT NOT NULL DEFAULT '';
