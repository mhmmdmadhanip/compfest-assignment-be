/*
  Warnings:

  - You are about to drop the `Branch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BranchService` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BranchService" DROP CONSTRAINT "BranchService_branchID_fkey";

-- DropForeignKey
ALTER TABLE "BranchService" DROP CONSTRAINT "BranchService_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_branchID_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "Reservation" DROP CONSTRAINT "Reservation_userID_fkey";

-- DropTable
DROP TABLE "Branch";

-- DropTable
DROP TABLE "BranchService";

-- DropTable
DROP TABLE "Reservation";

-- DropTable
DROP TABLE "Service";

-- CreateTable
CREATE TABLE "reservations" (
    "reservationID" SERIAL NOT NULL,
    "fullname" VARCHAR(100) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "userID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,
    "branchID" INTEGER NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("reservationID")
);

-- CreateTable
CREATE TABLE "services" (
    "serviceID" SERIAL NOT NULL,
    "serviceName" VARCHAR(100) NOT NULL,
    "duration" INTEGER NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("serviceID")
);

-- CreateTable
CREATE TABLE "branches" (
    "branchID" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "locationName" VARCHAR(100) NOT NULL,
    "openTime" VARCHAR(5) NOT NULL,
    "closeTime" VARCHAR(5) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("branchID")
);

-- CreateTable
CREATE TABLE "branchservices" (
    "branchID" INTEGER NOT NULL,
    "serviceID" INTEGER NOT NULL,

    CONSTRAINT "branchservices_pkey" PRIMARY KEY ("branchID","serviceID")
);

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "services"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "branches"("branchID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branchservices" ADD CONSTRAINT "branchservices_branchID_fkey" FOREIGN KEY ("branchID") REFERENCES "branches"("branchID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branchservices" ADD CONSTRAINT "branchservices_serviceID_fkey" FOREIGN KEY ("serviceID") REFERENCES "services"("serviceID") ON DELETE RESTRICT ON UPDATE CASCADE;
