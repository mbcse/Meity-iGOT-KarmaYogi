/*
  Warnings:

  - You are about to drop the column `officeLocation` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `officeTime` on the `User` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jobTitle` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeEndTime` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeStartTime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "officeLocation",
DROP COLUMN "officeTime",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "jobTitle" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "officeEndTime" TEXT NOT NULL,
ADD COLUMN     "officeStartTime" TEXT NOT NULL;
