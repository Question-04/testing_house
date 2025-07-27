'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from './ProductSlider.module.css';

// Dynamically import Swiper components to avoid SSR issues
const Swiper = dynamic(() => import('swiper/react').then(mod => ({ default: mod.Swiper })), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

const SwiperSlide = dynamic(() => import('swiper/react').then(mod => ({ default: mod.SwiperSlide })), {
  ssr: false
});

// Import Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';

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
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastXRef = useRef<number | null>(null);
  const previousProductIndex = useRef<number>(0);
  const isMobile = useIsMobile();

  // Filter products for mobile (show only 4)
  const displayProducts = isMobile ? products.slice(0, 4) : products;

  useEffect(() => {
    if (!isHovering && !isTransitioning) {
      intervalRef.current = setInterval(() => {
        setFrameIndex((prev) => (prev + 1) % selectedProduct.images360.length);
      }, 150);
    }
    return () => clearInterval(intervalRef.current!);
  }, [isHovering, selectedProduct, isTransitioning]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering || isTransitioning) return;
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

  const handleProductChange = (newProduct: typeof products[0], newIndex: number) => {
    const currentIndex = displayProducts.findIndex(p => p === selectedProduct);
    const direction = newIndex > currentIndex ? 'right' : 'left';
    
    setSlideDirection(direction);
    setIsTransitioning(true);
    
    // Reset frame index for new product
    setFrameIndex(0);
    
    // Update selected product after a short delay to allow animation
    setTimeout(() => {
      setSelectedProduct(newProduct);
      setIsTransitioning(false);
      setSlideDirection(null);
    }, 400); // Match the CSS animation duration
  };

  return (
    <div className={`${styles.homeProducts} ${styles.whiteBg}`}>
      <div className={styles.homeProductsTitleInner}>PLUTUS CHOICE</div>

      <div className={`${styles.swiperSlideTitle} ${selectedProduct.name === 'Louis Vuitton' ? styles.louisText : selectedProduct.name === 'New Balance' ? styles.longText : ''}`}>
        {selectedProduct.name}
      </div>

      {/* Main rotating shoe display */}
      <div className={styles.mainShoeContainer}>
        <div
          className={`${styles.image360} ${slideDirection ? styles[`slide${slideDirection.charAt(0).toUpperCase() + slideDirection.slice(1)}`] : ''}`}
          ref={containerRef}
          onMouseEnter={() => setIsHovering(true)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={selectedProduct.images360[frameIndex]}
            alt={selectedProduct.name}
            className={styles.productPreviewImage}
            style={{
              maxWidth: '55%',
              height: 'auto'
            }}
          />
        </div>
      </div>

      {/* Pagination at bottom */}
      <div className={styles.paginationContainer}>
        {displayProducts.map((product, index) => (
          <div
            key={index}
            className={`${styles.paginationItem} ${selectedProduct === product ? styles.paginationItemActive : ''}`}
            onClick={() => handleProductChange(product, index)}
          >
            <img
              src={product.thumb}
              alt={product.name}
              className={styles.paginationThumb}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider360;
