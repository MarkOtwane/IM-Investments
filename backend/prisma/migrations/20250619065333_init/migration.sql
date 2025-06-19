/*
  Warnings:

  - You are about to drop the `_CartItemToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CartItemToUser" DROP CONSTRAINT "_CartItemToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToUser" DROP CONSTRAINT "_CartItemToUser_B_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_CartItemToUser";
