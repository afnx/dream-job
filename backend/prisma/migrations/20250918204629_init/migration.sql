-- CreateEnum
CREATE TYPE "public"."SalaryUnit" AS ENUM ('YEAR', 'MONTH', 'WEEK', 'DAY', 'HOUR');

-- AlterTable
ALTER TABLE "public"."jobs" ADD COLUMN     "salaryUnit" "public"."SalaryUnit";
