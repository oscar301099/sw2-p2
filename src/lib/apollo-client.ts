// lib/apollo-client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;

// hooks/useGastos.ts
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_GASTOS = gql`
  query GetGastos {
    gastos {
      id
      descripcion
      monto
      createdAt
    }
  }
`;

const CREATE_GASTO = gql`
  mutation CreateGasto($descripcion: String!, $monto: Float!) {
    createGasto(descripcion: $descripcion, monto: $monto) {
      id
      descripcion
      monto
      createdAt
    }
  }
`;

const UPDATE_GASTO = gql`
  mutation UpdateGasto($id: String!, $descripcion: String, $monto: Float) {
    updateGasto(id: $id, descripcion: $descripcion, monto: $monto) {
      id
      descripcion
      monto
      createdAt
    }
  }
`;

const DELETE_GASTO = gql`
  mutation DeleteGasto($id: String!) {
    deleteGasto(id: $id)
  }
`;

export const useGastos = () => {
  const { data, loading, error, refetch } = useQuery(GET_GASTOS);
  
  const [createGasto] = useMutation(CREATE_GASTO, {
    refetchQueries: [{ query: GET_GASTOS }],
  });
  
  const [updateGasto] = useMutation(UPDATE_GASTO, {
    refetchQueries: [{ query: GET_GASTOS }],
  });
  
  const [deleteGasto] = useMutation(DELETE_GASTO, {
    refetchQueries: [{ query: GET_GASTOS }],
  });

  return {
    gastos: data?.gastos || [],
    loading,
    error,
    refetch,
    createGasto,
    updateGasto,
    deleteGasto,
  };
};

// app/providers.tsx
'use client';

import { ApolloProvider } from '@apollo/client';
import apolloClient from '@/lib/apollo-client';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}