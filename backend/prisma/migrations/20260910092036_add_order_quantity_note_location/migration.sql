/*
  Warnings:

  - You are about to drop the `appointment_requests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "appointment_requests" DROP CONSTRAINT "appointment_requests_doctorId_fkey";

-- DropTable
DROP TABLE "appointment_requests";

-- CreateTable
CREATE TABLE "gallery_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'image',
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "patientId" TEXT,
    "patientName" TEXT NOT NULL,
    "patientPhone" TEXT NOT NULL,
    "patientEmail" TEXT,
    "doctorId" TEXT,
    "department" TEXT,
    "service" TEXT,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentTime" TEXT,
    "reason" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "imageUrls" TEXT[],
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "customerNote" TEXT,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "locationCounty" TEXT,
    "locationTown" TEXT,
    "locationPlace" TEXT,
    "locationRoad" TEXT,
    "locationBuilding" TEXT,
    "locationLat" DOUBLE PRECISION,
    "locationLng" DOUBLE PRECISION,
    "paymentMethod" TEXT NOT NULL,
    "paymentId" TEXT,
    "deliveryType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gallery_items_isActive_idx" ON "gallery_items"("isActive");

-- CreateIndex
CREATE INDEX "gallery_items_type_idx" ON "gallery_items"("type");

-- CreateIndex
CREATE INDEX "gallery_items_createdAt_idx" ON "gallery_items"("createdAt");

-- CreateIndex
CREATE INDEX "appointments_doctorId_idx" ON "appointments"("doctorId");

-- CreateIndex
CREATE INDEX "appointments_patientPhone_idx" ON "appointments"("patientPhone");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE INDEX "products_active_idx" ON "products"("active");

-- CreateIndex
CREATE INDEX "products_createdAt_idx" ON "products"("createdAt");

-- CreateIndex
CREATE INDEX "orders_productId_idx" ON "orders"("productId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_customerPhone_idx" ON "orders"("customerPhone");

-- CreateIndex
CREATE INDEX "orders_customerEmail_idx" ON "orders"("customerEmail");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
