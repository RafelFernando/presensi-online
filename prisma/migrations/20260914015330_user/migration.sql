/*
  Warnings:

  - Added the required column `userId` to the `Presensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Presensi" ADD COLUMN     "catatan_keluar" TEXT,
ADD COLUMN     "catatan_masuk" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
