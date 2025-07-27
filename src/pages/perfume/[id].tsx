import { GetServerSideProps } from 'next';
import { initializeApollo } from '../../lib/apolloClient';
import { ProductPage } from '../../components/ProductPage/ProductPage';
import { gql } from '@apollo/client';

const PERFUME_QUERY = gql`
  query Perfume($id: ID!) {
    perfume(id: $id) {
      id
      brand
      title
      fragranceFamily
      concentration
      subcategory
      variants { size price }
      images
      url
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
      query: PERFUME_QUERY,
      variables: { id },
    });

    // If no product found, return 404
    if (!data.perfume) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        perfume: data.perfume,
        productId: id,
        productType: 'perfume',
        initialApolloState: apolloClient.cache.extract(),
      },
    };
  } catch (error) {
    console.error('Error fetching perfume:', error);
    return {
      notFound: true,
    };
  }
};

export default function PerfumeProductSSRPage(props: any) {
  return <ProductPage {...props} />;
} 