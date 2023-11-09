/*
  Warnings:

  - You are about to drop the column `productName` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stockQuantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `upcNumber` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upc]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upc` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_upcNumber_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "productName",
DROP COLUMN "stockQuantity",
DROP COLUMN "upcNumber",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "upc" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_upc_key" ON "products"("upc");
