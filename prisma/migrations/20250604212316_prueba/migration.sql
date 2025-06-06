-- CreateTable
CREATE TABLE "Boleto" (
    "id" TEXT NOT NULL,
    "idPasajero" TEXT NOT NULL,
    "idBus" TEXT NOT NULL,
    "fechaCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Boleto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VentaBoleto" (
    "id" TEXT NOT NULL,
    "idBoleto" TEXT NOT NULL,
    "idPasajero" TEXT NOT NULL,

    CONSTRAINT "VentaBoleto_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_idPasajero_fkey" FOREIGN KEY ("idPasajero") REFERENCES "Pasajero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Boleto" ADD CONSTRAINT "Boleto_idBus_fkey" FOREIGN KEY ("idBus") REFERENCES "Bus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaBoleto" ADD CONSTRAINT "VentaBoleto_idBoleto_fkey" FOREIGN KEY ("idBoleto") REFERENCES "Boleto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VentaBoleto" ADD CONSTRAINT "VentaBoleto_idPasajero_fkey" FOREIGN KEY ("idPasajero") REFERENCES "Pasajero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
