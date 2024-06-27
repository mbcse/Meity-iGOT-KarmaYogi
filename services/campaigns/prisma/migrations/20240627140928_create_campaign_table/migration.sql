-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "campaignType" "CampaignType"[],

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mailbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL,
    "bounced" INTEGER NOT NULL,
    "opened" INTEGER NOT NULL,
    "mobile" INTEGER NOT NULL,
    "desktop" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "unsubscribed" INTEGER NOT NULL,
    "spamReports" INTEGER NOT NULL,
    "regionsClicks" JSONB NOT NULL,

    CONSTRAINT "WhatsAppCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mailbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL,
    "bounced" INTEGER NOT NULL,
    "opened" INTEGER NOT NULL,
    "mobile" INTEGER NOT NULL,
    "desktop" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "unsubscribed" INTEGER NOT NULL,
    "spamReports" INTEGER NOT NULL,
    "regionsClicks" JSONB NOT NULL,

    CONSTRAINT "SMSCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "mailbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL,
    "bounced" INTEGER NOT NULL,
    "opened" INTEGER NOT NULL,
    "mobile" INTEGER NOT NULL,
    "desktop" INTEGER NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "unsubscribed" INTEGER NOT NULL,
    "spamReports" INTEGER NOT NULL,
    "regionsClicks" JSONB NOT NULL,

    CONSTRAINT "EmailCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CTALink" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "mobile" INTEGER NOT NULL,
    "desktop" INTEGER NOT NULL,
    "regionsClicks" JSONB NOT NULL,
    "emailCampaignID" TEXT,
    "smsCampaignID" TEXT,
    "whatsappCampaignID" TEXT,

    CONSTRAINT "CTALink_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTALink" ADD CONSTRAINT "CTALink_emailCampaignID_fkey" FOREIGN KEY ("emailCampaignID") REFERENCES "EmailCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTALink" ADD CONSTRAINT "CTALink_smsCampaignID_fkey" FOREIGN KEY ("smsCampaignID") REFERENCES "SMSCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CTALink" ADD CONSTRAINT "CTALink_whatsappCampaignID_fkey" FOREIGN KEY ("whatsappCampaignID") REFERENCES "WhatsAppCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
