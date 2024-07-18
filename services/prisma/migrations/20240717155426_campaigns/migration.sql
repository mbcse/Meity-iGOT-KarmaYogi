/*
  Warnings:

  - You are about to drop the column `fromNumber` on the `SMSCampaign` table. All the data in the column will be lost.
  - You are about to drop the column `fromNumber` on the `WhatsAppCampaign` table. All the data in the column will be lost.
  - Added the required column `Number` to the `SMSCampaign` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Number` to the `WhatsAppCampaign` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SMSCampaign" DROP COLUMN "fromNumber",
ADD COLUMN     "Number" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WhatsAppCampaign" DROP COLUMN "fromNumber",
ADD COLUMN     "Number" TEXT NOT NULL;
