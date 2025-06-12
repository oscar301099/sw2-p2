// app/api/graphql/route.js
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { gql } from 'graphql-tag';
import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

// Definir el esquema GraphQL
const typeDefs = gql`
  scalar DateTime

  type Query {
    ventaBoletos: [VentaBoleto!]!
    ventaBoleto(id: String!): VentaBoleto
    ventaBoletosByPasajero(idPasajero: String!): [VentaBoleto!]!
    ventaBoletosByBoleto(idBoleto: String!): [VentaBoleto!]!
    pasajeros: [Pasajero!]!
    boletos: [Boleto!]!
    buses: [Bus!]!
    conductores: [Conductor!]!
    gastos: [Gasto!]!
  }

  type VentaBoleto {
    id: String!
    idBoleto: String!
    idPasajero: String!
    precio: Float!
    fechaVenta: DateTime!
    boleto: Boleto
    pasajero: Pasajero
  }

  type Pasajero {
    id: String!
    name: String!
    ventas: [VentaBoleto!]!
  }

  type Boleto {
    id: String!
    idBus: String!
    bus: Bus
    ventas: [VentaBoleto!]!
  }

  type Bus {
    id: String!
    placa: String!
    idConductor: String!
    conductor: Conductor
    boletos: [Boleto!]!
  }

  type Conductor {
    id: String!
    name: String!
    sueldo: Float!
    buses: [Bus!]!
  }

  type Gasto {
    id: String!
    descripcion: String!
    monto: Float!
    fecha: DateTime!
  }

  type Mutation {
    createVentaBoleto(input: CreateVentaBoletoInput!): VentaBoleto!
    updateVentaBoleto(id: String!, input: UpdateVentaBoletoInput!): VentaBoleto
    deleteVentaBoleto(id: String!): Boolean!
    createPasajero(name: String!): Pasajero!
    createGasto(input: CreateGastoInput!): Gasto!
  }

  input CreateVentaBoletoInput {
    idBoleto: String!
    idPasajero: String!
    precio: Float!
  }

  input UpdateVentaBoletoInput {
    idBoleto: String
    idPasajero: String
    precio: Float
  }

  input CreateGastoInput {
    descripcion: String!
    monto: Float!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    // Obtener todas las ventas de boletos
    ventaBoletos: async () => {
      return await prisma.ventaBoleto.findMany({
        include: {
          boleto: {
            include: {
              bus: {
                include: {
                  conductor: true
                }
              }
            }
          },
          pasajero: true,
        },
      });
    },

    // Obtener una venta de boleto por ID
    ventaBoleto: async (_, { id }) => {
      return await prisma.ventaBoleto.findUnique({
        where: { id },
        include: {
          boleto: {
            include: {
              bus: {
                include: {
                  conductor: true
                }
              }
            }
          },
          pasajero: true,
        },
      });
    },

    // Obtener ventas por pasajero
    ventaBoletosByPasajero: async (_, { idPasajero }) => {
      return await prisma.ventaBoleto.findMany({
        where: { idPasajero },
        include: {
          boleto: true,
          pasajero: true,
        },
      });
    },

    // Obtener ventas por boleto
    ventaBoletosByBoleto: async (_, { idBoleto }) => {
      return await prisma.ventaBoleto.findMany({
        where: { idBoleto },
        include: {
          boleto: true,
          pasajero: true,
        },
      });
    },

    // Obtener todos los pasajeros
    pasajeros: async () => {
      return await prisma.pasajero.findMany({
        include: {
          ventas: true,
        },
      });
    },

    // Obtener todos los boletos
    boletos: async () => {
      return await prisma.boleto.findMany({
        include: {
          bus: {
            include: {
              conductor: true
            }
          },
          ventas: true,
        },
      });
    },

    // Obtener todos los buses
    buses: async () => {
      return await prisma.bus.findMany({
        include: {
          conductor: true,
          boletos: true,
        },
      });
    },

    // Obtener todos los conductores
    conductores: async () => {
      return await prisma.conductor.findMany({
        include: {
          buses: true,
        },
      });
    },

    // Obtener todos los gastos
    gastos: async () => {
      return await prisma.gasto.findMany({
        orderBy: {
          fecha: 'desc'
        }
      });
    },
  },

  Mutation: {
    // Crear nueva venta de boleto
    createVentaBoleto: async (_, { input }) => {
      return await prisma.ventaBoleto.create({
        data: {
          idBoleto: input.idBoleto,
          idPasajero: input.idPasajero,
          precio: input.precio,
        },
        include: {
          boleto: true,
          pasajero: true,
        },
      });
    },

    // Actualizar venta de boleto
    updateVentaBoleto: async (_, { id, input }) => {
      return await prisma.ventaBoleto.update({
        where: { id },
        data: input,
        include: {
          boleto: true,
          pasajero: true,
        },
      });
    },

    // Eliminar venta de boleto
    deleteVentaBoleto: async (_, { id }) => {
      try {
        await prisma.ventaBoleto.delete({
          where: { id },
        });
        return true;
      } catch (error) {
        return false;
      }
    },

    // Crear nuevo pasajero
    createPasajero: async (_, { name }) => {
      return await prisma.pasajero.create({
        data: { name },
        include: {
          ventas: true,
        },
      });
    },

    // Crear nuevo gasto
    createGasto: async (_, { input }) => {
      return await prisma.gasto.create({
        data: {
          descripcion: input.descripcion,
          monto: input.monto,
        },
      });
    },
  },

  // Resolvers para campos relacionados
  VentaBoleto: {
    boleto: async (parent) => {
      if (parent.boleto) return parent.boleto;
      return await prisma.boleto.findUnique({
        where: { id: parent.idBoleto },
        include: {
          bus: {
            include: {
              conductor: true
            }
          }
        }
      });
    },
    pasajero: async (parent) => {
      if (parent.pasajero) return parent.pasajero;
      return await prisma.pasajero.findUnique({
        where: { id: parent.idPasajero },
      });
    },
  },

  Boleto: {
    bus: async (parent) => {
      if (parent.bus) return parent.bus;
      return await prisma.bus.findUnique({
        where: { id: parent.idBus },
        include: {
          conductor: true
        }
      });
    },
    ventas: async (parent) => {
      return await prisma.ventaBoleto.findMany({
        where: { idBoleto: parent.id },
      });
    },
  },

  Bus: {
    conductor: async (parent) => {
      if (parent.conductor) return parent.conductor;
      return await prisma.conductor.findUnique({
        where: { id: parent.idConductor },
      });
    },
    boletos: async (parent) => {
      return await prisma.boleto.findMany({
        where: { idBus: parent.id },
      });
    },
  },

  Conductor: {
    buses: async (parent) => {
      return await prisma.bus.findMany({
        where: { idConductor: parent.id },
      });
    },
  },

  Pasajero: {
    ventas: async (parent) => {
      return await prisma.ventaBoleto.findMany({
        where: { idPasajero: parent.id },
      });
    },
  },
};

// Crear servidor Apollo
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Crear el handler para Next.js
const handler = startServerAndCreateNextHandler(server);

// Exportar para App Router
export { handler as GET, handler as POST };