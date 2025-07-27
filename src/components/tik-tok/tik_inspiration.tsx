// TikTokCarousel.tsx
import React, { useRef, useState, useEffect } from 'react';
import styles from './TikTokCarousal.module.css';
import { Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselItem {
  id: number;
  videoUrl: string;
}

const TikTokCarousel: React.FC = () => {
  // Original data and extended data defined first to compute startIndex
  const originalData: CarouselItem[] = [
    { id: 1, videoUrl: '/tictock/house_of_plutus-20250725-0001.webm' },
    { id: 2, videoUrl: '/tictock/house_of_plutus-20250725-0002.webm' },
    { id: 3, videoUrl: '/tictock/house_of_plutus-20250725-0003.webm' },
    { id: 4, videoUrl: '/tictock/house_of_plutus-20250725-0004.webm' },
    { id: 5, videoUrl: '/tictock/house_of_plutus-20250725-0005.webm' },
    { id: 6, videoUrl: '/tictock/house_of_plutus-20250725-0006.webm' },
    { id: 7, videoUrl: '/tictock/house_of_plutus-20250725-0007.webm' },
    { id: 8, videoUrl: '/tictock/house_of_plutus-20250725-0008.webm' },
    { id: 9, videoUrl: '/tictock/house_of_plutus-20250725-0009.webm' }
  ];

  const createInfiniteData = () => {
    const repeats = 5;
    const infData: CarouselItem[] = [];
    for (let i = 0; i < repeats; i++) {
      originalData.forEach((item) => {
        infData.push({ ...item, id: item.id + i * originalData.length });
      });
    }
    return infData;
  };

  const carouselData = createInfiniteData();
  const startIndex = originalData.length * 2;

  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playingStates, setPlayingStates] = useState<{ [key: number]: boolean }>({});
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Initialize currentIndex to middle of infinite data
  useEffect(() => {
    setCurrentIndex(startIndex);
    // Initialize all playing states to true
    const initialStates: { [key: number]: boolean } = {};
    carouselData.forEach((_, index) => {
      initialStates[index] = true;
    });
    setPlayingStates(initialStates);
  }, []);

  const handlePlayPause = () => {
    const video = videoRefs.current[currentIndex];
    if (!video) return;
    
    const newPlayingState = !playingStates[currentIndex];
    
    if (newPlayingState) {
      video.play();
    } else {
      video.pause();
    }
    
    setPlayingStates(prev => ({
      ...prev,
      [currentIndex]: newPlayingState
    }));
    setIsPlaying(newPlayingState);
  };

  const navigate = (direction: 'left' | 'right') => {
    const newIndex = direction === 'left'
      ? (currentIndex - 1 + carouselData.length) % carouselData.length
      : (currentIndex + 1) % carouselData.length;

    setCurrentIndex(newIndex);
    const newPlayingState = playingStates[newIndex] ?? true;
    setIsPlaying(newPlayingState);
  };

  const handleCardClick = (index: number) => {
    setCurrentIndex(index);
    const newPlayingState = playingStates[index] ?? true;
    setIsPlaying(newPlayingState);
  };

  useEffect(() => {
    // Pause all videos first
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Handle current video
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      const shouldPlay = playingStates[currentIndex] ?? true;
      if (shouldPlay) {
        currentVideo.play().catch(console.error);
      } else {
        currentVideo.pause();
      }
      setIsPlaying(shouldPlay);
    }
  }, [currentIndex, playingStates]);

  // Reset indices when near edges to maintain infinite illusion
  useEffect(() => {
    const buffer = originalData.length; // 9
    if (currentIndex < buffer) {
      const newIndex = currentIndex + originalData.length * 3;
      setTimeout(() => setCurrentIndex(newIndex), 0);
    } else if (currentIndex >= carouselData.length - buffer) {
      const newIndex = currentIndex - originalData.length * 3;
      setTimeout(() => setCurrentIndex(newIndex), 0);
    }
  }, [currentIndex, carouselData.length, originalData.length]);

  const getCardWidth = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 ? window.innerWidth : 458;
    }
    return 458;
  };

const [centerOffset, setCenterOffset] = useState(0);

useEffect(() => {
  const handleResize = () => {
    if (typeof window !== 'undefined') {
      setCenterOffset(window.innerWidth / 2);
    }
  };

  handleResize(); // initial load
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

const getTransformValue = () => {
  const cardWidth = getCardWidth();
  return `translateX(calc(${centerOffset}px - ${(currentIndex + 0.5) * cardWidth}px))`;
};


  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>THE HYPE ZONE</h1>
        <p>
          A reel zone for fashion drops, sneak peeks, and styling stories.&nbsp;
          <a
            href="https://www.instagram.com/house_of_plutus?igsh=M2xzd2x0OXFzdWti"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.joinLink}
          >
            Join The Hype
          </a>
        </p>
      </header>

      <div className={styles.navButtonLeft} onClick={() => navigate('left')}>
        <ChevronLeft size={28} />
      </div>

      <div className={styles.navButtonRight} onClick={() => navigate('right')}>
        <ChevronRight size={28} />
      </div>

      <div className={styles.carouselWrapper}>
        <div
          className={styles.carousel}
          style={{ 
            transform: getTransformValue(),
            transition: currentIndex < 5 || currentIndex >= carouselData.length - 5 ? 'none' : 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          {carouselData.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className={`${styles.card} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => handleCardClick(index)}
            >
              <video
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                src={item.videoUrl}
                muted
                loop
                playsInline
                className={styles.video}
              />
              {index === currentIndex && (
                <button 
                  className={styles.controlBtn} 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handlePlayPause(); 
                  }}
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    
    </div>
  );
};

export default TikTokCarousel;