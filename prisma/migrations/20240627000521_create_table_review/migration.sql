/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "userID" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("userID");

-- CreateTable
CREATE TABLE "reviews" (
    "reviewID" SERIAL NOT NULL,
    "starRating" INTEGER NOT NULL,
    "comment" VARCHAR(200) NOT NULL,
    "userID" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("reviewID")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userID_fkey" FOREIGN KEY ("userID") REFERENCES "users"("userID") ON DELETE RESTRICT ON UPDATE CASCADE;
