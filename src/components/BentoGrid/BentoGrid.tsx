import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BentoGrid.module.css';
// Removed unused import to fix TypeScript error

interface ProductCard {
  id: string;
  brand: string;
  productName?: string;
  title?: string;
  name?: string;
  images: string[];
  price?: number;
  salePrice?: number;
  marketPrice?: number;
}

interface BentoGridProps {
  sneakers?: ProductCard[];
}

const BentoGrid: React.FC<BentoGridProps> = () => {
  // Removed unused variables to fix TypeScript errors

  // Get products for each category from preloaded data (for subtle enhancement)
  // Removed unused variables to fix TypeScript errors

  return (
    <div className={styles.bentoGrid}>
      {/* Apparel (large left) */}
      <Link href="/apparel" passHref legacyBehavior>
        <a className={styles.apparel + ' ' + styles.bentoCell} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelApparel}>APPAREL</span>
          <Image className={styles.imgApparel} src="/apparel.png" alt="Apparel" width={300} height={300} />
        </a>
      </Link>
      
      {/* Sneakers (top right) */}
      <Link href="/sneaker" passHref legacyBehavior>
        <a className={`${styles.sneakers} ${styles.bentoCell}`} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelSneakers}>SNEAKERS</span>
          <div style={{display:'flex', flexDirection:'row', gap: '12px', alignItems:'center', justifyContent:'center', width:'100%', height:'100%', padding:'24px 0'}}>
            <Image className={styles.imgSneakers} src="/Sneaker AJ.png" alt="Sneakers" width={120} height={180} />
          </div>
        </a>
      </Link>
      
      {/* Watches (middle right) */}
      <Link href="/watch" passHref legacyBehavior>
        <a className={styles.watches + ' ' + styles.bentoCell} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelWatches}>WATCHES</span>
          <Image className={styles.imgWatches} src="/watch casio.png" alt="Watches" width={100} height={100} />
        </a>
      </Link>
      
      {/* Handbags (middle right) - redirect to accessories */}
      <Link href="/accessories" passHref legacyBehavior>
        <a className={styles.handbags + ' ' + styles.bentoCell} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelHandbags}>HANDBAGS</span>
          <Image className={styles.imgHandbags} src="/Bag.png" alt="Handbags" width={120} height={100} />
        </a>
      </Link>
      
      {/* Accessories (bottom left, only labubu.png, larger) */}
      <Link href="/accessories" passHref legacyBehavior>
        <a className={styles.accessories + ' ' + styles.bentoCell} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelAccessories}>ACCESSORIES</span>
          <Image className={styles.imgAccessories} src="/labubu.png" alt="Accessory" width={120} height={170} />
        </a>
      </Link>
      
      {/* Perfumes (bottom right) */}
      <Link href="/perfume" passHref legacyBehavior>
        <a className={styles.perfumes + ' ' + styles.bentoCell} style={{cursor:'pointer', position:'relative', display: 'block', textDecoration: 'none'}}>
          <span className={styles.labelPerfumes}>PERFUMES</span>
          <Image className={styles.imgPerfumes} src="/perfumeticker/perfume.png" alt="Perfumes" width={180} height={120} />
        </a>
      </Link>
    </div>
  );
};

export default BentoGrid; 