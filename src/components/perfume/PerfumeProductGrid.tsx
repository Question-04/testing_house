import React from 'react';
import styles from './PerfumeProductGrid.module.css';
import Link from 'next/link';
import ProductGridSkeleton from '../ProductGridSkeleton';

interface PerfumeProduct {
  id: string;
  brand: string;
  title?: string;
  fragranceFamily?: string;
  images: string[];
  variants?: { size?: string; price?: number }[];
  price?: number;
}

interface PerfumeProductGridProps {
  products: PerfumeProduct[];
  onProductClick?: (id: string) => void;
  mobile?: boolean;
}

function getLowestPrice(variants: { price?: number }[] | undefined): number | null {
  if (!Array.isArray(variants) || variants.length === 0) return null;
  let lowest: number | null = null;
  for (const v of variants) {
    const p = v.price;
    const priceNum = typeof p === 'string' ? parseFloat(p) : p;
    if (typeof priceNum === 'number' && !isNaN(priceNum) && (lowest === null || priceNum < lowest)) {
      lowest = priceNum;
    }
  }
  return lowest;
}

function truncateWords(str: string, num: number) {
  if (!str) return '';
  const words = str.split(' ');
  return words.length > num ? words.slice(0, num).join(' ') + '...' : str;
}

const PerfumeProductGrid: React.FC<PerfumeProductGridProps & { loading?: boolean }> = ({ products, onProductClick, mobile, loading = false }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  return (
    <div className={mobile ? styles.gridMobile : styles.grid}>
      {products.map(product => {
        const price = product.variants ? getLowestPrice(product.variants) : (typeof product.price === 'number' ? product.price : null);
        return (
          <Link href={`/perfume/${product.id}`} key={product.id} legacyBehavior>
            <a className={styles.card} onClick={() => onProductClick && onProductClick(product.id)}>
              <div className={styles.imageWrapper}>
                <img
                  src={product.images?.[0] || '/image1.jpeg'}
                  alt={product.title}
                  className={styles.image}
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/image1.jpeg';
                  }}
                />
              </div>
              <div className={styles.info}>
                <div className={styles.infoText}>
                  <div className={styles.brand}>{product.brand}</div>
                  {product.title && <div className={styles.name}>{truncateWords(product.title, 5)}</div>}
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.startingFrom}>starting from</span>
                  <span className={styles.price}>{price !== null ? `Rs ${price.toLocaleString()}` : '-'}</span>
                </div>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default PerfumeProductGrid;