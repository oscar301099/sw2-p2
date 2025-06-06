import { useQuery, useMutation } from '@apollo/client';
import { GET_GASTOS } from '@/lib/graphql/queries';
import { CREATE_GASTO, UPDATE_GASTO, DELETE_GASTO } from '@/lib/graphql/mutations';

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

// ==========================================

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