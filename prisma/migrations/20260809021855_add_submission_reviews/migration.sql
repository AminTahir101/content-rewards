-- CreateEnum
CREATE TYPE "ReviewAction" AS ENUM ('APPROVED', 'REJECTED', 'FLAGGED', 'HOLD');

-- CreateTable
CREATE TABLE "submission_reviews" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "action" "ReviewAction" NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "submission_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "submission_reviews_submissionId_idx" ON "submission_reviews"("submissionId");

-- CreateIndex
CREATE INDEX "submissions_status_idx" ON "submissions"("status");

-- AddForeignKey
ALTER TABLE "submission_reviews" ADD CONSTRAINT "submission_reviews_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
