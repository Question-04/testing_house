'use client';

import React, { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const config = {
  NUM_CARDS: 10,
  CARD_WIDTH: 2.2,
  CARD_HEIGHT: 3.3,
};

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const imageUrls = [
  '/background.mp4',
  '/image2.jpeg',
  '/image3.jpeg',
  '/image4.jpeg',
  '/image5.jpeg',
  '/image6.jpeg',
  '/image7.jpeg',
  '/image8.jpeg',
  '/image6.jpeg',
  '/image7.jpeg',
];

function Card({
  index,
  imageUrl,
  activeIndex,
  setCenterCardIndex,
  isMobile,
}: {
  index: number;
  imageUrl: string;
  activeIndex: number;
  setCenterCardIndex: (index: number | null) => void;
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(imageUrl);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [imageUrl]);

  useFrame(() => {
    const mesh = meshRef.current;

    if (isMobile) {
      // Mobile layout: 5 cards in a horizontal line
      let delta = index - activeIndex;
      if (delta > config.NUM_CARDS / 2) delta -= config.NUM_CARDS;
      if (delta < -config.NUM_CARDS / 2) delta += config.NUM_CARDS;

      // Horizontal spacing for mobile with non-uniform distribution
      let x = 0;
      if (delta === 0) x = 0; // Center card
      else if (delta === 1) x = 1.7; // Right card - more space from center
      else if (delta === -1) x = -1.7; // Left card - more space from center
      else if (delta === 2) x =3; // Far right - even more space
      else if (delta === -2) x = -3; // Far left - even more space
      
      const z = 0; // All cards on same z-plane
      const y = 0;

      // Mobile tilt logic
      let rotY = 0;
      if (delta === 0) rotY = 0; // Center card no tilt
      else if (delta === 1) rotY = -1.4; // Right card slight tilt
      else if (delta === -1) rotY = 1.4; // Left card slight tilt
      else if (delta === 2) rotY = -1.3; // Far right more tilt
      else if (delta === -2) rotY = 1.3; // Far left more tilt

      let scale = 0.8;
      if (delta === 0) scale = 1.3; // Center card larger
      else if (Math.abs(delta) === 1) scale = 1.3;
      else if (Math.abs(delta) === 2) scale = 1.4;

      // Only show 5 cards in mobile view
      mesh.visible = Math.abs(delta) <= 2;

      if (delta === 0) setCenterCardIndex(index);

      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, x, 0.15);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, z, 0.15);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, y, 0.15);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, rotY, 0.15); // Mobile tilt
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scale, 0.15));
    } else {
      // Desktop layout: Original curved layout
      let delta = index - activeIndex;
      if (delta > config.NUM_CARDS / 2) delta -= config.NUM_CARDS;
      if (delta < -config.NUM_CARDS / 2) delta += config.NUM_CARDS;

      const angle = delta * (Math.PI / 9);
      // Adjusted for 7 visible cards
      const radius = 4.5; // reduce from 5.2
      const spacing = 0.5; // reduce from 0.5
      const x = Math.sin(angle) * radius + delta * spacing;
      const z = Math.cos(angle) * radius - radius;
      const rotY = -angle;

      let tiltMultiplier = 1;
      if (Math.abs(delta) === 1) tiltMultiplier = 3;
      else if (Math.abs(delta) === 2) tiltMultiplier = 2.1;
      else if (Math.abs(delta) === 3) tiltMultiplier = 1.3; // less tilt for outermost

      const adjustedRotY = rotY * tiltMultiplier;
      const y = delta === 0 ? -0.2 : -0.3;

      let scale = 0.6;
      if (delta === 0) scale = 1.1;
      else if (Math.abs(delta) === 1) scale = 1;
      else if (Math.abs(delta) === 2) scale = 1;
      else if (Math.abs(delta) === 3) scale = 0.9; // larger for outermost

      mesh.visible = Math.abs(delta) <= 3;

      if (delta === 0) setCenterCardIndex(index);

      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, x, 0.15);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, z, 0.15);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, y, 0.15);
      mesh.rotation.y = THREE.MathUtils.lerp(mesh.rotation.y, adjustedRotY, 0.15);
      mesh.scale.setScalar(THREE.MathUtils.lerp(mesh.scale.x, scale, 0.15));
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[
        isMobile ? 1.9 : config.CARD_WIDTH, // Smaller width for mobile
        isMobile ? 3.6 : config.CARD_HEIGHT  // Smaller height for mobile
      ]} />
      <meshStandardMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function CardStack({
  activeIndex,
  setCenterCardIndex,
  isMobile,
}: {
  activeIndex: number;
  setCenterCardIndex: (index: number | null) => void;
  isMobile: boolean;
}) {
  const cards = useMemo(() => imageUrls.map((url, i) => ({ id: i, url })), []);
  return (
    <>
      {cards.map((card, i) => (
        <Card
          key={card.id}
          index={i}
          imageUrl={card.url}
          activeIndex={activeIndex}
          setCenterCardIndex={setCenterCardIndex}
          isMobile={isMobile}
        />
      ))}
    </>
  );
}

