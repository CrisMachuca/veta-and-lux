// @/app/[locale]/components/ZoomableImage.tsx
"use client";

import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  return (
    <Zoom>
      <img
        src={src}
        alt={alt}
        className={className}
      />
    </Zoom>
  );
}