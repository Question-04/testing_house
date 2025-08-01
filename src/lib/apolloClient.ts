import { ApolloClient, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function createApolloClient() {
  const isServer = typeof window === 'undefined';
  
  // Better environment variable handling
  let uri = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (!uri) {
    // Fallback for different environments
    if (process.env.NODE_ENV === 'production') {
      uri = 'https://testing-house.onrender.com/query';
    } else {
      uri = 'https://testing-house.onrender.com/query';
    }
  }
  
  console.log('Creating Apollo client:', { 
    isServer, 
    uri, 
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT 
  });
  
  return new ApolloClient({
    ssrMode: isServer,
    link: new HttpLink({
      uri,
      credentials: 'same-origin',
      fetch: isServer ? undefined : fetch,
    }),
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
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();
  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }
  if (typeof window === 'undefined') return _apolloClient;
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: any) {
  return useMemo(() => initializeApollo(initialState), [initialState]);
} 