
"use client"
import { useState, useEffect, useRef } from "react"
import styles from "./HeroCarousel.module.css"

const HeroCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPlaying] = useState(true)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const fgVideoRefs = useRef<(HTMLVideoElement | null)[]>([])

  // Videos used in hero section (stored in public/herosection)
  const videos = [
    "/herosection/StorySaver.to_AQMiiL2ymzY2G0kqVs2OLw37rR5PwqdeSPY4Op1sUmtSQSXL8NwtA7r00YqdE1AEMu0ELk9wQXa60avNhd4e5kt.webm",
    "/herosection/StorySaver.to_AQNRVdeF2ejk-sqw5JUDMy_23uzXuD2m1jqUBnYxUodDN_38d8AFtBk-n4pjN13bvNcAiNFdx2EsLUHMFYoY3sx.webm",
    "/herosection/StorySaver.to_AQObCzPuN2j23kjIwDyRbd4rgniYN7kM8ZAn_fO09Q_ZhVpRCGVQya6evieaDdlyqwx0hZOnX1q72VjoW2-PGhw.webm",
    "/herosection/StorySaver.to_AQP8TheManZYkoMPUGyyyzhRfH5jlRZ8veRzG5zO9o3Jw4Pql8C71K27_MG7DFMr7x1MZ9NxIdYGo8Jd7wS4Hjc.webm",
    "/herosection/StorySaver.to_AQOKbDbVhs6Jnnb0LVccp3FdKXqVba9a7ps5E53RcALtrDbCosTs8ub03_Gb0-IV7Ju9m0AIAoO-Zl0TCDu9w7i.webm",
  ]

  // Titles corresponding to each video (optional, can be adjusted later)
  const titles = [
    "SCENT SYNDICATE",
    "LUXE KICKS",
    "DRIP KNOTS",
    "FUSION OF FORM",
    "BOUNDLESS IMAGINATION",
  ]

  const carouselLength = videos.length

  const startProgress = () => {
    if (progressInterval.current) clearInterval(progressInterval.current)
    setProgress(0)
    progressInterval.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext()
          return 0
        }
        return prev + 100 / (8 * 10)
      })
    }, 100)
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % carouselLength)
  }

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + carouselLength) % carouselLength)
  }

  useEffect(() => {
    if (isPlaying) startProgress()
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying, activeIndex])

  useEffect(() => {
    const safePlay = (video: HTMLVideoElement | null) => {
      if (!video) return
      video.currentTime = 0
      video.play().catch(console.warn)
    }

    videoRefs.current.forEach((v) => v && (v.currentTime = 0))
    fgVideoRefs.current.forEach((v) => v && (v.currentTime = 0))
    safePlay(videoRefs.current[activeIndex])
    // Play preview video (current container shows next video)
    safePlay(fgVideoRefs.current[activeIndex])
  }, [activeIndex])

  return (
    <section className={styles.heroWrapper}>
      <div className={styles.heroCarousel}>
        <div className={styles.bgCarousel}>
          {videos.map((videoSrc, index) => (
            <div
              key={`bg-${index}`}
              className={`${styles.videoContainer} ${index === activeIndex ? styles.active : ""}`}
            >
              <video
                ref={(el) => { videoRefs.current[index] = el; }}
                className={styles.video}
                src={videoSrc}
                playsInline
                muted
                loop
              />
            </div>
          ))}
        </div>

        <div className={styles.fgCarousel}>
          {videos.map((videoSrc, index) => {
            const previewIndex = (index + 1) % carouselLength
            return (
              <div
                key={`fg-${index}`}
                className={`${styles.fgVideoContainer} ${index === activeIndex ? styles.active : ""}`}
              >
                <video
                  ref={(el) => { fgVideoRefs.current[index] = el; }}
                  className={styles.fgVideo}
                  src={videos[previewIndex]}
                  playsInline
                  muted
                  loop
                />
              </div>
            )
          })}
        </div>

        <div className={styles.textContent}>
     
          <h1 className={styles.title}>{titles[activeIndex]}</h1>
        </div>

        

        {/* Right bottom: Next up, progress bar, nav */}
        <div className={styles.rightControls}>
          <div className={styles.nextUp}>
            <div className={styles.nextUpText + ' ' + styles.hideOnMobile}>NEXT UP</div>
            <div className={styles.nextTitle + ' ' + styles.hideOnMobile}>{titles[(activeIndex + 1) % carouselLength]}</div>
          </div>
          <div className={styles.progressBarRow}>
            <div className={styles.progressBarOuter}>
              <div className={styles.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={styles.navArrows}>
              <button className={styles.prev} onClick={handlePrev}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
              </button>
              <div className={styles.arrowDivider}></div>
              <button className={styles.next} onClick={handleNext}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Slide indicator bar at the bottom center */}
      <div className={styles.slideIndicatorBar}>
        {videos.map((_, idx) => (
          <span
            key={idx}
            className={idx === activeIndex ? styles.slideIndicatorActive : styles.slideIndicator}
          />
        ))}
      </div>
    </section>
  )
}

export default HeroCarousel
