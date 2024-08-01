/*
  Warnings:

  - The primary key for the `Buckets` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "EmailCampaign" DROP CONSTRAINT "EmailCampaign_bucketID_fkey";

-- DropForeignKey
ALTER TABLE "SMSCampaign" DROP CONSTRAINT "SMSCampaign_bucketID_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppCampaign" DROP CONSTRAINT "WhatsAppCampaign_bucketID_fkey";

-- AlterTable
ALTER TABLE "Buckets" DROP CONSTRAINT "Buckets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Buckets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Buckets_id_seq";

-- AlterTable
ALTER TABLE "EmailCampaign" ALTER COLUMN "bucketID" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "SMSCampaign" ALTER COLUMN "bucketID" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "WhatsAppCampaign" ALTER COLUMN "bucketID" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
