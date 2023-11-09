/*
  Warnings:

  - You are about to drop the column `product_name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock_quantity` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `upc_number` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upcNumber]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productName` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockQuantity` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upcNumber` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_upc_number_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "product_name",
DROP COLUMN "stock_quantity",
DROP COLUMN "upc_number",
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "stockQuantity" INTEGER NOT NULL,
ADD COLUMN     "upcNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_upcNumber_key" ON "products"("upcNumber");
