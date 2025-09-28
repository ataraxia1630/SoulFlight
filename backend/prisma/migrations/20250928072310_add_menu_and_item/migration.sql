-- CreateEnum
CREATE TYPE "public"."ServiceStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE', 'NO_LONGER_PROVIDED');

-- CreateEnum
CREATE TYPE "public"."UnitType" AS ENUM ('PORTION', 'SERVING', 'PIECE', 'SLICE', 'SET', 'BOX', 'TRAY', 'PACK', 'CUP', 'BOTTLE', 'CAN', 'DISH', 'BOWL', 'GLASS', 'JAR');

-- CreateTable
CREATE TABLE "public"."Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_url" TEXT,
    "service_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MenuItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "public"."ServiceStatus" NOT NULL DEFAULT 'AVAILABLE',
    "menu_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Menu" ADD CONSTRAINT "Menu_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MenuItem" ADD CONSTRAINT "MenuItem_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
