import React from 'react';
import styles from './apparel/ApparelProductGrid.module.css';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  brand: string;
  productName?: string;
  name?: string;
  title?: string;
  images: string[];
  productLink?: string;
  link?: string;
  url?: string;
  price?: number;
  type: string;
  sizePrices?: Array<{ size: string; price: number }>;
  salePrice?: number;
  variants?: Array<{ price: number }>;
}

function normalizeType(type: string) {
  if (!type) return '';
  const map: Record<string, string> = {
    sneakers: 'Sneaker',
    watches: 'Watch',
    perfumes: 'Perfume',
    apparel: 'Apparel',
    accessories: 'Accessory',
  };
  return map[type] || type;
}

function getPrice(product: Product) {
  if (product.type === 'Sneaker' && product.sizePrices && product.sizePrices.length > 0) {
    const prices = product.sizePrices.map((sp) => sp.price).filter((p) => typeof p === 'number');
    return prices.length ? Math.min(...prices) : undefined;
  }
  if (product.type === 'Watch' && typeof product.salePrice === 'number') {
    return product.salePrice;
  }
  if (product.type === 'Perfume' && product.variants && product.variants.length > 0) {
    const prices = product.variants.map((v) => v.price).filter((p) => typeof p === 'number');
    return prices.length ? Math.min(...prices) : undefined;
  }
  if (product.type === 'Apparel' && product.sizePrices && product.sizePrices.length > 0) {
    const prices = product.sizePrices.map((sp) => sp.price).filter((p) => typeof p === 'number');
    return prices.length ? Math.min(...prices) : undefined;
  }
  if (product.type === 'Accessory' && product.sizePrices && product.sizePrices.length > 0) {
    const prices = product.sizePrices.map((sp) => sp.price).filter((p) => typeof p === 'number');
    return prices.length ? Math.min(...prices) : undefined;
  }
  return undefined;
}

function getHref(product: Product) {
  if (product.type === 'Sneaker') return `/sneaker/${product.id}`;
  if (product.type === 'Watch') return `/watch/${product.id}`;
  if (product.type === 'Perfume') return `/perfume/${product.id}`;
  if (product.type === 'Apparel') return `/apparel/${product.id}`;
  if (product.type === 'Accessory') return `/accessory/${product.id}`;
  return '#';
}

function getTitle(product: Product) {
  return product.productName || product.name || product.title || '';
}

function getBrand(product: Product) {
  return product.brand || '';
}

function getImage(product: Product) {
  if (product.images && product.images.length > 0) return product.images[0];
  return '/blue_nav_icons/Blue PLUTUS LOGO.svg';
}


import ProductGridSkeleton from './ProductGridSkeleton';

const UniversalProductGrid: React.FC<{ products: Product[]; loading?: boolean; isMobile?: boolean }> = ({ products, loading = false, isMobile = false }) => {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }
  const normalizedProducts = products.map(p => ({ ...p, type: normalizeType(p.type) }));
  return (
    <div className={isMobile ? styles.gridMobile : styles.grid}>
      {normalizedProducts.map(product => {
        const imgSrc = getImage(product);
        const isFallback = imgSrc === '/blue_nav_icons/Blue PLUTUS LOGO.svg';
        return (
          <Link href={getHref(product)} key={product.id} legacyBehavior>
            <a className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={imgSrc}
                  alt={getTitle(product)}
                  width={300}
                  height={300}
                  className={styles.image}
                  style={isFallback ? { objectFit: 'contain', background: '#fff', width: 120, height: 120 } : {}}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/blue_nav_icons/Blue PLUTUS LOGO.svg';
                    target.style.width = '120px';
                    target.style.height = '120px';
                  }}
                />
              </div>
              <div className={styles.info}>
                <div className={styles.infoText}>
                  <div className={styles.brand}>{getBrand(product)}</div>
                  <div className={styles.name}>{getTitle(product)}</div>
                </div>
                <div className={styles.priceRow}>
                  <span className={styles.startingFrom}>starting from</span>
                  <span className={styles.price}>
                    {typeof getPrice(product) === 'number' ? `Rs ${getPrice(product)?.toLocaleString()}` : '-'}
                  </span>
                </div>
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
};

export default UniversalProductGrid; 