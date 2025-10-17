-- AlterTable
ALTER TABLE "public"."Tour" ADD COLUMN     "end_date" TIMESTAMP(3),
ADD COLUMN     "is_recurring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "repeat_days" TEXT[],
ADD COLUMN     "repeat_rule" TEXT,
ADD COLUMN     "start_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."TourPlace" ALTER COLUMN "start_time" SET DATA TYPE TEXT,
ALTER COLUMN "end_time" SET DATA TYPE TEXT;
