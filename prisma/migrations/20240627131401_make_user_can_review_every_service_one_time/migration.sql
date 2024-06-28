/*
  Warnings:

  - A unique constraint covering the columns `[email,serviceName]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceName` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "serviceName" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_email_serviceName_key" ON "reviews"("email", "serviceName");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "services"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;
