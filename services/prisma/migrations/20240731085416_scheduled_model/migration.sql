-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'QUEUED');

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
