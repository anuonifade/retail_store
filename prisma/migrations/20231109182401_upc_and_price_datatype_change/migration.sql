/*
  Warnings:

  - Changed the type of `price` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `upcNumber` on the `products` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL,
DROP COLUMN "upcNumber",
ADD COLUMN     "upcNumber" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_upcNumber_key" ON "products"("upcNumber");
