/*
  Warnings:

  - You are about to drop the column `fechaCompra` on the `Boleto` table. All the data in the column will be lost.
  - You are about to drop the column `idPasajero` on the `Boleto` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Boleto" DROP CONSTRAINT "Boleto_idPasajero_fkey";

-- AlterTable
ALTER TABLE "Boleto" DROP COLUMN "fechaCompra",
DROP COLUMN "idPasajero";

-- AlterTable
ALTER TABLE "VentaBoleto" ADD COLUMN     "fechaVenta" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
