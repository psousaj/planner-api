/*
  Warnings:

  - You are about to drop the column `email` on the `participants` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `participants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trip_id,user_id]` on the table `participants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `participants` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "participants_trip_id_email_key";

-- AlterTable
ALTER TABLE "participants" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "trips" ADD COLUMN     "is_concluded" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "socialProvider" TEXT,
    "socialProviderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "participants_trip_id_user_id_key" ON "participants"("trip_id", "user_id");

-- AddForeignKey
ALTER TABLE "participants" ADD CONSTRAINT "participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
