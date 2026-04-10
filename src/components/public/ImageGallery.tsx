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
          src={mainImage.url}
          alt={mainImage.alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-4"
          priority={selectedIndex === 0}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedIndex
                  ? "border-coral"
                  : "border-gray-100 hover:border-coral/50"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} - ${index + 1}`}
                fill
                sizes="120px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
