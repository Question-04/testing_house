import Navbar from '@/components/nav/Navbar';
import Footer from '@/components/Footer';
import type { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { Montserrat } from 'next/font/google';
import SearchOverlay from '../components/SearchOverlay';
import React, { useState } from 'react';
import { useApollo } from '../lib/apolloClient';
import { StashProvider } from '../components/StashContext';
import StashPrompt from '../components/StashPrompt';
import { useStash } from '../components/StashContext';
import { EnquiryPanelProvider } from '../components/EnquiryPanelContext';
import EnquiryPanel from '../components/EnquiryPanel';
import { ProductProvider } from '../context/ProductContext';
import PerformanceMonitor from '../components/PerformanceMonitor';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '700'] });

function MyApp({ Component, pageProps }: AppProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const apolloClient = useApollo(pageProps.initialApolloState);

  // No pre-fetching needed - pages are statically generated and will load instantly

  return (
    <ApolloProvider client={apolloClient}>
      <ProductProvider>
        <EnquiryPanelProvider>
          <EnquiryPanel />
          <StashProvider>
            <StashPromptWrapper />
            <main className={montserrat.className}>
              <Navbar onSearchClick={() => setIsSearchOpen(true)} />
              <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
              <Component {...pageProps} />
              <PerformanceMonitor />
            </main>
            <Footer />
          </StashProvider>
        </EnquiryPanelProvider>
      </ProductProvider>
    </ApolloProvider>
  );
}

function StashPromptWrapper() {
  const { showStashPrompt } = useStash();
  return showStashPrompt ? <StashPrompt /> : null;
}

export default MyApp; 