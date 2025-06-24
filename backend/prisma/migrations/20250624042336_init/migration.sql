/*
  Warnings:

  - You are about to drop the column `postDate` on the `jobs` table. All the data in the column will be lost.
  - You are about to drop the column `salary` on the `jobs` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "jobs_postDate_idx";

-- AlterTable
ALTER TABLE "jobs" DROP COLUMN "postDate",
DROP COLUMN "salary",
ADD COLUMN     "postedAt" TIMESTAMP(3),
ADD COLUMN     "salaryCurrency" TEXT,
ADD COLUMN     "salaryMax" INTEGER,
ADD COLUMN     "salaryMin" INTEGER,
ADD COLUMN     "salaryRaw" TEXT;

-- CreateIndex
CREATE INDEX "jobs_postedAt_idx" ON "jobs"("postedAt");
