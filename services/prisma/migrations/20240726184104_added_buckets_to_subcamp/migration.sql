-- AlterTable
ALTER TABLE "EmailCampaign" ADD COLUMN     "bucketID" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SMSCampaign" ADD COLUMN     "bucketID" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "WhatsAppCampaign" ADD COLUMN     "bucketID" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
