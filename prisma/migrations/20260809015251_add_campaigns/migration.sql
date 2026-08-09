-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RewardModel" AS ENUM ('CPM', 'CPV', 'CPA', 'FIXED', 'HYBRID', 'MILESTONE');

-- CreateEnum
CREATE TYPE "SocialPlatform" AS ENUM ('TIKTOK', 'INSTAGRAM', 'YOUTUBE', 'X');

-- CreateEnum
CREATE TYPE "CampaignCategory" AS ENUM ('LIFESTYLE', 'ENTERTAINMENT', 'GAMING', 'TECHNOLOGY', 'FOOD', 'FASHION', 'BEAUTY', 'TRAVEL', 'SPORTS', 'EDUCATION', 'FINANCE', 'OTHER');

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverUrl" TEXT,
    "description" TEXT,
    "objective" TEXT,
    "category" "CampaignCategory" NOT NULL DEFAULT 'OTHER',
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "rewardModel" "RewardModel" NOT NULL DEFAULT 'CPM',
    "cpm" DECIMAL(10,4),
    "minPayout" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "maxCreatorPayout" DECIMAL(10,2),
    "totalBudget" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "reservedBudget" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "settledBudget" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "maxSubmissions" INTEGER,
    "countries" TEXT[] DEFAULT ARRAY['SA']::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY['ar']::TEXT[],
    "minFollowers" INTEGER NOT NULL DEFAULT 0,
    "requiredHashtags" TEXT[],
    "requiredMentions" TEXT[],
    "contentBrief" TEXT,
    "contentDos" TEXT[],
    "contentDonts" TEXT[],
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "participantCount" INTEGER NOT NULL DEFAULT 0,
    "submissionCount" INTEGER NOT NULL DEFAULT 0,
    "verifiedViews" BIGINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_platforms" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,

    CONSTRAINT "campaign_platforms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_participants" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaign_participants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "campaigns_slug_key" ON "campaigns"("slug");

-- CreateIndex
CREATE INDEX "campaigns_status_createdAt_idx" ON "campaigns"("status", "createdAt");

-- CreateIndex
CREATE INDEX "campaigns_organizationId_idx" ON "campaigns"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_platforms_campaignId_platform_key" ON "campaign_platforms"("campaignId", "platform");

-- CreateIndex
CREATE INDEX "campaign_participants_userId_idx" ON "campaign_participants"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_participants_campaignId_userId_key" ON "campaign_participants"("campaignId", "userId");

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_platforms" ADD CONSTRAINT "campaign_platforms_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_participants" ADD CONSTRAINT "campaign_participants_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
