"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
async function seedGastos() {
    const gastos = Array.from({ length: 1000 }).map((_, i) => ({
        descripcion: `Gasto número ${i + 1}`,
        monto: parseFloat((Math.random() * 1000).toFixed(2)),
    }));
    await prisma.gasto.createMany({
        data: gastos,
    });
    console.log('✅ 1000 gastos creados');
}
seedGastos()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
