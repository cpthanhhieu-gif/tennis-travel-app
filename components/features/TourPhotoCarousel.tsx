"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import TourHeroActions from "@/components/features/TourHeroActions";

interface Props {
  images: { src: string; alt: string }[];
}

export default function TourPhotoCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [images.length]);

  const activeImage = images[activeIndex];

  return (
    <div className="app-tour-photo" role="group" aria-label="Ảnh trải nghiệm">
      <Image key={activeImage.src} src={activeImage.src} alt={activeImage.alt} fill priority sizes="100vw" />
      <TourHeroActions src={activeImage.src} alt={activeImage.alt} />
      {images.length > 1 && (
        <div className="app-tour-photo-dots" aria-label={`Ảnh ${activeIndex + 1} trên ${images.length}`}>
          {images.map((image, index) => (
            <span key={image.src} className={index === activeIndex ? "is-active" : ""} />
          ))}
        </div>
      )}
    </div>
  );
}
