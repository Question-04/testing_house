import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/apolloClient';
import { ProductPage } from '../../components/ProductPage/ProductPage';
import { gql } from '@apollo/client';

const SNEAKER_QUERY = gql`
  query Sneaker($id: ID!) {
    sneaker(id: $id) {
      id
      brand
      productName
      sizePrices { size price }
      images
      soldOut
      sellerName
      sellerUrl
      productLink
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const apolloClient = initializeApollo();
    const { id } = context.params!;
    
    // Debug environment variables
    console.log('Environment variables:', {
      NEXT_PUBLIC_GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    console.log('Fetching sneaker with ID:', id);
    
    const { data } = await apolloClient.query({
      query: SNEAKER_QUERY,
      variables: { id },
    });

    console.log('Sneaker data received:', data);

    // If no product found, return 404
    if (!data.sneaker) {
      console.log('No sneaker found for ID:', id);
      return {
        notFound: true,
      };
    }

    return {
      props: {
        sneaker: data.sneaker,
        productId: id,
        productType: 'sneaker',
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    
    // Return a more graceful error response
    return {
      props: {
        error: error instanceof Error ? error.message : 'Unknown error',
        productId: context.params?.id,
        productType: 'sneaker',
      },
    };
  }
};

export default function SneakerProductSSRPage(props: any) {
  // Handle SSR error
  if (props.error) {
    console.error('SSR Error:', props.error);
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error Loading Product</h1>
        <p>{props.error}</p>
        <p>Product ID: {props.productId}</p>
      </div>
    );
  }
  
  return <ProductPage {...props} />;
} 