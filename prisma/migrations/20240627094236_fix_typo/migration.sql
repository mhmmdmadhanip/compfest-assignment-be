/*
  Warnings:

  - The primary key for the `branchservices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceID` on the `branchservices` table. All the data in the column will be lost.
  - You are about to drop the column `serviceID` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `reviews` table. All the data in the column will be lost.
  - The primary key for the `services` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `serviceID` on the `services` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `users` table. All the data in the column will be lost.
  - Added the required column `serviceName` to the `branchservices` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "branchservices" DROP CONSTRAINT "branchservices_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_serviceID_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_userID_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_userID_fkey";

-- AlterTable
ALTER TABLE "branchservices" DROP CONSTRAINT "branchservices_pkey",
DROP COLUMN "serviceID",
ADD COLUMN     "serviceName" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "branchservices_pkey" PRIMARY KEY ("branchID", "serviceName");

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "serviceID",
DROP COLUMN "userID",
ADD COLUMN     "email" VARCHAR(50) NOT NULL,
ADD COLUMN     "serviceName" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "userID",
ADD COLUMN     "email" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "services" DROP CONSTRAINT "services_pkey",
DROP COLUMN "serviceID",
ADD CONSTRAINT "services_pkey" PRIMARY KEY ("serviceName");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "Role",
DROP COLUMN "userID",
ADD COLUMN     "role" VARCHAR(10) NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("email");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "services"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branchservices" ADD CONSTRAINT "branchservices_serviceName_fkey" FOREIGN KEY ("serviceName") REFERENCES "services"("serviceName") ON DELETE RESTRICT ON UPDATE CASCADE;
