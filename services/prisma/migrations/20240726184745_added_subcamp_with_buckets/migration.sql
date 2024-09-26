-- AlterTable
ALTER TABLE "EmailCampaign" ALTER COLUMN "bucketID" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SMSCampaign" ALTER COLUMN "bucketID" DROP DEFAULT;

-- AlterTable
ALTER TABLE "WhatsAppCampaign" ALTER COLUMN "bucketID" DROP DEFAULT;
