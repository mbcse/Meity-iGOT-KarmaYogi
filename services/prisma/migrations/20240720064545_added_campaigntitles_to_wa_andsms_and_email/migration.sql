/*
  Warnings:

  - You are about to drop the column `subject` on the `EmailCampaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmailCampaign" DROP COLUMN "subject",
ADD COLUMN     "campaignTitle" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SMSCampaign" ADD COLUMN     "campaignTitle" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "WhatsAppCampaign" ADD COLUMN     "campaignTitle" TEXT NOT NULL DEFAULT '';
