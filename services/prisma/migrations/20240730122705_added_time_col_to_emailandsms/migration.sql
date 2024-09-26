-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "timeToBeSent" TEXT NOT NULL DEFAULT '00:00';

-- AlterTable
ALTER TABLE "SMSCampaign" ADD COLUMN     "timeToBeSent" TEXT NOT NULL DEFAULT '00:00';
