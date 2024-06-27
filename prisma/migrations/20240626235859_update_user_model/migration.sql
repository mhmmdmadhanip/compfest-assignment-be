/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - Added the required column `Role` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "name",
DROP COLUMN "username",
ADD COLUMN     "Role" VARCHAR(10) NOT NULL,
ADD COLUMN     "email" VARCHAR(50) NOT NULL,
ADD COLUMN     "fullName" VARCHAR(100) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "phoneNumber" VARCHAR(15) NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
