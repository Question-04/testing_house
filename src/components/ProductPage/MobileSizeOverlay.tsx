import React from 'react';
import styles from './MobileSizeOverlay.module.css';
import { SizePrice } from './SizeGrid';

interface MobileSizeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  sizes: SizePrice[];
  selectedSize: SizePrice | null;
  onSelect: (size: SizePrice | null) => void;
  onSizeChartClick: () => void;
}

export const MobileSizeOverlay: React.FC<MobileSizeOverlayProps> = ({
  isOpen,
  onClose,
  sizes,
  selectedSize,
  onSelect,
  onSizeChartClick
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.content}>
        <button className={styles.closeButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.closeIcon}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className={styles.header}>
          <h3 className={styles.title}>Select Your Size</h3>
          <button className={styles.sizeChartButton} onClick={onSizeChartClick}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.sizeChartIcon}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
            Size Chart
          </button>
        </div>

        <div className={styles.sizeGrid}>
          {sizes.map((size) => (
            <button
              key={size.size}
              onClick={() => onSelect(selectedSize?.size === size.size ? null : size)}
              className={`${styles.sizeButton} ${size.size === selectedSize?.size ? styles.selected : ''}`}
            >
              <span className={styles.sizeText}>{size.size}</span>
              <span className={styles.priceText}>₹{size.price.toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}; 