'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import './ProductSlider.css';

SwiperCore.use([Pagination]);

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

// CDN base URL
const CDN_BASE_URL = 'https://houseofplutus.mos.ap-southeast-2.sufybkt.com';

const products = [
  { 
    name: 'New Balance', 
    thumb: `${CDN_BASE_URL}/550shoesimage_01.png`, 
    images360: Array.from({ length: 36 }, (_, i) => `${CDN_BASE_URL}/550shoesimage_${(i + 1).toString().padStart(2, '0')}.png`)
  },
  { 
    name: 'Yeezy', 
    thumb: `${CDN_BASE_URL}/yeezyimage_01.png`, 
    images360: Array.from({ length: 36 }, (_, i) => `${CDN_BASE_URL}/yeezyimage_${(i + 1).toString().padStart(2, '0')}.png`)
  },
  { 
    name: 'New Balance', 
    thumb: `${CDN_BASE_URL}/newbalanceshoe1image_01.png`, 
    images360: Array.from({ length: 36 }, (_, i) => `${CDN_BASE_URL}/newbalanceshoe1image_${(i + 1).toString().padStart(2, '0')}.png`)
  },
  { 
    name: 'Louis Vuitton', 
    thumb: `${CDN_BASE_URL}/louisimage_01.png`, 
    images360: Array.from({ length: 36 }, (_, i) => `${CDN_BASE_URL}/louisimage_${(i + 1).toString().padStart(2, '0')}.png`)
  },
  { 
    name: 'Air Jordan', 
    thumb: `${CDN_BASE_URL}/airjordanpinegreenimage_01.png`, 
    images360: Array.from({ length: 36 }, (_, i) => `${CDN_BASE_URL}/airjordanpinegreenimage_${(i + 1).toString().padStart(2, '0')}.png`)
  },
  { 
    name: 'Air Jordan', 
    thumb: `${CDN_BASE_URL}/airjordan221image_02.png`, 
    images360: Array.from({ length: 19 }, (_, i) => `${CDN_BASE_URL}/airjordan221image_${(i + 2).toString().padStart(2, '0')}.png`) // Frames 2-20
  },
];

const ProductSlider360 = () => {
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [frameIndex, setFrameIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastXRef = useRef<number | null>(null);
  const isMobile = useIsMobile();

  // Filter products for mobile (show only 4)
  const displayProducts = isMobile ? products.slice(0, 4) : products;

  useEffect(() => {
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % selectedProduct.images360.length);
      }, 150);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isHovering, selectedProduct]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const x = e.clientX;
    if (lastXRef.current !== null) {
      const delta = x - lastXRef.current;
      if (Math.abs(delta) > 8) {
        setFrameIndex((prev) => (prev + (delta > 0 ? 1 : -1) + selectedProduct.images360.length) % selectedProduct.images360.length);
        lastXRef.current = x;
      }
    } else {
      lastXRef.current = x;
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    lastXRef.current = null;
  };

  return (
    <div className="home__products white-bg">
      <div className="home__products-title__inner">PLUTUS CHOICE</div>

      <div className={`swiper-slide-title ${selectedProduct.name === 'Louis Vuitton' ? 'louis-text' : selectedProduct.name === 'New Balance' ? 'long-text' : ''}`}>
        {selectedProduct.name}
      </div>

      <Swiper
        slidesPerView={1}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className}"><img src="${displayProducts[index].thumb}" class="pagination-thumb"/></span>`;
          },
        }}
        onSlideChange={(swiper) => {
          setSelectedProduct(displayProducts[swiper.activeIndex]);
          setFrameIndex(0);
        }}
        className="product-swiper"
      >
        {displayProducts.map((product, index) => (
          <SwiperSlide key={index}>
            <div className="product-preview">
              <div
                className="image-360"
                ref={containerRef}
                onMouseEnter={() => setIsHovering(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.images360[frameIndex]}
                  alt={product.name}
                  className="product-preview__image"
                  style={{
                    maxWidth: '55%',
                    height: 'auto'
                  }}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider360;
