-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'VERIFYING', 'PENDING_REVIEW', 'APPROVED', 'TRACKING', 'PERFORMANCE_LOCKED', 'PAYOUT_PENDING', 'PAID', 'REJECTED', 'FLAGGED', 'DISPUTED', 'PAYMENT_HOLD');

-- CreateTable
CREATE TABLE "submissions" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "platform" "SocialPlatform" NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "rejectionReason" TEXT,
    "earnedAmount" DECIMAL(14,2),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submissions_userId_idx" ON "submissions"("userId");

-- CreateIndex
CREATE INDEX "submissions_campaignId_idx" ON "submissions"("campaignId");

-- CreateIndex
CREATE INDEX "submissions_userId_campaignId_idx" ON "submissions"("userId", "campaignId");

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
