/*
  Warnings:

  - The primary key for the `branchservices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceName` on the `branchservices` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `serviceName` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[email,serviceID]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serviceID` to the `branchservices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceID` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "branchservices" DROP CONSTRAINT "branchservices_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_branchID_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_branchID_serviceName_fkey";

-- DropIndex
DROP INDEX "reviews_email_serviceName_key";

-- AlterTable
ALTER TABLE "branchservices" DROP CONSTRAINT "branchservices_pkey",
DROP COLUMN "serviceName",
ADD COLUMN     "serviceID" INTEGER NOT NULL,
ADD CONSTRAINT "branchservices_pkey" PRIMARY KEY ("branchID", "serviceID");

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "serviceName",
ADD COLUMN     "serviceID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "serviceName",
ADD COLUMN     "serviceID" INTEGER;

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
ADD COLUMN     "serviceID" SERIAL NOT NULL,
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("serviceID");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_email_serviceID_key" ON "reviews"("email", "serviceID");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_branchID_serviceID_fkey" FOREIGN KEY ("branchID", "serviceID") REFERENCES "branchservices"("branchID", "serviceID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_branchID_serviceID_fkey" FOREIGN KEY ("branchID", "serviceID") REFERENCES "branchservices"("branchID", "serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branchservices" ADD CONSTRAINT "branchservices_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "services"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;
