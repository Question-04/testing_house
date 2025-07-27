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
  const apolloClient = initializeApollo();
  const { id } = context.params!;
  
  try {
    const { data } = await apolloClient.query({
      query: SNEAKER_QUERY,
      variables: { id },
    });

    // If no product found, return 404
    if (!data.sneaker) {
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
    console.error('Error fetching sneaker:', error);
    return {
      notFound: true,
    };
  }
};

export default function SneakerProductSSRPage(props: any) {
  return <ProductPage {...props} />;
} 