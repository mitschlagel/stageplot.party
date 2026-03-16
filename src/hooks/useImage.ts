import { useState, useEffect } from 'react';

/**
 * Hook to load an SVG file as an HTMLImageElement for use in Konva.
 * Konva doesn't render SVG directly — we load SVGs as Image objects.
 */
export function useImage(url: string): HTMLImageElement | null {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => setImage(img);
    img.onerror = () => {
      console.warn(`Failed to load image: ${url}`);
      setImage(null);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return image;
}
