import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';
import Menu from '../menu/Menu';
import { useProductContext } from '../../context/ProductContext';
import { useRouter } from 'next/router';
import { useStash } from '../StashContext';

interface NavbarProps {
  onSearchClick: () => void;
  blueIcons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onSearchClick, blueIcons }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [bg, setBg] = useState('#fff');
  const { isPreloaded, loading } = useProductContext();
  const router = useRouter();

  // Use blueIcons prop if provided, otherwise fallback to route logic
  const isBlueIcons = typeof blueIcons === 'boolean' 
    ? blueIcons 
    : (
        router.pathname.startsWith('/sneaker') ||
        router.pathname.startsWith('/apparel') ||
        router.pathname.startsWith('/perfume') ||
        router.pathname.startsWith('/accessories') ||
        router.pathname.startsWith('/watch') ||
        router.pathname.startsWith('/search') ||
        router.pathname.startsWith('/stash') ||
        router.pathname.includes('/brand/')
      );
  
  const isHome = router.pathname === '/';

  useEffect(() => {
    if (router.pathname === '/') {
      setBg('#07202c'); // Home page - blue background
    } else {
      setBg('#fff'); // All other pages - white background
    }
  }, [router.pathname]);

  // Stash functionality
  const { clearStashDot } = useStash();

  // Auto-close the menu whenever we navigate to a new route
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <nav
        className={styles.navbar}
        style={{ background: bg }}
      >
        <div className={styles.logoContainer}>
          <Image src={isBlueIcons ? "/blue_nav_icons/Blue PLUTUS LOGO.svg" : "/nav/plutus logo.svg"} alt="House of Plutus Logo" width={160} height={48} priority />
        </div>
        <div className={styles.iconsContainer}>
          <button className={styles.iconBtn} aria-label="Search" onClick={onSearchClick}>
            <Image src={isHome ? "/nav/search.svg" : (isBlueIcons ? "/blue_nav_icons/Blue Search icon.svg" : "/nav/search.svg")} alt="Search" width={32} height={32} />
            {!isPreloaded && loading && (
              <div style={{
                position: 'absolute',
                top: -2,
                right: -2,
                width: 8,
                height: 8,
                background: '#ff6b6b',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }}></div>
            )}
          </button>
          <button className={styles.iconBtn} aria-label="Menu" onClick={() => setIsMenuOpen(true)}>
            <Image src={isHome ? "/nav/Menu.svg" : (isBlueIcons ? "/blue_nav_icons/Blue menu icon.svg" : "/nav/Menu.svg")} alt="Menu" width={32} height={32} />
          </button>
          <button className={styles.iconBtn} aria-label="Stash" onClick={() => {
            clearStashDot();
            router.push('/stash');
          }}>
            <Image src={isHome ? "/nav/STASH.svg" : (isBlueIcons ? "/blue_nav_icons/Blue Stash icon.svg" : "/nav/STASH.svg")} alt="Stash" width={22} height={22} />
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <Menu />
      )}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default Navbar; 