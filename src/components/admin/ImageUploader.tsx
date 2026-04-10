"use client";

import Image from "next/image";
import { useState, useRef, useCallback } from "react";

interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  displayOrder: number;
}

interface ImageUploaderProps {
  productId: string;
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export default function ImageUploader({
  productId,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");

      const formData = new FormData();
      formData.append("file", file);

      // Upload file
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        const data = await uploadRes.json();
        throw new Error(data.error || "Eroare la upload");
      }

      const { url } = await uploadRes.json();

      // Create ProductImage record
      const imageRes = await fetch(`/api/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, alt: file.name.replace(/\.[^.]+$/, "") }),
      });

      if (!imageRes.ok) {
        const data = await imageRes.json();
        throw new Error(data.error || "Eroare la salvarea imaginii");
      }

      return (await imageRes.json()) as ProductImage;
    },
    [productId]
  );

  const handleFiles = useCallback(
    async (files: FileList) => {
      setUploading(true);
      setError("");

      const newImages: ProductImage[] = [];

      for (const file of Array.from(files)) {
        try {
          const img = await uploadFile(file);
          newImages.push(img);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Eroare la upload");
        }
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }

      setUploading(false);
    },
    [images, onImagesChange, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDelete = async (imageId: string) => {
    try {
      const res = await fetch(
        `/api/products/${productId}/images?imageId=${imageId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Eroare la ștergere");
        return;
      }

      onImagesChange(images.filter((img) => img.id !== imageId));
    } catch {
      setError("Eroare la ștergerea imaginii");
    }
  };

  const moveImage = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIndex, 0, moved);

    // Optimistic update
    onImagesChange(reordered);

    // Persist to server
    try {
      const res = await fetch(`/api/products/${productId}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: reordered.map((img) => img.id) }),
      });

      if (!res.ok) {
        // Revert on failure
        onImagesChange(images);
        setError("Eroare la reordonare");
      }
    } catch {
      onImagesChange(images);
      setError("Eroare la reordonare");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Current images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-lightgray"
            >
              <Image
                src={img.url}
                alt={img.alt || "Imagine produs"}
                fill
                sizes="200px"
                className="object-contain p-2"
              />

              {/* Primary badge */}
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-coral text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Principală
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-darkgray hover:bg-lightgray text-sm"
                    title="Mută la stânga"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.id)}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 text-sm"
                  title="Șterge"
                >
                  ✕
                </button>
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-darkgray hover:bg-lightgray text-sm"
                    title="Mută la dreapta"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-coral bg-coral/5"
            : "border-gray-300 hover:border-coral/50 hover:bg-lightgray"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFiles(e.target.files);
              e.target.value = "";
            }
          }}
        />

        {uploading ? (
          <div>
            <span className="text-3xl block mb-2">⏳</span>
            <p className="text-sm text-darkgray-light">Se încarcă...</p>
          </div>
        ) : (
          <div>
            <span className="text-3xl block mb-2">📸</span>
            <p className="text-sm font-medium text-darkgray">
              Trage imagini aici sau click pentru a selecta
            </p>
            <p className="text-xs text-darkgray-light mt-1">
              JPEG, PNG, WebP — max 5MB per imagine
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
