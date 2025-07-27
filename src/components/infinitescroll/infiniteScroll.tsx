import React from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./infinitescroll.module.css";

const InfiniteCardSection: React.FC = () => {
  return (
    <section className={styles.sectionCustom}>
      <h2 className={styles.sectionTitle}>
        Fragrance For Every Style
      </h2>
      <div className={styles.cardsRow}>
        {/* Left Card */}
        <div className={styles.cardTiltLeft}>
          <Image src="/image1.jpeg" alt="Designer Perfumes" fill className={styles.cardImageStatic} />
          <div className={styles.cardCta}>Designer Perfumes</div>
        </div>
        {/* Middle Card (Video) */}
        <div className={styles.cardCenter}>
          <video
            src="/hero_video.mp4"
            className={styles.cardImageStatic}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        {/* Right Card */}
        <div className={styles.cardTiltRight}>
          <Image src="/image7.jpeg" alt="Niche Perfumes" fill className={styles.cardImageStatic} />
          <div className={styles.cardCta}>Niche Perfumes</div>
        </div>
      </div>
      <Link href="/perfume" legacyBehavior>
        <a className={styles.ctaMain}>Explore the Collection</a>
      </Link>
    </section>
  );
};

export default InfiniteCardSection;
