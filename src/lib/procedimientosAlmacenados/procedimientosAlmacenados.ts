import { PrismaClient } from '../../generated/prisma'
const prisma = new PrismaClient()

async function seedGastos() {
  const gastos = Array.from({ length: 5000 }).map((_, i) => ({
    descripcion: `Gasto número ${i + 1}`,
    monto: parseFloat((Math.random() * 1000).toFixed(2)),
  }))

  await prisma.gasto.createMany({
    data: gastos,
  })

  console.log('✅ 5000 gastos creados')
}


async function seedPasajeros() {
  const pasajeros = Array.from({ length: 100 }).map((_, i) => ({
    name: `Pasajero ${i + 1}`,
  }))

  await prisma.pasajero.createMany({
    data: pasajeros,
  })

  console.log('✅ 100 pasajeros creados')
}


async function seedConductor() {
  const conductor = Array.from({ length: 10 }).map((_, i) => ({
    name: `conductor ${i + 1}`,
    sueldo: 3000.0,
  }))

  await prisma.conductor.createMany({
    data: conductor,
  })

  console.log('✅ 10 conductores creados')
}


async function seedBus() {
  const conductores = await prisma.conductor.findMany()

  const buses = conductores.map((conductor, i) => ({
    placa: `BUS-${i + 1}`,
    idConductor: conductor.id,
  }))

  await prisma.bus.createMany({
    data: buses,
  })

  console.log('✅ 10 buses creados y asignados a conductores')
}


  function randomDate(start: Date, end: Date): Date {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  }
  async function seedBoletosYVentas() {
    const pasajeros = await prisma.pasajero.findMany()
    const buses = await prisma.bus.findMany()
    if (pasajeros.length === 0) throw new Error('No hay pasajeros creados')
    if (buses.length === 0) throw new Error('No hay buses creados')
    const boletosData: { idBus: string }[] = []
    pasajeros.forEach((pasajero, idxPasajero) => {
      for (let i = 0; i < 5; i++) {
        boletosData.push({
          idBus: buses[(idxPasajero + i) % buses.length].id,
        })
      }
    })
  
    const boletosCreados = []
    for (const boleto of boletosData) {
      const creado = await prisma.boleto.create({ data: boleto })
      boletosCreados.push(creado)
    }
    console.log(`✅ ${boletosCreados.length} boletos creados`)
  
    const ahora = new Date()
    const haceUnAno = new Date()
    haceUnAno.setFullYear(ahora.getFullYear() - 1)
  
    const ventasData = boletosCreados.map((boleto, idx) => ({
      idBoleto: boleto.id,
      idPasajero: pasajeros[idx % pasajeros.length].id, 
      precio: 100.0,
      fechaVenta: randomDate(haceUnAno, ahora),
    }))
  
    await prisma.ventaBoleto.createMany({
      data: ventasData,
    })
  
    console.log(`✅ ${ventasData.length} ventas creadas`)
  }
  
  async function seedGastosSueldos() {
    const conductores = await prisma.conductor.findMany()
    const ahora = new Date()
    const haceUnAno = new Date()
    haceUnAno.setFullYear(ahora.getFullYear() - 1)
  
    const gastos = conductores.flatMap((conductor, idx) =>
      Array.from({ length: 12 }).map(() => ({
        descripcion: `Sueldo conductor ${idx + 1}`,
        monto: 3000,
        fecha: randomDate(haceUnAno, ahora),
      }))
    )
  
    await prisma.gasto.createMany({
      data: gastos,
    })
  
    console.log('✅ Sueldos aleatorios por 12 meses creados para 10 conductores')
  }

  async function seedGastosMantenimientos() {
    const buses = await prisma.bus.findMany()
  
    const gastos = buses.flatMap((bus, idx) =>
      Array.from({ length: 10 }).map(() => ({
        descripcion: `Mantenimiento bus ${idx + 1}`,
        monto: 1000,
        fecha: new Date(),
      }))
    )
  
    await prisma.gasto.createMany({
      data: gastos,
    })
  
    console.log('✅ Mantenimientos creados para 10 buses')
  }
  


async function seedDatabase() {
  await seedGastos();
  await seedConductor();
  await seedPasajeros();
  await seedBus();
  await seedBoletosYVentas();
  await seedGastosSueldos();
  await seedGastosMantenimientos();
  console.log('✅ Base de datos sembrada con éxito');
}
seedDatabase()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });