-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ERROR', 'INFO', 'WARNING');

-- AlterTable
ALTER TABLE "ParsedItem" ADD COLUMN     "check_error_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "check_status" TEXT,
ADD COLUMN     "last_checked_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AdminNotification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "details" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminNotification_pkey" PRIMARY KEY ("id")
);
