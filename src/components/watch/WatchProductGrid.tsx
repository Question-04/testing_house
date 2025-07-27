import React from 'react';
import styles from './WatchProductGrid.module.css';
import Link from 'next/link';
import ProductGridSkeleton from '../ProductGridSkeleton';
import { hasViewableImage } from '../../utils/imageUtils';

interface WatchProduct {
  id: string;
  brand: string;
  name: string;
  salePrice: number;
  marketPrice: string;
  images: string[];
}

interface WatchProductGridProps {
  products: WatchProduct[];
  onProductClick?: (id: string) => void;
  mobile?: boolean;
}

function truncateWords(str: string, num: number) {
  if (!str) return '';
  const words = str.split(' ');
  return words.length > num ? words.slice(0, num).join(' ') + '...' : str;
}

const WatchProductGrid: React.FC<WatchProductGridProps & { loading?: boolean; hideName?: boolean }> = ({ products, onProductClick, loading = false, mobile = false, hideName = false }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  // Show all products, fallback image if missing
  return (
    <div className={mobile ? styles.gridMobile : styles.grid}>
      {products.map(product => (
        <Link href={`/watch/${product.id}`} key={product.id} legacyBehavior>
          <a className={styles.card} onClick={() => onProductClick && onProductClick(product.id)}>
            <div className={styles.imageWrapper}>
              {(() => {
                const hasImage = hasViewableImage(product.images);
                const fallback = '/blue_nav_icons/Blue PLUTUS LOGO.svg';
                const src = hasImage ? product.images[0] : fallback;
                const fallbackSize = mobile ? 60 : 120;
                return (
                  <img
                    src={src}
                    alt={product.name}
                    className={styles.image}
                    style={
                      hasImage
                        ? { objectFit: 'contain', background: '#fff' }
                        : { width: fallbackSize, height: fallbackSize, objectFit: 'contain', background: '#fff' }
                    }
                    onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.src = fallback;
                      target.style.width = `${fallbackSize}px`;
                      target.style.height = `${fallbackSize}px`;
                    }}
                  />
                );
              })()}
            </div>
            <div className={styles.info}>
              <div className={styles.infoText}>
                <div className={styles.brand}>{product.brand}</div>
                {!hideName && (
                  <div className={styles.name}>{truncateWords(product.name, 5)}</div>
                )}
              </div>
              <div className={styles.priceRow}>
                <span className={styles.startingFrom}>salePrice INR</span>
                <span className={styles.price}>{product.salePrice > 0 ? `Rs ${product.salePrice.toLocaleString()}` : '-'}</span>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default WatchProductGrid;