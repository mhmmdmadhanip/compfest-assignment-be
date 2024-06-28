/*
  Warnings:

  - A unique constraint covering the columns `[email,branchID]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_serviceName_fkey";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "branchID" INTEGER,
ALTER COLUMN "serviceName" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "reviews_email_branchID_key" ON "reviews"("email", "branchID");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "services"("serviceName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "branches"("branchID") ON DELETE SET NULL ON UPDATE CASCADE;
