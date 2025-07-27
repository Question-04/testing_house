export const isViewableImage = (url?: string): boolean => {
  if (!url) return false;
  const lowered = url.toLowerCase();
  // Skip obviously bad/placeholder paths
  if (
    lowered.endsWith('.svg') ||
    lowered.includes('placeholder') ||
    lowered.includes('no_image') ||
    lowered.includes('noimage') ||
    lowered.includes('nophoto') ||
    lowered.startsWith('/image') // local fallback placeholder
  ) {
    return false;
  }
  // Allow images that originate from luxurysouq, even if they are served via an optimisation CDN
  // (e.g. https://cdn-*.nitrocdn.com/...luxurysouq.com/...)
  // As long as the final URL still contains "luxurysouq.com" we treat it as a valid, viewable image.
  if (lowered.includes('luxurysouq.com')) {
    return true;
  }

  // Everything else is considered non-viewable for watches
  return false;
};

export const hasViewableImage = (images?: string[]): boolean => {
  if (!images || images.length === 0) return false;
  return isViewableImage(images[0]);
}; 