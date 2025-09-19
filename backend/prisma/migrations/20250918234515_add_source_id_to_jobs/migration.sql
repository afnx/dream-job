/*
  Warnings:

  - A unique constraint covering the columns `[sourceId]` on the table `jobs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "sourceId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "jobs_sourceId_key" ON "public"."jobs"("sourceId");