export default function FlipbookComponent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [centerCardIndex, setCenterCardIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!sectionRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: isMobile ? '+=3000' : '+=5000', // Shorter scroll distance for mobile
      pin: true,
      scrub: isMobile ? 0.3 : 0.5, // Faster response for mobile
      snap: {
        snapTo: (value) => Math.round(value * config.NUM_CARDS) / config.NUM_CARDS,
        duration: { min: 0.2, max: 0.4 },
        delay: 0.05,
      },
      onUpdate: (self) => {
        // Adjust scroll progress for mobile vs desktop
        let idx;
        if (isMobile) {
          // For mobile, we want smoother transitions between the 5 visible cards
          // Map progress to the full range of cards but with mobile-optimized stepping
          idx = Math.round(self.progress * (config.NUM_CARDS - 1));
        } else {
          // Desktop uses original logic
          idx = Math.round(self.progress * (config.NUM_CARDS - 1));
        }
        setActiveIndex(idx);
      },
    });

    return () => trigger.kill();
  }, [isMobile]);

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % config.NUM_CARDS);
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + config.NUM_CARDS) % config.NUM_CARDS);
  };

  return (
    <section
      ref={sectionRef}
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#c7a77b',
        position: 'relative',
        margin: 0,
        padding: 0,
        border: 'none',
      }}
    >
      {/* Title */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? 80 : 20,
          width: '100%',
          textAlign: 'center',
          color: '#051f2d',
          fontFamily: 'TIMES NEW NORMAL',
          zIndex: 30,
        }}
      >
        <h1 style={{ 
          fontSize: isMobile ? '2.6rem' : '3.5rem', 
          fontWeight: '400', 
          marginBottom: '0.2rem' 
        }}>
          SCENE STEALERS
        </h1>
        <p style={{ 
          fontSize: isMobile ? '1.2rem' : '1.5rem', 
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          color: '#fff' 
        }}>
          Iconic looks curated just for you, Steal the spotlight with our top picks.
        </p>
      </div>

      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100vw',
          zIndex: 10,
          margin: 0,
          padding: 0,
          border: 'none',
        }}
      >
        <Suspense fallback={null}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ 
              position: isMobile ? [0, 0, 8] : [0, 0, 7.2], 
              fov: isMobile ? 75 : 42 
            }}
            style={{
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          >
            <ambientLight intensity={0.8} />
            <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
            <CardStack 
              activeIndex={activeIndex} 
              setCenterCardIndex={setCenterCardIndex} 
              isMobile={isMobile}
            />
          </Canvas>
        </Suspense>

        {/* Steal the Look button - bottom of center card */}
        {centerCardIndex !== null && (
          <div
            style={{
              position: 'absolute',
              top: isMobile ? '74%' : '80%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 25,
              pointerEvents: 'none',
            }}
          >
            <button
              style={{
                padding: isMobile ? '8px 16px' : '10px 20px',
                fontSize: isMobile ? '1rem' : '1rem',
                background: '#051f2d',
                color: '#fff',
                fontFamily: 'TIMES NEW NORMAL',
                border: 'none',
                pointerEvents: 'auto',
                cursor: 'pointer',
              }}
            >
              Steal the Look
            </button>
          </div>
        )}

        {/* Navigation Arrows with SVGs */}
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? 120 : 30,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            zIndex: 20,
          }}
        >
          <button
            onClick={goPrev}
            style={{
              width: isMobile ? '40px' : '40px',
              height: isMobile ? '40px' : '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#051f2d',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" style={{ width: isMobile ? 16 : 20, height: isMobile ? 16 : 20 }}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
</svg>
          </button>
          <button
            onClick={goNext}
            style={{
              width:  '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: '#051f2d',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#fff" style={{ width: isMobile ? 16 : 20, height: isMobile ? 16 : 20 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
