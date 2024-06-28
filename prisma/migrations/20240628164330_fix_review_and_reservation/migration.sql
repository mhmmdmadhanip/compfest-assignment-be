-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_branchID_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_serviceName_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_branchID_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_serviceName_fkey";

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_branchID_serviceName_fkey" FOREIGN KEY ("branchID", "serviceName") REFERENCES "branchservices"("branchID", "serviceName") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_branchID_serviceName_fkey" FOREIGN KEY ("branchID", "serviceName") REFERENCES "branchservices"("branchID", "serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;
