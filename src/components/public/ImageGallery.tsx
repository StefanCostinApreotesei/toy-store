"use client";

import Image from "next/image";
import { useState } from "react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fadeKey, setFadeKey] = useState(0);

  const handleSelect = (index: number) => {
    if (index !== selectedIndex) {
      setSelectedIndex(index);
      setFadeKey((k) => k + 1);
    }
  };

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="aspect-square bg-lightgray rounded-xl overflow-hidden flex items-center justify-center border border-gray-100">
          <div className="text-center text-darkgray-light">
            <span className="text-8xl block mb-2">📷</span>
            <span className="text-sm">Fără imagine</span>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = images[selectedIndex];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-lightgray rounded-xl overflow-hidden border border-gray-100">
        <Image
          key={fadeKey}
          src={mainImage.url}
          alt={mainImage.alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          style={{ animation: "imageFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)" }}
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => handleSelect(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                index === selectedIndex
                  ? "border-coral shadow-md scale-[1.02]"
                  : "border-gray-100 hover:border-coral/50 hover:shadow-sm"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} - ${index + 1}`}
                fill
                sizes="120px"
                className={`object-contain p-1 transition-opacity duration-200 ${
                  index === selectedIndex ? "opacity-100" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
