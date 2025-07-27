export interface EnquiryPayload {
  productId: string;
  productName: string;
  productBrand: string;
  productImage: string;
  contact: string;
  timestamp: string;
}

export async function sendEnquiry(payload: EnquiryPayload): Promise<{ success: boolean }> {
  const mutation = `
    mutation CreateEnquiry($productId: String!, $productName: String!, $productBrand: String!, $productImage: String!, $contact: String!) {
      createEnquiry(productId: $productId, productName: $productName, productBrand: $productBrand, productImage: $productImage, contact: $contact)
    }
  `;
  const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'https://testing-house.onrender.com/query', {
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