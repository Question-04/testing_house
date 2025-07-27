import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/apolloClient';
import { ProductPage } from '../../components/ProductPage/ProductPage';
import { gql } from '@apollo/client';

const ACCESSORY_QUERY = gql`
  query Accessory($id: ID!) {
    accessory(id: $id) {
      id
      brand
      productName
      subcategory
      gender
      sizePrices { size price }
      images
      inStock
      productLink
      sellerName
      sellerUrl
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const { id } = context.params!;
  
  try {
    const { data } = await apolloClient.query({
      query: ACCESSORY_QUERY,
      variables: { id },
    });

    // If no product found, return 404
    if (!data.accessory) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        accessory: data.accessory,
        productId: id,
        productType: 'accessory',
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (error) {
    console.error('Error fetching accessory:', error);
    return {
      notFound: true,
    };
  }
};

export default function AccessoryProductSSRPage(props: any) {
  return <ProductPage {...props} />;
} 