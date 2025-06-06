import { PrismaClient } from '@prisma/client'

export const resolvers = {
    Query: {
      gastos: async () => {
        const prisma = new PrismaClient()
        return await prisma.gasto.findMany();
      }
    }
  };
  