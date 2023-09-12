/*
  Warnings:

  - A unique constraint covering the columns `[clientphone]` on the table `ClientPhoneNumber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ClientPhoneNumber_clientphone_key" ON "ClientPhoneNumber"("clientphone");
