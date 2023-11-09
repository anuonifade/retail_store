/*
  Warnings:

  - You are about to alter the column `upc` on the `products` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "upc" SET DATA TYPE INTEGER;
