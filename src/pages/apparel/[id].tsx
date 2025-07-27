import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/apolloClient';
import { ProductPage } from '../../components/ProductPage/ProductPage';
import { gql } from '@apollo/client';

const APPAREL_QUERY = gql`
  query ApparelItem($id: ID!) {
    apparelItem(id: $id) {
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
      query: APPAREL_QUERY,
      variables: { id },
    });

    // If no product found, return 404
    if (!data.apparelItem) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        apparel: data.apparelItem,
        productId: id,
        productType: 'apparel',
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (error) {
    console.error('Error fetching apparel:', error);
    return {
      notFound: true,
    };
  }
};

export default function ApparelProductSSRPage(props: any) {
  return <ProductPage {...props} />;
} 