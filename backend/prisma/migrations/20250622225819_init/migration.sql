/*
  Warnings:

  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Experience" AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'VOLUNTEER', 'FREELANCE');

-- CreateEnum
CREATE TYPE "RemoteOption" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- DropTable
DROP TABLE "Job";

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "companyId" INTEGER,
    "location" TEXT,
    "experience" "Experience",
    "salary" TEXT,
    "jobType" "JobType",
    "remoteOption" "RemoteOption",
    "postDate" TIMESTAMP(3),
    "link" TEXT NOT NULL,
    "skills" TEXT[],
    "benefits" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "source" TEXT,
    "rawData" JSONB,
    "searchVector" tsvector,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "jobs_searchVector_idx" ON "jobs" USING GIN ("searchVector");

-- CreateIndex
CREATE INDEX "jobs_jobType_idx" ON "jobs"("jobType");

-- CreateIndex
CREATE INDEX "jobs_location_idx" ON "jobs"("location");

-- CreateIndex
CREATE INDEX "jobs_postDate_idx" ON "jobs"("postDate");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
