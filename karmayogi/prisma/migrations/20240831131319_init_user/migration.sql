/*
  Warnings:

  - You are about to drop the column `jobTitle` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `officeEndTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `officeStartTime` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Database` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Table` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobtitle` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officeendtime` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `officestarttime` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Column" DROP CONSTRAINT "Column_tableId_fkey";

-- DropForeignKey
ALTER TABLE "Table" DROP CONSTRAINT "Table_databaseId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobTitle",
DROP COLUMN "officeEndTime",
DROP COLUMN "officeStartTime",
ADD COLUMN     "jobtitle" TEXT NOT NULL,
ADD COLUMN     "officeendtime" TEXT NOT NULL,
ADD COLUMN     "officestarttime" TEXT NOT NULL;

-- DropTable
DROP TABLE "Column";

-- DropTable
DROP TABLE "Database";

-- DropTable
DROP TABLE "Table";
