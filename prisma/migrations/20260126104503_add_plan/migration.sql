-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "plan" "Plan" NOT NULL DEFAULT 'FREE';
