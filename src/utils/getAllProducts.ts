import fetch from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT || 'http://localhost:8090/query';

const ALL_PRODUCTS_QUERY = `
  query AllProducts {
    sneakers { id brand productName images productLink }
    apparel { id brand productName images productLink }
    accessories { id brand productName images productLink }
    perfumes { id brand title images url }
    watches { id brand name images link }
  }
`;

export async function getAllProducts() {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: ALL_PRODUCTS_QUERY }),
  });
  const { data } = await res.json();
  if (!data) return [];
  return [
    ...(data.sneakers?.map((p: any) => ({ ...p, type: 'sneakers' })) || []),
    ...(data.apparel?.map((p: any) => ({ ...p, type: 'apparel' })) || []),
    ...(data.accessories?.map((p: any) => ({ ...p, type: 'accessories' })) || []),
    ...(data.perfumes?.map((p: any) => ({ ...p, type: 'perfumes' })) || []),
    ...(data.watches?.map((p: any) => ({ ...p, type: 'watches' })) || []),
  ];
} 