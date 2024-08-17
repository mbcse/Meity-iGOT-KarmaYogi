-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('scheduled', 'running', 'completed', 'cancelled', 'draft', 'failed');

-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'QUEUED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Buckets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "changedName" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "timeCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "noOfEmails" INTEGER NOT NULL DEFAULT 0,
    "noOfSMS" INTEGER NOT NULL DEFAULT 0,
    "noOfWhatsApp" INTEGER NOT NULL DEFAULT 0,
    "noOfUsers" INTEGER NOT NULL DEFAULT 0,
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "campaignType" "CampaignType"[],

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "campaignTitle" TEXT NOT NULL DEFAULT '',
    "Number" TEXT NOT NULL,
    "bucketID" TEXT NOT NULL,
    "textbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "timeToBeSent" TEXT NOT NULL DEFAULT '00:00',
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "WhatsAppCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "campaignTitle" TEXT NOT NULL DEFAULT '',
    "Number" TEXT NOT NULL,
    "bucketID" TEXT NOT NULL,
    "SMSBody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "timeToBeSent" TEXT NOT NULL DEFAULT '00:00',
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "SMSCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "campaignTitle" TEXT NOT NULL DEFAULT '',
    "fromMail" TEXT NOT NULL,
    "mailbody" TEXT NOT NULL,
    "bucketID" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "mobile" INTEGER NOT NULL DEFAULT 0,
    "desktop" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "timeToBeSent" TEXT NOT NULL DEFAULT '00:00',
    "status" "CampaignStatus" NOT NULL DEFAULT 'draft',
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "spamReports" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CTALink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "mobile" INTEGER NOT NULL DEFAULT 0,
    "desktop" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "CTALink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CampaignType"[],
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "noCode" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scheduled" (
    "id" TEXT NOT NULL,
    "subCampaignID" TEXT NOT NULL,
    "type" "CampaignType"[],
    "scheduled" TIMESTAMP(3) NOT NULL,
    "timeToBeSent" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "queueStats" "QueueStatus" NOT NULL,

    CONSTRAINT "Scheduled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Database" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Database_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "databaseId" INTEGER NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Column" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "tableId" INTEGER NOT NULL,

    CONSTRAINT "Column_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WhatsAppCampaignCTALinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_SMSCampaignCTALinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailCampaignCTALinks" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Buckets_changedName_key" ON "Buckets"("changedName");

-- CreateIndex
CREATE INDEX "WhatsAppCampaign_campaignID_idx" ON "WhatsAppCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "SMSCampaign_campaignID_idx" ON "SMSCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "EmailCampaign_campaignID_idx" ON "EmailCampaign"("campaignID");

-- CreateIndex
CREATE UNIQUE INDEX "Database_url_key" ON "Database"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_WhatsAppCampaignCTALinks_AB_unique" ON "_WhatsAppCampaignCTALinks"("A", "B");

-- CreateIndex
CREATE INDEX "_WhatsAppCampaignCTALinks_B_index" ON "_WhatsAppCampaignCTALinks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_SMSCampaignCTALinks_AB_unique" ON "_SMSCampaignCTALinks"("A", "B");

-- CreateIndex
CREATE INDEX "_SMSCampaignCTALinks_B_index" ON "_SMSCampaignCTALinks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailCampaignCTALinks_AB_unique" ON "_EmailCampaignCTALinks"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailCampaignCTALinks_B_index" ON "_EmailCampaignCTALinks"("B");

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_bucketID_fkey" FOREIGN KEY ("bucketID") REFERENCES "Buckets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Table" ADD CONSTRAINT "Table_databaseId_fkey" FOREIGN KEY ("databaseId") REFERENCES "Database"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhatsAppCampaignCTALinks" ADD CONSTRAINT "_WhatsAppCampaignCTALinks_A_fkey" FOREIGN KEY ("A") REFERENCES "CTALink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WhatsAppCampaignCTALinks" ADD CONSTRAINT "_WhatsAppCampaignCTALinks_B_fkey" FOREIGN KEY ("B") REFERENCES "WhatsAppCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignCTALinks" ADD CONSTRAINT "_SMSCampaignCTALinks_A_fkey" FOREIGN KEY ("A") REFERENCES "CTALink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SMSCampaignCTALinks" ADD CONSTRAINT "_SMSCampaignCTALinks_B_fkey" FOREIGN KEY ("B") REFERENCES "SMSCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailCampaignCTALinks" ADD CONSTRAINT "_EmailCampaignCTALinks_A_fkey" FOREIGN KEY ("A") REFERENCES "CTALink"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EmailCampaignCTALinks" ADD CONSTRAINT "_EmailCampaignCTALinks_B_fkey" FOREIGN KEY ("B") REFERENCES "EmailCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
