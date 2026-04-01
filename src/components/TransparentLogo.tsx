import { useEffect, useRef, useState } from "react";

interface TransparentLogoProps {
  src: string;
  alt: string;
  className?: string;
  /** Threshold 0-255: pixels with R,G,B all above this are made transparent */
  threshold?: number;
}

export function TransparentLogo({
  src,
  alt,
  className = "",
  threshold = 240,
}: TransparentLogoProps) {
  const [transparentSrc, setTransparentSrc] = useState<string | null>(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // If pixel is near-white, make it fully transparent
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setTransparentSrc(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src, threshold]);

  if (!transparentSrc) {
    // Render invisible placeholder to avoid layout shift
    return <img src={src} alt={alt} className={`${className} opacity-0`} />;
  }

  return <img src={transparentSrc} alt={alt} className={className} />;
}
