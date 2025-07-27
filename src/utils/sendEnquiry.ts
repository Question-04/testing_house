export interface EnquiryPayload {
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  contact: string;
  timestamp: string;
}

export async function sendEnquiry(payload: EnquiryPayload): Promise<{ success: boolean }> {
  // Better environment variable handling
  let GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;
  if (!GRAPHQL_ENDPOINT) {
    // Fallback for different environments
    if (process.env.NODE_ENV === 'production') {
      GRAPHQL_ENDPOINT = 'https://testing-house.onrender.com/query';
    } else {
      GRAPHQL_ENDPOINT = 'https://testing-house.onrender.com/query';
    }
  }
  
  const mutation = `
    mutation CreateEnquiry($productId: String!, $productName: String!, $productBrand: String!, $productImage: String!, $contact: String!) {
      createEnquiry(productId: $productId, productName: $productName, productBrand: $productBrand, productImage: $productImage, contact: $contact)
    }
  `;
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: mutation,
      variables: {
        productId: payload.productId,
        productName: payload.productName,
        productBrand: payload.productBrand,
        productImage: payload.productImage,
        contact: payload.contact,
      },
    }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return { success: json.data.createEnquiry };
} 