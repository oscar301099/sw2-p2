// app/api/graphql/route.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { PrismaClient } from '@prisma/client';
import { gql } from 'graphql-tag';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

const typeDefs = gql`
  type Gasto {
    id: String!
    descripcion: String!
    monto: Float!
    createdAt: String
  }

  type Query {
    gastos: [Gasto!]!
    gasto(id: String!): Gasto
  }

  type Mutation {
    createGasto(descripcion: String!, monto: Float!): Gasto!
    updateGasto(id: String!, descripcion: String, monto: Float): Gasto!
    deleteGasto(id: String!): Boolean!
  }
`;

const resolvers = {
  Query: {
    gastos: async () => {
      try {
        return await prisma.gasto.findMany({
          orderBy: { createdAt: 'desc' }
        });
      } catch (error) {
        console.error('Error fetching gastos:', error);
        throw new Error('Failed to fetch gastos');
      }
    },
    gasto: async (_: any, { id }: { id: string }) => {
      try {
        return await prisma.gasto.findUnique({
          where: { id }
        });
      } catch (error) {
        console.error('Error fetching gasto:', error);
        throw new Error('Failed to fetch gasto');
      }
    }
  },
  Mutation: {
    createGasto: async (_: any, { descripcion, monto }: { descripcion: string; monto: number }) => {
      try {
        return await prisma.gasto.create({
          data: {
            descripcion,
            monto
          }
        });
      } catch (error) {
        console.error('Error creating gasto:', error);
        throw new Error('Failed to create gasto');
      }
    },
    updateGasto: async (_: any, { id, descripcion, monto }: { id: string; descripcion?: string; monto?: number }) => {
      try {
        return await prisma.gasto.update({
          where: { id },
          data: {
            ...(descripcion && { descripcion }),
            ...(monto && { monto })
          }
        });
      } catch (error) {
        console.error('Error updating gasto:', error);
        throw new Error('Failed to update gasto');
      }
    },
    deleteGasto: async (_: any, { id }: { id: string }) => {
      try {
        await prisma.gasto.delete({
          where: { id }
        });
        return true;
      } catch (error) {
        console.error('Error deleting gasto:', error);
        return false;
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  csrfPrevention: true,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req: NextRequest) => {
    return {
      req,
      // Aquí puedes agregar contexto adicional como autenticación
    };
  }
});

export const GET = handler;
export const POST = handler;