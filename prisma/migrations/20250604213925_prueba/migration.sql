/*
  Warnings:

  - Added the required column `precio` to the `VentaBoleto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VentaBoleto" ADD COLUMN     "precio" DOUBLE PRECISION NOT NULL;
