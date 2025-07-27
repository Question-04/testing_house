import React, { useState, useRef, useEffect } from 'react';
import { useStash } from '../StashContext';
import StashProductCard from './StashProductCard';
import styles from './StashProductGrid.module.css';

interface StashProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  category: string;
  productType: string;
}

interface StashProductGridProps {
  products: StashProduct[];
}

const StashProductGrid: React.FC<StashProductGridProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { removeFromStash } = useStash();

  // Center the active card in the scroll view
  useEffect(() => {
    if (currentIndex !== null && cardRefs.current[currentIndex]) {
      cardRefs.current[currentIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    // If only one card, center it
    if (products.length === 1 && cardRefs.current[0]) {
      cardRefs.current[0].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex, products.length]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.scrollWidth / products.length;
      const scrollLeft = container.scrollLeft;
      const newIndex = Math.round(scrollLeft / cardWidth);
      setCurrentIndex(Math.min(newIndex, products.length - 1));
    }
  };

  const scrollToProduct = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.productGrid}>
        <div 
          ref={scrollContainerRef}
          className={styles.scrollContainer}
          onScroll={handleScroll}
        >
          {products.map((product, idx) => {
            const isHovered = idx === hoveredCardIndex || idx === hoveredLineIndex;
            return (
              <div
                key={product.id}
                ref={el => (cardRefs.current[idx] = el)}
                onMouseEnter={() => setHoveredCardIndex(idx)}
                onMouseLeave={() => setHoveredCardIndex(null)}
                style={{
                  zIndex: isHovered ? 2 : 1,
                  transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
                  transform: isHovered ? 'translateY(-16px)' : 'translateY(0)'
                }}
              >
                <StashProductCard
                  product={product}
                  onRemove={() => removeFromStash(product.id)}
                />
              </div>
            );
          })}
        </div>
      </div>
      {products.length > 1 && (
        <div className={styles.navigation}>
          <div className={styles.productCount}>
            {(currentIndex !== null ? currentIndex + 1 : 1)}/{products.length}
          </div>
          <div className={styles.lineContainer}>
            {products.map((_, index) => {
              const isHovered = index === hoveredCardIndex || index === hoveredLineIndex;
              return (
                <div
                  key={index}
                  className={styles.line}
                  style={{
                    transition: 'transform 0.2s cubic-bezier(.4,0,.2,1)',
                    transform: isHovered ? 'translateY(-12px)' : 'translateY(0)'
                  }}
                  onClick={() => scrollToProduct(index)}
                  onMouseEnter={() => setHoveredLineIndex(index)}
                  onMouseLeave={() => setHoveredLineIndex(null)}
                  onMouseDown={e => e.preventDefault()}
                />
              );
            })}
          </div>
        </div>
      )}
      {products.length === 1 && (
        <div className={styles.navigation}>
          <div className={styles.productCount}>
            1/1
          </div>
        </div>
      )}
    </div>
  );
};

export default StashProductGrid; 