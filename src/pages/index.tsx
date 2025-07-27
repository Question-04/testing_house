import React from 'react';
import Head from 'next/head';
import HeroCarousel from '../components/HeroCarousel/HeroCarousal';

import InfiniteCardSection from '@/components/infinitescroll/infiniteScroll';
import TikTokInspiration from '@/components/tik-tok/tik_inspiration';
import NewArrivals from '@/components/newArrivals/NewArrivals';
import ProductSlider360 from '@/components/swiper3602/ProductSlider360';
import HeroShowcase from '@/components/showcase/ShowCase';
import ShowcaseMoodSection from '@/components/moodmatch/ShowcaseMoodSection';
import BentoGrid from '@/components/BentoGrid/BentoGrid';
import PremiumScrollRow from '@/components/scrollrow/PremiumScrollRow';
import PremiumIconRow from '@/components/scrollrow/PremiumIconRow';



const HomePage = () => {
  return (
    <>
      <Head>
        <title>Premium Brand Experience</title>
        <meta name="description" content="A premium brand experience inspired by Cartier" />
      </Head>
      <HeroCarousel/>
 
      <PremiumIconRow/>
      <BentoGrid/>
      <ShowcaseMoodSection/>
      <InfiniteCardSection/>
      <PremiumScrollRow/>
      <TikTokInspiration/>
      <NewArrivals/>
      <HeroShowcase/> 
      <ProductSlider360/>
    </>
  );
};

export default HomePage;
