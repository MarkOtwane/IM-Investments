/*
  # Add Orders and Payments System

  1. New Tables
    - `Order` - Customer orders with status tracking
      - `id` (integer, primary key)
      - `userId` (integer, foreign key to User)
      - `totalAmount` (decimal)
      - `status` (enum: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
    
    - `OrderItem` - Individual items within orders
      - `id` (integer, primary key)
      - `orderId` (integer, foreign key to Order)
      - `productId` (integer, foreign key to Product)
      - `quantity` (integer)
      - `price` (decimal, price at time of order)
    
    - `Payment` - Payment tracking for orders
      - `id` (integer, primary key)
      - `orderId` (integer, foreign key to Order)
      - `amount` (decimal)
      - `phoneNumber` (string)
      - `transactionId` (string, nullable)
      - `checkoutRequestId` (string, nullable)
      - `status` (enum: PENDING, COMPLETED, FAILED, CANCELLED)
      - `createdAt` (timestamp)
      - `updatedAt` (timestamp)
      - `mpesaResponse` (json, nullable)

  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to access their own data
*/

-- CreateEnum for OrderStatus
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum for PaymentStatus
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateTable Order
CREATE TABLE IF NOT EXISTS "Order" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable OrderItem
CREATE TABLE IF NOT EXISTS "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable Payment
CREATE TABLE IF NOT EXISTS "Payment" (
    "id" SERIAL NOT NULL,
    "orderId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "transactionId" TEXT,
    "checkoutRequestId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mpesaResponse" JSONB,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_orderId_key" ON "Payment"("orderId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_transactionId_key" ON "Payment"("transactionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Payment_checkoutRequestId_key" ON "Payment"("checkoutRequestId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Enable Row Level Security
ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Payment" ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for Order
CREATE POLICY "Users can read own orders"
  ON "Order"
  FOR SELECT
  TO authenticated
  USING ("userId" = auth.uid());

CREATE POLICY "Users can create own orders"
  ON "Order"
  FOR INSERT
  TO authenticated
  WITH CHECK ("userId" = auth.uid());

-- Create RLS Policies for OrderItem
CREATE POLICY "Users can read own order items"
  ON "OrderItem"
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "Order" 
    WHERE "Order"."id" = "OrderItem"."orderId" 
    AND "Order"."userId" = auth.uid()
  ));

-- Create RLS Policies for Payment
CREATE POLICY "Users can read own payments"
  ON "Payment"
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM "Order" 
    WHERE "Order"."id" = "Payment"."orderId" 
    AND "Order"."userId" = auth.uid()
  ));