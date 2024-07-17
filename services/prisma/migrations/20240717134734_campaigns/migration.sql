-- CreateEnum
CREATE TYPE "CampaignType" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'DRAFT');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "campaignName" TEXT NOT NULL,
    "timeCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignType" "CampaignType"[],

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "textbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "status" "CampaignStatus" NOT NULL,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "WhatsAppCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMSCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "fromNumber" TEXT NOT NULL,
    "SMSBody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "status" "CampaignStatus" NOT NULL,
    "unsubscribed" INTEGER NOT NULL DEFAULT 0,
    "regionsClicks" TEXT[],

    CONSTRAINT "SMSCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCampaign" (
    "id" TEXT NOT NULL,
    "campaignID" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "fromMail" TEXT NOT NULL,
    "mailbody" TEXT NOT NULL,
    "targeted" INTEGER NOT NULL DEFAULT 0,
    "bounced" INTEGER NOT NULL DEFAULT 0,
    "opened" INTEGER NOT NULL DEFAULT 0,
    "mobile" INTEGER NOT NULL DEFAULT 0,
    "desktop" INTEGER NOT NULL DEFAULT 0,
    "scheduled" TIMESTAMP(3) NOT NULL,
    "status" "CampaignStatus" NOT NULL,
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
CREATE INDEX "WhatsAppCampaign_campaignID_idx" ON "WhatsAppCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "SMSCampaign_campaignID_idx" ON "SMSCampaign"("campaignID");

-- CreateIndex
CREATE INDEX "EmailCampaign_campaignID_idx" ON "EmailCampaign"("campaignID");

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
ALTER TABLE "WhatsAppCampaign" ADD CONSTRAINT "WhatsAppCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMSCampaign" ADD CONSTRAINT "SMSCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCampaign" ADD CONSTRAINT "EmailCampaign_campaignID_fkey" FOREIGN KEY ("campaignID") REFERENCES "Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
