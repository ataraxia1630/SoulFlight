-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'INFO_REQUIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."ActionTaker" AS ENUM ('PROVIDER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Action" AS ENUM ('SEND', 'APPROVE', 'REJECT', 'REQUIRE_INFO');

-- CreateTable
CREATE TABLE "public"."Registration" (
    "id" TEXT NOT NULL,
    "provider_id" INTEGER NOT NULL,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "metadata" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ApprovalHistory" (
    "id" SERIAL NOT NULL,
    "action" "public"."Action" NOT NULL,
    "by" "public"."ActionTaker" NOT NULL,
    "note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalHistory_pkey" PRIMARY KEY ("id")
);
