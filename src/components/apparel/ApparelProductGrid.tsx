import React from 'react';
import styles from './ApparelProductGrid.module.css';
import Link from 'next/link';
import ProductGridSkeleton from '../ProductGridSkeleton';

interface ApparelProduct {
  id: string;
  brand: string;
  productName: string;
  images: string[];
  price: number;
}

interface ApparelProductGridProps {
  products: ApparelProduct[];
  onProductClick?: (id: string) => void;
  mobile?: boolean;
}

const ApparelProductGrid: React.FC<ApparelProductGridProps & { loading?: boolean }> = ({ products, onProductClick, loading = false, mobile = false }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  return (
    <div className={mobile ? styles.gridMobile : styles.grid}>
      {products.map(product => (
        <Link href={`/apparel/${product.id}`} key={product.id} legacyBehavior>
          <a className={styles.card} onClick={() => onProductClick && onProductClick(product.id)}>
            <div className={styles.imageWrapper}>
              <img
                src={product.images[0]}
                alt={product.productName}
                className={styles.image}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.infoText}>
                <div className={styles.brand}>{product.brand}</div>
                <div className={styles.name}>{product.productName}</div>
              </div>
              <div className={styles.priceRow}>
                <span className={styles.startingFrom}>starting from</span>
                <span className={styles.price}>Rs {product.price.toLocaleString()}</span>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default ApparelProductGrid;