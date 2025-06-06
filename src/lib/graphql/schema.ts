import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  type Gasto {
    id: String
    descripcion: String
    monto: Float
  }

  type Query {
    gastos: [Gasto]
  }
`;
