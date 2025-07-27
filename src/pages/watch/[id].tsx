import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/apolloClient';
import { ProductPage } from '../../components/ProductPage/ProductPage';
import { gql } from '@apollo/client';

const WATCH_QUERY = gql`
  query Watch($id: ID!) {
    watch(id: $id) {
      id
      brand
      name
      color
      salePrice
      marketPrice
      images
      link
      sellerName
      sellerUrl
      gender
    }
  }
`;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const apolloClient = initializeApollo();
  const { id } = context.params!;
  
  try {
    const { data } = await apolloClient.query({
      query: WATCH_QUERY,
      variables: { id },
    });

    // If no product found, return 404
    if (!data.watch) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        watch: data.watch,
        productId: id,
        productType: 'watch',
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (error) {
    console.error('Error fetching watch:', error);
    return {
      notFound: true,
    };
  }
};

export default function WatchProductSSRPage(props: any) {
  return <ProductPage {...props} />;
} 