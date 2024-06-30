/*
  Warnings:

  - A unique constraint covering the columns `[serviceName]` on the table `services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "services_serviceName_key" ON "services"("serviceName");
